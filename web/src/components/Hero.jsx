import { Link } from 'react-router-dom';
import { business } from '../data/siteContent';
import { siteImages } from '../data/siteImages';

const trustItems = [
  '★★★★★ Local Rated',
  'Licensed & Insured',
  'Same-Day Available',
  'Upfront Pricing'
];

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
          <div className="hero-badge">Mermaid Beach • Gold Coast Local</div>
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
              Trusted Gold Coast Plumbing, Fast When You Need It.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/90 sm:text-xl">
              Local licensed plumbers servicing Mermaid Beach, Broadbeach, Robina, Burleigh and surrounding Gold Coast suburbs. Fast response, clear pricing, quality workmanship.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={business.phoneHref} className="btn btn-hero-primary">
              Call Now
            </a>
            <Link to="/contact" className="btn btn-hero-secondary">
              Get Free Quote
            </Link>
          </div>
          <div className="hero-trust-strip">
            {trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <img src={siteImages.icon} alt="" className="hero-panel-icon" />
          <p className="eyebrow">Emergency plumbing response</p>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-primary">
            Emergency Plumbing Response
          </h2>
          <p className="text-sm leading-7 text-secondary">
            Burst pipe, blocked drain, leaking hot water or urgent issue? We prioritise fast local callouts across the Gold Coast.
          </p>
          <div className="grid gap-3">
            <div className="hero-stat">
              <strong>Fast Response Times</strong>
            </div>
            <div className="hero-stat">
              <strong>Licensed Local Plumbers</strong>
            </div>
            <div className="hero-stat">
              <strong>Clean & Respectful Service</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
