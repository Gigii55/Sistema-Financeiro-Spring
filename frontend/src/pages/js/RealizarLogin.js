export async function realizarLogin(nome, senha) {
    
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log('Nome:', nome);
  console.log('Senha:', senha);

  return true;
}