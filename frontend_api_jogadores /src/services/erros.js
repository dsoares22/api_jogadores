export function mensagemErroApi(erro, padrao) {
  if (erro.response?.status === 404)
    return "Jogador não encontrado. Ele pode ter sido removido.";
  if (erro.response?.status === 400) {
    const detalhe = erro.response.data?.message;
    return typeof detalhe === "string" && detalhe.trim()
      ? `Dados inválidos: ${detalhe}`
      : "Dados inválidos. Confira os campos obrigatórios, os números e o número da camisa (1 a 99).";
  }
  if (!erro.response)
    return "Não foi possível conectar à API. Verifique se o backend está em execução.";
  return padrao;
}
