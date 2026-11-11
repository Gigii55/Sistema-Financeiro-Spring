
import api from '../configs/axiosConfig';

class ConviteCarteiraServices {

  async enviar(carteiraId, email) {
    return api.post(`/convites/carteira/${carteiraId}`, { email });
  }

  async buscarPendentes() {
    return api.get('/convites/pendentes');
  }

  async aceitar(conviteId) {
    return api.post(`/convites/${conviteId}/aceitar`);
  }

  async recusar(conviteId) {
    return api.post(`/convites/${conviteId}/recusar`);
  }
}

export default ConviteCarteiraServices;
