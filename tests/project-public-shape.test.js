import { describe, expect, it } from "vitest";
import { toPublicProject } from "../lib/project-public-shape.js";

describe("toPublicProject", () => {
  it("returns only public portfolio fields", () => {
    expect(
      toPublicProject(
        {
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
          published_at: "2026-05-22T00:00:00.000Z",
          internal_note: "do not leak"
        },
        ["Claude AI", "Python"]
      )
    ).toEqual({
      slug: "payroll-exception-assistant",
      contributorName: "Amir",
      contributorSpecialty: "HR Payroll Automation",
      title: "Payroll Exception Assistant",
      description: "Public project description",
      industry: "HR & Payroll",
      projectType: "Workflow Automation",
      automationLayer: "Hybrid",
      serviceModel: "Done-For-You",
      dealType: "B2B SME",
      dataHosting: "Cloud-Hosted",
      complexity: "Standard (1-4 weeks)",
      techStack: ["Claude AI", "Python"],
      asset: {
        type: "loom",
        url: "https://loom.com/share/demo",
        altText: "Payroll project demo"
      },
      publishedAt: "2026-05-22T00:00:00.000Z"
    });
  });
});
