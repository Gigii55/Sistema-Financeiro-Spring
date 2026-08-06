import BaseService from './BaseService';


class UsuarioService extends BaseService {

  constructor() {
    super('/usuarios');
  }


  async login(dados) {
    return await this.api.post(`${this.endPoint}/login`,dados);
  }
}


export default UsuarioService;