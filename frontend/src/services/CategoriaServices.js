import BaseService from './BaseServices';

class CategoriaServices extends BaseService {
  constructor() {
    super('/categorias');
  }

  async buscarTodos() {
    const usuarioSalvo = localStorage.getItem('usuario');
    const usuario = usuarioSalvo? JSON.parse(usuarioSalvo): null;

    return this.api.get('/categorias', {params: {usuarioId: usuario?.id}});
  }

  async remover(id) {
    return this.api.delete(`/categorias/${id}`);
  }
}

export default CategoriaServices;
