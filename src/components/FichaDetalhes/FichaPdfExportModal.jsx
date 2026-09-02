// src/components/FichaDetalhes/FichaPdfExportModal.jsx
import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Stack
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./FichaPdfExportModal.module.css";

const SKILL_GROUPS = [
  { ability: "Força", skills: [{ id: "Atletismo", label: "Atletismo" }] },
  {
    ability: "Destreza",
    skills: [
      { id: "Acrobacia", label: "Acrobacia" },
      { id: "Furtividade", label: "Furtividade" },
      { id: "Prestidigitação", label: "Prestidigitação" },
    ],
  },
  { ability: "Constituição", skills: [] },
  {
    ability: "Inteligência",
    skills: [
      { id: "Arcanismo", label: "Arcanismo" },
      { id: "História", label: "História" },
      { id: "Investigação", label: "Investigação" },
      { id: "Natureza", label: "Natureza" },
      { id: "Religião", label: "Religião" },
    ],
  },
  {
    ability: "Sabedoria",
    skills: [
      { id: "Intuição", label: "Intuição" },
      { id: "Lidar com Animais", label: "Lidar com animais" },
      { id: "Medicina", label: "Medicina" },
      { id: "Percepção", label: "Percepção" },
      { id: "Sobrevivência", label: "Sobrevivência" },
    ],
  },
  {
    ability: "Carisma",
    skills: [
      { id: "Atuação", label: "Atuação" },
      { id: "Enganação", label: "Enganação" },
      { id: "Intimidação", label: "Intimidação" },
      { id: "Persuasão", label: "Persuasão" },
    ],
  },
];

const safeStr = (val, fallback = "—") => {
  if (val === null || val === undefined || val === "") return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.antecedente) return String(val.antecedente);
    if (val.nome) return String(val.nome);
    if (val.name) return String(val.name);
    if (val.label) return String(val.label);
    if (val.raca) return String(val.raca);
    if (val.classe) return String(val.classe);
    return fallback;
  }
  return String(val);
};

export default function FichaPdfExportModal({
  open,
  onClose,
  ficha = {},
  fichaBase = {},
  atributosComBonus = {},
  abilityMods = {},
  profBonus = 2,
  fichaEstado = {},
  periciasAtivas = [],
  savingThrowsAtivos = [],
  passivePerception = 10,
  spellAttr = "Inteligência",
}) {
  const [exporting, setExporting] = useState(false);
  const printContainerRef = useRef(null);

  const formatMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

  const handleDownloadPdf = async () => {
    if (!printContainerRef.current) return;
    setExporting(true);

    try {
      const page1El = printContainerRef.current.querySelector("#dnd-sheet-page-1");
      const page2El = printContainerRef.current.querySelector("#dnd-sheet-page-2");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;

      if (page1El) {
        const canvas1 = await html2canvas(page1El, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData1 = canvas1.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData1, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      if (page2El) {
        pdf.addPage();
        const canvas2 = await html2canvas(page2El, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData2 = canvas2.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData2, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      const safeName = safeStr(fichaBase.nome || ficha.nome, "Personagem").replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(`Ficha_${safeName}_DND5E.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Extração segura de strings
  const nome = safeStr(fichaBase.nome || ficha.nome, "—");
  const classe = safeStr(fichaBase.classe || ficha.classe, "—");
  const raca = safeStr(fichaBase.raca || ficha.raca, "—");
  const subRaca = safeStr(fichaBase.subRaca || ficha.subRaca, "");
  const subClasse = safeStr(fichaBase.subClasse || ficha.subClasse, "");
  const antecedente = safeStr(fichaBase.antecedente || ficha.antecedenteDetalhes || ficha.antecedente, "—");
  const nivel = fichaEstado.level || ficha.level || 1;
  const xp = fichaEstado.xp || ficha.xp || 0;

  const ca = fichaEstado.ca || ficha.ca || 10;
  const hpAtual = fichaEstado.hp?.atual ?? ficha.hp?.atual ?? 10;
  const hpMax = fichaEstado.hp?.max ?? ficha.hp?.max ?? 10;
  const hpTemp = fichaEstado.hp?.temp ?? ficha.hp?.temp ?? 0;
  const deslocamento = safeStr(ficha.deslocamento, "9m (30ft)");
  const tamanho = safeStr(ficha.tamanho, "Médio");
  const hitDie = ficha.hitDie || 8;

  // Armas / Arsenal conforme Regras D&D 5E
  const weapons = Object.values(ficha.inventory?.equipped || {})
    .filter((item) => item && (item.kind === "weapon" || item.damageDice || item.dano))
    .map((item) => {
      let stat = item.attackStat || "Força";
      const forMod = Number(abilityMods["Força"] || 0);
      const desMod = Number(abilityMods["Destreza"] || 0);
      if (item.props?.agil) stat = desMod >= forMod ? "Destreza" : "Força";
      else if (item.category === "ranged") stat = "Destreza";

      const mod = Number(abilityMods[stat] || 0);
      const prof = item.proficiente === false ? 0 : profBonus;
      const extra = Number(item.attackBonus || 0);
      const attackBonus = mod + prof + extra;
      const damageBonus = mod + extra;
      const damageDice = item.damageDice || item.dano || "1d6";
      const damageFormula = `${damageDice}${damageBonus !== 0 ? (damageBonus > 0 ? `+${damageBonus}` : `${damageBonus}`) : ""}`;

      return {
        ...item,
        name: safeStr(item.name || item.nome, "Arma"),
        attackBonus,
        damageBonus,
        damageFormula,
        damageType: safeStr(item.damageType || item.tipo, "Dano"),
      };
    });

  // Magias
  const spells = Object.values(ficha.spellcasting?.spells || {});
  const spellMod = Number(abilityMods[spellAttr] || 0);
  const spellDc = 8 + profBonus + spellMod;
  const spellAttackBonus = profBonus + spellMod;

  // Moedas
  const moedas = ficha.riquezaMoedas || { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
  const antObj = (typeof ficha.antecedenteDetalhes === "object" ? ficha.antecedenteDetalhes : null) ||
                 (typeof ficha.antecedente === "object" ? ficha.antecedente : null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper">
      <DialogTitle sx={{ bgcolor: "#111520", color: "#f1c40f", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.25)" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PictureAsPdfIcon sx={{ color: "#ffd700" }} />
          <Typography variant="h6" sx={{ fontFamily: "Cinzel", fontWeight: 700 }}>
            EXPORTAR FICHA D&D 5E (PDF / IMPRESSÃO)
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: "#888", "&:hover": { color: "#fff" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#0d0f17", p: { xs: 1, md: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Typography variant="caption" sx={{ color: "#8b949e", textAlign: "center" }}>
            Visualização formatada no padrão clássico D&D 5ª Edição (2 Páginas A4 prontas para download ou impressão).
          </Typography>
        </Box>

        {/* CONTAINER IMPRESSÃO / CAPTURA */}
        <div ref={printContainerRef} className={styles.printWrapper}>
          
          {/* ================= PÁGINA 1 ================= */}
          <div id="dnd-sheet-page-1" className={styles.a4Page}>
            {/* CABEÇALHO */}
            <div className={styles.sheetHeader}>
              <div className={styles.headerNameBox}>
                <span className={styles.fieldLabel}>NOME DO PERSONAGEM</span>
                <span className={styles.fieldValueBig}>{nome}</span>
              </div>
              <div className={styles.headerInfoGrid}>
                <div className={styles.infoCell}>
                  <span className={styles.fieldLabel}>CLASSE & NÍVEL</span>
                  <span className={styles.fieldValue}>{classe} {nivel}</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.fieldLabel}>ANTECEDENTE</span>
                  <span className={styles.fieldValue}>{antecedente}</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.fieldLabel}>ESPÉCIE / RAÇA</span>
                  <span className={styles.fieldValue}>{raca} {subRaca && `(${subRaca})`}</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.fieldLabel}>SUBCLASSE</span>
                  <span className={styles.fieldValue}>{subClasse || "—"}</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.fieldLabel}>EXPERIÊNCIA (XP)</span>
                  <span className={styles.fieldValue}>{xp} XP</span>
                </div>
                <div className={styles.infoCell}>
                  <span className={styles.fieldLabel}>BÔNUS DE PROFICIÊNCIA</span>
                  <span className={styles.fieldValue}>+{profBonus}</span>
                </div>
              </div>
            </div>

            {/* FAIXA COMBATE RÁPIDO */}
            <div className={styles.combatTopBar}>
              <div className={styles.combatBox}>
                <span className={styles.combatLabel}>CLASSE DE ARMADURA</span>
                <span className={styles.combatValue}>{ca}</span>
                <span className={styles.combatSub}>ESCUDO {ficha.caState?.usaEscudo ? "[X]" : "[ ]"}</span>
              </div>
              <div className={styles.combatBoxWide}>
                <span className={styles.combatLabel}>PONTOS DE VIDA (PV)</span>
                <div className={styles.hpNumbers}>
                  <span>ATUAL: <strong>{hpAtual}</strong></span>
                  <span>MÁX: <strong>{hpMax}</strong></span>
                  <span>TEMP: <strong>{hpTemp}</strong></span>
                </div>
              </div>
              <div className={styles.combatBox}>
                <span className={styles.combatLabel}>INICIATIVA</span>
                <span className={styles.combatValue}>{formatMod(abilityMods.Destreza || 0)}</span>
              </div>
              <div className={styles.combatBox}>
                <span className={styles.combatLabel}>DESLOCAMENTO</span>
                <span className={styles.combatValue}>{deslocamento}</span>
              </div>
              <div className={styles.combatBox}>
                <span className={styles.combatLabel}>DADOS DE VIDA</span>
                <span className={styles.combatValue}>1d{hitDie}</span>
              </div>
              <div className={styles.combatBox}>
                <span className={styles.combatLabel}>PERCEPÇÃO PASSIVA</span>
                <span className={styles.combatValue}>{passivePerception}</span>
              </div>
            </div>

            {/* CORPO DE 3 COLUNAS */}
            <div className={styles.page1Body}>
              {/* COLUNA 1: ATRIBUTOS & SALVAGUARDAS */}
              <div className={styles.col1}>
                {["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"].map((attr) => {
                  const val = atributosComBonus[attr] || 0;
                  const mod = abilityMods[attr] || 0;
                  const isSaveProf = savingThrowsAtivos.includes(attr);
                  const saveMod = mod + (isSaveProf ? profBonus : 0);
                  const group = SKILL_GROUPS.find((g) => g.ability === attr);

                  return (
                    <div key={attr} className={styles.attrBlock}>
                      <div className={styles.attrScoreBox}>
                        <span className={styles.attrName}>{attr.toUpperCase()}</span>
                        <span className={styles.attrMod}>{formatMod(mod)}</span>
                        <span className={styles.attrVal}>VALOR {val}</span>
                      </div>

                      <div className={styles.skillsBox}>
                        <div className={styles.saveRow}>
                          <span className={styles.checkSquare}>{isSaveProf ? "■" : "□"}</span>
                          <span className={styles.saveLabel}>Salvaguarda</span>
                          <span className={styles.skillModText}>{formatMod(saveMod)}</span>
                        </div>

                        {group?.skills.map((sk) => {
                          const isProf = periciasAtivas.includes(sk.id);
                          const skMod = mod + (isProf ? profBonus : 0);
                          return (
                            <div key={sk.id} className={styles.skillRow}>
                              <span className={styles.checkSquare}>{isProf ? "■" : "□"}</span>
                              <span className={styles.skillLabel}>{sk.label}</span>
                              <span className={styles.skillModText}>{formatMod(skMod)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* COLUNA 2: ATAQUES & ARSENAL */}
              <div className={styles.col2}>
                <div className={styles.sectionHeader}>ARMAS & ATAQUES DE COMBATE</div>
                <table className={styles.weaponsTable}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Bônus Atq</th>
                      <th>Dano & Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weapons.length > 0 ? (
                      weapons.map((w, idx) => (
                        <tr key={idx}>
                          <td><strong>{w.name}</strong></td>
                          <td>{formatMod(w.attackBonus)}</td>
                          <td>{w.damageFormula} {w.damageType ? `(${w.damageType})` : ""}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className={styles.emptyTable}>Nenhuma arma cadastrada</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className={styles.sectionHeader} style={{ marginTop: 12 }}>TREINAMENTOS & PROFICIÊNCIAS</div>
                <div className={styles.trainingBox}>
                  <strong>Armaduras:</strong> {ficha.treinamentos?.armaduraLeve ? "Leve, " : ""}{ficha.treinamentos?.armaduraMedia ? "Média, " : ""}{ficha.treinamentos?.armaduraPesada ? "Pesada, " : ""}{ficha.treinamentos?.escudos ? "Escudos" : "Sem armadura"}<br />
                  <strong>Armas:</strong> {safeStr(ficha.treinamentos?.armas, "Armas simples e marciais da classe")}<br />
                  <strong>Ferramentas:</strong> {safeStr(ficha.treinamentos?.ferramentas, "Nenhuma")}
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: 12 }}>TRAÇOS DE ESPÉCIE & TALENTOS</div>
                <div className={styles.traitsBox}>
                  {Array.isArray(ficha.habilidadesRaca) && ficha.habilidadesRaca.length > 0 ? (
                    ficha.habilidadesRaca.map((h, i) => (
                      <div key={i}>• {typeof h === "object" ? safeStr(h.nome || h.name, "Habilidade") : String(h)}</div>
                    ))
                  ) : (
                    <div>• Traços raciais de {raca}</div>
                  )}
                </div>
              </div>

              {/* COLUNA 3: CARACTERÍSTICAS DE CLASSE */}
              <div className={styles.col3}>
                <div className={styles.sectionHeader}>CARACTERÍSTICAS DE CLASSE</div>
                <div className={styles.featuresBox}>
                  {Array.isArray(ficha.habilidadesClasseCustom) && ficha.habilidadesClasseCustom.length > 0 ? (
                    ficha.habilidadesClasseCustom.map((h, i) => (
                      <div key={i} className={styles.featureItem}>
                        <strong>{safeStr(h.name, "Habilidade")} (Nvl {h.level || 1}):</strong>
                        <span> {safeStr(h.description, "")}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyTable}>Habilidades padrão de {classe} (Nvl {nivel})</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================= PÁGINA 2 ================= */}
          <div id="dnd-sheet-page-2" className={styles.a4Page}>
            {/* CABEÇALHO GRIMÓRIO */}
            <div className={styles.page2Header}>
              <div className={styles.spellHeaderBox}>
                <span className={styles.fieldLabel}>ATRIBUTO DE CONJURAÇÃO</span>
                <span className={styles.fieldValueBig}>{safeStr(spellAttr, "INTELIGÊNCIA").toUpperCase()}</span>
              </div>
              <div className={styles.spellStatBox}>
                <span className={styles.fieldLabel}>MODIFICADOR</span>
                <span className={styles.fieldValue}>{formatMod(spellMod)}</span>
              </div>
              <div className={styles.spellStatBox}>
                <span className={styles.fieldLabel}>CD DE RESISTÊNCIA</span>
                <span className={styles.fieldValue}>{spellDc}</span>
              </div>
              <div className={styles.spellStatBox}>
                <span className={styles.fieldLabel}>BÔNUS DE ATAQUE</span>
                <span className={styles.fieldValue}>+{spellAttackBonus}</span>
              </div>
            </div>

            <div className={styles.page2Body}>
              {/* COLUNA ESQUERDA: MAGIAS PREPARADAS */}
              <div className={styles.page2ColLeft}>
                <div className={styles.sectionHeader}>GRIMÓRIO DE MAGIAS & TRUQUES</div>
                <table className={styles.spellsTable}>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>Círc.</th>
                      <th>Nome da Magia</th>
                      <th>Tempo / Alcance</th>
                      <th>Efeito / Dano</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spells.length > 0 ? (
                      spells.map((s, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: "center" }}>{s.circle === 0 ? "0" : `${s.circle}º`}</td>
                          <td><strong>{safeStr(s.name, "Magia")}</strong></td>
                          <td>{safeStr(s.castingTime, "1 Ação")} • {safeStr(s.range, "18m")}</td>
                          <td>{safeStr(s.damage || s.formula, "—")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className={styles.emptyTable}>Nenhuma magia cadastrada no grimório</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* COLUNA DIREITA: HISTÓRIA, MOEDAS, INVENTÁRIO */}
              <div className={styles.page2ColRight}>
                <div className={styles.sectionHeader}>MOEDAS & RIQUEZA</div>
                <div className={styles.coinsGrid}>
                  <div className={styles.coinCell}><span>PC</span><strong>{moedas.pc || 0}</strong></div>
                  <div className={styles.coinCell}><span>PP</span><strong>{moedas.pp || 0}</strong></div>
                  <div className={styles.coinCell}><span>PE</span><strong>{moedas.pe || 0}</strong></div>
                  <div className={styles.coinCell}><span>PO</span><strong>{moedas.po || 0}</strong></div>
                  <div className={styles.coinCell}><span>PL</span><strong>{moedas.pl || 0}</strong></div>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: 10 }}>EQUIPAMENTO & MOCHILA</div>
                <div className={styles.inventoryBox}>
                  {Object.values(ficha.inventory?.backpack || {}).length > 0 ? (
                    Object.values(ficha.inventory.backpack).map((item, i) => (
                      <div key={i}>• {safeStr(item.name || item.nome, "Item")} (Qtd: {item.qty || 1})</div>
                    ))
                  ) : (
                    <div>• Itens padrão de aventureiro</div>
                  )}
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: 10 }}>HISTÓRIA & PERSONALIDADE</div>
                <div className={styles.storyBox}>
                  {typeof ficha.historia === "string" && ficha.historia.trim() && (
                    <div style={{ marginBottom: 6 }}>
                      {ficha.historia}
                    </div>
                  )}
                  {antObj && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: "0.64rem", color: "#333" }}>
                      {antObj.tracoPersonalidade && <div><strong>Traço:</strong> {String(antObj.tracoPersonalidade)}</div>}
                      {antObj.ideal && <div><strong>Ideal:</strong> {String(antObj.ideal)}</div>}
                      {antObj.vinculo && <div><strong>Vínculo:</strong> {String(antObj.vinculo)}</div>}
                      {antObj.defeito && <div><strong>Defeito:</strong> {String(antObj.defeito)}</div>}
                    </div>
                  )}
                  {!ficha.historia && !antObj && <div>História e trajetória de {nome}</div>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>

      <DialogActions sx={{ bgcolor: "#111520", p: 2, borderTop: "1px solid rgba(212,175,55,0.25)", justifyContent: "space-between" }}>
        <Button onClick={onClose} sx={{ color: "#8b949e" }}>
          Fechar
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={handlePrint}
            startIcon={<PrintIcon />}
            sx={{ borderColor: "rgba(212,175,55,0.4)", color: "#ffd700" }}
          >
            Imprimir
          </Button>
          <Button
            variant="contained"
            onClick={handleDownloadPdf}
            disabled={exporting}
            startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon />}
            sx={{ bgcolor: "#bf8f00", color: "#000", fontWeight: "bold", "&:hover": { bgcolor: "#d4af37" } }}
          >
            {exporting ? "Gerando PDF..." : "Baixar PDF (2 Páginas A4)"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
