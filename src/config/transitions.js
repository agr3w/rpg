// Tempos padrão de transição (segundos)
// Ajuste aqui e o app inteiro acompanha.
export const T_IN = 2.95;  // tempo para "revelar" a nova página
export const T_OUT = 0.75; // tempo para "cobrir" na saída

// (opcional) helpers prontos p/ framer-motion
export const PAGE_TRANSITION = {
  type: "tween",
  ease: "easeInOut",
};