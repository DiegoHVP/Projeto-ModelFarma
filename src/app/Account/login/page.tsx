"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from 'next/head';



const Account = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Login";
  })
  
  const handleLogin = async () => {
    try {
      
      
    } catch (error) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  }
  return (<>
  <Head><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
  
  <div className="container my-5">
    <div className="card mx-auto" style={{ maxWidth: '400px' }}>
      <div className="card-body">
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger mb-3">{error}</div>}
        <form>
            
          <div className="mb-3">
            <label htmlFor="email"className="form-label">Email</label>
            <input type="email" id="email" className="form-control"
                value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <input type="password" id="password" className="form-control"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
            
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="remember" />
            <label className="form-check-label" htmlFor="remember">Lembrar</label>
            <Link href="/esqueceu-senha" className="ms-2">Esqueceu a senha?</Link>
          </div>
            
          <button type="button" className="btn btn-primary d-block w-100 mb-3" onClick={handleLogin}>Login</button>
        </form>
          
        <div className="text-center">
          <p>Sem conta? <Link href="/Account/sign-up">Crie uma aqui</Link></p>
          <p>ou faça login com:</p>  
        </div>
      </div>
    </div>
   </div>
  </>);
};

export default Account;
