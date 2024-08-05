const mockIDs = [1];

// Gerando parâmetros estáticos a partir dos IDs mockados
export async function generateStaticParams() {
  return mockIDs.map(id => ({
    id: id.toString()
  }));
}
