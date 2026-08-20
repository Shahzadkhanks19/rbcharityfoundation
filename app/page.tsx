import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { causes, impactPlaceholders } from "@/data/foundation";

export default function Home() {
  return (
    <main id="home">
      <Header />

      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">RB CHARITY FOUNDATION</span>
            <h1>When business grows, <em>good should grow with it.</em></h1>
            <p>RB Charity Foundation channels a share of the RB Group&apos;s success into meaningful social initiatives—and invites everyone to be part of the impact.</p>
            <div className="hero-actions"><a className="btn primary" href="#donate">Donate now</a><a className="btn ghost" href="#about">Explore our work</a></div>
            <div className="hero-note"><span>●</span> Public donations + RB Group contributions</div>
          </div>
          <div className="hero-visual" aria-label="People-focused charity visual placeholder">
            <div className="photo-card photo-main"><div className="photo-placeholder"><span>Human impact photography</span><small>Replace with original RB charity field image</small></div></div>
            <div className="impact-chip"><strong>100%</strong><span>purpose-led giving</span></div>
            <div className="quote-card">“Growth means more when it creates opportunity for someone else.”</div>
          </div>
        </div>
      </section>

      <section className="trust-bar"><div className="container trust-grid"><span>RB GROUP FUNDED</span><span>PUBLIC DONATIONS</span><span>CAUSE-LED CAMPAIGNS</span><span>TRANSPARENT IMPACT</span></div></section>

      <section className="section purpose" id="about">
        <div className="container split">
          <div><span className="eyebrow dark">PROFITS WITH PURPOSE</span><h2>A foundation built into the way the RB Group grows.</h2></div>
          <div><p>RB Charity Foundation is the social-impact arm of the RB ecosystem. A portion of value created across group businesses is directed toward charitable initiatives, while individuals and partners can contribute alongside us.</p><p>The goal is simple: make giving consistent, accountable and connected to real needs.</p></div>
        </div>
        <div className="container flow-card"><div><span>01</span><strong>RB businesses grow</strong><small>Responsible commercial activity creates value.</small></div><i>→</i><div><span>02</span><strong>Value is shared</strong><small>Part of group success supports foundation initiatives.</small></div><i>→</i><div><span>03</span><strong>People join in</strong><small>Donors, volunteers and partners amplify the mission.</small></div><i>→</i><div><span>04</span><strong>Impact is documented</strong><small>Campaign updates and outcomes keep giving accountable.</small></div></div>
      </section>

      <section className="section causes" id="causes">
        <div className="container section-head"><div><span className="eyebrow dark">OUR CAUSES</span><h2>Focused help where it can matter most.</h2></div><p>These are the foundation&apos;s core areas of action. Active programmes will only display verified campaign details and real impact data.</p></div>
        <div className="container cause-grid">{causes.map((cause) => <article className="cause-card" key={cause.title}><span className="cause-icon">{cause.icon}</span><h3>{cause.title}</h3><p>{cause.description}</p><a href="#campaigns">Explore cause <span>↗</span></a></article>)}</div>
      </section>

      <section className="section impact" id="impact">
        <div className="container impact-panel"><div className="impact-copy"><span className="eyebrow">MEASURE WHAT MATTERS</span><h2>Impact should be visible, not vague.</h2><p>Once historical records are confirmed, this dashboard will show verified totals instead of inflated or invented claims.</p><a className="text-link" href="#transparency">View transparency framework →</a></div><div className="stats-grid">{impactPlaceholders.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></div>
      </section>

      <section className="section campaign" id="campaigns">
        <div className="container section-head"><div><span className="eyebrow dark">FEATURED CAMPAIGNS</span><h2>Give to a purpose you can follow.</h2></div><p>Campaign cards are designed for real targets, progress updates, media and transparent donation tracking.</p></div>
        <div className="container campaign-card"><div className="campaign-media"><span>Featured campaign image/video</span></div><div className="campaign-body"><span className="badge">Campaign template</span><h3>Verified campaign title will appear here</h3><p>We&apos;ll publish the beneficiary context, target, utilisation plan and regular progress updates before accepting campaign-specific donations.</p><div className="progress"><div className="progress-bar" /></div><div className="progress-meta"><span>₹0 verified</span><span>Target added after verification</span></div><div className="hero-actions"><a className="btn primary" href="#donate">Support this cause</a><a className="btn light" href="#stories">See updates</a></div></div></div>
      </section>

      <section className="section transparency" id="transparency"><div className="container transparency-grid"><div><span className="eyebrow dark">TRANSPARENCY BY DESIGN</span><h2>Know where support goes.</h2><p>Every public campaign can be backed by structured updates, payment records, receipts, outcome reporting and supporting media where appropriate.</p></div><div className="transparency-list"><div><b>01</b><span><strong>Donation receipt</strong><small>Unique donation and transaction reference.</small></span></div><div><b>02</b><span><strong>Campaign allocation</strong><small>See how funds are assigned to verified initiatives.</small></span></div><div><b>03</b><span><strong>Field updates</strong><small>Photos, milestones and progress from the initiative.</small></span></div><div><b>04</b><span><strong>Annual reporting</strong><small>Foundation-level summaries and disclosures.</small></span></div></div></div></section>

      <section className="section stories" id="stories"><div className="container section-head"><div><span className="eyebrow dark">STORIES OF CHANGE</span><h2>Impact is ultimately about people.</h2></div><p>Real stories will be published only with suitable consent and supporting context.</p></div><div className="container story-grid"><article className="story-feature"><div className="story-image">Featured story photography</div><div><span>FIELD STORY</span><h3>A place for one meaningful, documented story at a time.</h3><a href="#contact">Read future stories →</a></div></article><article className="story-side"><div className="story-image small">Recent work</div><h3>Field updates will live here</h3><p>Short updates from distributions, programmes and community initiatives.</p></article></div></section>

      <section className="section involvement" id="volunteer"><div className="container involvement-grid"><article><span>01</span><h3>Donate</h3><p>Support the general foundation fund or a verified campaign.</p><a href="#donate">Contribute →</a></article><article><span>02</span><h3>Volunteer</h3><p>Register your interests and participate in available drives.</p><a href="#contact">Join us →</a></article><article id="partner"><span>03</span><h3>Partner</h3><p>Collaborate through CSR, resources, expertise or community access.</p><a href="#contact">Partner with us →</a></article></div></section>

      <section className="section donate" id="donate"><div className="container donate-card"><div><span className="eyebrow">MAKE YOUR IMPACT COUNT</span><h2>Choose generosity with visibility.</h2><p>The payment layer will support one-time donations, campaign-specific contributions, custom amounts and downloadable receipts. Razorpay can be integrated once the foundation&apos;s verified payment and compliance details are supplied.</p></div><div className="donation-ui"><span className="donate-label">Choose an amount</span><div className="amounts"><button>₹500</button><button>₹1,000</button><button>₹2,500</button><button>Custom</button></div><button className="btn primary full" disabled>Donation gateway pending verification</button><small>No payment is collected in this prototype.</small></div></div></section>

      <section className="section contact" id="contact"><div className="container contact-inner"><div><span className="eyebrow dark">STAY CONNECTED</span><h2>Build something meaningful with us.</h2></div><div className="contact-actions"><a className="btn primary" href="mailto:foundation@example.com">Contact the foundation</a><span>Verified phone, email, address and registration details will be added here.</span></div></div></section>

      <Footer />
    </main>
  );
}
