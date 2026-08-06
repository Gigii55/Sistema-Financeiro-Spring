import api from '../../configs/axiosConfig';


export const realizarLogin = async (email, senha) => {

  return await api.post('/usuarios/login', {
    email: email,
    senha: senha
  });
};