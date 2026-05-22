import { insertPublishedProject } from "../../lib/project-repository.js";
import { validateProjectSubmission } from "../../lib/project-validation.js";

export default async function submitProject(req, res, dependencies = {}) {
  if (req.method !== "POST") {
    res.setHeader?.("Allow", "POST");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  const validation = validateProjectSubmission(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ ok: false, errors: validation.errors });
  }

  try {
    const save = dependencies.insertProject || insertPublishedProject;
    const project = await save(validation.value);
    return res.status(201).json({ ok: true, project });
  } catch {
    return res.status(500).json({
      ok: false,
      errors: ["project could not be saved right now"]
    });
  }
}
