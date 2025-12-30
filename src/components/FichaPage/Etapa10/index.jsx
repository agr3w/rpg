import React, { useMemo } from "react";
import {
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";
import { motion } from "framer-motion";

const Etapa10 = ({
  racaSelecionada = {},
  valoresHabilidade,
  setValoresHabilidade,
  SubRaca,
  detalhesSubRaca = {},
}) => {
  const habilidades = [
    "Força",
    "Destreza",
    "Constituição",
    "Inteligência",
    "Sabedoria",
    "Carisma",
  ];

  const valoresPossiveisBase = [
    { realValue: 15, label: "15" },
    { realValue: 14, label: "14" },
    { realValue: 13, label: "13" },
    { realValue: 12, label: "12" },
    { realValue: 10, label: "10" },
    { realValue: 8, label: "8" },
  ];

  const bonusRaca = racaSelecionada?.proficienciaHabilidadeBonus || {};
  const bonusSub = detalhesSubRaca?.habilidadeBonusSubRaca || {};

  const handleSelecionarValor = (habilidade, valorReal) => {
    const currentValues = { ...valoresHabilidade };
    const valoresAtuais = Object.fromEntries(
      Object.entries(currentValues).map(([k, v]) => [k, v === "" ? "" : Number(v)])
    );

    const alreadyUsed = Object.entries(valoresAtuais).some(
      ([k, v]) => k !== habilidade && v === valorReal
    );

    if (alreadyUsed) return;

    if (valoresAtuais[habilidade] === valorReal) {
      setValoresHabilidade({ ...valoresAtuais, [habilidade]: "" });
    } else {
      setValoresHabilidade({ ...valoresAtuais, [habilidade]: valorReal });
    }
  };

  const calcularBonus = (valorAtributo) => {
    const bonus = Math.floor((Number(valorAtributo) - 10) / 2);
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  const opcoesDisponiveis = (habilidade) => {
    const valoresSelecionados = Object.values(valoresHabilidade)
      .filter((v) => v !== "")
      .map((v) => Number(v));

    const br = bonusRaca[habilidade] || 0;
    const bs = bonusSub[habilidade] || 0;

    return valoresPossiveisBase
      .filter(
        (opcao) =>
          !valoresSelecionados.includes(opcao.realValue) ||
          Number(valoresHabilidade[habilidade]) === opcao.realValue
      )
      .map((opcao) => ({
        ...opcao,
        displayValue: opcao.realValue + br + bs,
        bonusText: calcularBonus(opcao.realValue + br + bs),
      }));
  };

  const selecionadas = useMemo(
    () =>
      Object.entries(valoresHabilidade).reduce((acc, [k, v]) => {
        if (v !== "" && v != null) acc.push(Number(v));
        return acc;
      }, []),
    [valoresHabilidade]
  );

  return (
    <LayoutFicha title="Atributos">
      <Stack spacing={3}>
        <Typography variant="body1" sx={{ color: "#3d2b1f", textAlign: "center", fontStyle: "italic" }}>
          "Defina suas capacidades físicas e mentais. (Standard Array)"
        </Typography>

        <Grid container spacing={2}>
          {habilidades.map((habilidade, index) => {
            const valorBase = valoresHabilidade[habilidade] ? Number(valoresHabilidade[habilidade]) : 0;
            const bonusTotal = (bonusRaca[habilidade] || 0) + (bonusSub[habilidade] || 0);
            const valorFinal = valorBase > 0 ? valorBase + bonusTotal : 0;
            const mod = valorFinal > 0 ? calcularBonus(valorFinal) : "—";

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(243, 235, 214, 0.6)",
                    border: "1px solid rgba(92, 64, 51, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontFamily: "Cinzel", fontWeight: 700, color: "#58180D", mb: 1 }}>
                    {habilidade}
                  </Typography>

                  {/* Caixa do Modificador (Estilo Ficha D&D) */}
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "12px",
                      border: "2px solid #2c1a10",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "#fff",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#2c1a10" }}>
                      {mod}
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{ color: "#833c0b", fontWeight: 700, mb: 1 }}>
                    Valor: {valorFinal > 0 ? valorFinal : "—"}
                  </Typography>

                  <FormControl fullWidth size="small">
                    <Select
                      value={valoresHabilidade[habilidade] ?? ""}
                      onChange={(e) => handleSelecionarValor(habilidade, Number(e.target.value))}
                      displayEmpty
                      sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
                    >
                      <MenuItem value="">
                        <em>Escolha</em>
                      </MenuItem>
                      {opcoesDisponiveis(habilidade).map((opcao) => (
                        <MenuItem key={opcao.realValue} value={opcao.realValue}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <span>{opcao.displayValue}</span>
                            <Typography variant="caption" sx={{ opacity: 0.6 }}>
                              (Base {opcao.realValue})
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Paper elevation={0} sx={{ p: 2, bgcolor: "rgba(0,0,0,0.05)", borderRadius: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#58180D" }}>
              VALORES USADOS:
            </Typography>
            {selecionadas.length === 0 ? (
              <Typography variant="caption" sx={{ fontStyle: "italic" }}>Nenhum</Typography>
            ) : (
              selecionadas.map((v) => (
                <Chip 
                  key={v} 
                  label={v} 
                  size="small" 
                  sx={{ 
                    bgcolor: "#833c0b", 
                    color: "#fff", 
                    fontWeight: 700,
                    fontFamily: "Cinzel" 
                  }} 
                />
              ))
            )}
          </Stack>
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa10;
