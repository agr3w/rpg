//// filepath: src/components/FichaDetalhes/FichaEstadoPanel.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { motion } from "framer-motion";
import FichaXpPanel from "components/FichaDetalhes/FichaXpPanel";
import FichaInventory from "components/FichaDetalhes/FichaInventory";
import FichaAtributosPericiasPanel from "components/FichaDetalhes/FichaAtributosPericiasPanel";

export default function FichaEstadoPanel({
  userID,
  fichaKey,
  ficha,
  fichaEstado,
  abilityMods,
  atributosComBonus,          // ✅ novo
  spellAttr,
  onFichaChange,
  onChangeEquipped,
  onChangeBackpack,
  periciasAtivas,             // ✅ novo
  onChangePericiasAtivas,     // ✅ novo
  sectionMotion,
}) {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <>
      {/* 🔹 Atributos + Perícias (estilo ficha oficial) */}
      <FichaAtributosPericiasPanel
        level={fichaEstado.level}
        atributosComBonus={atributosComBonus}
        abilityMods={abilityMods}
        periciasAtivas={periciasAtivas}
        onChangePericiasAtivas={onChangePericiasAtivas}
      />

      {/* XP / Nível */}
      <FichaXpPanel
        userID={userID}
        fichaKey={fichaKey}
        ficha={ficha}
        onFichaChange={onFichaChange}
      />

      {/* Inventário (bloco principal) */}
      <Box sx={{ mb: 3 }}>
        <motion.div {...sectionMotion}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Inventory2Icon
                  fontSize="small"
                  style={{ marginRight: 8 }}
                />
                <Typography variant="h6">Inventário</Typography>
              </Box>

              <Button
                size="small"
                onClick={() => setInventoryOpen(true)}
              >
                Tela cheia
              </Button>
            </Box>

            <FichaInventory
              inventory={fichaEstado.inventory}
              abilityMods={abilityMods}
              level={fichaEstado.level}
              spellAttr={spellAttr}
              onChangeEquipped={onChangeEquipped}
              onChangeBackpack={onChangeBackpack}
            />
          </Paper>
        </motion.div>
      </Box>

      {/* Inventário em modal (tela cheia) */}
      <Dialog
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Inventário</DialogTitle>
        <DialogContent dividers>
          <FichaInventory
            inventory={ficha.inventory || {}}
            abilityMods={abilityMods}
            level={ficha.level || 1}
            spellAttr={spellAttr}
            onChangeEquipped={onChangeEquipped}
            onChangeBackpack={onChangeBackpack}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}