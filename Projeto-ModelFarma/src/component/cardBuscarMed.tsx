import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Medicamento } from '../../types/Medicamentos';

interface Props {
  medicamento: Medicamento; 
}

export default function CardMedicamentoBusca({ medicamento }: Props) {
  const [quantidade, setQuantidade] = useState<number>(0);  // Define o estado inicial da quantidade como 0

  // Pega a quantidade já carregada no Cookie
  useEffect(() => {
    const cesta = Cookies.get('cesta');  // Obtém o cookie 'cesta'
    if (cesta) {  // Se o cookie existe
      try {
        const cestaObj = JSON.parse(cesta);
        if (medicamento.id !== undefined) {
          // Define a quantidade do medicamento específico a partir do cookie
          setQuantidade(cestaObj[medicamento.id] || 0);
        }
      } catch (error) {
        Cookies.remove('cesta');  // Remove o cookie em caso de erro
      }
    }
  }, [medicamento.id]);  // Executa esse efeito sempre que o ID do medicamento mudar

  
  const atualizarCesta = (novoQuantidade: number) => {
    const cesta = Cookies.get('cesta');
    let cestaObj = cesta ? JSON.parse(cesta) : {};

    if (novoQuantidade <= 0) {  // Se a nova quantidade for menor ou igual a 0
      if (medicamento.id !== undefined) { // EVITA O CASO DE undefined
        // Next quebra se não verificar
        delete cestaObj[medicamento.id];  // Remove o medicamento da cesta
      }
    } else {  // Caso contrário
      if (medicamento.id !== undefined) {
        cestaObj[medicamento.id] = novoQuantidade;  // Atualiza a quantidade do medicamento
      }
    }

    Cookies.set('cesta', JSON.stringify(cestaObj));  // Salva o estado atualizado da cesta no cookie
    setQuantidade(novoQuantidade);  // Atualiza o estado local da quantidade
  };


  const adicionarMedicamento = () => {
    atualizarCesta(quantidade + 1); 
  };

  
  const removerMedicamento = () => {
    if (quantidade > 0) {
      atualizarCesta(quantidade - 1);  // Decrementa a quantidade do medicamento em 1 se a quantidade for maior que 0
    }
  };

  return (
    <div className="card mx-auto" style={{maxWidth: 1100}}>
      <div className="row no-gutters">
        {/* Coluna para o nome e informações gerais */}
        <div className="col-md-4">
          <div className="card-body">
            <Link href={`/detailMed/${medicamento.id}`}>
              <h5 className="card-title">{medicamento.nome}</h5>
            </Link>
            <p className="card-text">Preço: R${medicamento.preco.toFixed(2)}</p>
            <p className="card-text">Vencimento: {medicamento.vencimento}</p>
          </div>
        </div>
        
        {/* Coluna para a faixa etária, unidades e dosagem */}
        <div className="col-md-4 text-center">
          <div className="card-body">
            <p className="card-text">Faixa Etária: {medicamento.faixa_etaria}</p>
            <p className="card-text">Unidade (por caixa): {medicamento.unidade}</p>
            <p className="card-text">mg/ml: {medicamento.mg_ml}</p>
          </div>
        </div>
        
        {/* Coluna para os botões de adicionar, remover e comprar */}
        <div className="col-md-4">
          <div className="card-body d-flex flex-column justify-content-between align-items-center">
            
            {quantidade > 0 ? (  // Se a quantidade for maior que 0, exibe os botões de adicionar e remover
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-secondary"
                  onClick={removerMedicamento}
                  disabled={quantidade <= 0}  // Desabilita o botão se a quantidade for menor ou igual a 0
                >
                  &#9664;
                </button>

                <span className="mx-2">{quantidade}</span>  {/* Exibe a quantidade atual */}
                
                <button
                  className="btn btn-secondary"
                  onClick={adicionarMedicamento}
                >
                  &#9654;
                </button>
              </div>
            ) : (  // Se a quantidade for 0, exibe o botão para adicionar à cesta
              <button
                className="btn btn-primary mb-2"
                onClick={adicionarMedicamento}
              >
                Adicionar à Cesta
              </button>
            )}
            <button className="btn btn-success mt-2">Comprar</button>  {/* Botão para finalizar a compra */}
          </div>
        </div>
      </div>
    </div>
  );
}
