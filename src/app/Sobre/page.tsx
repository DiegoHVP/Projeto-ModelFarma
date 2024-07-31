// Sobre.js
import styles from './sobre.module.css';

export const metadata = {
  title: 'Sobre',
  description: 'Modelo de farmacia',
};


export default function Sobre() {
  return (
    <div>
      <h1 className={styles.title}>SOBRE A LOJA</h1>
      <section className={styles.sobre}>
        <p>
          A Model-Farma é um modelo modular de farmácia online com a virtude de oferecer um serviço de compra e venda de medicamentos. Esse modelo podera ser ajustado dependendo da necessidade de customização do cliente 
        </p>
      </section>
    </div>
  );
}
