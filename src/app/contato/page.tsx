// Importando React
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./page.module.css"


// Componente da página de contatos
export default function Contato() {
    return (<div>
            <h1 className={style.title}>CONTATOS</h1>
        <div className={`container ${style.contato}`}>
            <div className="row">
                <div className="col-md-6">
                    <h2>Informações de Contato</h2>
                    <p>
                        <strong>Email:</strong> contato@example.com<br />
                        <strong>Telefone:</strong> (XX) XXXX-XXXX<br />
                        <strong>Endereço:</strong> Rua Exemplo, 1234 - Bairro Exemplo - Cidade Exemplo
                    </p>
                </div>
                <div className="col-md-6">
                    <h2>Horário de Funcionamento</h2>
                    <p>
                        <strong>Segunda a Sexta:</strong> 08:00 - 18:00<br />
                        <strong>Sábado:</strong> 08:00 - 12:00<br />
                        <strong>Domingo:</strong> Fechado
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <h2>Redes Sociais</h2>
                <p>
                    Siga-nos em nossas redes sociais para ficar por dentro das novidades:<br />
                    <a href="https://www.facebook.com/example" className="me-3"><i className="fab fa-facebook"></i></a>
                    <a href="https://twitter.com/example" className="me-3"><i className="fab fa-twitter"></i></a>
                    <a href="https://www.instagram.com/example"><i className="fab fa-instagram"></i></a>
                </p>
            </div>
        </div></div>
    );
}
