export function alternarVisibilidadeSenha(valorAtual) {
  return !valorAtual;
}

export function definirTipoSenha(mostrarSenha) {
  return mostrarSenha ? 'text' : 'password';
}

export function definirTextoBotao(mostrarSenha) {
  return mostrarSenha ? 'Ocultar' : 'Mostrar';
}