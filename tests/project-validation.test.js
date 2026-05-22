import { describe, expect, it } from "vitest";
import { validateProjectSubmission } from "../lib/project-validation.js";

const validSubmission = {
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

describe("validateProjectSubmission", () => {
  it("accepts approved taxonomy values", () => {
    expect(validateProjectSubmission(validSubmission)).toMatchObject({
      ok: true,
      value: {
        status: "published",
        assetType: "loom"
      }
    });
  });

  it("rejects unapproved taxonomy values", () => {
    const result = validateProjectSubmission({
      ...validSubmission,
      industry: "Anything Goes"
    });

    expect(result).toMatchObject({
      ok: false,
      errors: expect.arrayContaining(["industry must be an approved value"])
    });
  });

  it("requires exactly one visual asset path", () => {
    const result = validateProjectSubmission({
      ...validSubmission,
      assetMode: "loom",
      assetUrl: "",
      uploadedAssetUrl: "https://blob.example/image.png"
    });

    expect(result).toMatchObject({
      ok: false,
      errors: expect.arrayContaining(["choose exactly one project visual"])
    });
  });

  it("rejects non-Loom URLs in Loom mode", () => {
    const result = validateProjectSubmission({
      ...validSubmission,
      assetUrl: "https://example.com/video"
    });

    expect(result).toMatchObject({
      ok: false,
      errors: expect.arrayContaining(["loom URL must use loom.com"])
    });
  });

  it("accepts external image URLs", () => {
    expect(
      validateProjectSubmission({
        ...validSubmission,
        assetMode: "external_image",
        assetUrl: "https://images.example.com/payroll-assistant.webp"
      })
    ).toMatchObject({
      ok: true,
      value: { assetType: "external_image" }
    });
  });

  it("accepts uploaded image Blob URLs", () => {
    expect(
      validateProjectSubmission({
        ...validSubmission,
        assetMode: "uploaded_image",
        assetUrl: "",
        uploadedAssetUrl: "https://portfolio.public.blob.vercel-storage.com/payroll.png"
      })
    ).toMatchObject({
      ok: true,
      value: { assetType: "uploaded_image" }
    });
  });
});
