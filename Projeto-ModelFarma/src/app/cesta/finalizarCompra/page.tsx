'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchMedicamento } from '../fetchMedicamento'; // Importando o hook fetchMedicamento
import { Medicamento } from '../../../../types/Medicamentos';
import { getApiUrl } from '../../../component/featchAPI/getApiUrl';

const Pagamento = () => {
  const [cliente, setCliente] = useState<any>(null);
  const [medicamentosComprados, setMedicamentosComprados] = useState<Medicamento[]>([]);
  const [mensagem, setMensagem] = useState<string>('');
  const [precoTotal, setPrecoTotal] = useState<number>(0);
  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchCliente = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/cliente/logado`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCliente(data);
          } else {
            setCliente(null);
          }
        } catch (error) {
          console.error('Erro na requisição:', error);
          alert('Algo inexperado ocorreu.');
        }
      } else {
        setCliente(null);
      }
    };

    fetchCliente();
  }, [apiUrl]);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      const cesta = Cookies.get('cesta');
      if (!cesta) {
        alert('Sem itens no carrinho de compras');
        window.location.href = '/';
        return;
      }

      // Decodifica e analisa o conteúdo do cookie
      const decodedCesta = decodeURIComponent(cesta);
      const items = JSON.parse(decodedCesta);

      const medicamentos = await Promise.all(
        Object.entries(items).map(async ([id, quantity]) => {
          const medicamento = await fetchMedicamento(Number(id));
          return medicamento ? { ...medicamento, quantidade: quantity } : null;
        })
      );

      const medicamentosFiltrados = medicamentos.filter(Boolean);
      setMedicamentosComprados(medicamentosFiltrados);

      // Calcula o preço total
      const total = medicamentosFiltrados.reduce(
        (soma, med) => soma + med.preco * (med.quantidade || 1),
        0
      );
      setPrecoTotal(total);
    };

    fetchMedicamentos();
  }, [apiUrl]);

  const confirmarPagamento = async () => {
    const medicamentos_ids = medicamentosComprados.map((med) => med.id);
    const quantidade = medicamentosComprados.map((med) => med.quantidade);

    const body: any = {
      medicamentos_ids,
      quantidade,
    };

    if (cliente) {
      body.cliente_id = cliente.id; 
    }

    try {
      const response = await fetch(`${apiUrl}/compra/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        alert("Pagamento concluído com sucesso!");
        Cookies.remove('cesta'); // Limpa a cesta de compras
        window.location.href = "/";
        return;
      } else {
        setMensagem('Erro ao processar o pagamento.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagem('Erro ao processar o pagamento.');
    }
  };

  return (
    <div className="container mt-5 pr-4 pl-4 mx-auto mb-3" style={{ maxWidth: '700px' }}>
      <div className="card pr-4 pl-4">
        <div className="card-header">
          <h2>Confirmar Pagamento</h2>
        </div>
        <div className="card-body">
          <p><strong>Valor da Compra:</strong> R$ {precoTotal.toFixed(2)}</p>
          {cliente && (
            <p>
              <strong>Cliente:</strong> {cliente.nome} {cliente.sobrenome}
            </p>
          )}
          <h3>Lista de Compras:</h3>
          <div className="table-responsive">
            <table className="table table-striped mx-auto" style={{ maxWidth: '600px' }}>
              <thead>
                <tr>
                  <th scope="col">Medicamento</th>
                  <th scope="col">Quantidade</th>
                  <th scope="col" className='text-center'>Valor</th>
                </tr>
              </thead>
              <tbody>
                {medicamentosComprados.map((med, index) => (
                  <tr key={index}>
                    <td>{med.nome}</td>
                    <td className='text-center'>{med.quantidade}</td>
                    <td className='text-center'>R$ {med.preco.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-primary w-100" onClick={confirmarPagamento}>
            Confirmar Pagamento
          </button>
          {mensagem && <div className="alert alert-danger mt-3">{mensagem}</div>}
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
