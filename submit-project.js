import { PROJECT_TAXONOMY } from "./lib/project-taxonomy.js";

const form = document.querySelector("#project-submission-form");
const status = document.querySelector("#submission-status");
const assetUrlField = document.querySelector("#asset-url-field");
const assetFileField = document.querySelector("#asset-file-field");
const submitButton = form.querySelector('button[type="submit"]');

function fillSelect(select, values) {
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select...";
  select.append(placeholder);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

for (const select of document.querySelectorAll("[data-taxonomy]")) {
  fillSelect(select, PROJECT_TAXONOMY[select.dataset.taxonomy]);
}

const techStackFieldset = document.querySelector("#tech-stack-fieldset");
for (const value of PROJECT_TAXONOMY.techStack) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = "techStack";
  input.value = value;
  label.append(input, document.createTextNode(value));
  techStackFieldset.append(label);
}

function selectedAssetMode() {
  return form.elements.assetMode.value;
}

function syncAssetMode() {
  const uploaded = selectedAssetMode() === "uploaded_image";
  assetUrlField.hidden = uploaded;
  assetFileField.hidden = !uploaded;
  form.elements.assetUrl.required = !uploaded;
  form.elements.assetFile.required = uploaded;
}

function setStatus(message, tone = "") {
  status.textContent = message;
  status.dataset.tone = tone;
}

function submissionBody() {
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);
  body.techStack = formData.getAll("techStack");
  delete body.assetFile;
  return body;
}

async function publishProject(body) {
  const response = await fetch("/api/projects/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.errors?.join(" ") || "Project could not be published.");
  }

  return result;
}

async function uploadScreenshot(body) {
  if (body.assetMode !== "uploaded_image") return body;

  const file = form.elements.assetFile.files[0];
  if (!file) throw new Error("Choose a screenshot before publishing.");

  const { upload } = await import("https://esm.sh/@vercel/blob/client");
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/projects/upload"
  });

  body.uploadedAssetUrl = blob.url;
  delete body.assetUrl;
  return body;
}

form.addEventListener("change", (event) => {
  if (event.target.name === "assetMode") syncAssetMode();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  setStatus("Publishing project...");

  try {
    const body = submissionBody();
    await uploadScreenshot(body);
    await publishProject(body);
    form.reset();
    syncAssetMode();
    setStatus("Project published.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

syncAssetMode();
