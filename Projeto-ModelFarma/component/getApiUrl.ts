export const getApiUrl = () => {
  const url = String(process.env.NEXT_PUBLIC_API_URL);
  return url? url: 'http://localhost:8000';

};
