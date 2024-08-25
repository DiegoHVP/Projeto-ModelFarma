export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url? String(url): "http://localhost:8000";

};
