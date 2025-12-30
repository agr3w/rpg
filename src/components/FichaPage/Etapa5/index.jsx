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
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LayoutFicha from "components/FichaLayout/LayoutFicha";

const Etapa5 = ({ tendencia, setTendencia, TendenciasOptions, itensDaTendencia }) => {
  return (
    <LayoutFicha title="Sua Bússola Moral">
      <Stack spacing={3}>
        <Typography variant="body1" sx={{ color: "#3d2b1f", textAlign: "center", fontStyle: "italic" }}>
          "Onde seu personagem se encaixa na batalha cósmica entre o bem e o mal, a lei e o caos?"
        </Typography>

        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: "Cinzel" }}>Tendência</InputLabel>
          <Select
            value={tendencia}
            onChange={(e) => setTendencia(e.target.value)}
            label="Tendência"
            sx={{
              fontWeight: 700,
              color: "#2c1a10",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(92, 64, 51, 0.3)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#833c0b" },
            }}
          >
            <MenuItem value="">
              <em>Selecione uma tendência</em>
            </MenuItem>
            {TendenciasOptions.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Caixa de Descrição Estilizada como Citação/Lore */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: "rgba(243, 235, 214, 0.6)",
            border: "1px solid rgba(92, 64, 51, 0.2)",
            position: "relative",
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <FormatQuoteIcon 
            sx={{ 
              position: "absolute", 
              top: 8, 
              left: 8, 
              fontSize: 40, 
              color: "rgba(131, 60, 11, 0.15)",
              transform: "rotate(180deg)"
            }} 
          />
          
          {itensDaTendencia && itensDaTendencia.length > 0 ? (
            <Box sx={{ position: "relative", zIndex: 1, px: 2 }}>
              {itensDaTendencia.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="body1"
                  sx={{ 
                    whiteSpace: "pre-wrap", 
                    lineHeight: 1.6, 
                    color: "#2c1a10",
                    fontFamily: "'Cinzel', serif", // Fonte mais elegante para a descrição
                    fontWeight: 500,
                    textAlign: "center"
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="caption" sx={{ textAlign: "center", color: "rgba(44, 26, 16, 0.5)", fontStyle: "italic" }}>
              Selecione uma tendência para ler sobre sua filosofia.
            </Typography>
          )}

           <FormatQuoteIcon 
            sx={{ 
              position: "absolute", 
              bottom: 8, 
              right: 8, 
              fontSize: 40, 
              color: "rgba(131, 60, 11, 0.15)"
            }} 
          />
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa5;
