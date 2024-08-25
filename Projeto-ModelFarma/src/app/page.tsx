import CardGallery from "../component/galeria";



export default function Home() {

  return (
    <>
      <section>
        <div className='m-4 p-1'>
          <div className="row">
            <CardGallery
              title="Bem-vindo"
              description="Aqui você vai encontrar os melhores preços e qualidade."
              link="#"
            />
            <CardGallery
              title="Que desconto?"
              description="Com o cadastro da loja ganhe descontos exclusivos de até 20%"
              link="./Account/login"
            />
          </div>
        </div>
      </section>
    </>
  );
}
