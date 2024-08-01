"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import CardMedicamento from "../../../../../component/funcionario/card/page";




const gerenciar_med = () => {
  interface Medicamento {
    id: number;
    nome: string;
    vencimento: string;
    preco: number;
    quantidade: number;
    alergias: string[];
    faixa_etaria: string;
    mg_ml: string;
    unidade: string;
    farmacia_id: number;
    similares: string[];
    genericos: string[];
    reabastecer: boolean;
  }




  const [loading, setLoading] = useState(false);
  const [med, setMed] = useState<Medicamento[]>([]);
  const [upLista, setUpLista] =  useState<boolean>(false);

  const ListarMedicamentos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/medicamento/`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }

      const data = await response.json();
      setMed(data.Medicamentos);
    } catch (error) {
      console.error('Algo de errado ocorreu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ListarMedicamentos();
    document.title = "Gerenciar Medicamentos";
  }, []);

  if (upLista){
    ListarMedicamentos();
    setUpLista(false)
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <Link href='/Account/login/gerenciar_med/cadastro_med' className="d-flex">
          <button className="btn btn-primary mb-2 m-2 p-2">
            Cadastrar Medicamento
            </button>
        </Link>
        <Link href='/Account/sign-up' className="d-flex">
          <button className="btn btn-primary mb-2 m-2 p-2">
            Cadastrar cliente
            </button>
        </Link>
        <Link href='/Account/login/gerenciar_cliente' className="d-flex">
          <button className="btn btn-primary mb-2 m-2 p-2">
            Lista clientes
            </button>
        </Link>
      </div>

      {!med || med.length > 0 ? (
        <div>
          <ul>
            {med.map((medicamento) => (
              <li key={medicamento.id} className="m-2 p-2">
                <CardMedicamento
                  medicamento={medicamento}
                  setUpLista={setUpLista}
                />

              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && (
          <div className="card mb-5 m-4 p-2">
            <div className="row no-gutters">
              <div className="card-body">
                <h5 className="card-title text-center">Nenhum medicamento encontrado</h5>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default gerenciar_med;
