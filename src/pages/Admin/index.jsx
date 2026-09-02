import React, { useState, useEffect } from "react";
import { 
  Box, Container, Typography, Paper, TextField, Button, 
  Grid, Divider, Alert, Switch, FormControlLabel, Stack, Chip,
  FormControl, InputLabel, Select, MenuItem, IconButton
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { database, auth } from "APIs/firebaseConfig";
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BugReportIcon from '@mui/icons-material/BugReport';
import LinkIcon from '@mui/icons-material/Link';
import CampaignIcon from '@mui/icons-material/Campaign';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

  // Relatórios de usuários
  const [reports, setReports] = useState([]);
  const [reportsFilter, setReportsFilter] = useState("all");

  // Carregar dados atuais e escutar chamados de usuários
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

    // Escuta relatórios em 'reports' e 'system/reports'
    const reportsRef = database.ref("reports");
    const sysReportsRef = database.ref("system/reports");
    let reportsData = {};
    let sysReportsData = {};

    const syncReports = () => {
      const merged = { ...sysReportsData, ...reportsData };
      const list = Object.entries(merged).map(([id, item]) => ({
        id,
        ...item
      })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setReports(list);
    };

    const listener = reportsRef.on("value", (snapshot) => {
      reportsData = snapshot.val() || {};
      syncReports();
    });

    const sysListener = sysReportsRef.on("value", (snapshot) => {
      sysReportsData = snapshot.val() || {};
      syncReports();
    });

    return () => {
      reportsRef.off("value", listener);
      sysReportsRef.off("value", sysListener);
    };
  }, []);

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      await database.ref(`reports/${reportId}`).update({ status: newStatus }).catch(() => {
        return database.ref(`system/reports/${reportId}`).update({ status: newStatus });
      });
      setMsg({ type: "success", text: "Status do relatório alterado." });
      setTimeout(() => setMsg(null), 3000);
    } catch (e) {
      setMsg({ type: "error", text: "Erro ao atualizar: " + e.message });
    }
  };

  const [replyDrafts, setReplyDrafts] = useState({});

  const handleSendAdminReply = async (reportId, replyText, newStatus = "resolvido") => {
    if (!replyText || !replyText.trim()) {
      setMsg({ type: "error", text: "Por favor, escreva uma resposta para o jogador antes de enviar." });
      return;
    }

    try {
      const updateData = {
        adminReply: replyText.trim(),
        adminReplyAt: new Date().toISOString(),
        status: newStatus,
        userDismissed: false
      };

      await database.ref(`reports/${reportId}`).update(updateData).catch(() => {
        return database.ref(`system/reports/${reportId}`).update(updateData);
      });

      setMsg({ type: "success", text: "Resposta enviada ao jogador e chamado atualizado com sucesso!" });
      setReplyDrafts(prev => ({ ...prev, [reportId]: "" }));
      setTimeout(() => setMsg(null), 4000);
    } catch (e) {
      setMsg({ type: "error", text: "Erro ao enviar resposta: " + e.message });
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Deseja realmente remover este chamado?")) {
      try {
        await database.ref(`reports/${reportId}`).remove().catch(() => {
          return database.ref(`system/reports/${reportId}`).remove();
        });
        setMsg({ type: "success", text: "Chamado removido com sucesso." });
        setTimeout(() => setMsg(null), 3000);
      } catch (e) {
        setMsg({ type: "error", text: "Erro ao deletar: " + e.message });
      }
    }
  };

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

  const ADMIN_UID = import.meta.env.VITE_ADMIN_UID || import.meta.env.VITE_REACT_APP_ADMIN_UID;
  const isAdmin = auth.currentUser?.uid && auth.currentUser.uid === ADMIN_UID;

  if (!isAdmin) {
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

            {/* --- CHAMADOS & RELATOS DE JOGADORES --- */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <SectionTitle icon={BugReportIcon}>
                Chamados & Relatos de Jogadores ({reports.length})
              </SectionTitle>

              {/* Filtros */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                {[
                  { id: "all", label: `Todos (${reports.length})` },
                  { id: "pendente", label: `Pendentes (${reports.filter(r => r.status === "pendente" || !r.status).length})`, color: "#ef5350" },
                  { id: "analise", label: `Em Análise (${reports.filter(r => r.status === "analise").length})`, color: "#ffa726" },
                  { id: "resolvido", label: `Resolvidos (${reports.filter(r => r.status === "resolvido").length})`, color: "#66bb6a" }
                ].map((f) => (
                  <Chip
                    key={f.id}
                    label={f.label}
                    onClick={() => setReportsFilter(f.id)}
                    sx={{
                      bgcolor: reportsFilter === f.id ? (f.color ? alpha(f.color, 0.25) : "rgba(255,255,255,0.2)") : "rgba(255,255,255,0.05)",
                      border: `1px solid ${reportsFilter === f.id ? (f.color || "#fff") : "rgba(255,255,255,0.1)"}`,
                      color: reportsFilter === f.id ? (f.color || "#fff") : "#aaa",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontFamily: "Cinzel"
                    }}
                  />
                ))}
              </Stack>

              {reports.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center", bgcolor: "rgba(0,0,0,0.3)", borderRadius: 2, border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Typography variant="body2" sx={{ color: "#888", fontFamily: "Cinzel" }}>
                    Nenhum chamado de erro ou sugestão recebido até o momento.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {reports
                    .filter(r => reportsFilter === "all" ? true : (r.status || "pendente") === reportsFilter)
                    .map((rep) => {
                      const typeBadge = rep.type === "bug" 
                        ? { label: "Bug / Erro", color: "#ef5350" }
                        : rep.type === "suggestion"
                        ? { label: "Sugestão", color: "#ffa726" }
                        : { label: "Feedback", color: "#29b6f6" };

                      const severityColor = rep.severity === "critica"
                        ? "#ff1744"
                        : rep.severity === "alta"
                        ? "#ff9100"
                        : rep.severity === "media"
                        ? "#ffea00"
                        : "#00e676";

                      return (
                        <Paper
                          key={rep.id}
                          sx={{
                            p: 3,
                            bgcolor: "#16100c",
                            backgroundImage: "none",
                            border: `1px solid ${rep.status === "resolvido" ? "rgba(102,187,106,0.6)" : "rgba(212,175,55,0.45)"}`,
                            borderRadius: 2.5,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                            position: "relative",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#ffd700",
                              boxShadow: "0 12px 30px rgba(0,0,0,0.8)"
                            }
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1.5 }}>
                            <Box>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }} flexWrap="wrap">
                                <Chip
                                  label={typeBadge.label}
                                  size="small"
                                  sx={{ bgcolor: alpha(typeBadge.color, 0.25), color: typeBadge.color, border: `1px solid ${typeBadge.color}`, fontWeight: 800, fontFamily: "Cinzel" }}
                                />
                                <Chip
                                  label={`Impacto: ${rep.severity || "Média"}`}
                                  size="small"
                                  sx={{ bgcolor: alpha(severityColor, 0.2), color: severityColor, border: `1px solid ${severityColor}`, fontWeight: 700, fontSize: "0.75rem" }}
                                />
                                <Typography variant="caption" sx={{ color: "#b8ab99", fontWeight: 600 }}>
                                  {rep.createdAt ? new Date(rep.createdAt).toLocaleString("pt-BR") : "Data desconhecida"}
                                </Typography>
                              </Stack>

                              <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#ffd700", letterSpacing: 0.5 }}>
                                {rep.title}
                              </Typography>
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() => handleDeleteReport(rep.id)}
                              sx={{ color: "#aaa", "&:hover": { color: "#ff1744", bgcolor: "rgba(255,23,68,0.1)" } }}
                              title="Remover chamado"
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Caixa de Descrição do Jogador com Alto Contraste */}
                          <Box sx={{ bgcolor: "#000000", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 1.5, p: 2, mb: 2 }}>
                            <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: 800, display: "block", mb: 0.5, fontFamily: "Cinzel" }}>
                              Relato do Jogador:
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#f5f0e6", whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "0.95rem" }}>
                              {rep.description}
                            </Typography>
                          </Box>

                          {/* Seção de Resposta Existente */}
                          {rep.adminReply && (
                            <Box sx={{ bgcolor: "rgba(102,187,106,0.1)", border: "1px solid rgba(102,187,106,0.4)", borderRadius: 1.5, p: 2, mb: 2 }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                <CheckCircleIcon sx={{ color: "#66bb6a", fontSize: 18 }} />
                                <Typography variant="caption" sx={{ color: "#66bb6a", fontWeight: 800, fontFamily: "Cinzel" }}>
                                  Sua Resposta Enviada ao Jogador ({rep.adminReplyAt ? new Date(rep.adminReplyAt).toLocaleString("pt-BR") : "Enviada"}):
                                </Typography>
                              </Stack>
                              <Typography variant="body2" sx={{ color: "#e8f5e9", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                {rep.adminReply}
                              </Typography>
                            </Box>
                          )}

                          {/* Formulário de Resposta do Mestre */}
                          <Box sx={{ bgcolor: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 1.5, p: 2, mb: 2 }}>
                            <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: 800, display: "block", mb: 1, fontFamily: "Cinzel" }}>
                              {rep.adminReply ? "Atualizar / Enviar Nova Resposta:" : "Responder ao Jogador:"}
                            </Typography>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              placeholder="Digite a resposta ou solução que aparecerá no Mural de Avisos do jogador..."
                              value={replyDrafts[rep.id] ?? (rep.adminReply || "")}
                              onChange={(e) => setReplyDrafts(prev => ({ ...prev, [rep.id]: e.target.value }))}
                              variant="filled"
                              sx={{
                                mb: 1.5,
                                "& .MuiFilledInput-root": { bgcolor: "#0a0705", border: "1px solid rgba(255,255,255,0.2)", color: "#f5f0e6" }
                              }}
                            />
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleSendAdminReply(rep.id, replyDrafts[rep.id] ?? rep.adminReply, "resolvido")}
                                sx={{
                                  bgcolor: "#2e7d32",
                                  color: "#fff",
                                  fontFamily: "Cinzel",
                                  fontWeight: 800,
                                  "&:hover": { bgcolor: "#1b5e20" }
                                }}
                              >
                                Responder & Marcar como Resolvido
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleSendAdminReply(rep.id, replyDrafts[rep.id] ?? rep.adminReply, "analise")}
                                sx={{
                                  borderColor: "rgba(255,167,38,0.5)",
                                  color: "#ffa726",
                                  fontFamily: "Cinzel",
                                  fontWeight: 700,
                                  "&:hover": { bgcolor: "rgba(255,167,38,0.1)", borderColor: "#ffa726" }
                                }}
                              >
                                Responder (Em Análise)
                              </Button>
                            </Stack>
                          </Box>

                          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.1)" }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
                            <Box sx={{ fontSize: "0.85rem", color: "#b8ab99" }}>
                              <Typography variant="caption" sx={{ display: "block", color: "#dcd3c2" }}>
                                <strong>Jogador:</strong> <span style={{ color: "#ffd700" }}>{rep.userName || "Anônimo"}</span> ({rep.userEmail || "sem email"})
                              </Typography>
                              <Typography variant="caption" sx={{ display: "block", color: "#dcd3c2" }}>
                                <strong>Rota / URL:</strong> <span style={{ color: "#fff" }}>{rep.pathname || rep.currentUrl || "N/A"}</span>
                              </Typography>
                            </Box>

                            <FormControl size="small" sx={{ minWidth: 160 }}>
                              <InputLabel sx={{ color: "#ffd700", fontFamily: "Cinzel" }}>Status</InputLabel>
                              <Select
                                value={rep.status || "pendente"}
                                label="Status"
                                onChange={(e) => handleUpdateReportStatus(rep.id, e.target.value)}
                                sx={{
                                  color: rep.status === "resolvido" ? "#66bb6a" : rep.status === "analise" ? "#ffa726" : "#ef5350",
                                  bgcolor: "#000000",
                                  fontWeight: 800,
                                  fontFamily: "Cinzel",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: rep.status === "resolvido" ? "rgba(102,187,106,0.6)" : rep.status === "analise" ? "rgba(255,167,38,0.6)" : "rgba(239,83,80,0.6)"
                                  }
                                }}
                              >
                                <MenuItem value="pendente" sx={{ color: "#ef5350", fontWeight: 700 }}>Pendente</MenuItem>
                                <MenuItem value="analise" sx={{ color: "#ffa726", fontWeight: 700 }}>Em Análise</MenuItem>
                                <MenuItem value="resolvido" sx={{ color: "#66bb6a", fontWeight: 700 }}>Resolvido</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Paper>
                      );
                    })}
                </Stack>
              )}
            </Grid>
          </Grid>
        </GrimoirePaper>
      </Container>
    </AdminContainer>
  );
}