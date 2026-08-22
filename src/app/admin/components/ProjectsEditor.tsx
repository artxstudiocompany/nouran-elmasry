"use client";

import { useState } from "react";
import { useSiteData } from "@/store/DataContext";
import ImageUploader from "./ImageUploader";
import SavedIndicator, { useSaveIndicator } from "./SavedIndicator";
import { clientUpload } from "@/lib/clientUpload";
import type { Project } from "@/types";

function emptyProject(): Project {
  return {
    id: "",
    type: "", typeAr: "",
    category: "", categoryAr: "",
    scope: "", scopeAr: "",
    systems: [], systemsAr: [],
    imageUrl: "",
    year: "", area: "",
  };
}

export default function ProjectsEditor() {
  const { projects, refresh } = useSiteData();
  const { saved, show } = useSaveIndicator();
  const [editing, setEditing] = useState<Project | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const input =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  const addProject = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        await refresh();
        setEditing({ ...emptyProject(), id: data.id });
      } else {
        show(false, data?.error || `Server error (${res.status})`);
      }
    } catch (err) {
      show(false, `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  };

  const startEdit = (p: Project) => {
    setEditing(p);
    setPdfFile(null);
    setPdfDataUrl("");
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        show(true, "Project deleted!");
        await refresh();
      } else {
        show(false, data?.error || `Server error (${res.status})`);
      }
    } catch (err) {
      show(false, `Network error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);

      let finalImageUrl = editing.imageUrl || "";
      let finalPdfUrl = editing.pdfUrl || "";

      if (finalImageUrl && finalImageUrl.startsWith("blob:")) {
        try {
          const imgBlob = await fetch(finalImageUrl).then((r) => r.blob());
          const imgFile = new File([imgBlob], "project-image.jpg", { type: imgBlob.type });
          const imgResult = await clientUpload(imgFile, "images/projects");
          if ("url" in imgResult) finalImageUrl = imgResult.url;
          else show(false, `Image upload failed: ${imgResult.error}`);
        } catch (err) {
          show(false, `Image upload failed: ${err instanceof Error ? err.message : "Unknown"}`);
        }
      }

      if (pdfFile) {
        try {
          const pdfResult = await clientUpload(pdfFile, "pdfs/projects");
          if ("url" in pdfResult) finalPdfUrl = pdfResult.url;
          else show(false, `PDF upload failed: ${pdfResult.error}`);
        } catch (err) {
          show(false, `PDF upload failed: ${err instanceof Error ? err.message : "Unknown"}`);
        }
      }

      const projectData = {
        type: fd.get("type") as string,
        typeAr: fd.get("typeAr") as string,
        category: fd.get("category") as string,
        categoryAr: fd.get("categoryAr") as string,
        scope: fd.get("scope") as string,
        scopeAr: fd.get("scopeAr") as string,
        systems: JSON.stringify(((fd.get("systems") as string) || "").split(",").map((s) => s.trim()).filter(Boolean)),
        systemsAr: JSON.stringify(((fd.get("systemsAr") as string) || "").split(",").map((s) => s.trim()).filter(Boolean)),
        year: fd.get("year") as string,
        area: fd.get("area") as string,
        imageUrl: finalImageUrl,
        pdfUrl: finalPdfUrl,
      };

      let res;
      if (editing.id) {
        res = await fetch(`/api/projects/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      }

      const resData = await res.json().catch(() => null);
      show(res.ok, res.ok ? "Project saved!" : (resData?.error || `Server error (${res.status})`));
      if (res.ok) {
        setEditing(null);
        await refresh();
      }
    } catch (err) {
      show(false, `Save failed: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Projects ({projects.length})</h2>
        <button onClick={addProject} className="rounded-lg bg-glow/15 px-4 py-2 text-sm text-glow ring-1 ring-glow/50 hover:bg-glow/25">
          + Add Project
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-night-panel p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink">Edit Project</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-sm text-ink-muted hover:text-ink">
              Cancel
            </button>
          </div>

          <ImageUploader
            label="Project Image"
            value={editing.imageUrl || ""}
            onChange={(v) => setEditing({ ...editing, imageUrl: v })}
            folder="images/projects"
          />

          <div className="space-y-2">
            <label className="block text-sm text-ink-muted">Project PDF</label>
            {(editing.pdfUrl || pdfDataUrl) && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-glow">PDF attached</span>
                <button
                  type="button"
                  onClick={() => { setEditing({ ...editing, pdfUrl: undefined }); setPdfFile(null); setPdfDataUrl(""); }}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id="pdf-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 50 * 1024 * 1024) { alert("PDF too large (max 50MB)"); return; }
                setPdfFile(file);
                const reader = new FileReader();
                reader.onload = () => setPdfDataUrl(reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("pdf-input")?.click()}
              className="rounded-lg border border-white/10 bg-night-deep/70 px-4 py-2 text-sm text-ink-muted hover:border-glow/40 hover:text-glow"
            >
              {(editing.pdfUrl || pdfDataUrl) ? "Replace PDF" : "Upload PDF"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Title (EN)</label>
              <input name="type" defaultValue={editing.type} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Title (AR)</label>
              <input name="typeAr" defaultValue={editing.typeAr} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Category (EN)</label>
              <input name="category" defaultValue={editing.category} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Category (AR)</label>
              <input name="categoryAr" defaultValue={editing.categoryAr} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Year</label>
              <input name="year" defaultValue={editing.year} className={`${input} font-latin`} dir="ltr" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Area</label>
              <input name="area" defaultValue={editing.area} className={input} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink-muted">Scope (EN)</label>
            <textarea name="scope" defaultValue={editing.scope} rows={2} className={`${input} resize-none`} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Scope (AR)</label>
            <textarea name="scopeAr" defaultValue={editing.scopeAr} rows={2} className={`${input} resize-none`} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Systems (EN, comma-separated)</label>
              <input name="systems" defaultValue={editing.systems.join(", ")} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Systems (AR, comma-separated)</label>
              <input name="systemsAr" defaultValue={editing.systemsAr.join(", ")} className={input} />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-glow/15 px-8 py-2.5 text-sm font-semibold text-glow ring-1 ring-glow/50 hover:bg-glow/25 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Project"}
          </button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="flex items-start gap-3 rounded-xl border border-white/5 bg-night-panel/60 p-4">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
            ) : p.pdfUrl ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-glow/20 bg-glow/10 text-xs text-glow">
                PDF
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{p.type || p.typeAr}</p>
              <p className="text-sm text-ink-muted">{p.year} · {p.area}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="text-sm text-glow hover:text-glow-strong">
                Edit
              </button>
              <button onClick={() => deleteProject(p.id)} className="text-sm text-red-400 hover:text-red-300">
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      <SavedIndicator saved={saved} />
    </div>
  );
}
