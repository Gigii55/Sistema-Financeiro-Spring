import { converterData } from './formatadores';
 
function somarPorMes(transacoes, tipo, mes, ano) {
  return transacoes
    .filter((transacao) => {
      const data = converterData(transacao.data);
      return (
        transacao.tipo === tipo &&
        data.getMonth() === mes &&
        data.getFullYear() === ano
      );
    })
    .reduce((total, transacao) => total + Number(transacao.valor), 0);
}
 
function gerarUltimosMeses(hoje) {
  return Array.from({ length: 6 }, (_, indice) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - indice), 1);
    return {
      mes: data.getMonth(),
      ano: data.getFullYear(),
      nome: data
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', '')
        .replace(/^./, (letra) => letra.toUpperCase())
    };
  });
}
 
export function calcularResumo(transacoes, hoje = new Date()) {
  const transacoesDoMes = transacoes.filter((transacao) => {
    const data = converterData(transacao.data);
    return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
  });
 
  const totalReceitas = transacoesDoMes
    .filter((transacao) => transacao.tipo === 'RECEITA')
    .reduce((total, transacao) => total + Number(transacao.valor), 0);
 
  const totalDespesas = transacoesDoMes
    .filter((transacao) => transacao.tipo === 'DESPESA')
    .reduce((total, transacao) => total + Number(transacao.valor), 0);
 
  const saldo = transacoes.reduce((total, transacao) => {
    if (transacao.tipo === 'RECEITA') {
      return total + Number(transacao.valor);
    }
    return total - Number(transacao.valor);
  }, 0);
 
  const resultado = totalReceitas - totalDespesas;
  const percentual = totalReceitas > 0 ? Math.round((totalDespesas / totalReceitas) * 100) : 0;
  const percentualGrafico = Math.min(percentual, 100);
 
  const meses = gerarUltimosMeses(hoje);
 
  const dadosGrafico = {
    labels: meses.map((item) => item.nome),
    datasets: [
      {
        label: 'Receitas',
        data: meses.map((item) => somarPorMes(transacoes, 'RECEITA', item.mes, item.ano)),
        backgroundColor: '#44aa8b',
        borderColor: '#237f63',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Despesas',
        data: meses.map((item) => somarPorMes(transacoes, 'DESPESA', item.mes, item.ano)),
        backgroundColor: '#c44c4c',
        borderColor: '#af3838',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };
 
  const ultimasTransacoes = [...transacoes]
    .sort((a, b) => converterData(b.data) - converterData(a.data))
    .slice(0, 5);
 
  return {
    totalReceitas,
    totalDespesas,
    saldo,
    resultado,
    percentual,
    percentualGrafico,
    dadosGrafico,
    ultimasTransacoes
  };
}
 