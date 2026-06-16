import './style/Login.css';

function Login() {
  return (
    <>
      <div>
        <h1 className="welcome">SEJA BEM VINDO!</h1>
        <h1 className="sistem-identification">Sistemas de Financas Astrotech!</h1>
      </div>
      
      <div className="form-div"> 
        <p className="login">LOGIN</p>
        
        <form className="form">
          <p className="name-login">Nome</p>
          <input className="input" placeholder="Digite seu nome..." />
          
          <p className="password-login">Senha</p>
          <input className="input" type="password" placeholder="Digite sua senha..." />
          
          <a href="#" className="forgot-password">esqueceu a senha?</a>
          <button type="submit" className="btn-login">ENTRAR</button>
          
          <p className="register">Não tem uma conta? <a href="#" className="register-link">CADASTRE-SE</a></p>
        </form>
      </div>
    </>
  )
}

export default Login;