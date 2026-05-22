export function toPublicProject(row, techStack = []) {
  return {
    slug: row.slug,
    contributorName: row.contributor_name,
    contributorSpecialty: row.contributor_specialty,
    title: row.title,
    description: row.description,
    industry: row.industry,
    projectType: row.project_type,
    automationLayer: row.automation_layer,
    serviceModel: row.service_model,
    dealType: row.deal_type,
    dataHosting: row.data_hosting,
    complexity: row.complexity,
    techStack,
    asset: {
      type: row.asset_type,
      url: row.asset_url,
      altText: row.asset_alt_text
    },
    publishedAt: row.published_at
  };
}
