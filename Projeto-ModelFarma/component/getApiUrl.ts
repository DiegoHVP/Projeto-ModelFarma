export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  console.log(url)  
  return url;

};
