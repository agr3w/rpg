// Função para calcular a riqueza inicial com base na classe selecionada
function calcularRiquezaInicialPorClasse(classeSelecionada) {
    switch (classeSelecionada) {
      case "Bárbaro":
        return `${rolarDados(2, 4) * 10} PO`;
      case "Bardo":
        return `${rolarDados(5, 4) * 10} PO`;
      case "Bruxo":
        return `${rolarDados(4, 4) * 10} PO`;
      case "Clérigo":
        return `${rolarDados(5, 4) * 10} PO`;
      case "Druida":
        return `${rolarDados(2, 4) * 10} PO`;
      case "Feiticeiro":
        return `${rolarDados(3, 4) * 10} PO`;
      case "Guerreiro":
        return `${rolarDados(5, 4) * 10} PO`;
      case "Ladino":
        return `${rolarDados(4, 4) * 10} PO`;
      case "Mago":
        return `${rolarDados(4, 4) * 10} PO`;
      case "Monge":
        return `${rolarDados(5, 4)} PO`;
      case "Paladino":
        return `${rolarDados(5, 4) * 10} PO`;
      case "Patrulheiro":
        return `${rolarDados(5, 4) * 10} PO`;
      default:
        return "Classe não reconhecida";
    }
  }
  
  // Função para rolar dados com uma quantidade e lados especificados
  function rolarDados(quantidade, lados) {
    let resultado = 0;
    for (let i = 0; i < quantidade; i++) {
      resultado += Math.floor(Math.random() * lados) + 1;
    }
    return resultado;
  }
  
  export { calcularRiquezaInicialPorClasse };
  