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
import Nav from "components/nav";
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

  return (
    <>
      <Nav />
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
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 6,
                        transition: "transform .18s ease, box-shadow .18s ease",
                        "&:hover": { transform: "translateY(-8px) scale(1.02)", boxShadow: 14 },
                      }}
                    >
                      <Box sx={{ p: 2, background: style.bg, color: style.color }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.12)" }}>
                            {ficha.nome ? ficha.nome.charAt(0).toUpperCase() : "?"}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 700 }}>{ficha.nome || "Sem nome"}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
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

                      <CardContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {ficha.DetalhesDaClasse?.Equipamentos?.equipamentoObgt
                            ? `Equipamento inicial: ${ficha.DetalhesDaClasse.Equipamentos.equipamentoObgt}`
                            : "Equipamento inicial: —"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Riqueza: {ficha.riquezaInicial ?? (ficha.Valor ? ficha.Valor : "—")} PO
                        </Typography>

                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {(ficha.DetalhesDaClasse?.periciasClasseSelecionadas || ficha.periciasClasseSelecionadas || []).slice(0, 4).map((p) => (
                            <Chip key={p} label={p} size="small" />
                          ))}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          component={Link}
                          to={`/ficha-completa/${id}`}
                          startIcon={<VisibilityIcon />}
                        >
                          Ver
                        </Button>

                        <Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openConfirmDelete(ficha.key)}
                            aria-label="Excluir ficha"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
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
