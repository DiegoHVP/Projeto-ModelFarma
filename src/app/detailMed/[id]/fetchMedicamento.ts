export async function fetchMedicamento(id: number) {
  const response = await fetch(`http://localhost:8000/medicamento/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar medicamento. Por favor, tente novamente.");
  }
  const data = await response.json();
  return data.Medicamento;
}
