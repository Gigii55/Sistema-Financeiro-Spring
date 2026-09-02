import BaseServices from "./BaseServices";

class UsuarioServices extends BaseServices{
    constructor(){
        super('/usuarios');
    }

async alterarSenha(dados) {
  const resposta = await this.api.put('/usuarios/senha', dados);
  return resposta;
}
}

export default UsuarioServices;