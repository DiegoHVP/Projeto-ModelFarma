export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL? process.env.NEXT_PUBLIC_API_URL : "https://localhost:8000"
  return String(url);
};