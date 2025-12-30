import React from "react";
import { Paper, Stack, Typography, Divider, Box } from "@mui/material";
import { RPG_TOKENS } from "theme/rpgTokens";

export default function RpgSection({ title, subtitle, actions, children, sx }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        border: RPG_TOKENS.border,
        bgcolor: RPG_TOKENS.paperBg,
        boxShadow: RPG_TOKENS.shadow,
        ...sx,
      }}
    >
      <Stack spacing={1.25}>
        {(title || subtitle || actions) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {title ? (
                <Typography variant="h5" sx={{ fontWeight: 1000, color: RPG_TOKENS.ink }}>
                  {title}
                </Typography>
              ) : null}
              {subtitle ? (
                <Typography sx={{ opacity: 0.85, color: "rgba(44,26,16,0.85)" }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>

            {actions ? <Box>{actions}</Box> : null}
          </Box>
        )}

        {(title || subtitle || actions) && <Divider />}
        {children}
      </Stack>
    </Paper>
  );
}