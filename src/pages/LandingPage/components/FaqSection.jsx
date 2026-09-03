// src/pages/LandingPage/components/FaqSection.jsx
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "../LandingPage.module.css";

const FAQ_ITEMS = [
  {
    q: "O RPG Companion é realmente gratuito durante o Beta Aberto?",
    a: "Sim! Durante todo o período de Beta Aberto, todas as ferramentas essenciais — criação ilimitada de fichas D&D 5E, grimório, editor de mapas, rolagens 3D e diário de campanhas — estão 100% liberadas sem qualquer custo ou necessidade de cadastrar cartão."
  },
  {
    q: "Como funciona a mesa virtual (VTT) colaborativa em tempo real?",
    a: "O Mestre pode gerar um link seguro de sessão diretamente no editor do mapa. Os jogadores entram pelo navegador e veem instantaneamente o grid e seus tokens. A névoa de guerra esconde os monstros até que a visão do token revele a sala, tudo sincronizado em milissegundos via Firebase Realtime Database."
  },
  {
    q: "As fichas calculam automaticamente os atributos e regras de D&D 5E?",
    a: "Sim! O sistema aplica automaticamente bônus de proficiência, cálculo de CA com base em armaduras e escudos, modificadores de Força/Destreza em armas simples, marciais e ágeis (Finesse), CD de resistência de magias e limites de espaços de conjuração (spell slots)."
  },
  {
    q: "Posso exportar minha ficha para jogar presencialmente em mesa física?",
    a: "Com certeza! Criamos um exportador de alta resolução que converte sua ficha digital em um documento PDF no formato clássico de 2 páginas A4, pronto para impressão ou para salvar no seu tablet/computador."
  },
  {
    q: "Preciso baixar ou instalar algum aplicativo?",
    a: "Não. O RPG Companion roda diretamente no navegador (Chrome, Edge, Firefox, Safari), aproveitando aceleração de hardware Canvas para garantir 60 FPS fluidos mesmo em mapas de grande resolução."
  },
  {
    q: "Meus mapas, notas e personagens ficam salvos na nuvem?",
    a: "Sim. Todos os seus dados são criptografados e vinculados à sua conta no Firebase, garantindo que suas anotações, histórico de sessões e fichas estejam sempre seguros e disponíveis de qualquer dispositivo."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className={styles.faqContainer}>
      <div className={styles.sectionHeading}>
        <span className={styles.goldBadge}>
          <HelpOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />
          DÚVIDAS FREQUENTES
        </span>
        <h2>Perguntas & Respostas</h2>
        <p>Tudo o que você precisa saber antes de iniciar sua jornada.</p>
      </div>

      <div className={styles.faqList}>
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqQuestion}
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                {isOpen ? (
                  <ExpandLessIcon sx={{ color: "#ffd700" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#8b949e" }} />
                )}
              </button>
              {isOpen && <div className={styles.faqAnswer}>{item.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
