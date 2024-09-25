'use client'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchMedicamento } from './fetchMedicamento';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CartItem {
  id: number;
  qtd_item: number;
}

const CestaPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Carregar a cesta do cookie
  useEffect(() => {
    const cesta = Cookies.get('cesta');
    if (cesta) {
      try {
        // PEGA CESTA COMO OBJETOS
        const ObjCesta = JSON.parse(cesta);
        // Object.entries pega um objeto e retorna
        // um dicionario chave valor
        const items = Object.entries(ObjCesta).map(([id, qtd_item]) => ({
          id: Number(id),
          qtd_item: qtd_item as number,
        }));
        // Guarda em CardtItems
        setCartItems(items);
      } catch (error) {
        console.error("Erro ao carregar a cesta do cookie:", error);
        Cookies.remove('cesta');
      }
    }
  }, []);

  // Carregar detalhes dos medicamentos para cada item da cesta
  useEffect(() => {
    const fetchMedicamentos = async () => {
      // Promise.all Roda a varias instacias async para busca os medicamentos
      const items = await Promise.all(
        cartItems.map(async (item) => {
          // busca o medicamento
          const medicamento = await fetchMedicamento(item.id);
          // retorna um novo objeto com o atributo quantidade
          // se nao devolve nulo
          return medicamento ? { ...medicamento, qtd_item: item.qtd_item } : null;
        })
      );
      // retira os nulos
      setMedicamentos(items.filter(Boolean));
    };

    if (cartItems.length > 0) fetchMedicamentos();
  }, [cartItems]);

  // Calcular o valor total
  useEffect(() => {
    const total = medicamentos.reduce((_preco, med) => _preco + med.preco * med.qtd_item, 0);
    setTotalPrice(total);
  }, [medicamentos]);

  // Atualizar a cesta no cookie e no estado
  // recebeo id do medicamento e quantidade
  const atualizarCesta = (id: number, novaQuantidade: number) => {
    const cesta = Cookies.get('cesta');
    if (cesta) {
      try {
        // pega a cesta como objeto
        const ObjCesta = JSON.parse(cesta);
        if (novaQuantidade > 0) {
          ObjCesta[id] = novaQuantidade;
        } else {
          delete ObjCesta[id];
        }
        // atualizo o cookie
        // traz o objeto como json
        Cookies.set('cesta', JSON.stringify(ObjCesta));
        // atualiza CartItems
        setCartItems(
          cartItems.map(item => 
            item.id === id ? { ...item, qtd_item: novaQuantidade } : item
          ).filter(item => item.qtd_item > 0)
        );
      } catch (error) {
        console.error("Erro ao atualizar a cesta no cookie:", error);
      }
    }
  };

  // Funções para incrementar e decrementar a quantidade
  const incrementarQuantidade = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      atualizarCesta(id, item.qtd_item + 1);
    }
  };

  const decrementarQuantidade = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.qtd_item > 1) {
      atualizarCesta(id, item.qtd_item - 1);
    }
  };

  // Função para remover o medicamento
  const removerMedicamento = (id: number) => {
    atualizarCesta(id, 0); // Define a quantidade como 0 para remover
  };

  const finalizarCompra = () => {
    window.location.href = "/cesta/finalizarCompra";
  }


  return (
    <div className="container mt-4 mx-auto" style={{ maxWidth: '900px'}}>
      <h2 className="mb-4 text-center list-group-item">Cesta de Compras</h2>
      {/* SE NAO TEM MEDICAMENTOS*/}
      {medicamentos.length === 0 ? (
        <p className="text-muted">Sua cesta está vazia.</p>
      ) : (
        <div>
          {/* SE TEM FAÇA*/}
          <ul className="list-group mb-4">
            {medicamentos.map((med) => (
              <li key={med.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{med.nome}</h5>
                  <p className="mb-1">Preço Unitário: R$ {med.preco.toFixed(2)}</p>
                  <p className="mb-1">Subtotal: R$ {(med.preco * med.qtd_item).toFixed(2)}</p>
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-outline-secondary me-2" 
                    onClick={() => decrementarQuantidade(med.id)}
                    disabled={med.qtd_item <= 1}
                  >
                    &#9664;
                  </button>
                  <span className="px-3">{med.qtd_item}</span>
                  <button 
                    className="btn btn-outline-secondary me-3" 
                    onClick={() => incrementarQuantidade(med.id)}
                  >
                    &#9654;
                  </button>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={() => removerMedicamento(med.id)}
                  >
                    Remover <br /> item
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-success btn-lg btn-block mt-3" onClick={finalizarCompra}>Finalizar Compra</button>
          <h2 className="text-end">Valor Total: R$ {totalPrice.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default CestaPage;
