"use client";
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";


interface Medicamento {
  id: string;
  nome: string;
  quantidade: number;
  unidade: number;
  faixa_etaria: string;
  mg_ml: string;
  vencimento: string;
  preco: number;
  alergias: string;
}


const cadastro_med = () => {
  

  const [Med, setMed] = useState<Medicamento>({
    id: '',
    nome: '',
    quantidade: 0,
    unidade: 0,
    faixa_etaria: '',
    mg_ml: '',
    vencimento: '',
    preco: 0,
    alergias: ''
  });
  const [OK, setOK] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMed({
      ...Med,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response = await fetch('http://localhost:8000/medicamento/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Med)
      });
      
      if (response.ok) {
        setOK(true);
        clearForm();
        window.scrollTo(0, 0); // Rolando para o topo da página
      } else {
        setOK(false);
      }
    } catch (error) {
      console.error('Erro ao realizar operação:', error);
    }
  };

  const clearForm = () => {
    setMed({
      id: '',
      nome: '',
      quantidade: 1,
      unidade: 1,
      faixa_etaria: 'livre',
      mg_ml: '',
      vencimento: '',
      preco: 0.1,
      alergias: ''
    });
  };

  useEffect(() => {
    document.title = "Cadastrar cliente";
  })
  
  return (
      <div className="container my-5">
        <div className="card mx-auto" style={{maxWidth: '800px'}}>
          <div className="card-body">
            <form onSubmit={handleSubmit} >
              <h1 className="text-center mb-4">Cadastro de medicamento</h1>
              
              {OK ? (
                <p className="text-success text-center">Medicamento {Med.nome} cadastrado com sucesso</p>
              ) : (
                
                <p className="text-danger text-center">Aguardando seu envio</p>
              )}

              <div className="mb-3">
                <label className="form-label">Nome:</label>
                <input type="text" className="form-control" name="nome"
                value={Med.nome} placeholder='EX: Dipirona - comprimido' onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantidade:</label>
                <input type="number" className="form-control" min={1} name="quantidade" value={Med.quantidade} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Unidades (por caixa):</label>
                <input type="number" className="form-control" min={1} name="unidade" value={Med.unidade} onChange={handleChange} />
              </div>

              <div className="mb-3">
                  <label className="form-label">Faixa etária:</label>
                  
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="form-check-input" type="radio" name="faixa_etaria" value="adulto" onChange={handleChange} />
                      Adulto</label>
                  </div>

                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="form-check-input" type="radio" name="faixa_etaria" value="infantil" onChange={handleChange} />
                      Pediatrico</label>
                  </div>
                  
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="form-check-input" type="radio" name="faixa_etaria" value="livre" onChange={handleChange} defaultChecked/>
                      Livre</label>
                  </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Dosagem (mg/ml):</label>
                <input type="text" className="form-control" placeholder="EX: 10mg ou 250ml etc" name="mg_ml" value={Med.mg_ml} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Vencimento:</label>
                <input type="date" className="form-control" name="vencimento" value={Med.vencimento} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Preço:</label>
                <input type="number" step="0.01" min={0.01} className="form-control" name="preco" value={Med.preco} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Alergia:</label>
                <input type="text" className="form-control" placeholder='EX: Plasil, paracetamol etc' name="alergias" value={Med.alergias} onChange={handleChange} />
              </div>
              
              <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
          </div>
        </div>
      </div>
  );
}

export default cadastro_med;