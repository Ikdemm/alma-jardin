import { ContactForm } from '@/components/contact/contact-form';
import styles from '../site.module.css';

export default function ContactoPage() {
  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>Contacto</p>
        <h1>Escríbenos</h1>
        <p className={styles.sectionLead}>
          ¿Preguntas sobre el menú, eventos privados o colaboraciones? Déjanos un
          mensaje y te responderemos pronto.
        </p>
      </section>

      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.bookingPanel}>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
