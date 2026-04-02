import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import ServiceCards from '../components/ServiceCards';
import Testimonials from '../components/Testimonials';
import { business } from '../data/siteContent';
import { siteImages } from '../data/siteImages';

export default function ServicesPage() {
  return (
    <div>
      <section className="service-hero">
        <div
          className="service-hero-media"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0, 63, 135, 0.9) 0%, rgba(0, 63, 135, 0.62) 52%, rgba(8, 39, 71, 0.24) 100%),
              url(${siteImages.servicesHero})
            `
          }}
        />
        <div className="service-hero-overlay" />
        <div className="site-shell service-hero-grid">
          <div className="max-w-2xl space-y-6 text-white">
            <p className="eyebrow text-tertiary-fixed">Available 24/7 Gold Coast + Brisbane</p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
              Precision Care
              <br />
              for Plumbing
              <span className="block text-tertiary-fixed">Emergencies.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/90">
              This page mirrors the supplied service-detail direction: urgent messaging, premium presentation, and a form module placed directly beside the conversion narrative.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="service-badge">24/7 Response</span>
              <span className="service-badge">Licensed Pros</span>
            </div>
          </div>

          <LeadForm title="Get a Quick Quote" subtitle="We’ll review the issue and contact you with the fastest viable next step." />
        </div>
      </section>

      <section className="section-block section-surface">
        <div className="site-shell space-y-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-4">
              <p className="eyebrow">Why We Lead</p>
              <h2 className="section-title">
                Rapid response,
                <span className="text-primary-container"> architectural precision.</span>
              </h2>
            </div>
            <p className="border-l-4 border-tertiary-container pl-5 text-base italic leading-8 text-secondary">
              Plumbing is the circulatory system of a property. The interface should treat that fact with more seriousness than a generic trade template.
            </p>
          </div>

          <ServiceCards />
        </div>
      </section>

      <Testimonials />

      <section className="section-block bg-surface-container-low">
        <div className="site-shell cta-panel">
          <div className="space-y-4">
            <p className="eyebrow">Stop the damage before it spreads</p>
            <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
              Built to convert emergency traffic into real leads.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/72">
              Priority actions remain obvious: call immediately for emergencies, or send a structured request with all the fields needed for dispatch and follow-up.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={business.phoneHref} className="btn btn-hero-primary">
              Call {business.phoneDisplay}
            </a>
            <Link to="/contact" className="btn btn-hero-secondary">
              Request Quote Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
