import { handleUpload } from "@vercel/blob/client";

export function projectScreenshotUploadOptions() {
  return {
    allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
    maximumSizeInBytes: 5 * 1024 * 1024,
    addRandomSuffix: true
  };
}

export default async function uploadProjectAsset(req, res) {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => projectScreenshotUploadOptions(),
      onUploadCompleted: async () => {}
    });

    return res.status(200).json(jsonResponse);
  } catch {
    return res.status(500).json({
      ok: false,
      errors: ["screenshot upload could not start"]
    });
  }
}
