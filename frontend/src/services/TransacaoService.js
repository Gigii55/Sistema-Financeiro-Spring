import BaseService from './BaseServices';

class TransacaoService extends BaseService {
  constructor() {
    super('/transacoes');
  }
}

export default TransacaoService;