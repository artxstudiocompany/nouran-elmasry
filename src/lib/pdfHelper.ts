let pdfjsReady = false;

export async function loadPdfjs() {
  if (pdfjsReady) return await import("pdfjs-dist");
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  pdfjsReady = true;
  return pdfjsLib;
}

export async function loadPdfDocument(
  url: string,
  timeoutMs = 15000
): Promise<{ doc: any; numPages: number }> {
  const pdfjsLib = await loadPdfjs();

  let docData: any;
  if (url.startsWith("data:")) {
    docData = { data: Uint8Array.from(atob(url.split(",")[1]), (c) => c.charCodeAt(0)) };
  } else {
    docData = { url };
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`PDF load timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const doc = await Promise.race([
    pdfjsLib.getDocument(docData).promise,
    timeoutPromise,
  ]);

  return { doc, numPages: doc.numPages };
}
