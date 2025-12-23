import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { alpha, Box, Card, CardActionArea, Stack, Typography, useTheme } from "@mui/material";

export default function HubTile({ title, subtitle, to, icon, imageSrc, imageAlt }) {
  const theme = useTheme();

  return (
    <Card elevation={0}>
      <CardActionArea component={RouterLink} to={to} disableRipple sx={{ p: 2, height: "100%" }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.rpg?.ink || theme.palette.text.primary,
              flex: "0 0 auto",
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }} noWrap>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Stack>

        {imageSrc ? (
          <Box
            sx={{
              mt: 1.5,
              borderRadius: 2,
              overflow: "hidden",
              border: `1px solid ${alpha("#000", 0.08)}`,
              bgcolor: alpha("#000", 0.04),
            }}
          >
            <Box
              component="img"
              src={imageSrc}
              alt={imageAlt || title}
              loading="lazy"
              decoding="async"
              sx={{
                width: "100%",
                height: 170,
                objectFit: "contain",
                display: "block",
                p: 1.5,
                transition: "transform 260ms ease",
                ".MuiCardActionArea-root:hover &": { transform: "scale(0.98)" },
              }}
            />
          </Box>
        ) : null}

        <Box
          sx={{
            mt: 1.25,
            height: 6,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.55)}, ${alpha(
              theme.palette.secondary.main,
              0.30
            )})`,
            opacity: 0.9,
          }}
        />
      </CardActionArea>
    </Card>
  );
}