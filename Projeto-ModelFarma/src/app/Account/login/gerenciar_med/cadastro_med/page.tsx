"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Medicamento } from "../../../../../../types/Medicamentos";
import { getApiUrl } from "../../../../../component/getApiUrl";

const CadastroMed = () => {
  const [Med, setMed] = useState<Medicamento>({
    nome: "",
    preco: 0.1,
  });

  const [OK, setOK] = useState<boolean>(false);
  const apiUrl = getApiUrl();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setMed({
      ...Med,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const MedToSend = { ...Med };

    // Remover a lógica de transformar arrays vazios em ['']
    if (Med.similares?.length === 0) {
      MedToSend.similares = [];
    }
    if (Med.genericos?.length === 0) {
      MedToSend.genericos = [];
    }
    if (Med.alergias?.length === 0) {
      MedToSend.alergias = [];
    }

    try {
      const response = await fetch(`${apiUrl}/medicamento/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(MedToSend),
      });

      if (response.ok) {
        setOK(true);
        clearForm();
        window.scrollTo(0, 0);
      } else {
        setOK(false);
        console.error("Erro ao enviar:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao realizar operação:", error);
    }
  };

  const clearForm = () => {
    setMed({
      nome: "",
      preco: 0.1,
    });
  };

  useEffect(() => {
    document.title = "Cadastrar Medicamento";
  }, []);

  return (
    <div className="container my-5">
      <div className="card mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center mb-4">Cadastro de Medicamento</h1>

            {OK ? (
              <p className="text-success text-center">
                Medicamento {Med.nome} cadastrado com sucesso
              </p>
            ) : (
              <p className="text-danger text-center">Aguardando seu envio</p>
            )}

            <div className="mb-3">
              <label className="form-label">Nome:</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={Med.nome}
                placeholder="EX: Dipirona - comprimido"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Preço:</label>
              <input
                type="number"
                step="0.01"
                min={0.01}
                className="form-control"
                name="preco"
                value={Med.preco}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campos opcionais */}
            <div className="mb-3">
              <label className="form-label">Quantidade:</label>
              <input
                type="number"
                className="form-control"
                min={1}
                name="quantidade"
                value={Med.quantidade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Unidades (por caixa):</label>
              <input
                type="number"
                className="form-control"
                min={1}
                name="unidade"
                value={Med.unidade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Faixa etária:</label>
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="faixa_etaria"
                    value="adulto"
                    onChange={handleChange}
                  />
                  Adulto
                </label>
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="faixa_etaria"
                    value="infantil"
                    onChange={handleChange}
                  />
                  Pediátrico
                </label>
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="faixa_etaria"
                    value="livre"
                    onChange={handleChange}
                  />
                  Livre
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Dosagem (mg/ml):</label>
              <input
                type="text"
                className="form-control"
                placeholder="EX: 10mg ou 250ml etc"
                name="mg_ml"
                value={Med.mg_ml || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Vencimento:</label>
              <input
                type="date"
                className="form-control"
                name="vencimento"
                value={Med.vencimento || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Alergia:</label>
              <input
                type="text"
                className="form-control"
                placeholder="EX: Plasil, paracetamol etc"
                name="alergias"
                value={Med.alergias?.join(", ") || ""}
                onChange={(e) =>
                  setMed({
                    ...Med,
                    alergias: e.target.value.split(",").map((a) => a.trim()),
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Farmácia ID (Opcional):</label>
              <input
                type="number"
                className="form-control"
                name="farmacia_id"
                value={Med.farmacia_id || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Medicamentos Similares:</label>
              <input
                type="text"
                className="form-control"
                placeholder="EX: Medicamento A, Medicamento B"
                name="similares"
                value={Med.similares?.join(", ") || ""}
                onChange={(e) =>
                  setMed({
                    ...Med,
                    similares: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Medicamentos Genéricos:</label>
              <input
                type="text"
                className="form-control"
                placeholder="EX: Medicamento A, Medicamento B"
                name="genericos"
                value={Med.genericos?.join(", ") || ""}
                onChange={(e) =>
                  setMed({
                    ...Med,
                    genericos: e.target.value.split(",").map((g) => g.trim()),
                  })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroMed;