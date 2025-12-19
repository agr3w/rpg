import React from "react";
import { TextField } from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha"; // Ajuste o import conforme sua pasta

const Etapa1 = ({ nome, setNome }) => {
  return (
    <LayoutFicha title="Qual o nome da lenda?">
      <TextField
        label="Nome do Personagem"
        variant="outlined"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        helperText="Esse será o nome pelo qual você será conhecido."
        sx={{
            // Pequeno ajuste local se precisar, mas o ideal é o theme cuidar disso
            backgroundColor: '#fff' 
        }}
      />
    </LayoutFicha>
  );
};

export default Etapa1;