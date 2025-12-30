import React, { useMemo } from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ELEMENT_VARS, getElementFromPath } from "theme/elementTokens";
import RouteBackground from "components/RouteBackground";

function D20Mark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false">
      <path
        d="M32 3 6 18v28l26 15 26-15V18L32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M32 3 20 22l12 39 12-39L32 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M6 18h52M20 22 6 46m38-24 14 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
  right,
  maxWidth = "lg",
  elementOverride,
}) {
  const location = useLocation();

  const element = useMemo(() => {
    if (elementOverride) return elementOverride;
    return getElementFromPath(location.pathname);
  }, [location.pathname, elementOverride]);

  const vars = ELEMENT_VARS?.[element] || ELEMENT_VARS?.void || {};

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", ...vars }}>
      <RouteBackground />

      <Container
        maxWidth={maxWidth}
        sx={{
          position: "relative",
          zIndex: 1,
          py: { xs: 3, md: 7 },
          minHeight: "100vh",
          display: "grid",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: right ? "1.2fr 1fr" : "1fr" },
            gap: { xs: 2, md: 3 },
            alignItems: "start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: "1px solid var(--rpg-stroke)",
              bgcolor: "color-mix(in srgb, var(--rpg-surface) 88%, transparent)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
              position: "relative",
              isolation: "isolate",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                backgroundImage: `
                  radial-gradient(80% 120% at 50% 0%, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 55%),
                  linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.00))
                `,
              },
            }}
          >
            <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--rpg-accent2)",
                    bgcolor: "rgba(0,0,0,0.12)",
                    border: "1px solid var(--rpg-stroke)",
                    flex: "0 0 auto",
                  }}
                >
                  <D20Mark size={24} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{ letterSpacing: 2.4, textTransform: "uppercase", opacity: 0.75 }}
                  >
                    RPG Organizer
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 1000,
                      letterSpacing: 0.6,
                      color: "var(--rpg-ink)",
                      lineHeight: 1.05,
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
              </Stack>

              {subtitle ? (
                <Typography sx={{ color: "color-mix(in srgb, var(--rpg-ink) 80%, transparent)" }}>
                  {subtitle}
                </Typography>
              ) : null}

              {children}
            </Stack>
          </Paper>

          {right ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                border: "1px solid var(--rpg-stroke)",
                bgcolor: "color-mix(in srgb, var(--rpg-surface) 78%, transparent)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
                backdropFilter: "blur(6px)",
              }}
            >
              {right}
            </Paper>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}