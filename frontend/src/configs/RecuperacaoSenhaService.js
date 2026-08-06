import api from '../configs/axiosConfig';

export const solicitarRecuperacao = async (email) => {
  return await api.post(
    '/recuperacao-senha/solicitar',
    { email }
  );
};

export const redefinirSenha = async (token, novaSenha) => {
  return await api.post(
    '/recuperacao-senha/redefinir',
    {
      token,
      novaSenha
    }
  );
};