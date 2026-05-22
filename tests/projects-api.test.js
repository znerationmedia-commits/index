import { describe, expect, it, vi } from "vitest";
import listProjects from "../api/projects/index.js";
import submitProject from "../api/projects/submit.js";
import { projectScreenshotUploadOptions } from "../api/projects/upload.js";

const validBody = {
  contributorName: "Amir",
  contributorSpecialty: "HR Payroll Automation",
  title: "Payroll Exception Assistant",
  description:
    "A payroll operations team needed a faster way to identify mismatched attendance and payroll records before monthly closing. Their existing spreadsheet checks were slow, repetitive, and easy to miss when several departments submitted late corrections. We built an AI-assisted exception workflow that compares payroll inputs, flags risky rows, groups the likely causes, and routes human review steps to the right owner before closing. The team still makes the final payroll decisions, but the workflow removes the hunting work, keeps review notes structured, and gives managers a clearer view of which exceptions are resolved and which ones need escalation for action.",
  dealType: "B2B SME",
  serviceModel: "Done-For-You",
  automationLayer: "Hybrid",
  industry: "HR & Payroll",
  projectType: "Workflow Automation",
  dataHosting: "Cloud-Hosted",
  techStack: ["Claude AI", "Python"],
  complexity: "Standard (1-4 weeks)",
  assetMode: "loom",
  assetUrl: "https://www.loom.com/share/demo-project"
};

function mockResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    }
  };
}

describe("submit project API", () => {
  it("publishes a valid URL-based submission", async () => {
    const res = mockResponse();
    const insertProject = vi.fn().mockResolvedValue({ slug: "payroll-exception-assistant" });

    await submitProject({ method: "POST", body: validBody }, res, { insertProject });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      ok: true,
      project: { slug: "payroll-exception-assistant" }
    });
  });

  it("rejects invalid submissions without inserting", async () => {
    const res = mockResponse();
    const insertProject = vi.fn();

    await submitProject({ method: "POST", body: {} }, res, { insertProject });

    expect(res.statusCode).toBe(400);
    expect(insertProject).not.toHaveBeenCalled();
  });
});

describe("published projects API", () => {
  it("returns public project data", async () => {
    const res = mockResponse();

    await listProjects({ method: "GET" }, res, {
      listPublishedProjects: vi.fn().mockResolvedValue([{ slug: "payroll-exception-assistant" }])
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      projects: [{ slug: "payroll-exception-assistant" }]
    });
  });
});

describe("project screenshot upload options", () => {
  it("limits Blob uploads to small web images", () => {
    expect(projectScreenshotUploadOptions()).toEqual({
      allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
      maximumSizeInBytes: 5 * 1024 * 1024,
      addRandomSuffix: true
    });
  });
});
