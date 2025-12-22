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

  // valores base permitidos (standard array)
  const valoresPossiveisBase = [
    { realValue: 15, label: "15" },
    { realValue: 14, label: "14" },
    { realValue: 13, label: "13" },
    { realValue: 12, label: "12" },
    { realValue: 10, label: "10" },
    { realValue: 8, label: "8" },
  ];

  // bônus por raça/sub-raça (espera objeto com chaves de habilidade)
  const bonusRaca = racaSelecionada?.proficienciaHabilidadeBonus || {};
  const bonusSub = detalhesSubRaca?.habilidadeBonusSubRaca || {};

  // manter consistência: armazenamos números (não strings)
  const handleSelecionarValor = (habilidade, valorReal) => {
    const currentValues = { ...valoresHabilidade };
    // transforma valores existentes para números para comparação
    const valoresAtuais = Object.fromEntries(
      Object.entries(currentValues).map(([k, v]) => [k, v === "" ? "" : Number(v)])
    );

    // se a mesma opção já foi escolhida em outra habilidade, desmarca dessa habilidade atual
    const alreadyUsed = Object.entries(valoresAtuais).some(
      ([k, v]) => k !== habilidade && v === valorReal
    );

    if (alreadyUsed) {
      // ignora seleção duplicada
      return;
    }

    // toggle: se já está selecionado nessa habilidade, limpa; senão seta
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

  // opcoes que ficam visíveis por habilidade (aplica bônus para exibição)
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
    <LayoutFicha title="Distribuir Pontos de Habilidade">
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.secondary">
          Selecione um valor diferente para cada habilidade (standard array). Bônus de raça/sub-raça já aplicado na visualização.
        </Typography>

        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {habilidades.map((habilidade, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle2">{habilidade}</Typography>
                  <Chip
                    label={
                      valoresHabilidade[habilidade]
                        ? `${valoresHabilidade[habilidade]} (${calcularBonus(Number(valoresHabilidade[habilidade]) + (bonusRaca[habilidade] || 0) + (bonusSub[habilidade] || 0))})`
                        : "—"
                    }
                    size="small"
                  />
                </Box>

                <FormControl fullWidth>
                  <Select
                    value={valoresHabilidade[habilidade] ?? ""}
                    onChange={(e) => handleSelecionarValor(habilidade, Number(e.target.value))}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Escolha</em>
                    </MenuItem>

                    {opcoesDisponiveis(habilidade).map((opcao) => (
                      <MenuItem key={opcao.realValue} value={opcao.realValue}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.18 }}
                          style={{ width: "100%" }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <span>{opcao.displayValue}</span>
                            <Typography variant="caption" color="text.secondary">
                              ({opcao.bonusText}) base {opcao.realValue}
                            </Typography>
                          </Box>
                        </motion.div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="caption" color="text.secondary">
            Valores usados:
          </Typography>
          {selecionadas.length === 0 ? (
            <Typography variant="caption">Nenhum</Typography>
          ) : (
            selecionadas.map((v) => <Chip key={v} label={v} size="small" />)
          )}
        </Box>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa10;
