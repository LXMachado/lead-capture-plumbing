import { Link } from 'react-router-dom';
import { business } from '../data/siteContent';
import { siteImages } from '../data/siteImages';

export default function Hero() {
  return (
    <section className="hero-shell">
      <div
        className="hero-media"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0, 63, 135, 0.9) 0%, rgba(0, 63, 135, 0.66) 48%, rgba(0, 63, 135, 0.2) 100%),
            url(${siteImages.homeHero})
          `
        }}
      />
      <div className="hero-overlay" />
      <div className="hero-grid site-shell">
        <div className="max-w-2xl space-y-7">
          <div className="hero-badge">Available 24/7</div>
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
              Fast, Reliable
              <br />
              Plumbing
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/90 sm:text-xl">
              The trusted choice for homeowners across Gold Coast and Brisbane. Licensed, insured, and structured for urgent response.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={business.phoneHref} className="btn btn-hero-primary">
              Call {business.phoneDisplay}
            </a>
            <Link to="/contact" className="btn btn-hero-secondary">
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <p className="eyebrow">Emergency plumbing</p>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-primary">
            Precision care for urgent failures.
          </h2>
          <p className="text-sm leading-7 text-secondary">
            Burst pipes, active leaks, hot water outages, and blocked drains handled with a response-first workflow that protects the property before anything else.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="hero-stat">
              <strong>{business.emergencyResponse}</strong>
              <span>Target arrival window</span>
            </div>
            <div className="hero-stat">
              <strong>Licensed team</strong>
              <span>Insured local operators</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
