import { describe, expect, it, vi } from "vitest";
import { listPublishedProjects } from "../lib/project-repository.js";

describe("listPublishedProjects", () => {
  it("maps published project rows and their tech stack", async () => {
    const sql = vi
      .fn()
      .mockResolvedValueOnce([
        {
          id: "project-1",
          slug: "payroll-exception-assistant",
          contributor_name: "Amir",
          contributor_specialty: "HR Payroll Automation",
          title: "Payroll Exception Assistant",
          description: "Public project description",
          industry: "HR & Payroll",
          project_type: "Workflow Automation",
          automation_layer: "Hybrid",
          service_model: "Done-For-You",
          deal_type: "B2B SME",
          data_hosting: "Cloud-Hosted",
          complexity: "Standard (1-4 weeks)",
          asset_type: "loom",
          asset_url: "https://loom.com/share/demo",
          asset_alt_text: "Payroll project demo",
          published_at: "2026-05-22T00:00:00.000Z"
        }
      ])
      .mockResolvedValueOnce([{ project_id: "project-1", tech_stack_value: "Claude AI" }]);

    await expect(listPublishedProjects(sql)).resolves.toMatchObject([
      {
        slug: "payroll-exception-assistant",
        techStack: ["Claude AI"]
      }
    ]);
  });
});
