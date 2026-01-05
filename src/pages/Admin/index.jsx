import React, { useState, useEffect } from "react";
import { 
  Box, Container, Typography, Paper, TextField, Button, 
  Grid, Divider, Alert, Switch, FormControlLabel, Stack, Chip
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { database, auth } from "APIs/firebaseConfig";
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BugReportIcon from '@mui/icons-material/BugReport';
import LinkIcon from '@mui/icons-material/Link';
import CampaignIcon from '@mui/icons-material/Campaign';

// --- ESTILOS RPG ---

const AdminContainer = styled(Box)({
  minHeight: "100vh",
  background: "radial-gradient(circle at 50% 20%, #1a0505 0%, #000000 100%)", // Fundo Void/Fire
  color: "#e0e0e0",
  paddingTop: 40,
  paddingBottom: 40,
});

const GrimoirePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha("#150a0a", 0.9),
  border: "1px solid #4a1a1a",
  boxShadow: "0 0 40px rgba(255, 50, 0, 0.15), inset 0 0 100px rgba(0,0,0,0.8)",
  borderRadius: 16,
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0, left: 0, right: 0, height: 4,
    background: "linear-gradient(90deg, #4a1a1a, #ff4500, #4a1a1a)",
  }
}));

const RpgTextField = styled(TextField)({
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    transition: "all 0.3s",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
    "&.Mui-focused": { 
      backgroundColor: "rgba(0,0,0,0.6)",
      borderColor: "#ff4500",
      boxShadow: "0 0 10px rgba(255,69,0,0.2)"
    },
  },
  "& .MuiInputLabel-root": { color: "#888", fontFamily: "Cinzel" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#ff4500" },
});

const SectionTitle = ({ children, icon: Icon }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, mt: 1 }}>
    {Icon && <Icon sx={{ color: "#ff4500" }} />}
    <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#ffcc00", letterSpacing: 1 }}>
      {children}
    </Typography>
    <Divider sx={{ flexGrow: 1, borderColor: "rgba(255,69,0,0.3)" }} />
  </Box>
);

export default function AdminPage() {
  const [data, setData] = useState({
    version: "",
    codename: "",
    build: "",
    // Novos campos de notificação rica
    announcementTitle: "",
    announcementMsg: "",
    announcementLink: "",
    announcementLinkText: "",
    announcementType: "info",
    showAnnouncement: false
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Carregar dados atuais
  useEffect(() => {
    database.ref("system/metadata").once("value").then(snap => {
      const val = snap.val() || {};
      const ann = val.announcement || {};
      setData({
        version: val.version || "",
        codename: val.codename || "",
        build: val.build || "",
        // Mapear dados antigos ou novos
        announcementTitle: ann.title || "",
        announcementMsg: ann.message || "",
        announcementLink: ann.link || "",
        announcementLinkText: ann.linkText || "",
        announcementType: ann.type || "info",
        showAnnouncement: !!val.announcement
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        version: data.version,
        codename: data.codename,
        build: data.build,
        announcement: data.showAnnouncement ? {
          // ✅ ID ÚNICO: Garante que o sino pisque novamente para todos
          id: Date.now(), 
          title: data.announcementTitle,
          message: data.announcementMsg,
          type: data.announcementType,
          link: data.announcementLink,
          linkText: data.announcementLinkText
        } : null
      };

      await database.ref("system/metadata").set(payload);
      setMsg({ type: "success", text: "O tecido da realidade foi alterado." });
      setTimeout(() => setMsg(null), 4000);
    } catch (error) {
      setMsg({ type: "error", text: "Falha no ritual: " + error.message });
    }
  };

  const MY_ADMIN_UID = "hKYEhI9JIEPOS2RSON7tsviLzjV2"; 
  if (auth.currentUser?.uid !== MY_ADMIN_UID) {
    return (
      <Box sx={{ height: "100vh", display: "grid", placeItems: "center", bgcolor: "#000", color: "#800" }}>
        <Stack alignItems="center" spacing={2}>
          <SecurityIcon sx={{ fontSize: 80 }} />
          <Typography variant="h2" fontFamily="Cinzel">ACESSO PROIBIDO</Typography>
          <Typography>Você não possui o nível de conjurador necessário.</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <AdminContainer>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#ff4500", textShadow: "0 0 20px rgba(255,69,0,0.5)" }}>
            Grimório do Mestre
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#888", fontFamily: "Cinzel" }}>
            Controle absoluto sobre o multiverso do RPG Organizer
          </Typography>
        </Box>

        <GrimoirePaper elevation={24}>
          {msg && (
            <Alert 
              severity={msg.type} 
              variant="filled"
              sx={{ mb: 4, bgcolor: msg.type === "success" ? "rgba(0,100,0,0.5)" : "rgba(100,0,0,0.5)" }}
            >
              {msg.text}
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* --- VERSÃO --- */}
            <Grid item xs={12}>
              <SectionTitle icon={AutoFixHighIcon}>Versão & Identidade</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <RpgTextField 
                    label="Versão Numérica" fullWidth variant="filled"
                    placeholder="ex: 1.2.0"
                    value={data.version} onChange={e => setData({...data, version: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RpgTextField 
                    label="Codinome da Criatura" fullWidth variant="filled"
                    placeholder="ex: Mindflayer"
                    value={data.codename} onChange={e => setData({...data, codename: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RpgTextField 
                    label="Tipo de Build" fullWidth variant="filled"
                    placeholder="ex: Beta"
                    value={data.build} onChange={e => setData({...data, build: e.target.value})}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* --- ANÚNCIOS RICOS --- */}
            <Grid item xs={12}>
              <SectionTitle icon={CampaignIcon}>Sussurros Globais (Notificações)</SectionTitle>
              
              <Box sx={{ mb: 2, p: 2, border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 2 }}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={data.showAnnouncement} 
                      onChange={e => setData({...data, showAnnouncement: e.target.checked})} 
                      color="warning" 
                    />
                  }
                  label={<Typography sx={{ fontFamily: "Cinzel", color: data.showAnnouncement ? "#ffcc00" : "#666" }}>Ativar Notificação Global</Typography>}
                />
              </Box>

              {data.showAnnouncement && (
                <Stack spacing={2} sx={{ animation: "fadeIn 0.5s" }}>
                  
                  {/* TIPO DE NOTIFICAÇÃO */}
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {[
                      { id: "info", label: "LORE (Azul)", color: "#29b6f6" },
                      { id: "success", label: "LOOT (Verde)", color: "#66bb6a" },
                      { id: "warning", label: "QUEST (Laranja)", color: "#ffa726" },
                      { id: "error", label: "DANGER (Vermelho)", color: "#ef5350" }
                    ].map((type) => (
                      <Chip 
                        key={type.id}
                        label={type.label}
                        onClick={() => setData({...data, announcementType: type.id})}
                        sx={{ 
                          bgcolor: data.announcementType === type.id ? alpha(type.color, 0.2) : "transparent",
                          border: `1px solid ${data.announcementType === type.id ? type.color : "rgba(255,255,255,0.1)"}`,
                          color: data.announcementType === type.id ? type.color : "#888",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      />
                    ))}
                  </Stack>

                  <RpgTextField 
                    label="Título do Aviso (Opcional)" fullWidth variant="filled"
                    placeholder="Ex: Nova Classe Disponível!"
                    value={data.announcementTitle} onChange={e => setData({...data, announcementTitle: e.target.value})}
                  />

                  <RpgTextField 
                    label="Mensagem Principal" fullWidth variant="filled" multiline rows={3}
                    placeholder="O que os jogadores precisam saber?"
                    value={data.announcementMsg} onChange={e => setData({...data, announcementMsg: e.target.value})}
                  />

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <RpgTextField 
                      label="Link de Ação (URL)" fullWidth variant="filled"
                      placeholder="https://..."
                      InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: "#666" }} /> }}
                      value={data.announcementLink} onChange={e => setData({...data, announcementLink: e.target.value})}
                    />
                    <RpgTextField 
                      label="Texto do Botão" fullWidth variant="filled"
                      placeholder="Ex: Ver Detalhes"
                      value={data.announcementLinkText} onChange={e => setData({...data, announcementLinkText: e.target.value})}
                    />
                  </Stack>

                </Stack>
              )}
            </Grid>

            {/* --- AÇÃO --- */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ 
                  fontFamily: "Cinzel", 
                  fontWeight: 900, 
                  fontSize: "1.1rem",
                  bgcolor: "#8b0000",
                  color: "#fff",
                  py: 1.5,
                  border: "1px solid #ff4500",
                  boxShadow: "0 0 15px rgba(139, 0, 0, 0.5)",
                  "&:hover": { 
                    bgcolor: "#a00000",
                    boxShadow: "0 0 25px rgba(255, 69, 0, 0.7)",
                  }
                }}
              >
                Aplicar Alterações no Multiverso
              </Button>
            </Grid>
          </Grid>
        </GrimoirePaper>
      </Container>
    </AdminContainer>
  );
}