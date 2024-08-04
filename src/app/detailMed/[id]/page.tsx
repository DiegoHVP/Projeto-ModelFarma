import { fetchMedicamento } from "./fetchMedicamento";
import { generateStaticParams } from "./generateStaticParams";
import DetailMedClient from "./DetailMedClient";

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
