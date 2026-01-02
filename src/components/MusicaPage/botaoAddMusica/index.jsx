import React from "react";
import { Box } from "@mui/material";
import { useMusicContext } from "APIs/MusicContext";
import AddMusicButton from "../painelAdd";

const BotaoAdicionarMusica = () => {
  const { adicionarMusica } = useMusicContext();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <AddMusicButton onMusicAdded={adicionarMusica} />
    </Box>
  );
};

export default BotaoAdicionarMusica;
