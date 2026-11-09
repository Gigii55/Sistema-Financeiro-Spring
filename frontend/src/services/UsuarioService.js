import BaseServices from "./BaseServices";

class UsuarioServices extends BaseServices{
    constructor(){
        super('/usuarios');
    }

async alterarSenha(dados) {
  const resposta = await this.api.put('/usuarios/senha', dados);
  return resposta;
}

async buscarPorId(id) {
  return this.api.get(`/usuarios/${id}`);
}

async alterarNome(id, nome) {
  return this.api.put(`/usuarios/${id}/nome`, { nome });
}
}

export default UsuarioServices;