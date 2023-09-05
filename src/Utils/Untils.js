export function encontrarItensPorNome(nomeItem, array) {
  const itensEncontrados = array.reduce((itens, item) => {
    const habilidades = item.habilidades || [];
    const dadosDeVida = item.dadosDeVida || [];
    const descricao = item.descricao || [];
    const todosItens = habilidades.concat(dadosDeVida, descricao);

    if (item.nome === nomeItem) {
      itens.push(...todosItens);
    }

    return itens;
  }, []);

  return itensEncontrados;
}
