import BaseService from './BaseServices';

class CarteiraServices extends BaseService {

  constructor() {
    super('/carteiras');
  }

  async buscarTodos() {
    const usuarioSalvo = localStorage.getItem('usuario');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

    return this.api.get('/carteiras', {
      params: {
        usuarioId: usuario?.id
      }
    });
  }

  async remover(id) {
    return this.api.delete(`/carteiras/${id}`);
  }
}

export default CarteiraServices;