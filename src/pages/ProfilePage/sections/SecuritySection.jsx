import React, { useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { changePassword } from "service/accountCleanup";
import { getPasswordRuleError } from "./validators";

export default function SecuritySection({ setStatus }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({ current: false, next: false });

  const currentError = touched.current && !currentPassword ? "Informe sua senha atual." : "";
  const nextRuleError = getPasswordRuleError(newPassword);
  const nextError = touched.next ? nextRuleError : "";

  const canSubmit = !saving && Boolean(currentPassword) && !getPasswordRuleError(newPassword);

  const handle = async () => {
    setStatus({ type: "info", msg: "" });
    setTouched({ current: true, next: true });
    if (!canSubmit) return;

    setSaving(true);
    try {
      await changePassword({ newPassword, currentPassword });
      setStatus({ type: "success", msg: "Senha atualizada com sucesso." });
      setCurrentPassword("");
      setNewPassword("");
      setTouched({ current: false, next: false });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || String(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Segurança
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Atualize sua senha para manter sua conta segura.
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={1.5}>
        <TextField
          label="Senha atual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onBlur={() => setTouched((s) => ({ ...s, current: true }))}
          type="password"
          autoComplete="current-password"
          fullWidth
          error={Boolean(currentError)}
          helperText={currentError || " "}
        />

        <TextField
          label="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onBlur={() => setTouched((s) => ({ ...s, next: true }))}
          type="password"
          autoComplete="new-password"
          fullWidth
          error={Boolean(nextError)}
          helperText={nextError || "Mínimo: 8 caracteres."}
        />

        <Button variant="contained" color="secondary" onClick={handle} disabled={!canSubmit}>
          {saving ? "Salvando..." : "Atualizar senha"}
        </Button>
      </Stack>
    </Stack>
  );
}