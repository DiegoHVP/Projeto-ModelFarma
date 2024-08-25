export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000';
  console.log(String(url));
  return String(url);
};
