"use client";
import { useState } from 'react';
import styles from './page.module.css'
import "bootstrap/dist/css/bootstrap.css";
export default function cadastro_med() {
  interface Medicamento {
    id: string;
    nome: string;
    quantidade: number;
    unidade: string;
    faixa_etaria: string;
    mg_ml: string;
    vencimento: string;
    preco: number;
    alergias: string;
  }
  
  const [Med, setMed] = useState<Medicamento>({
    id: '',
    nome: '',
    quantidade: 0,
    unidade: '',
    faixa_etaria: '',
    mg_ml: '',
    vencimento: '',
    preco: 0,
    alergias: ''
  });
  const [OK, setOK] = useState<boolean>();

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
      let response;
      response = await fetch('http://localhost:8000/medicamento/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Med)
      });
      
      if (response.ok) {
        setOK(true);
      }
    } catch (error) {
      setOK(false);
      console.error('Erro ao realizar operação:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className={styles['tela-cad']}>
        <h1 className="mb-4">Cadastro de medicamento</h1>
        
        {OK ? (
          <p className="text-success">Medicamento {Med.nome} cadastrado com sucesso</p>
        ) : (
          <p className="text-danger">Aguardando seu envio</p>
        )}

        <div className="mb-3">
          <label className="form-label">Nome *</label>
          <input type="text" className="form-control" name="nome" value={Med.nome} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantidade</label>
          <input type="number" className="form-control" name="quantidade" value={Med.quantidade} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Unidades (por caixa)</label>
          <input type="number" className="form-control" name="unidade" value={Med.unidade} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Faixa etária</label>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="faixa_etaria" value="adulto" onChange={handleChange} />
            <label className="form-check-label">Adulto</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="faixa_etaria" value="infantil" onChange={handleChange} />
            <label className="form-check-label">Pediatrico</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="faixa_etaria" value="livre" onChange={handleChange} />
            <label className="form-check-label">Livre</label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">mg/ml</label>
          <input type="text" className="form-control" name="mg_ml" value={Med.mg_ml} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Vencimento</label>
          <input type="date" className="form-control" name="vencimento" value={Med.vencimento} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Preço *</label>
          <input type="number" step="0.01" className="form-control" name="preco" value={Med.preco} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Alergia</label>
          <input type="text" className="form-control" name="alergias" value={Med.alergias} onChange={handleChange} />
        </div>
        
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
}