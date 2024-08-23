'use client'
import "bootstrap/dist/css/bootstrap.css";
import { useState } from 'react';

export default function BuscarMedicamento() {
  const [name, setName] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault(); 
    window.location.href = `/buscar?nome=${name}`; // Redirecionamento
  };

  return (
    <form className="container d-flex grid" onSubmit={handleSubmit}>
      <div className="form-group col">
        <input
          type="search"
          className="form-control"
          placeholder="Ex: Dipirona"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <button type="submit" className="btn btn-outline-success col-md-auto">
        Buscar
      </button>
    </form>
  );
}
