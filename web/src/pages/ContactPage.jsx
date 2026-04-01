import LeadForm from '../components/LeadForm';
import { business } from '../data/siteContent';

export default function ContactPage() {
  return (
    <div>
      <section className="section-block section-surface">
        <div className="site-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="eyebrow">Contact</p>
              <h1 className="section-title">Request a quote or call for urgent plumbing support.</h1>
              <p className="section-copy">
                The contact page keeps the decision simple: emergency calls go straight to phone, while standard jobs use the structured lead form for cleaner intake.
              </p>
            </div>

            <div className="contact-stack">
              <div className="contact-card">
                <p className="contact-label">Emergency Call</p>
                <a href={business.phoneHref} className="font-display text-2xl font-extrabold text-primary">
                  {business.phoneDisplay}
                </a>
                <p className="text-sm leading-7 text-secondary">Best for burst pipes, severe leaks, gas concerns, and urgent outages.</p>
              </div>
              <div className="contact-card">
                <p className="contact-label">Service Area</p>
                <p className="text-sm leading-7 text-secondary">Gold Coast, Brisbane, Ipswich, and nearby South East Queensland suburbs.</p>
              </div>
            </div>
          </div>

          <LeadForm title="Request a Quote" subtitle="Tell us what is happening, where the property is located, and how quickly you need a callback." />
        </div>
      </section>
    </div>
  );
}
