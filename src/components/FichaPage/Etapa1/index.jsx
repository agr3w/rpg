import React from "react";
import { TextField, Box } from "@mui/material";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

const Etapa1 = ({ nome, setNome }) => {
  return (
    <LayoutFicha title="Qual o nome da lenda?">
      <Box sx={{ width: '100%' }}>
        <TextField
          label="Nome do Personagem"
          variant="outlined"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          helperText={`${nome.length}/30 — Esse será o nome pelo qual você será conhecido.`}
          inputProps={{ maxLength: 30 }}
          autoFocus
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(16,24,40,0.06)'
            },
            '& .MuiFormHelperText-root': { color: 'text.secondary', fontSize: 13 }
          }}
        />
      </Box>
    </LayoutFicha>
  );
};

export default Etapa1;