import React, { useState } from "react";
import { Box, TextField, Button, Avatar, Grid, Typography } from "@mui/material";
import { auth, database } from "APIs/firebaseConfig";
import { Save } from "@mui/icons-material";

export default function AccountSection({ setStatus }) {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const handleSave = async () => {
    try {
      await user.updateProfile({ displayName, photoURL });
      await database.ref(`users/${user.uid}/meta`).update({ name: displayName, avatar: photoURL });
      setStatus({ type: "success", msg: "Identidade atualizada com sucesso." });
    } catch (e) {
      setStatus({ type: "error", msg: "Erro ao atualizar perfil." });
    }
  };

  return (
    <Box>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-block",
              p: 1,
              border: "2px solid #833c0b",
              borderRadius: "50%",
              bgcolor: "#fff"
            }}
          >
            <Avatar
              src={photoURL}
              sx={{ width: 120, height: 120, border: "4px solid #e3dac9" }}
            />
          </Box>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: "#666", fontFamily: "Cinzel" }}>
            Retrato Atual
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Nome do Aventureiro (Display Name)"
              variant="standard" // Estilo de linha
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { fontFamily: "Cinzel", color: "#833c0b" } }}
              InputProps={{ style: { fontFamily: "Merriweather", fontSize: "1.1rem" } }}
            />

            <TextField
              label="URL do Retrato (Imagem)"
              variant="standard"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { fontFamily: "Cinzel", color: "#833c0b" } }}
            />

            <TextField
              label="Email de Registro"
              variant="standard"
              value={user?.email || ""}
              disabled
              fullWidth
              InputLabelProps={{ style: { fontFamily: "Cinzel", color: "#999" } }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  bgcolor: "#833c0b",
                  color: "#fff",
                  fontFamily: "Cinzel",
                  "&:hover": { bgcolor: "#5e2a07" }
                }}
              >
                Salvar Alterações
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}