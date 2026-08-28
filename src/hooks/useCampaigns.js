import { useEffect, useState } from "react";
import { database } from "APIs/firebaseConfig";

const mapCampaigns = (data) => {
  const arr = Object.entries(data || {}).map(([campaignId, c]) => {
    const name = c?.meta?.name || (campaignId === "default" ? "Diário de Campanha" : campaignId);

    const quests = Object.values(c?.quests || {})
      .filter((x) => x?.id && x?.title)
      .sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));

    const npcs = Object.values(c?.npcs || {})
      .filter((n) => n?.id && n?.name)
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));

    return { campaignId, name, quests, npcs, meta: c?.meta || {}, raw: c };
  });

  arr.sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
  return arr;
};

export function useCampaigns(uid, campaignMode = "legacy", activeCampaignId = "all") {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (campaignMode === "shared") {
      const membershipsRef = database.ref(`userCampaigns/${uid}`);
      let campaignUnsubs = [];

      const clearCampaignListeners = () => {
        campaignUnsubs.forEach((off) => {
          try {
            off();
          } catch (_) {}
        });
        campaignUnsubs = [];
      };

      const onMemberships = (snap) => {
        const memberships = snap.val() || {};
        const allIds = Object.keys(memberships);
        const ids =
          activeCampaignId === "all"
            ? allIds
            : allIds.includes(activeCampaignId)
            ? [activeCampaignId]
            : [];

        clearCampaignListeners();

        if (!ids.length) {
          setCampaigns([]);
          setLoading(false);
          return;
        }

        const campaignMap = {};
        const pushState = () => {
          const filtered = ids.reduce((acc, id) => {
            if (campaignMap[id]) acc[id] = campaignMap[id];
            return acc;
          }, {});
          setCampaigns(mapCampaigns(filtered));
          setLoading(false);
        };

        ids.forEach((id) => {
          const ref = database.ref(`campaigns/${id}`);
          const onCampaign = (campaignSnap) => {
            campaignMap[id] = campaignSnap.val() || null;
            pushState();
          };
          ref.on("value", onCampaign);
          campaignUnsubs.push(() => ref.off("value", onCampaign));
        });
      };

      membershipsRef.on("value", onMemberships);
      return () => {
        membershipsRef.off("value", onMemberships);
        clearCampaignListeners();
      };
    }

    if (activeCampaignId !== "all") {
      const ref = database.ref(`users/${uid}/campaigns/${activeCampaignId}`);
      const handle = (snap) => {
        const c = snap.val();
        if (!c) {
          setCampaigns([]);
          setLoading(false);
          return;
        }
        setCampaigns(mapCampaigns({ [activeCampaignId]: c }));
        setLoading(false);
      };
      ref.on("value", handle);
      return () => ref.off("value", handle);
    }

    const ref = database.ref(`users/${uid}/campaigns`);
    const handle = (snap) => {
      const data = snap.val() || {};
      setCampaigns(mapCampaigns(data));
      setLoading(false);
    };

    ref.on("value", handle);
    return () => ref.off("value", handle);
  }, [uid, activeCampaignId, campaignMode]);

  return { campaigns, loading, error };
}

export default useCampaigns;
