import React from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import LayoutFicha from "components/FichaLayout/LayoutFicha";
import { armas } from "Array/Armas";

// Estilo reutilizável
const dndBoxStyle = {
  p: 2.5,
  borderRadius: 2,
  bgcolor: "rgba(243, 235, 214, 0.5)",
  border: "1px solid rgba(92, 64, 51, 0.2)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
};

// Sub-componente simplificado: recebe filtros diretos
const WeaponSubSelector = ({ filtros, slotKey, subSelecaoArmas, setSubSelecaoArmas }) => {
  if (!filtros) return null;

  // Filtra as opções baseado no objeto de filtros
  const opcoesFiltradas = armas.filter((arma) => {
    if (filtros.tipo && arma.tipo !== filtros.tipo) return false;
    if (filtros.alcance && arma.alcance !== filtros.alcance) return false;
    return true;
  });

  if (opcoesFiltradas.length === 0) return null;

  const handleChange = (key, value) => {
    setSubSelecaoArmas(prev => ({ ...prev, [key]: value }));
  };

  const quantidade = filtros.quantidade || 1;
  const isDuas = quantidade > 1;

  return (
    <Box sx={{ mt: 1, ml: 2, p: 1, borderLeft: "2px solid #bf8f00", bgcolor: "rgba(0,0,0,0.2)" }}>
      <Typography variant="caption" color="secondary" sx={{ mb: 1, display: "block" }}>
        Especifique sua escolha:
      </Typography>
      
      <Grid container spacing={1}>
        <Grid item xs={isDuas ? 6 : 12}>
          <FormControl fullWidth size="small">
            <InputLabel>Arma {isDuas ? "1" : ""}</InputLabel>
            <Select
              value={subSelecaoArmas[isDuas ? `${slotKey}_a` : slotKey] || ""}
              label={`Arma ${isDuas ? "1" : ""}`}
              onChange={(e) => handleChange(isDuas ? `${slotKey}_a` : slotKey, e.target.value)}
            >
              {opcoesFiltradas.map((arma) => (
                <MenuItem key={arma.nome} value={arma.nome}>
                  {arma.nome} <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>({arma.dano})</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {isDuas && (
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Arma 2</InputLabel>
              <Select
                value={subSelecaoArmas[`${slotKey}_b`] || ""}
                label="Arma 2"
                onChange={(e) => handleChange(`${slotKey}_b`, e.target.value)}
              >
                {opcoesFiltradas.map((arma) => (
                  <MenuItem key={arma.nome} value={arma.nome}>
                    {arma.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const Etapa4 = ({
  classe,
  setClasse,
  classesOptions,
  itensDaClasse,
  equipamentosClasseSelecionada1,
  setEquipamentoClasseSelecionado1,
  equipamentosClasseSelecionada2,
  setEquipamentoClasseSelecionado2,
  equipamentosClasseSelecionada3,
  setEquipamentoClasseSelecionado3,
  equipamentosClasseSelecionada4,
  setEquipamentoClasseSelecionado4,
  classeSelecioanda,
  periciasClasseSelecionadas,
  setPericiasSelecionadas,
  setExibirPainelHabilidades,
  exibirPainelHabilidades,
  subSelecaoArmas,
  setSubSelecaoArmas
}) => {
  const handleTogglePainelHabilidades = () => {
    setExibirPainelHabilidades(!exibirPainelHabilidades);
  };

  const handleCheckboxChange = (e) => {
    const periciaSelecionada = e.target.value;
    if (periciasClasseSelecionadas.includes(periciaSelecionada)) {
      setPericiasSelecionadas((prevPericias) =>
        prevPericias.filter((pericia) => pericia !== periciaSelecionada)
      );
    } else if (
      periciasClasseSelecionadas.length <
      classeSelecioanda?.proficiencias?.perficiasMinimo
    ) {
      setPericiasSelecionadas((prevPericias) => [
        ...prevPericias,
        periciaSelecionada,
      ]);
    }
  };

  // Renderizador de Select de Equipamento
  const renderEquipSelect = (label, value, setValue, options, slotKey) => {
    if (!options || options.length === 0) return null;

    // Encontra o objeto selecionado atualmente para saber se tem sub-seleção
    const selectedOptionObj = options.find(opt => opt.label === value);

    return (
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>{label}</InputLabel>
          <Select
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              // Limpa sub-seleção ao trocar a opção principal
              setSubSelecaoArmas(prev => {
                const novo = { ...prev };
                delete novo[slotKey];
                delete novo[`${slotKey}_a`];
                delete novo[`${slotKey}_b`];
                return novo;
              });
            }}
            label={label}
          >
            <MenuItem value=""><em>Selecione</em></MenuItem>
            {options.map((opt, index) => (
              <MenuItem key={index} value={opt.label} sx={{ whiteSpace: "normal" }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Passa os filtros diretamente do objeto selecionado */}
        <WeaponSubSelector 
          filtros={selectedOptionObj?.subSelecao} 
          slotKey={slotKey} 
          subSelecaoArmas={subSelecaoArmas} 
          setSubSelecaoArmas={setSubSelecaoArmas} 
        />
      </Box>
    );
  };

  return (
    <LayoutFicha title="Selecione sua Classe">
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: "Cinzel" }}>Classe</InputLabel>
          <Select
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            label="Classe"
            sx={{
              fontWeight: 700,
              color: "#2c1a10",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(92, 64, 51, 0.3)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#833c0b" },
            }}
          >
            <MenuItem value="">
              <em>Selecione uma classe</em>
            </MenuItem>
            {classesOptions.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Itens da Classe (Inventário Inicial) */}
        <Paper elevation={0} sx={{ ...dndBoxStyle, maxHeight: 220, overflow: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: "#58180D", fontFamily: "Cinzel" }}>
            Equipamento Inicial & Características:
          </Typography>
          <List dense disablePadding>
            {itensDaClasse?.map((item, i) => (
              <ListItem key={i} sx={{ py: 0.5, px: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 24, mt: 0.8 }}>
                  <CircleIcon sx={{ fontSize: 6, color: "#833c0b" }} />
                </ListItemIcon>
                <ListItemText 
                  primary={item} 
                  primaryTypographyProps={{ variant: "body2", style: { color: "#3d2b1f" } }} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Botão e Painel de Habilidades */}
        <Box>
          <Button 
            variant="outlined" 
            onClick={handleTogglePainelHabilidades}
            fullWidth
            sx={{
              borderColor: "#833c0b",
              color: "#58180D",
              fontWeight: 700,
              fontFamily: "Cinzel",
              "&:hover": { bgcolor: "rgba(131, 60, 11, 0.08)", borderColor: "#58180D" }
            }}
          >
            {exibirPainelHabilidades ? "Fechar Grimório de Habilidades" : "Ler Habilidades da Classe"}
          </Button>

          <Collapse in={exibirPainelHabilidades} sx={{ mt: 2 }}>
            <Paper sx={{ ...dndBoxStyle, bgcolor: "#fffbf0" }}>
              <Typography variant="h6" sx={{ fontFamily: "Cinzel", color: "#833c0b", mb: 1 }}>
                Habilidades de Nível 1
              </Typography>
              <Divider sx={{ my: 1, borderColor: "rgba(92, 64, 51, 0.2)" }} />
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#2c1a10", mb: 2 }}>
                {classeSelecioanda?.habilidadesClasse?.habilidadeNv1}
              </Typography>
              {classeSelecioanda?.habilidadesClasse?.habilidadeNv2 && (
                <>
                  <Divider sx={{ my: 1, borderColor: "rgba(92, 64, 51, 0.2)" }} />
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "#2c1a10" }}>
                    {classeSelecioanda?.habilidadesClasse?.habilidadeNv2}
                  </Typography>
                </>
              )}
            </Paper>
          </Collapse>
        </Box>

        {/* Proficiências */}
        <Paper elevation={0} sx={dndBoxStyle}>
          <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 700, color: "#58180D" }}>
            Proficiências
          </Typography>
          <Box sx={{ mt: 1.5, display: "grid", gap: 1 }}>
            {[
              { label: "Armaduras", val: classeSelecioanda?.proficiencias?.armaduras },
              { label: "Armas", val: classeSelecioanda?.proficiencias?.armas },
              { label: "Ferramentas", val: classeSelecioanda?.proficiencias?.ferramentas },
              { label: "Testes de Resistência", val: classeSelecioanda?.proficiencias?.testesDeResistecia },
            ].map((p, idx) => (
               <Typography key={idx} variant="body2" sx={{ color: "#3d2b1f" }}>
                 <Box component="span" sx={{ fontWeight: 700, color: "#833c0b" }}>{p.label}:</Box> {p.val}
               </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(92, 64, 51, 0.2)" }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2c1a10" }}>
            Perícias — Escolha {classeSelecioanda?.proficiencias?.perficiasMinimo}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5, mt: 1 }}>
            {classeSelecioanda?.proficiencias?.periciasSelecao?.map((pericia) => (
              <FormControlLabel
                key={pericia}
                control={
                  <Checkbox
                    size="small"
                    value={pericia}
                    checked={periciasClasseSelecionadas.includes(pericia)}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: "rgba(92, 64, 51, 0.5)",
                      "&.Mui-checked": { color: "#833c0b" },
                    }}
                    disabled={
                      periciasClasseSelecionadas.length ===
                        classeSelecioanda?.proficiencias?.perficiasMinimo &&
                      !periciasClasseSelecionadas.includes(pericia)
                    }
                  />
                }
                label={<Typography variant="body2" sx={{ color: "#3d2b1f" }}>{pericia}</Typography>}
              />
            ))}
          </Box>
        </Paper>

        {/* Equipamentos */}
        <Paper elevation={0} sx={dndBoxStyle}>
          <Typography variant="subtitle1" sx={{ fontFamily: "Cinzel", fontWeight: 700, color: "#58180D", mb: 1 }}>
            Equipamentos
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "#3d2b1f", fontStyle: "italic" }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Obrigatório:</Box> {classeSelecioanda?.equipamentos?.equipamentoObgt}
          </Typography>

          <Stack spacing={2}>
            {[
              { val: equipamentosClasseSelecionada1, set: setEquipamentoClasseSelecionado1, opts: classeSelecioanda?.equipamentos?.equipamentoAlpha1, label: "Opção 1", slotKey: "slot1" },
              { val: equipamentosClasseSelecionada2, set: setEquipamentoClasseSelecionado2, opts: classeSelecioanda?.equipamentos?.equipamentoAlpha2, label: "Opção 2", slotKey: "slot2" },
              { val: equipamentosClasseSelecionada3, set: setEquipamentoClasseSelecionado3, opts: classeSelecioanda?.equipamentos?.equipamentoAlpha3, label: "Opção 3", slotKey: "slot3" },
              { val: equipamentosClasseSelecionada4, set: setEquipamentoClasseSelecionado4, opts: classeSelecioanda?.equipamentos?.equipamentoAlpha4, label: "Opção 4", slotKey: "slot4" },
            ].map((field, idx) => (
              renderEquipSelect(field.label, field.val, field.set, field.opts, field.slotKey)
            ))}
          </Stack>
        </Paper>
      </Stack>
    </LayoutFicha>
  );
};

export default Etapa4;
