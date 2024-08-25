'use client'
import Link from 'next/link';
import Image from 'next/image';
import "bootstrap/dist/css/bootstrap.css";
import custom from "./navbar.module.css";
import { useState, useEffect } from 'react';
import BuscarMed from './buscarMed';
import login_SVG from './svgs/login.svg';
import bag_SVG from './svgs/bag.svg';
import Cookies from 'js-cookie';
import { getApiUrl } from './getApiUrl';

const Navigation = () => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const apiUrl = getApiUrl();
  
  useEffect(() => {
    const fetchUser = async () => {
      //SE NAO TEM TOKEN
      const token = Cookies.get('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const ApiClient = `${apiUrl}/cliente/me/`;
      const ApiFarmaceutico = `${apiUrl}/farmaceutico/me/`;

      // PROCURE NOME
      try {
        let response = await fetch(ApiFarmaceutico, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // SE FARMACEUTICO ESTA OK
        if (response.ok) {
          const data = await response.json();
          setUserName(data.p_nome);
          setIsClient(false);
          setIsAuthenticated(true);
          return;
        }

        //SE NÃO E FARMACEUTICO, BUSCA EM CLIENTE
        response = await fetch(ApiClient, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.nome);
          setIsClient(true);
          setIsAuthenticated(true);
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookies.set('token', '');
    Cookies.set('cesta', '')
    setIsAuthenticated(false);
    setUserName("");
    window.location.href = '/'; 
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand custom.Logo" href="/">
            <span style={{ color: "green", fontWeight: "bold" }}>Model</span>-<i>Farma</i>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav me-auto mb-2 mb-lg-0">
              <div className={custom.item + " " + custom.r_item}>
                <Link className="nav-item nav-link" href="/" aria-current="page">Home</Link>
              </div>
              <div className={custom.item}>
                <Link className="nav-item nav-link" href="/Sobre">Sobre</Link>
              </div>
              <div className={custom.item}>
                <Link className="nav-item nav-link" href="/contato">Contato</Link>
              </div>
            </div>

            <BuscarMed />

            <span className="navbar-nav me-auto mb-2 mb-lg-0">
              <div>
                {isAuthenticated ? (
                  <div className={`d-flex ${custom.user_sair}`}>
                    <Link href={isClient ? "/Account/perfilCliente" : "/Account/login/gerenciar_med"} className={`${custom.normalLink}`}>
                      <span className="nav-item nav-link">{userName}</span>
                    </Link>
                    <button className={`btn btn-link nav-item nav-link ${custom.sair}`} onClick={handleLogout}>Sair</button>
                  </div>
                ) : (
                  <Link className={`nav-item nav-link d-flex ${custom.item}`} href="/Account/login">
                    <Image src={login_SVG} alt="login-ico" width={20} height={20} />
                    Login
                  </Link>
                )}
              </div>

              <div className={`${custom.item} ${custom.cesta}`}>
                <Link className="nav-item nav-link d-flex" href="/cesta">
                  <Image src={bag_SVG} alt="login-ico" width={20} height={20} />
                  Cesta
                </Link>
              </div>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
