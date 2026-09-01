import React, { useState } from "react";
import { Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FeaturesCompendiumModal from "../../FichaDetalhes/FeaturesCompendiumModal";
import { getCompendioCompleto } from "../../../Array/HabilidadesDB";

export default function BotaoPainelHabilidade({
  classeNome = "",
  features = [],
  level = 1,
  racaNome = "",
  buttonText = "Ver Habilidades",
  variant = "contained",
  color = "secondary",
}) {
  const [open, setOpen] = useState(false);

  const structuredFeatures =
    features && features.length > 0
      ? features
      : getCompendioCompleto({ classe: classeNome, raca: racaNome, nivel: level });

  return (
    <>
      <Button
        type="button"
        variant={variant}
        color={color}
        startIcon={<MenuBookIcon />}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-label="Abrir compêndio de habilidades"
        sx={{ fontFamily: "Cinzel", fontWeight: 700 }}
      >
        {buttonText}
      </Button>

      <FeaturesCompendiumModal
        open={open}
        onClose={() => setOpen(false)}
        features={structuredFeatures}
        classeNome={classeNome}
        racaNome={racaNome}
        level={level}
      />
    </>
  );
}
