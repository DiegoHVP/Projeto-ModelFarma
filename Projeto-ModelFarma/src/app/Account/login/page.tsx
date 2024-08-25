"use client";
import { useState, useEffect } from'react';
import Link from"next/link";
import"bootstrap/dist/css/bootstrap.min.css";
import Head from'next/head';
import Cookies from 'js-cookie';
import { getApiUrl } from '../../../component/getApiUrl';


const Account = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(true); // Controle de tipo de usuário
  const apiUrl = getApiUrl();

  useEffect(() => {
    document.title = "Login";
  }, []);


  const handleLogin = async () => {
    try {
      // BUSQUE
      const endpoint = isClient ? `${apiUrl}/cliente/token` : `${apiUrl}/farmaceutico/token/`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: cpf,
          password: password,
        }),
      });
      
      // erro de retorno
      if (!response.ok) {
        // Extrai a mensagem de erro do corpo da resposta
        const errorData = await response.json();
        setError(errorData.detail || 'Erro desconhecido. Por favor, tente novamente.');
        return; // Evita a execução do código abaixo em caso de erro
      }

      
      const data = await response.json();
      // adiciona o token
      Cookies.set('token', data.access_token);
      
      // Redirecionar opos o login
      if (isClient) {
        window.location.href = '/'; // Se cliente va para home
       } else {
        window.location.href = '/Account/login/gerenciar_med'
        }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Erro ao tentar se conectar com a API.');
      } else {
        setError('Erro desconhecido.');
    }
  }
  }

  return (
    <><Head><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
    <div className="container my-5"><div className="card mx-auto" style={{ maxWidth: '400px' }}><div className="card-body"><h2 className="text-center mb-4">Login</h2>
            {error && <div className="text-center alert alert-danger mb-3">{error}</div>}
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">CPF</label><input
                  type="cpf"
                  id="cpf"
                  className="form-control"
                  placeholder="Insira o CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div><div className="mb-3"><label htmlFor="password" className="form-label">Senha</label><input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              
              
              </div><div className="mb-3 form-check"><input
                  type="checkbox"
                  className="form-check-input"
                  id="funcionario"
                  onChange={(e) => setIsClient(!e.target.checked)} // Ajusta o tipo de usuário
                />
                <label className="form-check-label" htmlFor="funcionario">Funcionário?</label></div>

              
                
                <button
                type="button"
                className="btn btn-primary d-block w-100 mb-3"
                onClick={handleLogin}
              >Login</button>
                <Link href="/esqueceu-senha" className="ms-2 text-right">Esqueceu a senha?</Link>
                </form>
                <div className="text-center">
                  <p>Sem conta? <Link href="/Account/sign-up">Crie uma aqui</Link>
                  </p>
                  <p>ou faça login com:</p>
                  </div>
                  </div>
                  </div>
                  </div>
                  </>
  );
};

export default Account;
