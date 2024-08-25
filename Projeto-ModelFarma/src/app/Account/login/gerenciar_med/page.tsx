"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import CardMedicamento from "../../../../component/funcionario/card/page";
import Cookies from 'js-cookie';
import { Medicamento } from "../../../../../types/Medicamentos";
import { getApiUrl } from "../../../../component/getApiUrl";


const GerenciarMed = () => {


  const [loading, setLoading] = useState(true);
  const [med, setMed] = useState<Medicamento[]>([]);
  const [upLista, setUpLista] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const apiUrl = getApiUrl();

  // Função para verificar a autenticação
  const checkAuth = async () => {
    const token = Cookies.get('token');

    if (!token) {
      alert("Usuario desconectado")
      window.location.href = '/';
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/farmaceutico/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAuthorized(true);
      } else {
        alert("Usuario não autorizado\nFazendo o Logout")
        Cookies.remove('token');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      Cookies.remove('token');
      alert(`erro na api ${error}`);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };


  // Buscar medicamentos
  const ListarMedicamentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/medicamento/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }

      const data = await response.json();

      // Verifica se `data.Medicamentos` é um array antes de definir o estado
      if (Array.isArray(data.Medicamentos)) {
        setMed(data.Medicamentos);
      } else {
        setMed([]); // Garante que `med` seja um array vazio caso a resposta seja inesperada
      }
    } catch (error) {
      console.error('Algo de errado ocorreu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    if (authorized && upLista) {
      ListarMedicamentos();
      setUpLista(false);
    }
  }, [authorized, upLista]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <Link href="/Account/login/gerenciar_med/cadastro_med" className="d-flex">
          <button className="btn btn-primary mb-2 m-2 p-2">
            Cadastrar Medicamento
          </button>
        </Link>
        <Link href="/Account/sign-up" className="d-flex">
          <button className="btn btn-primary mb-2 m-2 p-2">
            Cadastrar cliente
          </button>
        </Link>
        <Link href="/Account/login/gerenciar_cliente" className="d-flex">
          <button className="btn btn-primary mb-2 m-2 p-2">
            Lista clientes
          </button>
        </Link>
      </div>

      {med.length > 0 ? (
        <div>
          <ul>
            {med.map((medicamento) => (
              <li key={medicamento.id} className="m-2 p-2 list-unstyled">
                <CardMedicamento medicamento={medicamento} setUpLista={setUpLista} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="card mb-5 m-4 p-2">
          <div className="row no-gutters">
            <div className="card-body">
              <h5 className="card-title text-center">Nenhum medicamento encontrado</h5>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarMed;
