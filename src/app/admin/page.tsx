"use client";

import { useState, useEffect } from "react";
import PasswordGate from "./components/PasswordGate";
import AdminLayout from "./components/AdminLayout";
import ProfileEditor from "./components/ProfileEditor";
import ProjectsEditor from "./components/ProjectsEditor";
import ExperienceEditor from "./components/ExperienceEditor";
import SkillsEditor from "./components/SkillsEditor";
import CvEditor from "./components/CvEditor";
import TranslationsEditor from "./components/TranslationsEditor";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/check").then((res) => {
      if (res.ok) setAuthed(true);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  const handleLogin = () => setAuthed(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
  };

  if (checking) return null;
  if (!authed) return <PasswordGate onAuth={handleLogin} />;

  return (
    <AdminLayout onLogout={handleLogout}>
      {(tab) => {
        switch (tab) {
          case "profile": return <ProfileEditor />;
          case "projects": return <ProjectsEditor />;
          case "experience": return <ExperienceEditor />;
          case "skills": return <SkillsEditor />;
          case "cv": return <CvEditor />;
          case "translations": return <TranslationsEditor />;
        }
      }}
    </AdminLayout>
  );
}
