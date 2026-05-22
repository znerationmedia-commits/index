import { listPublishedProjects } from "../../lib/project-repository.js";

export default async function listProjects(req, res, dependencies = {}) {
  if (req.method !== "GET") {
    res.setHeader?.("Allow", "GET");
    return res.status(405).json({ ok: false, errors: ["method not allowed"] });
  }

  try {
    const list = dependencies.listPublishedProjects || listPublishedProjects;
    const projects = await list();
    return res.status(200).json({ ok: true, projects });
  } catch {
    return res.status(503).json({
      ok: false,
      projects: [],
      errors: ["projects are temporarily unavailable"]
    });
  }
}
