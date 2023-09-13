import React from "react";
import { Typography, Grid, FormControl, Select, MenuItem } from "@mui/material";

const Etapa10 = ({
  racaSelecionada,
  valoresHabilidade,
  setValoresHabilidade,
  SubRaca,
  habilidadeBonusSubRaca
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

  const calcularBonus = (valorAtributo) => {
    const bonus = Math.floor((valorAtributo - 10) / 2);
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  };

  const opcoesDisponiveis = (habilidade) => {
    const valoresSelecionados = Object.values(valoresHabilidade).map((valor) =>
      valor.toString()
    );
    const bonusRaca = racaSelecionada.proficienciaHabilidadeBonus[habilidade] || 0;
    const bonusSubRaca = habilidadeBonusSubRaca[habilidade] || 0; // Adicione o bônus da sub-raça
  
    const valoresPossiveis = [
      { value: 15, realValue: 15 },
      { value: 14, realValue: 14 },
      { value: 13, realValue: 13 },
      { value: 12, realValue: 12 },
      { value: 10, realValue: 10 },
      { value: 8, realValue: 8 },
    ];
  
    return valoresPossiveis
      .map((opcao) => ({
        ...opcao,
        value: opcao.value + bonusRaca + bonusSubRaca,
      })) // Adicione o bônus da raça e da sub-raça
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
            {habilidade} {valoresHabilidade[habilidade] && `${calcularBonus(valoresHabilidade[habilidade])}`}
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

export default Etapa10;
