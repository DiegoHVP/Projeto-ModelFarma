export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL? process.env.NEXT_PUBLIC_API_URL : "http://localhost:8000"
  console.log(process.env.NEXT_PUBLIC_API_URL)
  return String(url);
};