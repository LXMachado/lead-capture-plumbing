import { testimonials } from '../data/siteContent';

export default function Testimonials() {
  return (
    <section className="section-block section-surface">
      <div className="site-shell space-y-12">
        <div className="max-w-2xl text-center md:mx-auto">
          <p className="eyebrow justify-center">Trusted Across The Gold Coast</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.03em] text-primary">
            Real Service. Real Results.
          </h2>
          <p className="mt-4 text-base leading-8 text-secondary">
            We focus on honest service, quality workmanship and fast communication.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <blockquote className="text-base leading-8 text-on-surface">
                “{item.feedback}”
              </blockquote>
              <figcaption className="space-y-1">
                <p className="font-display text-lg font-bold text-primary">{item.name}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                  {item.location}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
