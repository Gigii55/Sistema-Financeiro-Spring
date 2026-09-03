import axios from 'axios';

function obterUsuarioId() {
    const usuarioSalvo = localStorage.getItem('usuario');
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    return usuario?.id;
}

class TransacaoService {

    async buscarTodos() {
        return axios.get('http://localhost:8080/transacoes', {
            params: { usuarioId: obterUsuarioId() }
        });
    }

    async buscarPaginado(pagina, tamanho = 4) {
        return axios.get('http://localhost:8080/transacoes/paginado', {
            params: {
                usuarioId: obterUsuarioId(),
                page: pagina,
                size: tamanho,
                sort: 'data,desc'
            }
        });
    }

    async buscarPorTipo(tipo) {
        return axios.get('http://localhost:8080/transacoes/filtro', {
            params: { usuarioId: obterUsuarioId(), tipo }
        });
    }

    async buscarPorCategoria(categoriaId) {
        return axios.get('http://localhost:8080/transacoes/filtro-categoria', {
            params: { usuarioId: obterUsuarioId(), categoriaId }
        });
    }

    async buscarPorPeriodo(dataInicio, dataFim) {
        return axios.get('http://localhost:8080/transacoes/filtro-periodo', {
            params: { usuarioId: obterUsuarioId(), dataInicio, dataFim }
        });
    }

    async inserir(payload) {
        return axios.post('http://localhost:8080/transacoes', payload, {
            params: { usuarioId: obterUsuarioId() } 
        });
    }
}

export default TransacaoService;