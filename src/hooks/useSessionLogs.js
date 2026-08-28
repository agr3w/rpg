import { useCallback, useEffect, useState } from "react";
import { createSessionLog, ensureCampaignMeta, listenSessionLogs } from "service/sessionLogService";

export function useSessionLogs(uid, campaignId, campaignMode = "legacy", options = { limit: 250 }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = options?.limit ?? 250;

  useEffect(() => {
    if (!uid || !campaignId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    ensureCampaignMeta({ uid, campaignId, mode: campaignMode }).catch(() => {});

    const off = listenSessionLogs({
      uid,
      campaignId,
      mode: campaignMode,
      limit,
      onValue: (arr) => {
        setLogs(arr);
        setLoading(false);
      },
    });

    return () => {
      try {
        off();
      } catch (_) {}
    };
  }, [uid, campaignId, campaignMode, limit]);

  const createLog = useCallback(
    async ({ title, summary, tags }) => {
      if (!uid || !campaignId) {
        throw new Error("Usuário ou campanha inválidos.");
      }
      return await createSessionLog({
        uid,
        campaignId,
        mode: campaignMode,
        title,
        summary,
        tags,
      });
    },
    [uid, campaignId, campaignMode]
  );

  return { logs, loading, error, createLog };
}

export default useSessionLogs;
