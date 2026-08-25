import { BookingForm } from '@/components/reservations/booking-form';
import styles from '../site.module.css';

export default function ReservarPage() {
  return (
    <div className={styles.container}>
      <section className={styles.pageHero}>
        <p className={styles.eyebrow}>Reservas</p>
        <h1>Tu mesa en el jardín</h1>
        <p className={styles.sectionLead}>
          Completa el formulario y te contactaremos para confirmar disponibilidad.
          Si prefieres, también puedes escribirnos por WhatsApp.
        </p>
      </section>

      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.bookingPanel}>
          <BookingForm />
        </div>
      </section>
    </div>
  );
}
