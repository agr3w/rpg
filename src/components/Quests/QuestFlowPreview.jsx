import React, { useMemo } from "react";
import { Box, Checkbox, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { computeFlowProgress, getMilestonesArray, getTodosArray } from "./questFlowUtils";

export default function QuestFlowPreview({
  milestonesObj,
  onToggleTodo, // (milestoneId, todo) => void
  previewMilestones = 2,
  previewTodos = 6,
}) {
  const milestones = useMemo(() => {
    return getMilestonesArray(milestonesObj).slice(0, previewMilestones);
  }, [milestonesObj, previewMilestones]);

  const overall = useMemo(() => computeFlowProgress(milestonesObj), [milestonesObj]);

  if (!milestones.length) {
    return (
      <Typography sx={{ opacity: 0.8 }}>
        Essa quest ainda não tem plano/checklist. Abra a quest e crie marcos/objetivos.
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {overall.total ? (
        <Typography variant="caption" sx={{ opacity: 0.75 }}>
          Progresso geral: {overall.done}/{overall.total}
        </Typography>
      ) : null}

      {milestones.map((m) => {
        const todos = getTodosArray(m?.todos).slice(0, previewTodos);
        const done = todos.filter((t) => Boolean(t?.done)).length;
        const total = todos.length;
        const mp = total ? Math.round((done / total) * 100) : 0;

        return (
          <Paper
            key={m.id}
            elevation={0}
            sx={{ p: 1.1, borderRadius: 2, border: "1px solid rgba(0,0,0,0.10)" }}
          >
            <Stack spacing={0.75}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ gap: 1 }}>
                <Typography sx={{ fontWeight: 900 }} noWrap title={m.title || ""}>
                  {m.title || "Marco"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {done}/{total}
                </Typography>
              </Stack>

              <LinearProgress variant="determinate" value={mp} sx={{ height: 8, borderRadius: 2 }} />

              {todos.length === 0 ? (
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  (Sem objetivos)
                </Typography>
              ) : (
                <Stack spacing={0.25}>
                  {todos.map((t) => (
                    <Box
                      key={t.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        border: "1px dashed rgba(0,0,0,0.16)",
                        borderRadius: 2,
                        px: 1,
                        py: 0.25,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                        <Checkbox checked={Boolean(t.done)} onChange={() => onToggleTodo?.(m.id, t)} />
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: t.done ? 0.7 : 0.95,
                            textDecoration: t.done ? "line-through" : "none",
                          }}
                          noWrap
                          title={t.text || ""}
                        >
                          {t.text || "—"}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}