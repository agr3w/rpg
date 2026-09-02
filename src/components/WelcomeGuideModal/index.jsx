// src/components/WelcomeGuideModal/index.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  Paper,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ShieldIcon from "@mui/icons-material/Shield";
import MapIcon from "@mui/icons-material/Map";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ConstructionIcon from "@mui/icons-material/Construction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

export default function WelcomeGuideModal({ open, onClose, onOpenReport }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("rpg_welcome_guide_seen_v1", "true");
    }
    onClose();
  };

  const handleFinish = () => {
    localStorage.setItem("rpg_welcome_guide_seen_v1", "true");
    onClose();
  };

  const toolsList = [
    {
      icon: <ShieldIcon sx={{ color: "#ffd700", fontSize: 30 }} />,
      title: "Fichas & Automação D&D 5e",
      desc: "Criação de heróis com cálculo de atributos, perícias, magias, inventário e modal automático de Subida de Nível (Level Up) com rolagem de HP e escolha de ASI."
    },
    {
      icon: <MapIcon sx={{ color: "#ffd700", fontSize: 30 }} />,
      title: "Mapas & VTT Tático",
      desc: "Grid inteligente com snap ao centro e vértice, régua tática 5e com diagonais, névoa de guerra dinâmica, atalhos rápidos tipo Figma e exportador Universal VTT (.dd2vtt)."
    },
    {
      icon: <HistoryEduIcon sx={{ color: "#ffd700", fontSize: 30 }} />,
      title: "Diário de Campanha & Sessões",
      desc: "Registro cronológico das sessões, decisões cruciais dos heróis, ganho de experiência e distribuição de tesouros em tempo real."
    },
    {
      icon: <GroupsIcon sx={{ color: "#ffd700", fontSize: 30 }} />,
      title: "Gestão de NPCs & Quests",
      desc: "Organize NPCs, monstros, facções do mundo e árvores de missões com filtros rápidos e acompanhamento de status."
    },
    {
      icon: <MusicNoteIcon sx={{ color: "#ffd700", fontSize: 30 }} />,
      title: "Taverna do Bardo",
      desc: "Player de áudio e trilhas sonoras atmosféricas personalizadas para ambientar batalhas épicas, tavernas e masmorras sombrias."
    },
    {
      icon: <MenuBookIcon sx={{ color: "#ffd700", fontSize: 30 }} />,
      title: "Biblioteca Arcana",
      desc: "Anotações e documentos organizados em pastas para guardar lendas, enigmas, regras da casa e segredos da campanha."
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#140e0b",
          backgroundImage: "radial-gradient(circle at 50% 0%, #2a1810 0%, #120b08 100%)",
          border: "1px solid rgba(212,175,55,0.45)",
          borderRadius: 3,
          boxShadow: "0 24px 70px rgba(0,0,0,0.95)",
          color: "#f5f0e6",
          fontFamily: "Cinzel, sans-serif",
          overflow: "hidden"
        }
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 1.5, borderBottom: "1px solid rgba(212,175,55,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "rgba(0,0,0,0.3)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: "#ffd700", fontSize: 30 }} />
          <Box>
            <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 900, color: "#ffd700", letterSpacing: 0.5 }}>
              Guia do Aventureiro & Boas-Vindas
            </Typography>
            <Typography variant="caption" sx={{ color: "#dcd3c2", fontFamily: "Roboto, sans-serif", fontSize: "0.8rem" }}>
              RPG Organizer - Sua Mesa Virtual e Grimório Definitivo
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: "#bbb", "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={tabIndex}
        onChange={(e, val) => setTabIndex(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: "#0d0907",
          borderBottom: "1px solid rgba(212,175,55,0.25)",
          minHeight: 48,
          "& .MuiTab-root": { color: "#b8ab99", minHeight: 48, fontFamily: "Cinzel", fontWeight: 700, fontSize: "0.82rem" },
          "& .Mui-selected": { color: "#ffd700" },
          "& .MuiTabs-indicator": { backgroundColor: "#ffd700", height: 3 }
        }}
      >
        <Tab icon={<AutoAwesomeIcon fontSize="small" />} iconPosition="start" label="Visão Geral" />
        <Tab icon={<ShieldIcon fontSize="small" />} iconPosition="start" label="Arsenal de Ferramentas" />
        <Tab icon={<ConstructionIcon fontSize="small" />} iconPosition="start" label="Trabalho em Progresso" />
        <Tab icon={<FavoriteIcon fontSize="small" />} iconPosition="start" label="Agradecimento & Suporte" />
      </Tabs>

      <DialogContent sx={{ p: { xs: 2.5, md: 3.5 }, minHeight: 340 }}>
        {/* ABA 0: VISÃO GERAL */}
        {tabIndex === 0 && (
          <Box sx={{ animation: "fadeIn 0.3s ease" }}>
            <Box sx={{ mb: 3, p: 2.5, bgcolor: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800, mb: 1 }}>
                Bem-vindo à Taverna Central do RPG Organizer
              </Typography>
              <Typography variant="body1" sx={{ color: "#f0e6d2", lineHeight: 1.8, fontFamily: "Roboto, sans-serif", fontSize: "0.95rem" }}>
                O <strong style={{ color: "#ffd700" }}>RPG Organizer</strong> foi concebido para ser o centro de comando completo para suas mesas de RPG. 
                Seja você um Mestre forjando mundos inteiros ou um Jogador administrando seu herói, a plataforma unifica 
                regras oficiais, automações precisas, mapas interativos e crônicas de campanha em uma interface escura, fluida e temática.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.55)", backgroundImage: "none", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, height: "100%" }}>
                  <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800, mb: 0.8 }}>
                    Zero Complicação
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                    Tudo acessível direto no seu navegador com sincronização na nuvem e resposta instantânea sem configurações complexas.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.55)", backgroundImage: "none", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, height: "100%" }}>
                  <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800, mb: 0.8 }}>
                    Regras D&D 5e RAW
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                    Todas as 12 classes básicas, arquétipos, dados de vida, magias e evolução calculados de acordo com os manuais oficiais.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.55)", backgroundImage: "none", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 2, height: "100%" }}>
                  <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800, mb: 0.8 }}>
                    VTT Tático Integrado
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                    Editor de mapas integrado com medição tática, névoa de guerra e exportador Universal VTT (.dd2vtt).
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ABA 1: ARSENAL DE FERRAMENTAS */}
        {tabIndex === 1 && (
          <Box sx={{ animation: "fadeIn 0.3s ease" }}>
            <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800, mb: 2 }}>
              Recursos Disponíveis para Sua Mesa
            </Typography>
            <Grid container spacing={2}>
              {toolsList.map((tool, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(0,0,0,0.55)",
                      backgroundImage: "none",
                      border: "1px solid rgba(212,175,55,0.3)",
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-start",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.75)",
                        borderColor: "#ffd700",
                        transform: "translateY(-2px)"
                      }
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>{tool.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800 }}>
                        {tool.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", display: "block", mt: 0.5, lineHeight: 1.6 }}>
                        {tool.desc}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ABA 2: TRABALHO EM PROGRESSO */}
        {tabIndex === 2 && (
          <Box sx={{ animation: "fadeIn 0.3s ease" }}>
            <Box sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,167,38,0.45)", borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <ConstructionIcon sx={{ color: "#ffa726", fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#ffa726", fontWeight: 800 }}>
                  Aviso: Forja em Plena Atividade (Early Access)
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: "#f0e6d2", lineHeight: 1.8, fontFamily: "Roboto, sans-serif" }}>
                Esta plataforma está em constante expansão e aprimoramento. Novas funcionalidades, balanceamentos, 
                otimizações de performance e integração com outros sistemas são lançados com frequência.
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 800, mb: 2 }}>
              O Que Esperar Durante o Uso:
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 2, bgcolor: "rgba(0,0,0,0.4)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }}>
                <CheckCircleOutlineIcon sx={{ color: "#66bb6a", fontSize: 24, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                  <strong style={{ color: "#fff" }}>Atualizações Contínuas:</strong> Melhorias no editor de mapas, fichas e novos módulos sem perda de dados das suas campanhas.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 2, bgcolor: "rgba(0,0,0,0.4)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }}>
                <CheckCircleOutlineIcon sx={{ color: "#66bb6a", fontSize: 24, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                  <strong style={{ color: "#fff" }}>Compatibilidade Total:</strong> Suporte a exportação de dados e mapas para VTTs consagrados como Foundry VTT e Roll20.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 2, bgcolor: "rgba(0,0,0,0.4)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }}>
                <CheckCircleOutlineIcon sx={{ color: "#66bb6a", fontSize: 24, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: "#e8dfce", fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                  <strong style={{ color: "#fff" }}>Canal Direto de Feedback:</strong> Se encontrar qualquer inconsistência ou tiver uma ideia brilhante, você pode nos enviar um relatório a qualquer momento.
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* ABA 3: AGRADECIMENTO & SUPORTE */}
        {tabIndex === 3 && (
          <Box sx={{ animation: "fadeIn 0.3s ease", textAlign: "center", py: 2 }}>
            <FavoriteIcon sx={{ color: "#ffd700", fontSize: 48, mb: 1.5 }} />
            <Typography variant="h5" sx={{ fontFamily: "Cinzel", color: "#ffd700", fontWeight: 900, mb: 1.5 }}>
              Obrigado por Fazer Parte Desta Jornada!
            </Typography>
            <Typography variant="body1" sx={{ color: "#f0e6d2", maxWidth: 620, mx: "auto", mb: 3.5, lineHeight: 1.8, fontFamily: "Roboto, sans-serif" }}>
              O RPG Organizer foi construído por apaixonados por RPG de mesa para a comunidade. 
              Sua presença aqui é fundamental para continuarmos aperfeiçoando cada detalhe da sua experiência de jogo.
            </Typography>

            <Paper sx={{ p: 3, bgcolor: "rgba(0,0,0,0.65)", backgroundImage: "none", border: "1px solid rgba(41,182,246,0.45)", borderRadius: 2.5, maxWidth: 600, mx: "auto", textAlign: "left" }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", color: "#29b6f6", fontWeight: 800, mb: 0.8 }}>
                Encontrou algum problema ou tem uma sugestão?
              </Typography>
              <Typography variant="body2" sx={{ color: "#dcd3c2", display: "block", mb: 2.5, fontFamily: "Roboto, sans-serif", lineHeight: 1.6 }}>
                Envie um chamado direto para os desenvolvedores. Lemos e analisamos cada relato com prioridade.
              </Typography>
              <Button
                variant="contained"
                startIcon={<BugReportIcon />}
                onClick={() => {
                  onClose();
                  onOpenReport?.();
                }}
                sx={{
                  bgcolor: "#29b6f6",
                  color: "#0b1520",
                  fontFamily: "Cinzel",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  py: 1,
                  px: 3,
                  "&:hover": { bgcolor: "#0288d1", color: "#fff" }
                }}
              >
                Abrir Relato de Erro / Sugestão
              </Button>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: "rgba(212,175,55,0.25)" }} />

      <DialogActions sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "rgba(0,0,0,0.3)" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              size="small"
              sx={{ color: "rgba(212,175,55,0.6)", "&.Mui-checked": { color: "#ffd700" } }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: "#dcd3c2", fontFamily: "Roboto, sans-serif" }}>
              Não mostrar automaticamente ao iniciar
            </Typography>
          }
        />

        <Stack direction="row" spacing={1.5}>
          {tabIndex > 0 && (
            <Button
              variant="outlined"
              onClick={() => setTabIndex((t) => t - 1)}
              startIcon={<ArrowBackIcon />}
              sx={{ color: "#f5f0e6", borderColor: "rgba(255,255,255,0.3)", fontFamily: "Cinzel", "&:hover": { borderColor: "#fff" } }}
            >
              Anterior
            </Button>
          )}

          {tabIndex < 3 ? (
            <Button
              variant="contained"
              onClick={() => setTabIndex((t) => t + 1)}
              endIcon={<ArrowForwardIcon />}
              sx={{ bgcolor: "#bf8f00", color: "#120e0a", fontFamily: "Cinzel", fontWeight: 800, px: 2.5, "&:hover": { bgcolor: "#ffd700" } }}
            >
              Próximo
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleFinish}
              sx={{ bgcolor: "#bf8f00", color: "#120e0a", fontFamily: "Cinzel", fontWeight: 800, px: 3, "&:hover": { bgcolor: "#ffd700" } }}
            >
              Iniciar Aventura
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
