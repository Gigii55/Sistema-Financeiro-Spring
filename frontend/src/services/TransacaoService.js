import BaseService from './BaseServices';

class TransacaoService extends BaseService {
  constructor() {
    super('/transacoes');
  }

  async buscarPorTipo(tipo) {
    const resposta = await this.api.get(`${this.endPoint}/filtro?tipo=${tipo}`);
    return resposta;
  }

  async buscarPorCategoria(categoriaId) {
    const resposta = await this.api.get(`${this.endPoint}/filtro-categoria?categoriaId=${categoriaId}`);
    return resposta;
  }

  async buscarPorPeriodo(dataInicio, dataFim) {
    const resposta = await this.api.get(`${this.endPoint}/filtro-periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    return resposta;
  }

  async buscarPaginado(pagina = 0, tamanho = 10) {
    const resposta = await this.api.get(`${this.endPoint}/paginado?page=${pagina}&size=${tamanho}`);
    return resposta;
  }
}

export default TransacaoService;