import { useEffect, useMemo, useState } from "react";
import { database } from "APIs/firebaseConfig";
import { getCampaignBasePath } from "service/campaignPath";

export function useNpcs(uid, campaignId, campaignMode = "legacy") {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  useEffect(() => {
    if (!campaignBasePath) {
      setNpcs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const npcsRef = database.ref(`${campaignBasePath}/npcs`);
    const onNpcs = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .filter((n) => n?.id && n?.name)
        .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
      setNpcs(arr);
      setLoading(false);
    };

    npcsRef.on("value", onNpcs);
    return () => npcsRef.off("value", onNpcs);
  }, [campaignBasePath]);

  return { npcs, loading, error };
}

export default useNpcs;
