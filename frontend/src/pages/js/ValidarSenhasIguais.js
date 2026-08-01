    export function validarSenhasIguais(senha, confirmacao) {
        if (confirmacao.length === 0) return null;
        return senha === confirmacao;
    }