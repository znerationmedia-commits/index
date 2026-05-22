import { PROJECT_TAXONOMY } from "./project-taxonomy.js";

const DESCRIPTION_MIN_WORDS = 100;
const DESCRIPTION_MAX_WORDS = 200;

function wordCount(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function isApproved(value, approved) {
  return approved.includes(value);
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isLoomUrl(value) {
  try {
    const url = new URL(value);
    return url.hostname === "loom.com" || url.hostname.endsWith(".loom.com");
  } catch {
    return false;
  }
}

function trimText(value) {
  return String(value || "").trim();
}

export function validateProjectSubmission(input = {}) {
  const errors = [];
  const required = [
    ["contributorName", "contributor name is required"],
    ["contributorSpecialty", "contributor specialty is required"],
    ["title", "project title is required"],
    ["description", "description is required"]
  ];

  for (const [key, message] of required) {
    if (!trimText(input[key])) errors.push(message);
  }

  const descriptionWords = wordCount(input.description);
  if (descriptionWords < DESCRIPTION_MIN_WORDS || descriptionWords > DESCRIPTION_MAX_WORDS) {
    errors.push("description must be 100-200 words");
  }

  const taxonomies = [
    ["dealType", PROJECT_TAXONOMY.dealTypes, "deal type"],
    ["serviceModel", PROJECT_TAXONOMY.serviceModels, "service model"],
    ["automationLayer", PROJECT_TAXONOMY.automationLayers, "automation layer"],
    ["industry", PROJECT_TAXONOMY.industries, "industry"],
    ["projectType", PROJECT_TAXONOMY.projectTypes, "project type"],
    ["dataHosting", PROJECT_TAXONOMY.dataHosting, "data hosting"],
    ["complexity", PROJECT_TAXONOMY.complexity, "complexity"]
  ];

  for (const [key, approved, label] of taxonomies) {
    if (!isApproved(input[key], approved)) errors.push(`${label} must be an approved value`);
  }

  const techStack = Array.isArray(input.techStack) ? input.techStack : [];
  if (!techStack.length || techStack.some((value) => !isApproved(value, PROJECT_TAXONOMY.techStack))) {
    errors.push("tech stack must contain approved values");
  }

  const assetMode = input.assetMode;
  const providedAssetUrl = trimText(input.assetUrl);
  const uploadedAssetUrl = trimText(input.uploadedAssetUrl);
  const hasExternalAsset = ["loom", "external_image"].includes(assetMode) && Boolean(providedAssetUrl);
  const hasUploadedAsset = assetMode === "uploaded_image" && Boolean(uploadedAssetUrl);

  if (Number(hasExternalAsset) + Number(hasUploadedAsset) !== 1) {
    errors.push("choose exactly one project visual");
  }

  if (assetMode === "loom" && providedAssetUrl && !isLoomUrl(providedAssetUrl)) {
    errors.push("loom URL must use loom.com");
  }

  if (assetMode === "external_image" && providedAssetUrl && !isHttpUrl(providedAssetUrl)) {
    errors.push("image URL must be a valid HTTP URL");
  }

  if (assetMode === "uploaded_image" && uploadedAssetUrl && !isHttpUrl(uploadedAssetUrl)) {
    errors.push("uploaded image URL must be a valid HTTP URL");
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      contributorName: trimText(input.contributorName),
      contributorSpecialty: trimText(input.contributorSpecialty),
      title: trimText(input.title),
      description: trimText(input.description),
      dealType: input.dealType,
      serviceModel: input.serviceModel,
      automationLayer: input.automationLayer,
      industry: input.industry,
      projectType: input.projectType,
      dataHosting: input.dataHosting,
      techStack: [...new Set(techStack)],
      complexity: input.complexity,
      assetType: assetMode,
      assetUrl: hasUploadedAsset ? uploadedAssetUrl : providedAssetUrl,
      assetAltText: trimText(input.assetAltText) || `${trimText(input.title)} project visual`,
      status: "published"
    }
  };
}
