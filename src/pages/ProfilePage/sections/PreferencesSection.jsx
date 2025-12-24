import React from "react";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  FormLabel,
  Switch,
  Typography,
} from "@mui/material";
import { usePreferences } from "contexts/PreferencesContext";

export default function PreferencesSection() {
  const {
    prefs,
    setThemeMode,      
    setThemeStyle,     
    setReduceMotion,   
    setPageTransition, 
  } = usePreferences();

  const forceSimple = Boolean(prefs.reduceMotion);

  return (
    <Box>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Preferências
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Personalize o visual e a experiência.
          </Typography>
        </Box>

        <Divider />

        <FormControl>
          <FormLabel sx={{ fontWeight: 900 }}>Tema</FormLabel>
          <RadioGroup
            value={prefs.themeMode}
            onChange={(e) => setThemeMode(e.target.value)}
          >
            <FormControlLabel value="system" control={<Radio />} label="Sistema" />
            <FormControlLabel value="light" control={<Radio />} label="Claro" />
            <FormControlLabel value="dark" control={<Radio />} label="Escuro" />
          </RadioGroup>
        </FormControl>

        <Divider />

        <FormControl>
          <FormLabel sx={{ fontWeight: 900 }}>Estilo</FormLabel>
          <RadioGroup
            value={prefs.themeStyle}
            onChange={(e) => setThemeStyle(e.target.value)}
          >
            <FormControlLabel value="parchment" control={<Radio />} label="Pergaminho" />
            <FormControlLabel value="default" control={<Radio />} label="Padrão" />
          </RadioGroup>
        </FormControl>

        <Divider />

        <FormControlLabel
          control={
            <Switch
              checked={Boolean(prefs.reduceMotion)}
              onChange={(e) => setReduceMotion(e.target.checked)}
            />
          }
          label={
            <Box>
              <Typography sx={{ fontWeight: 900 }}>Reduzir animações</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Desativa/transfere animações para ficar mais leve.
              </Typography>
            </Box>
          }
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography sx={{ fontWeight: 900, mb: 1 }}>Transição de tela</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1.25 }}>
        Para PCs mais fracos, use a transição simples (sem “bafos”).
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup
          value={forceSimple ? "simple" : (prefs.pageTransition || "dragon")}
          onChange={(e) => setPageTransition(e.target.value)}
        >
          <FormControlLabel
            value="dragon"
            control={<Radio />}
            label="Dinâmica (bafos do dragão)"
            disabled={forceSimple}
          />
          <FormControlLabel value="simple" control={<Radio />} label="Simples (leve e direta)" />
        </RadioGroup>
      </FormControl>

      {forceSimple ? (
        <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.8 }}>
          “Reduzir animações” está ativo, então a transição simples fica forçada.
        </Typography>
      ) : null}
    </Box>
  );
}