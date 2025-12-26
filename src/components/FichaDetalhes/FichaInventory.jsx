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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";


const abilityOptions = [
  "Força",
  "Destreza",
  "Constituição",
  "Inteligência",
  "Sabedoria",
  "Carisma",
];

const FichaInventory = ({
  inventory = {},
  abilityMods = {},
  level = 1,
  onChangeEquipped,
  onChangeBackpack,
  spellAttr, // atributo de conjuração passado pela página
}) => {
  const [equippedState, setEquippedState] = useState(
    () => inventory.equipped || {}
  );
  const [backpackState, setBackpackState] = useState(
    () => inventory.backpack || {}
  );

  useEffect(() => {
    setEquippedState(inventory.equipped || {});
    setBackpackState(inventory.backpack || {});
  }, [inventory.equipped, inventory.backpack]);

  const equippedEntries = Object.entries(equippedState);
  const backpackArr = Object.values(backpackState)
    .filter(Boolean)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

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

  const [showAddBackpackForm, setShowAddBackpackForm] = useState(false);

  // novo item mochila
  const [newBackName, setNewBackName] = useState("");
  const [newBackQty, setNewBackQty] = useState(1);
  const [newBackNotes, setNewBackNotes] = useState("");

  // edição / criação em modal
  const [editOpen, setEditOpen] = useState(false);
  const [editCtx, setEditCtx] = useState(null);

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

    if (item.props?.agil) {
      // arma ágil usa DES
      mod = Number(abilityMods["Destreza"] || 0);
    } else {
      const stat = item.attackStat || "Força";
      mod = Number(abilityMods[stat] || 0);
    }

    const prof = item.proficiente === false ? 0 : profBonus;
    const extra = Number(item.attackBonus || 0);
    return mod + prof + extra;
  };

  const computeSpellDc = (item) => {
    const stat = item.attackStat || "Inteligência";
    const mod = Number(abilityMods[stat] || 0);
    return 8 + profBonus + mod;
  };

  const handleAttack = (slot, item) => {
    const isSpell = item.kind === "spell";
    const isSaveSpell = isSpell && item.spellMode === "save";

    // Magia de resistência: não rola d20, só apresenta CD e dano
    if (isSaveSpell) {
      const dc = computeSpellDc(item);
      setLastAttack({
        slot,
        weaponId: item.id || slot,
        weaponName: item.name || "Magia",
        spellSave: true,
        dc,
        attackStat: item.attackStat || "Inteligência",
        damageDice: item.damageDice || "",
      });
      setLastDamage(null);
      return;
    }

    // Ataque normal (arma ou magia de ataque)
    const d20 = rollDie(20);
    let bonus;

    if (isSpell) {
      const stat = item.attackStat || "Inteligência";
      const mod = Number(abilityMods[stat] || 0);
      const prof = profBonus;
      const extra = Number(item.attackBonus || 0);
      bonus = mod + prof + extra;
    } else {
      bonus = computeAttackBonus(item);
    }

    const total = d20 + bonus;

    setLastAttack({
      slot,
      weaponId: item.id || slot,
      weaponName: item.name || "Ataque",
      d20,
      bonus,
      total,
      damageDice: item.damageDice || "",
      spellSave: false,
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

  const handleAddBackpackItem = () => {
    if (!newBackName.trim()) return;
    const id = `bp_${Date.now()}`;
    const item = {
      id,
      name: newBackName.trim(),
      qty: Number(newBackQty || 1),
      notes: newBackNotes.trim(),
      createdAt: Date.now(), // ✅ para ordenação na UI
    };

    setBackpackState((prev) => {
      const next = { ...prev, [id]: item };
      onChangeBackpack?.(next);
      return next;
    });

    setNewBackName("");
    setNewBackQty(1);
    setNewBackNotes("");
  };

  const handleDeleteEquipped = (id) => {
    setEquippedState((prev) => {
      const next = { ...prev };
      delete next[id];
      onChangeEquipped?.(next);
      return next;
    });
  };

  const handleDeleteBackpack = (id) => {
    setBackpackState((prev) => {
      const next = { ...prev };
      delete next[id];
      onChangeBackpack?.(next);
      return next;
    });
  };

  // ---------- modal: abrir para editar ----------
  const openEdit = (type, raw) => {
    const baseProps = raw.props || {};
    setEditCtx({
      type, // 'equipped' | 'backpack'
      isNew: false,
      id: raw.id,
      name: raw.name || "",
      qty: raw.qty || 1,
      damageDice: raw.damageDice || "",
      // se for magia e não tiver attackStat, sugere spellAttr
      attackStat: raw.attackStat || (raw.kind === "spell" ? (spellAttr || "Inteligência") : "Força"),
      notes: raw.notes || "",
      kind: raw.kind || "weapon", // 'weapon' | 'spell'
      spellMode: raw.spellMode || "attack", // 'attack' | 'save'
      saveAbility: raw.saveAbility || "Destreza",
      props: {
        agil: !!baseProps.agil,
        alcance: !!baseProps.alcance,
        arremesso: !!baseProps.arremesso,
        distancia: !!baseProps.distancia,
        duasMaos: !!baseProps.duasMaos,
        especial: !!baseProps.especial,
        leve: !!baseProps.leve,
        municao: !!baseProps.municao,
        pesada: !!baseProps.pesada,
        recarga: !!baseProps.recarga,
        versatil: !!baseProps.versatil,
        montaria: !!baseProps.montaria,
        rede: !!baseProps.rede,
      },
    });
    setEditOpen(true);
  };

  // ---------- modal: abrir para NOVO equipamento ----------
  const openNewEquipment = () => {
    setEditCtx({
      type: "equipped",
      isNew: true,
      id: null,
      name: "",
      qty: 1,
      damageDice: "",
      // se for magia, já sugere o atributo de conjuração da classe
      attackStat: spellAttr || "Força",
      notes: "",
      kind: "weapon",
      spellMode: "attack",
      saveAbility: "Destreza",
      props: {
        agil: false,
        alcance: false,
        arremesso: false,
        distancia: false,
        duasMaos: false,
        especial: false,
        leve: false,
        municao: false,
        pesada: false,
        recarga: false,
        versatil: false,
        montaria: false,
        rede: false,
      },
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editCtx) return;

    if (editCtx.type === "equipped") {
      const isNew = editCtx.isNew;
      const id = isNew ? `eq_${Date.now()}` : editCtx.id;

      setEquippedState((prev) => {
        const orig = isNew ? {} : prev[id] || {};
        const updated = {
          ...orig,
          id,
          name: editCtx.name.trim(),
          damageDice: editCtx.damageDice.trim(),
          attackStat: editCtx.attackStat,
          notes: editCtx.notes.trim(),
          kind: editCtx.kind || "weapon",
          spellMode: editCtx.spellMode || "attack",
          saveAbility: editCtx.saveAbility || "Destreza",
          props: { ...(orig.props || {}), ...editCtx.props },
          proficiente: orig.proficiente ?? true,
        };
        updated.finesse = !!updated.props.agil || !!orig.finesse;

        const next = { ...prev, [id]: updated };
        onChangeEquipped?.(next);
        return next;
      });
    } else {
      setBackpackState((prev) => {
        const orig = prev[editCtx.id] || {};
        const updated = {
          ...orig,
          id: editCtx.id,
          name: editCtx.name.trim(),
          qty: Number(editCtx.qty || 1),
          notes: editCtx.notes.trim(),
        };
        const next = { ...prev, [editCtx.id]: updated };
        onChangeBackpack?.(next);
        return next;
      });
    }

    setEditOpen(false);
    setEditCtx(null);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditCtx(null);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Coluna esquerda: Equipados + painel de rolagem */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle2">Equipados</Typography>

            <Button
              size="small"
              startIcon={<AddCircleOutlineIcon fontSize="small" />}
              onClick={openNewEquipment}
            >
              Adicionar equipamento
            </Button>
          </Box>

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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2.6fr 1.4fr 1.6fr 2.2fr 1.1fr",
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

              {equippedEntries.map(([slot, item], idx) => {
                const isSpell = item.kind === "spell";
                const isSaveSpell = isSpell && item.spellMode === "save";

                let attackLabel = "—";
                if (item.damageDice) {
                  if (isSaveSpell) {
                    const dc = computeSpellDc(item);
                    attackLabel = `CD ${dc} (${item.attackStat || "INT"})`;
                  } else {
                    const atkBonus = isSpell
                      ? (() => {
                          const stat = item.attackStat || "Inteligência";
                          const mod = Number(abilityMods[stat] || 0);
                          const prof = profBonus;
                          const extra = Number(item.attackBonus || 0);
                          return mod + prof + extra;
                        })()
                      : computeAttackBonus(item);

                    const statLabel =
                      isSpell || !item.finesse
                        ? item.attackStat || (isSpell ? "INT" : "Força")
                        : item.props?.agil
                        ? "DES"
                        : "Melhor F/D";

                    attackLabel = `+${atkBonus} (${statLabel})`;
                  }
                }

                const damage = item.damageDice || "—";
                const notesArr = [];
                if (isSpell) notesArr.push("Magia");
                if (item.notes) notesArr.push(item.notes);
                if (!isSpell) {
                  if (item.props?.agil) notesArr.push("Ágil");
                  if (item.props?.alcance) notesArr.push("Alcance");
                  if (item.props?.arremesso) notesArr.push("Arremesso");
                  if (item.props?.distancia) notesArr.push("Distância");
                  if (item.props?.duasMaos) notesArr.push("Duas Mãos");
                  if (item.props?.especial) notesArr.push("Especial");
                  if (item.props?.leve) notesArr.push("Leve");
                  if (item.props?.municao) notesArr.push("Munição");
                  if (item.props?.pesada) notesArr.push("Pesada");
                  if (item.props?.recarga) notesArr.push("Recarga");
                  if (item.props?.versatil) notesArr.push("Versátil");
                  if (item.props?.montaria) notesArr.push("Lança de Montaria");
                  if (item.props?.rede) notesArr.push("Rede");
                }
                const notes = notesArr.length ? notesArr.join(" • ") : "—";

                return (
                  <Box
                    key={slot}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2.6fr 1.4fr 1.6fr 2.2fr 1.1fr",
                      px: 1,
                      py: 0.5,
                      borderTop: "1px solid rgba(0,0,0,0.12)",
                      bgcolor:
                        idx % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="body2">
                        {item.name || "Item"}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => openEdit("equipped", item)}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDeleteEquipped(item.id || slot)
                        }
                      >
                        <DeleteOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Box>

                    <Typography variant="body2">{attackLabel}</Typography>

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
                          {isSaveSpell ? "Dano" : "Atacar"}
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {(lastAttack || lastDamage) && (
            <Paper
              variant="outlined"
              sx={{ mt: 1, p: 1, borderStyle: "dashed", position: "relative" }}
            >
              <IconButton
                size="small"
                sx={{ position: "absolute", top: 4, right: 4 }}
                onClick={() => {
                  setLastAttack(null);
                  setLastDamage(null);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>

              {lastAttack && (
                <>
                  <Typography variant="subtitle2">
                    Último ataque: {lastAttack.weaponName}
                  </Typography>

                  {lastAttack.spellSave ? (
                    <Typography variant="body2">
                      Magia de resistência — CD {lastAttack.dc} (
                      {lastAttack.attackStat || "INT"}). Aguarde o teste do
                      alvo.
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      d20: {lastAttack.d20}{" "}
                      {lastAttack.bonus >= 0
                        ? `+${lastAttack.bonus}`
                        : lastAttack.bonus}{" "}
                      = <b>{lastAttack.total}</b>
                    </Typography>
                  )}

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle2">Mochila</Typography>
            <Button
              size="small"
              startIcon={<AddCircleOutlineIcon fontSize="small" />}
              onClick={() => setShowAddBackpackForm((v) => !v)}
            >
              {showAddBackpackForm ? "Fechar" : "Adicionar item"}
            </Button>
          </Box>

          {showAddBackpackForm && (
            <Paper
              variant="outlined"
              sx={{ p: 1, mb: 1.5, borderStyle: "dashed" }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Novo item na mochila
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Nome"
                    size="small"
                    sx={{ flex: 2 }}
                    value={newBackName}
                    onChange={(e) => setNewBackName(e.target.value)}
                  />
                  <TextField
                    label="Qtd."
                    size="small"
                    sx={{ width: 90 }}
                    type="number"
                    value={newBackQty}
                    onChange={(e) =>
                      setNewBackQty(parseInt(e.target.value || "1", 10))
                    }
                  />
                </Box>

                <TextField
                  label="Descrição"
                  size="small"
                  multiline
                  minRows={2}
                  value={newBackNotes}
                  onChange={(e) => setNewBackNotes(e.target.value)}
                  placeholder="Anotações livres sobre o item."
                />

                <Box sx={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!newBackName.trim()}
                    onClick={handleAddBackpackItem}
                  >
                    Adicionar
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {backpackArr.length === 0 ? (
            <Typography sx={{ opacity: 0.8 }} variant="body2">
              Nenhum item na mochila ainda. Use o painel de Loot da sessão ou o
              botão acima para adicionar.
            </Typography>
          ) : (
            <List dense>
              {backpackArr.map((it) => (
                <ListItem
                  key={it.id}
                  sx={{ py: 0.5 }}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => openEdit("backpack", it)}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDeleteBackpack(it.id)}
                      >
                        <DeleteOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${it.qty || 1}× ${it.name || "Item"}`}
                    secondary={
                      it.campaignName || it.campaignId
                        ? `Campanha: ${it.campaignName || it.campaignId}`
                        : it.notes
                        ? it.notes
                        : undefined
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
      </Grid>

      {/* Modal de edição / novo equipamento ou item da mochila */}
      <Dialog open={editOpen} onClose={closeEdit} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editCtx?.isNew ? "Novo equipamento" : "Editar item"}
        </DialogTitle>
        {editCtx && (
          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nome"
                fullWidth
                size="small"
                value={editCtx.name}
                onChange={(e) =>
                  setEditCtx((c) => ({ ...c, name: e.target.value }))
                }
              />

              {editCtx.type === "backpack" && (
                <TextField
                  label="Quantidade"
                  size="small"
                  type="number"
                  value={editCtx.qty}
                  onChange={(e) =>
                    setEditCtx((c) => ({
                      ...c,
                      qty: parseInt(e.target.value || "1", 10),
                    }))
                  }
                />
              )}

              {editCtx.type === "equipped" && (
                <>
                  {(() => {
                    const isSpell = editCtx.kind === "spell";
                    return (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <TextField
                            select
                            label="Tipo"
                            size="small"
                            sx={{ width: 150 }}
                            value={editCtx.kind}
                            onChange={(e) => {
                              const v = e.target.value;
                              setEditCtx((c) => ({
                                ...c,
                                kind: v,
                                // se for novo e virou magia, sugere o atributo de conjuração
                                attackStat: v === "spell" ? (spellAttr || c.attackStat || "Inteligência") : c.attackStat || "Força",
                              }));
                            }}
                          >
                            <MenuItem value="weapon">Arma</MenuItem>
                            <MenuItem value="spell">Magia</MenuItem>
                          </TextField>

                          <TextField
                            select
                            label={
                              isSpell ? "Atributo chave" : "Atributo de ataque"
                            }
                            size="small"
                            sx={{ flex: 1, minWidth: 170 }}
                            value={editCtx.attackStat}
                            onChange={(e) =>
                              setEditCtx((c) => ({
                                ...c,
                                attackStat: e.target.value,
                              }))
                            }
                          >
                            {abilityOptions.map((a) => (
                              <MenuItem key={a} value={a}>
                                {a}
                              </MenuItem>
                            ))}
                          </TextField>

                          <TextField
                            label="Dano (ex: 1d8+3)"
                            size="small"
                            sx={{ flex: 1, minWidth: 170 }}
                            value={editCtx.damageDice}
                            onChange={(e) =>
                              setEditCtx((c) => ({
                                ...c,
                                damageDice: e.target.value,
                              }))
                            }
                          />
                        
                        {isSpell && (
                          <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: 'center' }}>
                            {/* Mostrar CD de resistência e bônus de ataque mágico calculados */}
                            <TextField
                              label="CD de Resistência"
                              size="small"
                              value={
                                8 + profBonus + (abilityMods[editCtx.attackStat] || 0)
                              }
                              InputProps={{ readOnly: true }}
                              sx={{ width: 160 }}
                            />

                            <TextField
                              label="Bônus de Ataque Mágico"
                              size="small"
                              value={`+${profBonus + (abilityMods[editCtx.attackStat] || 0)}`}
                              InputProps={{ readOnly: true }}
                              sx={{ width: 180 }}
                            />
                          </Box>
                        )}
                        </Box>

                        {isSpell && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mt: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <TextField
                              select
                              label="Tipo de magia"
                              size="small"
                              sx={{ flex: 1, minWidth: 200 }}
                              value={editCtx.spellMode}
                              onChange={(e) =>
                                setEditCtx((c) => ({
                                  ...c,
                                  spellMode: e.target.value,
                                }))
                              }
                            >
                              <MenuItem value="attack">
                                Ataque de magia (rolagem vs CA)
                              </MenuItem>
                              <MenuItem value="save">
                                Teste de resistência (CD fixa)
                              </MenuItem>
                            </TextField>

                            {editCtx.spellMode === "save" && (
                              <TextField
                                select
                                label="Resistência do alvo"
                                size="small"
                                sx={{ flex: 1, minWidth: 160 }}
                                value={editCtx.saveAbility}
                                onChange={(e) =>
                                  setEditCtx((c) => ({
                                    ...c,
                                    saveAbility: e.target.value,
                                  }))
                                }
                              >
                                {abilityOptions.map((a) => (
                                  <MenuItem key={a} value={a}>
                                    {a}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          </Box>
                        )}

                        {!isSpell && (
                          <>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 700, mt: 1 }}
                            >
                              Propriedades da arma
                            </Typography>
                            <FormGroup
                              sx={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit,minmax(160px,1fr))",
                              }}
                            >
                              {[
                                ["agil", "Ágil"],
                                ["alcance", "Alcance"],
                                ["arremesso", "Arremesso"],
                                ["distancia", "Distância"],
                                ["duasMaos", "Duas Mãos"],
                                ["especial", "Especial"],
                                ["leve", "Leve"],
                                ["municao", "Munição"],
                                ["pesada", "Pesada"],
                                ["recarga", "Recarga"],
                                ["versatil", "Versátil"],
                                ["montaria", "Lança de Montaria"],
                                ["rede", "Rede"],
                              ].map(([key, label]) => (
                                <FormControlLabel
                                  key={key}
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={!!editCtx.props[key]}
                                      onChange={(e) =>
                                        setEditCtx((c) => ({
                                          ...c,
                                          props: {
                                            ...c.props,
                                            [key]: e.target.checked,
                                          },
                                        }))
                                      }
                                    />
                                  }
                                  label={label}
                                />
                              ))}
                            </FormGroup>
                          </>
                        )}
                      </>
                    );
                  })()}
                </>
              )}

              <TextField
                label="Notas / descrição"
                fullWidth
                size="small"
                multiline
                minRows={2}
                value={editCtx.notes}
                onChange={(e) =>
                  setEditCtx((c) => ({ ...c, notes: e.target.value }))
                }
              />
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={closeEdit}>Cancelar</Button>
          <Button variant="contained" onClick={saveEdit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FichaInventory;