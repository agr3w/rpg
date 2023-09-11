import React from "react";
import { Typography, Grid, FormControl, Select, MenuItem } from "@mui/material";

const Etapa9 = ({
  racaSelecionada,
  valoresHabilidade,
  setValoresHabilidade,
}) => {
  const habilidades = [
    "Força",
    "Destreza",
    "Constituição",
    "Inteligência",
    "Sabedoria",
    "Carisma",
  ];

  // const pontosDisponiveis = 27;

  const handleSelecionarValor = (habilidade, valor) => {
    if (Object.values(valoresHabilidade).includes(valor.toString())) {
      setValoresHabilidade({ ...valoresHabilidade, [habilidade]: "" });
    } else {
      setValoresHabilidade({
        ...valoresHabilidade,
        [habilidade]: valor.toString(),
      });
    }
  };

  const calcularBonus = (valor) => {
    if (valor >= 14) {
      return "+2";
    } else if (valor >= 12) {
      return "+1";
    } else {
      return "+0";
    }
  };

  const opcoesDisponiveis = (habilidade) => {
    const valoresSelecionados = Object.values(valoresHabilidade).map((valor) =>
      valor.toString()
    );
    const bonusRaca = racaSelecionada.habilidadeBonus[habilidade] || 0;

    const valoresPossiveis = [
      { value: 15, realValue: 15 },
      { value: 14, realValue: 14 },
      { value: 13, realValue: 13 },
      { value: 12, realValue: 12 },
      { value: 10, realValue: 10 },
      { value: 8, realValue: 8 },
    ];

    return valoresPossiveis
      .map((opcao) => ({ ...opcao, value: opcao.value + bonusRaca })) // Adicione o bônus da raça
      .filter(
        (opcao) =>
          !valoresSelecionados.includes(opcao.realValue.toString()) ||
          valoresHabilidade[habilidade] === opcao.realValue.toString()
      );
  };

  return (
    <div>
      <Typography variant="h4">Distribuir Pontos de Habilidade</Typography>
      {/* <Typography>Points Available: {pontosDisponiveis}</Typography> */}
      <Grid container spacing={2}>
        {habilidades.map((habilidade, index) => (
          <Grid item xs={4} key={index}>
          <Typography>
            {habilidade} {valoresHabilidade[habilidade] && `(${calcularBonus(valoresHabilidade[habilidade])})`}
          </Typography>
          <FormControl fullWidth>
            <Select
              value={valoresHabilidade[habilidade]}
              onChange={(e) => handleSelecionarValor(habilidade, e.target.value)}
            >
              <MenuItem value="">Escolha</MenuItem>
              {opcoesDisponiveis(habilidade).map((opcao, index) => (
                <MenuItem key={index} value={opcao.realValue}>
                  {opcao.value} ({calcularBonus(opcao.realValue)})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Etapa9;
