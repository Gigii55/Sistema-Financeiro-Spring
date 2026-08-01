
    export function verificarForcaDaSenha(senha) {
        if (senha.length === 0) return '';
        if (senha.length < 6) return 'Fraca';

        let pontos = 0;
        if (/[A-Z]/.test(senha)) pontos++;
        if (/[0-9]/.test(senha)) pontos++;
        if (/[^A-Za-z0-9]/.test(senha)) pontos++;

        if (pontos === 0) return 'Fraca';
        if (pontos === 1 || pontos === 2) return 'Média';

        return 'Forte';
    }

