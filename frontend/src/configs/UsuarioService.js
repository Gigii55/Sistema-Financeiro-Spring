import BaseService from "./BaseService";

class UsuarioService extends BaseService {

    constructor() {
        super("/usuarios");
    }
}

export default UsuarioService;