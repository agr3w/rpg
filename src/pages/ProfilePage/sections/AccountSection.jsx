import React, { useMemo, useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { auth } from "APIs/firebaseConfig";
import { changeEmail } from "service/accountCleanup";
import { isValidEmail } from "./validators";

export default function AccountSection({ setStatus }) {
  const user = auth.currentUser;
  const emailAtual = useMemo(() => user?.email || "—", [user]);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [touched, setTouched] = useState({ email: false, pass: false });

  const newEmailTrim = newEmail.trim();
  const emailError =
    touched.email && !newEmailTrim
      ? "Informe o novo e-mail."
      : touched.email && !isValidEmail(newEmailTrim)
        ? "E-mail inválido."
        : "";

  const passError = touched.pass && !emailPassword ? "Informe sua senha atual." : "";

  const canSubmit =
    !savingEmail &&
    Boolean(newEmailTrim) &&
    isValidEmail(newEmailTrim) &&
    Boolean(emailPassword);

  const handle = async () => {
    setStatus({ type: "info", msg: "" });
    setTouched({ email: true, pass: true });
    if (!canSubmit) return;

    setSavingEmail(true);
    try {
      await changeEmail({ newEmail: newEmailTrim, currentPassword: emailPassword });
      setStatus({ type: "success", msg: "E-mail atualizado com sucesso." });
      setNewEmail("");
      setEmailPassword("");
      setTouched({ email: false, pass: false });
    } catch (e) {
      setStatus({ type: "error", msg: e?.message || String(e) });
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Conta
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          E-mail atual: <strong>{emailAtual}</strong>
        </Typography>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Alterar e-mail
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            label="Novo e-mail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, email: true }))}
            type="email"
            autoComplete="email"
            fullWidth
            error={Boolean(emailError)}
            helperText={emailError || " "}
          />

          <TextField
            label="Senha atual (para confirmar)"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, pass: true }))}
            type="password"
            autoComplete="current-password"
            fullWidth
            error={Boolean(passError)}
            helperText={passError || " "}
          />

          <Button variant="contained" onClick={handle} disabled={!canSubmit}>
            {savingEmail ? "Salvando..." : "Atualizar e-mail"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}