// Navigation.js
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.css";
import custom from "./navbar.module.css";
import BuscarMed from './buscarMed'; // Importe o componente de busca





const Navigation = () => {
  const Model = {
    color: "green",
    fontWeight: "bold" 
  };  
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand custom.Logo" href="/">
            <span style={Model}>Model</span>-<i>Farma</i>
          </Link>

          <div className="collapse navbar-collapse" id="navbarText">
            <div className="navbar-nav me-auto mb-2 mb-lg-0">
              <div className={custom.item+" "+custom.r_item}>
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
              <div className={custom.item}>
                <Link className="nav-item nav-link" href="/Account/login">Login</Link>
              </div>

              <div className={custom.item}>
                <Link className="nav-item nav-link" href="/carrinho">Cesta</Link>
              </div>
            </span>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
