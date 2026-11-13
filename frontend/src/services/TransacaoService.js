import api from '../configs/axiosConfig';

function obterUsuarioId() {
    const usuarioSalvo = localStorage.getItem('usuario');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    return usuario?.id;
}

class TransacaoService {

    async buscarTodos() {
        return api.get('/transacoes', {
            params: { usuarioId: obterUsuarioId() }
        });
    }

    async buscarPaginado(pagina, tamanho = 4, carteiraId = '') {
        return api.get('/transacoes/paginado', {
            params: {
                usuarioId: obterUsuarioId(),
                carteiraId: carteiraId || undefined,
                page: pagina,
                size: tamanho,
                sort: 'data,desc'
            }
        });
    }

    async buscarPorTipo(tipo) {
        return api.get('/transacoes/filtro', {
            params: {
                usuarioId: obterUsuarioId(),
                tipo
            }
        });
    }

    async buscarPorCategoria(categoriaId) {
        return api.get('/transacoes/filtro-categoria', {
            params: {
                usuarioId: obterUsuarioId(),
                categoriaId
            }
        });
    }

    async buscarPorPeriodo(dataInicio, dataFim) {
        return api.get('/transacoes/filtro-periodo', {
            params: {
                usuarioId: obterUsuarioId(),
                dataInicio,
                dataFim
            }
        });
    }

    async inserir(payload) {
        return api.post('/transacoes', payload, {
            params: { usuarioId: obterUsuarioId() }
        });
    }

    async remover(id) {
        return api.delete(`/transacoes/${id}`);
    }
}

export default TransacaoService;