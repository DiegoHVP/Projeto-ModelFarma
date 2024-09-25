export const getApiUrl = () => {
  // SE TIVE A URL DA API NO DOCKER PEGUE, SE NAO USE O LOCALHOST 
  const url = process.env.NEXT_PUBLIC_API_URL? process.env.NEXT_PUBLIC_API_URL : "http://localhost:8000/api/v1"
  return String(url);
};