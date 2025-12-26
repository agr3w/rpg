import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";

/**
 * inventory.equipped esperado (exemplo):
 * {
 *   eq_123: {
 *     id: "eq_123",
 *     name: "Espada Longa",
 *     attackStat: "Força",   // ou "Destreza"
 *     finesse: false,        // true = Acuidade (usa o melhor entre Força/Destreza)
 *     damageDice: "1d8+3",
 *     proficiente: true,
 *     attackBonus: 1,
 *     notes: "Cortante, alcance 1,5 m"
 *   }
 * }
 */

const FichaInventory = ({
  inventory = {},
  abilityMods = {},
  level = 1,
  // opcional: callback pra salvar no banco depois
  onChangeEquipped,
}) => {
  // estado local dos equipados (para o usuário editar livremente)
  const [equippedState, setEquippedState] = useState(
    () => inventory.equipped || {}
  );

  useEffect(() => {
    setEquippedState(inventory.equipped || {});
  }, [inventory.equipped]);

  const backpack = inventory.backpack || {};

  const equippedEntries = Object.entries(equippedState);

  const backpackArr = Object.values(backpack)
    .filter(Boolean)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  // --- bônus de proficiência (5e) ---
  const profBonus = useMemo(() => {
    const lvl = Number(level || 1);
    if (lvl >= 17) return 6;
    if (lvl >= 13) return 5;
    if (lvl >= 9) return 4;
    if (lvl >= 5) return 3;
    return 2;
  }, [level]);

  const [lastAttack, setLastAttack] = useState(null);
  const [lastDamage, setLastDamage] = useState(null);

  // formulário de novo equipamento
  const [newName, setNewName] = useState("");
  const [newAttackStat, setNewAttackStat] = useState("Força");
  const [newDamageDice, setNewDamageDice] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newFinesse, setNewFinesse] = useState(false);

  const rollDie = (faces) => 1 + Math.floor(Math.random() * faces);

  const parseDamageDice = (str) => {
    if (!str) return null;
    const m = /^(\d+)d(\d+)([+-]\d+)?$/i.exec(String(str).trim());
    if (!m) return null;
    return {
      num: Number(m[1]),
      faces: Number(m[2]),
      bonus: Number(m[3] || 0),
    };
  };

  const computeAttackBonus = (item) => {
    let mod;
    if (item.finesse) {
      // Acuidade: usa o melhor entre Força e Destreza
      const str = Number(abilityMods["Força"] || 0);
      const dex = Number(abilityMods["Destreza"] || 0);
      mod = Math.max(str, dex);
    } else {
      const stat = item.attackStat || "Força";
      mod = Number(abilityMods[stat] || 0);
    }

    const prof = item.proficiente === false ? 0 : profBonus;
    const extra = Number(item.attackBonus || 0);
    return mod + prof + extra;
  };

  const handleAttack = (slot, item) => {
    const d20 = rollDie(20);
    const bonus = computeAttackBonus(item);
    const total = d20 + bonus;

    setLastAttack({
      slot,
      weaponId: item.id || slot,
      weaponName: item.name || "Ataque",
      d20,
      bonus,
      total,
      damageDice: item.damageDice || "",
    });
    setLastDamage(null);
  };

  const handleRollDamage = () => {
    if (!lastAttack?.damageDice) return;
    const spec = parseDamageDice(lastAttack.damageDice);
    if (!spec) {
      setLastDamage({
        weaponName: lastAttack.weaponName,
        error: `Formato de dano inválido: ${lastAttack.damageDice}`,
      });
      return;
    }

    const rolls = [];
    let total = 0;
    for (let i = 0; i < spec.num; i++) {
      const r = rollDie(spec.faces);
      rolls.push(r);
      total += r;
    }
    total += spec.bonus || 0;

    setLastDamage({
      weaponName: lastAttack.weaponName,
      spec,
      rolls,
      total,
    });
  };

  const handleAddEquipment = () => {
    if (!newName.trim()) return;

    const id = `eq_${Date.now()}`;
    const item = {
      id,
      name: newName.trim(),
      attackStat: newAttackStat,
      finesse: newFinesse,
      damageDice: newDamageDice.trim(),
      notes: newNotes.trim(),
      proficiente: true,
    };

    setEquippedState((prev) => {
      const next = { ...prev, [id]: item };
      onChangeEquipped?.(next);
      return next;
    });

    setNewName("");
    setNewAttackStat("Força");
    setNewDamageDice("");
    setNewNotes("");
    setNewFinesse(false);
  };

  return (
    <Grid container spacing={2}>
      {/* Coluna esquerda: Equipados em formato de tabela + rolagens */}
      <Grid item xs={12} md={5}>
        <Typography variant="subtitle2" gutterBottom>
          Equipados
        </Typography>

        {equippedEntries.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }} variant="body2">
            Nenhum item equipado ainda.
          </Typography>
        ) : (
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.25)",
              borderRadius: 1,
              overflow: "hidden",
              fontSize: 13,
              mb: 1.5,
            }}
          >
            {/* Cabeçalho estilo ficha: Nomes / Ataque/CD / Dano e Tipo / Notas */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "3fr 1.2fr 1.6fr 2.2fr 1.1fr",
                bgcolor: "rgba(0,0,0,0.04)",
                px: 1,
                py: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Nomes
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Ataque / CD
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Dano e Tipo
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Notas
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, textAlign: "center" }}
              >
                Rolagem
              </Typography>
            </Box>

            {/* Linhas de armas/truques */}
            {equippedEntries.map(([slot, item], idx) => {
              const atkBonus = computeAttackBonus(item);
              const damage = item.damageDice || "—";
              const notesArr = [];
              if (item.notes) notesArr.push(item.notes);
              if (item.finesse) notesArr.push("Acuidade");
              const notes = notesArr.length ? notesArr.join(" • ") : "—";

              return (
                <Box
                  key={slot}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1.2fr 1.6fr 2.2fr 1.1fr",
                    px: 1,
                    py: 0.5,
                    borderTop: "1px solid rgba(0,0,0,0.12)",
                    bgcolor:
                      idx % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    {item.name || "Item"}
                  </Typography>

                  <Typography variant="body2">
                    {item.damageDice
                      ? `+${atkBonus} (${item.finesse ? "Melhor F/D" : item.attackStat || "Força"})`
                      : "—"}
                  </Typography>

                  <Typography variant="body2">{damage}</Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontSize: 12, opacity: 0.85 }}
                  >
                    {notes}
                  </Typography>

                  <Box sx={{ textAlign: "center" }}>
                    {item.damageDice && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleAttack(slot, item)}
                      >
                        Atacar
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Formulário: adicionar novo equipamento livremente */}
        <Paper
          variant="outlined"
          sx={{ p: 1, mb: 1.5, borderStyle: "dashed" }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Adicionar equipamento
          </Typography>

          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              label="Nome"
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                select
                label="Atributo de ataque"
                size="small"
                sx={{ flex: 1 }}
                value={newAttackStat}
                onChange={(e) => setNewAttackStat(e.target.value)}
              >
                <MenuItem value="Força">Força</MenuItem>
                <MenuItem value="Destreza">Destreza</MenuItem>
              </TextField>

              <TextField
                label="Dano (ex: 1d8+3)"
                size="small"
                sx={{ flex: 1 }}
                value={newDamageDice}
                onChange={(e) => setNewDamageDice(e.target.value)}
              />
            </Box>

            <TextField
              label="Notas / tipo de dano"
              size="small"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Cortante, alcance 1,5 m..."
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={newFinesse}
                  onChange={(e) => setNewFinesse(e.target.checked)}
                />
              }
              label="Acuidade (usa o melhor entre Força e Destreza)"
            />

            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                size="small"
                disabled={!newName.trim()}
                onClick={handleAddEquipment}
              >
                Adicionar
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Painel de rolagens (ataque + dano) */}
        {(lastAttack || lastDamage) && (
          <Paper
            variant="outlined"
            sx={{ mt: 1, p: 1, borderStyle: "dashed" }}
          >
            {lastAttack && (
              <>
                <Typography variant="subtitle2">
                  Último ataque: {lastAttack.weaponName}
                </Typography>
                <Typography variant="body2">
                  d20: {lastAttack.d20}{" "}
                  {lastAttack.bonus >= 0
                    ? `+${lastAttack.bonus}`
                    : lastAttack.bonus}{" "}
                  = <b>{lastAttack.total}</b>
                </Typography>

                {lastAttack.damageDice && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={handleRollDamage}
                  >
                    Rolar dano ({lastAttack.damageDice})
                  </Button>
                )}
              </>
            )}

            {lastDamage && !lastDamage.error && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">
                  Dano: {lastDamage.weaponName}
                </Typography>
                <Typography variant="body2">
                  Rolagens: {lastDamage.rolls.join(" + ")}
                  {lastDamage.spec.bonus
                    ? ` ${lastDamage.spec.bonus >= 0 ? "+" : ""}${
                        lastDamage.spec.bonus
                      }`
                    : ""}{" "}
                  = <b>{lastDamage.total}</b>
                </Typography>
              </Box>
            )}

            {lastDamage?.error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, fontSize: 12 }}
              >
                {lastDamage.error}
              </Typography>
            )}
          </Paper>
        )}
      </Grid>

      {/* Coluna direita: Mochila */}
      <Grid item xs={12} md={7}>
        <Typography variant="subtitle2" gutterBottom>
          Mochila
        </Typography>

        {backpackArr.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }} variant="body2">
            Nenhum item na mochila ainda. Use o painel de Loot da sessão para
            adicionar recompensas.
          </Typography>
        ) : (
          <List dense>
            {backpackArr.map((it) => (
              <ListItem key={it.id} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={`${it.qty || 1}× ${it.name || "Item"}`}
                  secondary={
                    it.sessionId ? `Origem: sessão ${it.sessionId}` : undefined
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Grid>
    </Grid>
  );
};

export default FichaInventory;