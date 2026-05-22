import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { toPublicProject } from "./project-public-shape.js";

export function getSql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  return neon(process.env.DATABASE_URL);
}

function techByProject(rows) {
  return rows.reduce((map, row) => {
    const values = map.get(row.project_id) || [];
    values.push(row.tech_stack_value);
    map.set(row.project_id, values);
    return map;
  }, new Map());
}

export async function listPublishedProjects(sql = getSql()) {
  const projects = await sql`
    select *
    from projects
    where status = 'published'
    order by published_at desc
  `;

  if (!projects.length) return [];

  const ids = projects.map((project) => project.id);
  const techRows = await sql`
    select project_id, tech_stack_value
    from project_tech_stack
    where project_id = any(${ids})
    order by tech_stack_value asc
  `;

  const techMap = techByProject(techRows);
  return projects.map((project) => toPublicProject(project, techMap.get(project.id) || []));
}

function baseSlug(value) {
  return (
    String(value || "project")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 72) || "project"
  );
}

export async function insertPublishedProject(project, sql = getSql()) {
  const slug = `${baseSlug(project.title)}-${randomUUID().slice(0, 8)}`;
  const rows = await sql`
    with inserted_project as (
      insert into projects (
        slug, contributor_name, contributor_specialty, title, description,
        deal_type, service_model, automation_layer, industry, project_type,
        data_hosting, complexity, asset_type, asset_url, asset_alt_text, status
      ) values (
        ${slug}, ${project.contributorName}, ${project.contributorSpecialty},
        ${project.title}, ${project.description}, ${project.dealType},
        ${project.serviceModel}, ${project.automationLayer}, ${project.industry},
        ${project.projectType}, ${project.dataHosting}, ${project.complexity},
        ${project.assetType}, ${project.assetUrl}, ${project.assetAltText}, 'published'
      )
      returning id, slug
    ),
    inserted_tech_stack as (
      insert into project_tech_stack (project_id, tech_stack_value)
      select inserted_project.id, tech.tech_stack_value
      from inserted_project
      cross join unnest(${project.techStack}::text[]) as tech(tech_stack_value)
    )
    select slug from inserted_project
  `;

  return { slug: rows[0].slug };
}
