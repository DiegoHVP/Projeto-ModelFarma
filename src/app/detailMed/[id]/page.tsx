
import { fetchMedicamento } from "@/app/detailMed/[id]/fetchMedicamento";
import DetailMedClient from "@/app/detailMed/[id]/DetailMedClient";

// Dados mock para desenvolvimento
const mockData = {
  Medicamentos: [
    {
      id: 1,
      nome: "Paracetamol",
      vencimento: "2025-12-31",
      preco: 19.99,
      quantidade: 100,
      alergias: "N/A",
      faixa_etaria: "Adulto",
      mg_ml: "500mg",
      unidade: "comprimido",
      farmacia_id: 1,
      similares: "Acetaminofeno",
      genericos: "Tylenol",
      reabastecer: true
    }
  ]
};

// Função para gerar parâmetros estáticos
export async function generateStaticParams() {
  
  // Consulta a API
  try {
    const res = await fetch('http://localhost:8000/medicamento/');
    if (!res.ok) {
      throw new Error(`Erro ao buscar dados: ${res.statusText}`);
    }
    const data = await res.json();

    if (!data.Medicamentos) {
      throw new Error('Dados de medicamentos não encontrados');
    }

    return data.Medicamentos.map((med: any) => ({
      id: med.id.toString(),
    }));
  } catch (error) {

    // Se há um problema na API (ex: desativada), retorna mock
    console.error("Erro ao coletar dados da página:", error);
    return mockData.Medicamentos.map((med: any) => ({
      id: med.id.toString(),
    }));
  }
}

// Componente da página de detalhes
export default async function DetailMedPage({ params }: { params: { id: string } }) {

  try {
    // Se estiver em modo desenvolvedor busca dados mock,
    // Se não busca na API
    const medicamento = process.env.NODE_ENV === 'development'
      ? mockData.Medicamentos.find((med: any) => med.id.toString() === params.id)
      : await fetchMedicamento(parseInt(params.id));
    // a busca retornou vazio
    if (!medicamento) {
      return (
        <div className="container my-5">
          <div className="alert alert-danger" role="alert">
            Medicamento não encontrado.
          </div>
        </div>
      );
    }
    
    // exibir
    return (
      <DetailMedClient id={params.id} />
    );

  } catch (error) {

    // Erro ao  tentar buscar e exibir
    console.error("Erro ao buscar medicamento:", error);
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          Erro ao carregar detalhes do medicamento.
        </div>
      </div>
    );
  }
}
