import BaseService from "./BaseServices";
import axios from 'axios';

class CarteiraServices extends BaseService {
  constructor() {
    super('/carteiras');
  }

  async buscarTodos() {
        const usuarioSalvo = localStorage.getItem('usuario');
        const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
        return axios.get('http://localhost:8080/carteiras', {
            params: { usuarioId: usuario?.id }
        });
    }

    async remover(id) {
    return axios.delete(`http://localhost:8080/carteiras/${id}`);
  }
}

export default CarteiraServices;