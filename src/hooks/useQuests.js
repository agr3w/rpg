import { useEffect, useMemo, useState } from "react";
import { database } from "APIs/firebaseConfig";
import { getCampaignBasePath } from "service/campaignPath";

export function useQuests(uid, campaignId, campaignMode = "legacy") {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const campaignBasePath = useMemo(
    () => getCampaignBasePath({ uid, campaignId, mode: campaignMode }),
    [uid, campaignId, campaignMode]
  );

  useEffect(() => {
    if (!campaignBasePath) {
      setQuests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const questsRef = database.ref(`${campaignBasePath}/quests`);
    const onQuests = (snap) => {
      const data = snap.val() || {};
      const arr = Object.values(data)
        .filter((x) => x?.id && x?.title)
        .sort((a, b) => String(a.title).localeCompare(String(b.title), "pt-BR"));
      setQuests(arr);
      setLoading(false);
    };

    questsRef.on("value", onQuests);
    return () => questsRef.off("value", onQuests);
  }, [campaignBasePath]);

  return { quests, loading, error };
}

export default useQuests;
