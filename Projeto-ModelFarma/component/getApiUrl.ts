export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return String(url); // Valor padrão caso a variável de ambiente não esteja definida
};
