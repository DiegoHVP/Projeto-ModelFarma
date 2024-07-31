// Sobre.js
import styles from './sobre.module.css';

export default function Sobre() {
  return (
    <div>
      <h1 className={styles.title}>Sobre a loja</h1>
      <section className={styles.sobre}>
        <p>
          A Green-Farma é uma farmácia online com a virtude de oferecer os melhores produtos com os menores preços.
        </p>
      </section>
    </div>
  );
}
