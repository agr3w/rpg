import { Button } from "@mui/material";
import { calcularRiquezaInicialPorClasse } from "Utils/DiceRoller";
import React, { useState } from "react";
import styles from "pages/FichaPage/fichaPage.module.css"

function Etapa9 ({
  classeSelecionada,
  onRiquezaInicialCalculada,
  riquezaInicial,
  setRiquezaInicial,
}) {
  const [botaoPressionado, setBotaoPressionado] = useState(false);

  // Função para calcular a riqueza inicial com base na classe selecionada
  const calcularRiquezaInicial = () => {
    if (!botaoPressionado) {
      // Aqui você pode usar a função calcularRiquezaInicialPorClasse que criamos anteriormente
      const riqueza = calcularRiquezaInicialPorClasse(classeSelecionada);
      setRiquezaInicial(riqueza);

      // Chamamos a função onRiquezaInicialCalculada passando a riqueza calculada
      onRiquezaInicialCalculada(riqueza);

      // Defina o botão como pressionado
      setBotaoPressionado(true);
    }
    // Aqui você pode usar a função calcularRiquezaInicialPorClasse que criamos anteriormente
    const riqueza = calcularRiquezaInicialPorClasse(classeSelecionada);
    setRiquezaInicial(riqueza);

    // Chamamos a função onRiquezaInicialCalculada passando a riqueza calculada
    onRiquezaInicialCalculada(riqueza);
  };

  return (
    <div className={styles.div}>
      <h3 className={styles.h2Habilidades }>Riqueza Inicial</h3>
      <p className={styles.espacamentoTextoItem}>{riquezaInicial} peças de ouro (PO)</p>
      <Button
        variant="contained"
        onClick={calcularRiquezaInicial}
        disabled={botaoPressionado}
      >
        Calcular Riqueza
      </Button>
    </div>
  );
}

export default Etapa9;
