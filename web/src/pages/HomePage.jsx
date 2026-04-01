import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import LeadForm from '../components/LeadForm';
import ServiceCards from '../components/ServiceCards';
import Testimonials from '../components/Testimonials';
import { business, coverageAreas, trustPoints } from '../data/siteContent';
import { siteImages } from '../data/siteImages';

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="section-block section-surface">
        <div className="site-shell space-y-10">
          <div className="section-intro">
            <p className="eyebrow">Specialised Solutions</p>
            <h2 className="section-title">Conversion-first service storytelling for urgent local jobs.</h2>
            <p className="section-copy">
              The homepage now follows the design system: strong editorial hierarchy, repeated CTA entry points, and clear service positioning for high-intent plumbing searches.
            </p>
          </div>
          <ServiceCards />
        </div>
      </section>

      <section className="section-block bg-surface-container-low">
        <div className="site-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="showcase-photo">
            <div className="showcase-photo-card">
              <div
                className="showcase-photo-image"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 63, 135, 0.12), rgba(0, 63, 135, 0.18)),
                    url(${siteImages.homeShowcase})
                  `
                }}
              />
            </div>
            <div className="showcase-photo-accent" />
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <p className="eyebrow">Why homeowners convert</p>
              <h2 className="section-title">Precision engineering, local heart.</h2>
              <p className="section-copy">
                The site positions the business as premium and dependable without adding unnecessary complexity. Messaging stays focused on urgency, trust, and property protection.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point.title} className="trust-item">
                  <div className="trust-icon" />
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold text-primary">{point.title}</h3>
                    <p className="text-sm leading-7 text-secondary">{point.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="section-block bg-primary">
        <div className="site-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6 text-white">
            <p className="eyebrow text-tertiary-fixed">Need a plumber now?</p>
            <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              Fast lead capture without slowing down the site.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-primary-fixed">
              The quote flow supports the advanced tier fields already wired into the API: urgency, suburb, preferred contact time, and service type.
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-semibold uppercase tracking-[0.12em] text-tertiary-fixed">
              <span>24/7 available</span>
              <span>{business.emergencyResponse}</span>
              <span>Simple admin workflow</span>
            </div>
          </div>

          <LeadForm compact title="Quick Callback" subtitle="Priority jobs should still call directly, but this form captures qualified leads cleanly." />
        </div>
      </section>

      <section className="section-block section-surface">
        <div className="site-shell space-y-8">
          <div className="section-intro">
            <p className="eyebrow">Service Areas</p>
            <h2 className="section-title">Local coverage designed for relevant search intent.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {coverageAreas.map((area) => (
              <div key={area} className="area-pill">
                {area}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <a href={business.phoneHref} className="btn btn-emergency">
              Call Now
            </a>
            <Link to="/services" className="btn btn-secondary">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
