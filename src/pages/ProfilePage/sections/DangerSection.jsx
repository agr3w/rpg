import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteAccountAndData } from "service/accountCleanup";

export default function DangerSection({ setStatus }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [touched, setTouched] = useState({ confirm: false, pass: false });
  const [deleting, setDeleting] = useState(false);

  const phrase = "DELETAR";
  const okPhrase = confirmText.trim().toUpperCase() === phrase;

  const confirmError =
    touched.confirm && !okPhrase ? `Digite "${phrase}" para confirmar.` : "";
  const passError = touched.pass && !password ? "Informe sua senha atual." : "";

  const canDelete = !deleting && okPhrase && Boolean(password);

  const handleOpen = () => {
    setStatus({ type: "info", msg: "" });
    setOpen(true);
    setPassword("");
    setConfirmText("");
    setTouched({ confirm: false, pass: false });
  };

  const handleDelete = async () => {
    setStatus({ type: "info", msg: "" });
    setTouched({ confirm: true, pass: true });
    if (!canDelete) return;

    setDeleting(true);
    try {
      await deleteAccountAndData({ currentPassword: password });
      setStatus({ type: "success", msg: "Conta deletada. Até a próxima!" });
      navigate("/login");
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || String(e) });
    } finally {
      setDeleting(false);
      setOpen(false);
      setPassword("");
      setConfirmText("");
      setTouched({ confirm: false, pass: false });
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, color: "error.main" }}>
          Zona de risco
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Remover conta apaga seus dados e acesso permanentemente.
        </Typography>
      </Box>

      <Divider />

      <Button variant="outlined" color="error" onClick={handleOpen} sx={{ width: "fit-content" }}>
        Deletar minha conta
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar exclusão da conta</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Essa ação é permanente. Seus dados serão removidos do sistema.
          </Alert>

          <Stack spacing={1.5}>
            <TextField
              label={`Digite "${phrase}" para confirmar`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, confirm: true }))}
              fullWidth
              error={Boolean(confirmError)}
              helperText={confirmError || " "}
            />

            <TextField
              label="Digite sua senha atual para confirmar"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, pass: true }))}
              type="password"
              autoComplete="current-password"
              fullWidth
              error={Boolean(passError)}
              helperText={passError || " "}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={!canDelete}>
            {deleting ? "Deletando..." : "Deletar conta"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}