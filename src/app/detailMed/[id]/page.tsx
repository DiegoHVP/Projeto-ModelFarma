import { fetchMedicamento } from "./fetchMedicamento";
import DetailMedClient from "./DetailMedClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await fetch('http://localhost:8000/medicamento/');
    const data = await res.json();
    
    console.log(data); // Inspecione a resposta da API

    // Verifica se data é um objeto e possui a propriedade Medicamentos como array
    if (!data || !Array.isArray(data.Medicamentos)) {
      throw new Error("A resposta da API não contém a propriedade 'Medicamentos' ou não é um array");
    }

    return data.Medicamentos.map((med: any) => ({
      id: med.id.toString(),
    }));

  } catch (error) {
    console.error("Erro ao coletar dados da página:", error);
    return [];
  }
}


export default async function DetailMedPage({ params }: { params: { id: string } }) {
  const medicamento = await fetchMedicamento(parseInt(params.id));

  if (!medicamento) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          Medicamento não encontrado.
        </div>
      </div>
    );
  }

  return (
    <DetailMedClient id={params.id} />
  );
}
