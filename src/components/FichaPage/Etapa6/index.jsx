import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu"; // Ícone de pena/escrita
import LayoutFicha from "components/FichaLayout/LayoutFicha";

// Estilo reutilizável de "Caixa de Texto D&D"
const dndBoxStyle = {
  p: 2.5,
  borderRadius: 2,
  bgcolor: "rgba(243, 235, 214, 0.5)",
  border: "1px solid rgba(92, 64, 51, 0.2)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
};

const Etapa6 = ({
  antecedente,
  setAntecedente,
  antecedentesOptions,
  itensDaAntecedencia = [],
  idiomaDoAntecedente,
  setIdiomaAntecedente,
  idiomaDoAntecendente2,
  setIdiomaAntecendente2,
  idiomaOption = [],
}) => {
  return (
    <LayoutFicha title="Selecione o Antecedente">
      <Stack spacing={3}>
        <Typography variant="body1" sx={{ color: "#3d2b1f", textAlign: "center", fontStyle: "italic" }}>
          "Quem você era antes de se tornar um aventureiro? O que deixou para trás?"
        </Typography>

        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: "Cinzel" }}>Antecedente</InputLabel>
          <Select
            label="Antecedente"
            value={antecedente}
            onChange={(e) => setAntecedente(e.target.value)}
            sx={{
              fontWeight: 700,
              color: "#2c1a10",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(92, 64, 51, 0.3)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#833c0b" },
            }}
          >
            <MenuItem value="">
              <em>Selecione um antecedente</em>
            </MenuItem>
            {antecedentesOptions.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper elevation={0} sx={{ ...dndBoxStyle, maxHeight: 320, overflow: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: "#58180D", fontFamily: "Cinzel" }}>
            Detalhes & Proficiências:
          </Typography>

          {itensDaAntecedencia.length > 0 ? (
            <List dense>
              {itensDaAntecedencia.map((item, idx) => (
                <ListItem key={idx} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                    <HistoryEduIcon sx={{ fontSize: 20, color: "#833c0b" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      variant: "body2",
                      style: { color: "#3d2b1f", lineHeight: 1.5 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="caption" sx={{ color: "rgba(44, 26, 16, 0.5)", fontStyle: "italic" }}>
              Selecione um antecedente para ver sua história.
            </Typography>
          )}
        </Paper>

        {/* Idiomas adicionais */}
        {(antecedente === "Acólito" || antecedente === "Sábio") && (
          <Paper elevation={0} sx={{ ...dndBoxStyle, bgcolor: "rgba(255,255,255,0.4)" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#2c1a10" }}>
              Idiomas Conhecidos
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Idioma adicional 1</InputLabel>
                <Select
                  value={idiomaDoAntecedente}
                  onChange={(e) => setIdiomaAntecedente(e.target.value)}
                  label="Idioma adicional 1"
                >
                  {idiomaOption.map((opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Idioma adicional 2</InputLabel>
                <Select
                  value={idiomaDoAntecendente2}
                  onChange={(e) => setIdiomaAntecendente2(e.target.value)}
                  label="Idioma adicional 2"
                >
                  {idiomaOption.map((opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        )}

        {["Artesão de Guilda", "Eremita", "Forasteiro", "Nobre"].includes(antecedente) && (
          <Paper elevation={0} sx={{ ...dndBoxStyle, bgcolor: "rgba(255,255,255,0.4)" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#2c1a10" }}>
              Idioma Conhecido
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Idioma adicional</InputLabel>
              <Select
                value={idiomaDoAntecedente}
                onChange={(e) => setIdiomaAntecedente(e.target.value)}
                label="Idioma adicional"
              >
                {idiomaOption.map((opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa6;
