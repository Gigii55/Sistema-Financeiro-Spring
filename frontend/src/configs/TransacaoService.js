import BaseService from "./BaseService";

class TransacaoService extends BaseService {

    constructor() {
        super("/transacoes");
    }
}

export default TransacaoService;