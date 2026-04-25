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
            <p className="eyebrow">Our Services</p>
            <h2 className="section-title">Complete plumbing solutions for Gold Coast & Brisbane homes.</h2>
            <p className="section-copy">
              From emergency repairs to preventative maintenance, our licensed team delivers fast, reliable service across South East Queensland.
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
            <p className="eyebrow">Why homeowners choose us</p>
            <h2 className="section-title">Reliable plumbing you can trust.</h2>
            <p className="section-copy">
              We combine precision engineering with local knowledge to protect your property and keep your plumbing running smoothly.
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
              Get a fast callback within the hour.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/90">
              Tell us about your plumbing issue and we&apos;ll connect you with a licensed plumber fast. Priority jobs call directly for immediate assistance.
            </p>
            <div className="flex flex-wrap gap-6 text-sm font-semibold uppercase tracking-[0.12em] text-tertiary-fixed">
              <span>24/7 available</span>
              <span>{business.emergencyResponse}</span>
              <span>Licensed & insured</span>
            </div>
          </div>

          <LeadForm compact title="Quick Callback" subtitle="Priority jobs should still call directly, but this form captures qualified leads cleanly." />
        </div>
      </section>

      <section className="section-block section-surface">
        <div className="site-shell space-y-8">
          <div className="section-intro">
            <p className="eyebrow">Service Areas</p>
            <h2 className="section-title">Proudly serving South East Queensland.</h2>
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
