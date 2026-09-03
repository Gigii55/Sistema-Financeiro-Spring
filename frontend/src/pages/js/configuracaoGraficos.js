export const opcoesGrafico = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const valorFormatado = Number(context.raw).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
          return `${context.dataset.label}: ${valorFormatado}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (valor) =>
          Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
          })
      }
    }
  }
};