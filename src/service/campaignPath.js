export function getCampaignBasePath({ uid, campaignId, mode = "legacy" }) {
  if (!campaignId) return "";
  if (mode === "shared") return `campaigns/${campaignId}`;
  if (!uid) return "";
  return `users/${uid}/campaigns/${campaignId}`;
}

export function buildCampaignQuery({ campaignId, mode = "legacy" }) {
  const params = new URLSearchParams();
  params.set("c", campaignId || "default");
  if (mode === "shared") params.set("m", "shared");
  return params.toString();
}
