
export async function generateStaticParams() {
    
    const res = await fetch('http://localhost:8000/medicamentos'); 
    const data = await res.json();
  
    return data.map((med: { id: number }) => ({
      id: med.id.toString(),
    }));
  }
  