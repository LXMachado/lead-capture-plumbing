import { Link } from 'react-router-dom';
import { publicServices } from '../data/siteContent';

export default function ServiceCards({ limit }) {
  const services = limit ? publicServices.slice(0, limit) : publicServices;

  return (
    <section className="grid gap-6 md:grid-cols-12">
      {services.map((service, index) => (
        <article
          key={service.slug}
          className={`service-card ${service.accent === 'dark' ? 'service-card-dark' : ''} ${
            index === 0 ? 'md:col-span-7' : index === services.length - 1 && services.length > 2 ? 'md:col-span-12' : 'md:col-span-5'
          }`}
        >
          <div className="space-y-4">
            <p className="eyebrow">{service.eyebrow}</p>
            <h3 className={`font-display text-2xl font-extrabold tracking-[-0.03em] md:text-3xl ${service.accent === 'dark' ? 'text-white' : 'text-primary'}`}>
              {service.title}
            </h3>
            <p className={`max-w-xl text-sm leading-7 ${service.accent === 'dark' ? 'text-white/80' : 'text-secondary'}`}>
              {service.summary}
            </p>
            <p className={`max-w-xl text-sm leading-7 ${service.accent === 'dark' ? 'text-white/70' : 'text-secondary/90'}`}>
              {service.detail}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {service.stats.map((item) => (
              <span key={item} className={`stat-pill ${service.accent === 'dark' ? 'stat-pill-dark' : ''}`}>
                {item}
              </span>
            ))}
          </div>

          <Link to="/contact" className={`service-link ${service.accent === 'dark' ? 'service-link-dark' : ''}`}>
            Request this service
          </Link>
        </article>
      ))}
    </section>
  );
}
