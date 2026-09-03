export function converterData(data) {
  return new Date(`${data}T00:00:00`);
}

export function formatarData(data) {
  return converterData(data).toLocaleDateString('pt-BR');
}

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}