import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  alpha,
  useTheme,
} from "@mui/material";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { motion, AnimatePresence } from "framer-motion";

import FichaArsenalPanel from "./FichaArsenalPanel";
import FichaMagiasPanel from "./FichaMagiasPanel";
import FichaBackpackPanel from "./FichaBackpackPanel";

export default function FichaTacticalEquipmentHub({
  inventory = {},
  spellcasting = {},
  abilityMods = {},
  spellAttr = "Carisma",
  profBonus = 2,
  classe = "Mago",
  level = 1,
  onChangeEquipped,
  onChangeBackpack,
  onChangeSpellcasting,
  initialTab = 0,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [tabIndex, setTabIndex] = useState(initialTab);

  const strokeColor = isDark ? "rgba(229,179,36,0.22)" : "rgba(131,60,11,0.22)";

  // Cores dinâmicas para a aba selecionada
  const tabColors = [
    isDark ? "#ff7043" : "#d84315", // 0: Arsenal
    isDark ? "#ba68c8" : "#8e24aa", // 1: Grimório
    isDark ? "#ffd54f" : "#b26a00", // 2: Mochila
  ];

  const currentTabColor = tabColors[tabIndex] || tabColors[0];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${strokeColor}`,
        bgcolor: isDark ? "rgba(24, 17, 13, 0.85)" : "rgba(255, 252, 246, 0.92)",
        backdropFilter: "blur(8px)",
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.06)",
        overflow: "hidden",
        mb: 3,
      }}
    >
      {/* Abas Principais do Hub Tático */}
      <Tabs
        value={tabIndex}
        onChange={(_, v) => setTabIndex(v)}
        variant="fullWidth"
        sx={{
          bgcolor: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.03)",
          borderBottom: `1px solid ${strokeColor}`,
          "& .MuiTabs-indicator": {
            bgcolor: currentTabColor,
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTab-root": {
            fontFamily: "Cinzel",
            fontWeight: 800,
            fontSize: { xs: "0.78rem", sm: "0.95rem" },
            minHeight: 52,
            transition: "all 0.2s ease",
            color: "text.secondary",
            "&.Mui-selected": {
              color: currentTabColor,
            },
          },
        }}
      >
        <Tab
          icon={<SportsKabaddiIcon />}
          iconPosition="start"
          label="Arsenal & Combate"
        />
        <Tab
          icon={<AutoFixHighIcon />}
          iconPosition="start"
          label="Grimório de Magias"
        />
        <Tab
          icon={<Inventory2Icon />}
          iconPosition="start"
          label="Mochila & Itens"
        />
      </Tabs>

      {/* Conteúdo da Aba */}
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <AnimatePresence mode="wait">
          {tabIndex === 0 && (
            <motion.div
              key="tab-arsenal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <FichaArsenalPanel
                equipped={inventory.equipped || {}}
                abilityMods={abilityMods}
                level={level}
                onChangeEquipped={onChangeEquipped}
              />
            </motion.div>
          )}

          {tabIndex === 1 && (
            <motion.div
              key="tab-grimorio"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <FichaMagiasPanel
                spellcasting={spellcasting}
                abilityMods={abilityMods}
                spellAttr={spellAttr}
                profBonus={profBonus}
                classe={classe}
                level={level}
                onChange={onChangeSpellcasting}
              />
            </motion.div>
          )}

          {tabIndex === 2 && (
            <motion.div
              key="tab-mochila"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <FichaBackpackPanel
                backpack={inventory.backpack || {}}
                onChangeBackpack={onChangeBackpack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Paper>
  );
}
