import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { deleteUserContent } from "service/accountCleanup";

export default function ContentSection({ setStatus }) {
  const [sel, setSel] = useState({
    books: false,
    notes: false,
    musicas: false,
    fichas: false,
  });

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [touched, setTouched] = useState({ confirm: false, pass: false });
  const [deleting, setDeleting] = useState(false);

  const anySelected = useMemo(
    () => Boolean(sel.books || sel.notes || sel.musicas || sel.fichas),
    [sel]
  );

  const phrase = "LIMPAR";
  const okPhrase = confirmText.trim().toUpperCase() === phrase;

  const confirmError =
    touched.confirm && !okPhrase ? `Digite "${phrase}" para confirmar.` : "";
  const passError = touched.pass && !password ? "Informe sua senha atual." : "";

  const canRun = !deleting && anySelected && okPhrase && Boolean(password);

  const openModal = () => {
    setStatus({ type: "info", msg: "" });
    setOpen(true);
    setPassword("");
    setConfirmText("");
    setTouched({ confirm: false, pass: false });
  };

  const run = async () => {
    setStatus({ type: "info", msg: "" });
    setTouched({ confirm: true, pass: true });
    if (!canRun) return;

    setDeleting(true);
    try {
      await deleteUserContent({ currentPassword: password, targets: sel });
      setStatus({ type: "success", msg: "Conteúdo selecionado deletado com sucesso." });
      setSel({ books: false, notes: false, musicas: false, fichas: false });
      setOpen(false);
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || String(e) });
    } finally {
      setDeleting(false);
      setPassword("");
      setConfirmText("");
      setTouched({ confirm: false, pass: false });
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Conteúdo
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Apague somente o que você quiser (irreversível).
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={0.5}>
        <FormControlLabel
          control={<Checkbox checked={sel.books} onChange={(e) => setSel((s) => ({ ...s, books: e.target.checked }))} />}
          label="Deletar todos os Livros"
        />
        <FormControlLabel
          control={<Checkbox checked={sel.notes} onChange={(e) => setSel((s) => ({ ...s, notes: e.target.checked }))} />}
          label="Deletar todas as Anotações"
        />
        <FormControlLabel
          control={<Checkbox checked={sel.musicas} onChange={(e) => setSel((s) => ({ ...s, musicas: e.target.checked }))} />}
          label="Deletar todas as Músicas"
        />
        <FormControlLabel
          control={<Checkbox checked={sel.fichas} onChange={(e) => setSel((s) => ({ ...s, fichas: e.target.checked }))} />}
          label="Deletar todas as Fichas"
        />
      </Stack>

      <Alert severity="warning">
        Essa ação remove dados e arquivos associados. Confirme com cuidado.
      </Alert>

      <Button
        variant="contained"
        color="error"
        onClick={openModal}
        disabled={!anySelected}
        sx={{ width: "fit-content" }}
      >
        Deletar conteúdo selecionado
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar limpeza de conteúdo</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Isso apagará o conteúdo selecionado permanentemente.
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
          <Button variant="contained" color="error" onClick={run} disabled={!canRun}>
            {deleting ? "Deletando..." : "Confirmar e deletar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}