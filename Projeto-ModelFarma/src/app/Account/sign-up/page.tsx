"use client"
import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { getApiUrl } from "../../../component/getApiUrl";


const SignUp = () => {
  const apiUrl = getApiUrl();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
    email: "",
    alergia: "",
    senha: "",
    repetirSenha: ""
  });


  const pegarDados = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const Enviar = async (e: any) => {
    e.preventDefault();
    
    // Verificar se as senhas coincidem
    if (formData.senha !== formData.repetirSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
      // Enviar os dados para a API
      const response = await fetch(`${apiUrl}/cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          telefone: formData.telefone,
          email: formData.email,
          alergias: formData.alergia,
          senha: formData.senha
        })
      });
      const data = await response.json();
      

      // Limpar o form ao terminar
      setFormData({
        nome: "",
        sobrenome: "",
        cpf: "",
        telefone: "",
        email: "",
        alergia: "",
        senha: "",
        repetirSenha: ""
      });
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Por favor, tente novamente.");
    }
  };

  useEffect(() => {
    document.title = "Sign up";
  })

  return (
    <div className="container my-5">
      <div className="card mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <form onSubmit={Enviar}>
            <h1 className="text-center mb-4">Cadastrar usuário</h1>

            <div className="mb-3">
              <label className="form-label">Nome:</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={formData.nome}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Sobrenome:</label>
              <input
                type="text"
                className="form-control"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">CPF:</label>
              <input
                type="text"
                className="form-control"
                name="cpf"
                value={formData.cpf}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Telefone:</label>
              <input
                type="text"
                className="form-control"
                name="telefone"
                value={formData.telefone}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">E-mail:</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Alergia:</label>
              <input
                type="text"
                className="form-control"
                name="alergia"
                value={formData.alergia}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha:</label>
              <input
                type="password"
                className="form-control"
                name="senha"
                value={formData.senha}
                onChange={pegarDados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Repita a senha:</label>
              <input
                type="password"
                className="form-control"
                name="repetirSenha"
                value={formData.repetirSenha}
                onChange={pegarDados}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Finalizar cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default SignUp;