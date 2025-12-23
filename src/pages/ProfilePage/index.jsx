import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import AccountSection from "./sections/AccountSection";
import SecuritySection from "./sections/SecuritySection";
import ContentSection from "./sections/ContentSection";
import DangerSection from "./sections/DangerSection";

export default function Perfil() {
  const [status, setStatus] = useState({ type: "info", msg: "" });
  const [active, setActive] = useState("conta");

  const sections = useMemo(
    () => [
      { id: "conta", label: "Conta", icon: <PersonOutlineRoundedIcon />, node: <AccountSection setStatus={setStatus} /> },
      { id: "seguranca", label: "Segurança", icon: <SecurityRoundedIcon />, node: <SecuritySection setStatus={setStatus} /> },
      { id: "conteudo", label: "Conteúdo", icon: <FolderOpenRoundedIcon />, node: <ContentSection setStatus={setStatus} /> },
      { id: "risco", label: "Zona de risco", icon: <WarningAmberRoundedIcon />, node: <DangerSection setStatus={setStatus} /> },
    ],
    []
  );

  const current = sections.find((s) => s.id === active) || sections[0];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Perfil & Configurações
          </Typography>
          <Typography sx={{ opacity: 0.8 }}>
            Ajuste sua conta e preferências básicas.
          </Typography>
        </Box>

        {status.msg ? <Alert severity={status.type}>{status.msg}</Alert> : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Paper elevation={0} sx={{ borderRadius: 2.5, p: 1 }}>
            <Typography sx={{ fontWeight: 900, px: 1.25, pt: 1, pb: 0.5 }}>
              Seções
            </Typography>
            <Divider sx={{ mb: 0.5 }} />

            <List dense>
              {sections.map((s) => (
                <ListItemButton
                  key={s.id}
                  selected={active === s.id}
                  onClick={() => setActive(s.id)}
                  sx={{ borderRadius: 2, mx: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 38 }}>{s.icon}</ListItemIcon>
                  <ListItemText primary={s.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: 2.5, p: { xs: 2, md: 3 } }}>
            {current.node}
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}