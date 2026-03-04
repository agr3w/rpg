import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Avatar,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "APIs/firebaseConfig";

/**
 * Página de listagem de fichas com cards estilizados por classe/raça.
 * - Usa a chave do nó do Firebase (key) para exclusão direta.
 * - Cada card recebe cor/gradiente baseado na classe e badge de raça.
 */

const classStyles = {
  Bárbaro: { bg: "linear-gradient(135deg,#7b3b00,#c75b1a)", color: "#fff" },
  Bardo: { bg: "linear-gradient(135deg,#3b2a5a,#8b5cf6)", color: "#fff" },
  Bruxo: { bg: "linear-gradient(135deg,#2b1f36,#6b2fa6)", color: "#fff" },
  Clérigo: { bg: "linear-gradient(135deg,#1f4f4f,#2fb6b6)", color: "#fff" },
  Druida: { bg: "linear-gradient(135deg,#2a4b2b,#6fbf69)", color: "#fff" },
  Feiticeiro: { bg: "linear-gradient(135deg,#4c1b1b,#f97316)", color: "#fff" },
  Guerreiro: { bg: "linear-gradient(135deg,#243b5a,#3b82f6)", color: "#fff" },
  Ladino: { bg: "linear-gradient(135deg,#3b2f2f,#a78bfa)", color: "#fff" },
  Mago: { bg: "linear-gradient(135deg,#0f172a,#6366f1)", color: "#fff" },
  Monge: { bg: "linear-gradient(135deg,#403d33,#d1a054)", color: "#fff" },
  Paladino: { bg: "linear-gradient(135deg,#3a1f1f,#ef4444)", color: "#fff" },
  Patrulheiro: { bg: "linear-gradient(135deg,#0f3d2e,#34d399)", color: "#fff" },
  default: { bg: "linear-gradient(135deg,#111827,#374151)", color: "#fff" },
};

const raceColors = {
  Humano: "default",
  Elfo: "success",
  Anão: "warning",
  Gnomo: "primary",
  Halfling: "secondary",
  Draconato: "error",
  "Meio-Elfo": "info",
  "Meio-Orc": "warning",
  Tiefling: "error",
  default: "default",
};

const FichasPage = () => {
  const [fichas, setFichas] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteKey, setToDeleteKey] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userID = user.uid;
    const databaseRef = firebase.database().ref(`fichas/${userID}`);

    const handleSnapshot = (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setFichas([]);
        return;
      }
      // transforma em array preservando a chave firebase (key)
      const arr = Object.entries(data).map(([key, value]) => ({
        key,
        ...value,
      }));
      // ordena por createdAt se houver
      arr.sort((a, b) => {
        const ta = a.createdAt ? a.createdAt : 0;
        const tb = b.createdAt ? b.createdAt : 0;
        return tb - ta;
      });
      setFichas(arr);
    };

    databaseRef.on("value", handleSnapshot);
    return () => databaseRef.off("value", handleSnapshot);
  }, [user]);

  const openConfirmDelete = (key) => {
    setToDeleteKey(key);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!user || !toDeleteKey) return;
    const userID = user.uid;
    const databaseRef = firebase.database().ref(`fichas/${userID}`);
    try {
      await databaseRef.child(toDeleteKey).remove();
    } catch (err) {
      console.error("Erro ao excluir ficha:", err);
    } finally {
      setConfirmOpen(false);
      setToDeleteKey(null);
    }
  };

  const getClassStyle = (classe) => classStyles[classe] || classStyles.default;

  const CONTENT_TEXT = "#f8efe0";
  const CONTENT_MUTED = "rgba(248,239,224,0.82)";

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: "center", color: "primary.main", fontWeight: 700 }}>
          Fichas de Personagem
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/criar-ficha"
              startIcon={<AddIcon />}
            >
              Criar Nova Ficha
            </Button>
          </motion.div>
        </Box>

        <AnimatePresence mode="popLayout">
          <Grid container spacing={3}>
            {fichas.length === 0 && (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography align="center" color="text.secondary">
                    Nenhuma ficha encontrada.
                  </Typography>
                </motion.div>
              </Grid>
            )}

            {fichas.map((ficha, i) => {
              const classeName = ficha.classe || "Sem Classe";
              const racaName = ficha.raca || "Sem Raça";
              const style = getClassStyle(classeName);
              const id = ficha.id || ficha.ID || ficha.key;

              return (
                <Grid item xs={12} sm={6} md={4} key={ficha.key}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.36, delay: i * 0.03 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: 6,
                        transition: "transform .18s ease, box-shadow .18s ease",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.01)",
                          boxShadow:
                            "0 14px 36px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,204,0,0.18)",
                        },

                        // ✅ aumenta um pouco o “glow” das brasas no hover
                        "&:hover::after": { opacity: 0.2 },

                        // ✅ Base “carvão”
                        backgroundImage: `
                          radial-gradient(120% 90% at 20% 0%, rgba(255,204,0,0.10) 0%, rgba(0,0,0,0.00) 60%),
                          radial-gradient(120% 90% at 80% 120%, rgba(255,70,0,0.08) 0%, rgba(0,0,0,0.00) 65%),
                          linear-gradient(180deg, rgba(28,22,20,0.95), rgba(14,12,12,0.95))
                        `,
                        backgroundColor: "var(--rpg-surface)",
                        border: "1px solid var(--rpg-stroke)",
                        color: "var(--rpg-cardText)",
                        position: "relative",

                        // ✅ IMPORTANTÍSSIMO: garante que os overlays fiquem atrás do conteúdo
                        "& > *": { position: "relative", zIndex: 1 },

                        "&::before": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          zIndex: 0, // ✅ atrás
                          opacity: 0.14,
                          backgroundImage: `
                            repeating-linear-gradient(
                              90deg,
                              rgba(0,0,0,0.00) 0px,
                              rgba(0,0,0,0.00) 12px,
                              rgba(0,0,0,0.18) 13px,
                              rgba(0,0,0,0.00) 20px
                            ),
                            radial-gradient(120% 80% at 50% -10%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.00) 70%),
                            radial-gradient(120% 90% at 50% 120%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.00) 70%)
                          `,
                          mixBlendMode: "multiply",
                        },

                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          zIndex: 0, // ✅ atrás
                          opacity: 0.1,
                          backgroundImage: `
                            radial-gradient(1px 1px at 16% 22%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%),
                            radial-gradient(2px 2px at 72% 28%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 60%),
                            radial-gradient(1px 1px at 46% 66%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%),

                            radial-gradient(6px 6px at 18% 62%, rgba(255,204,0,0.35) 0%, rgba(255,204,0,0) 60%),
                            radial-gradient(4px 4px at 60% 42%, rgba(255,120,0,0.32) 0%, rgba(255,120,0,0) 60%),
                            radial-gradient(5px 5px at 82% 30%, rgba(255,70,0,0.25) 0%, rgba(255,70,0,0) 60%)
                          `,
                          mixBlendMode: "screen",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          minHeight: 98,
                          background: style.bg,
                          color: style.color,
                          position: "relative",

                          // ✅ “fumacinha” no topo (estática, leve)
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            height: 54,
                            pointerEvents: "none",
                            opacity: 0.28,
                            backgroundImage: `
                              radial-gradient(60% 90% at 20% 80%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%),
                              radial-gradient(55% 85% at 55% 70%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 72%),
                              radial-gradient(50% 80% at 85% 85%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 70%)
                            `,
                            mixBlendMode: "multiply",
                          },

                          // ✅ fuligem + “lambe” de fogo bem discreta no rodapé do header
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            background: `
                              radial-gradient(120% 90% at 50% -10%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.00) 70%),
                              linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.28))
                            `,
                            mixBlendMode: "multiply",
                          },

                          // separa bem o header do corpo (mais leitura)
                          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.14)",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "relative" }}>
                          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.12)" }}>
                            {ficha.nome ? ficha.nome.charAt(0).toUpperCase() : "?"}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography noWrap sx={{ fontWeight: 900, fontSize: "1.05rem", textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}>
                              {ficha.nome || "Sem nome"}
                            </Typography>
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{ opacity: 0.96, textShadow: "0 2px 10px rgba(0,0,0,0.45)", letterSpacing: 0.3 }}
                            >
                              {classeName} • {racaName}
                            </Typography>
                          </Box>
                          <Chip
                            label={racaName}
                            color={raceColors[racaName] || raceColors.default}
                            size="small"
                            sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
                          />
                        </Box>
                      </Box>

                      <CardContent
                        sx={{
                          bgcolor: "rgba(16,12,12,0.78)",
                          borderTop: "1px solid rgba(255,255,255,0.12)",
                          minHeight: 176,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.5,
                            color: CONTENT_MUTED,
                            lineHeight: 1.45,
                            minHeight: 42,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {ficha.DetalhesDaClasse?.Equipamentos?.equipamentoObgt
                            ? `Equipamento inicial: ${ficha.DetalhesDaClasse.Equipamentos.equipamentoObgt}`
                            : "Equipamento inicial: —"}
                        </Typography>

                        <Typography variant="body2" sx={{ color: CONTENT_MUTED, fontWeight: 700 }}>
                          Riqueza: {ficha.riquezaInicial ?? (ficha.Valor ? ficha.Valor : "—")} PO
                        </Typography>

                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", minHeight: 56, alignContent: "flex-start", overflow: "hidden" }}>
                          {(ficha.DetalhesDaClasse?.periciasClasseSelecionadas ||
                            ficha.periciasClasseSelecionadas ||
                            [])
                            .slice(0, 4)
                            .map((p) => (
                              <Chip
                                key={p}
                                label={p}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255,255,255,0.10)",
                                  color: CONTENT_TEXT,
                                  border: "1px solid rgba(255,255,255,0.10)",
                                }}
                              />
                            ))}
                        </Box>
                      </CardContent>

                      <CardActions
                        sx={{
                          justifyContent: "space-between",
                          px: 2,
                          pb: 2,
                          mt: "auto",
                          bgcolor: "rgba(16,12,12,0.78)",
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          component={Link}
                          to={`/ficha-completa/${id}`}
                          startIcon={<VisibilityIcon />}
                          sx={{
                            color: CONTENT_TEXT,
                            borderColor: "rgba(255,255,255,0.22)",
                            "&:hover": {
                              borderColor: "var(--rpg-accent2)",
                              backgroundColor: "rgba(255,255,255,0.06)",
                            },
                          }}
                        >
                          Ver
                        </Button>

                        <IconButton
                          size="small"
                          onClick={() => openConfirmDelete(ficha.key)}
                          aria-label="Excluir ficha"
                          sx={{
                            color: "rgba(255,80,80,0.95)",
                            backgroundColor: "rgba(0,0,0,0.15)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.25)" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </AnimatePresence>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Typography>Tem certeza que deseja excluir esta ficha?</Typography>
            </motion.div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button color="error" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default FichasPage;
