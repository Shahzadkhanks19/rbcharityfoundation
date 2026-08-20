import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">RB</span><span><strong>RB Charity</strong><small>Foundation</small></span></div>
          <p>Turning responsible business growth and public generosity into transparent, meaningful action.</p>
        </div>
        <div><h3>Foundation</h3><Link href="#about">About us</Link><Link href="#impact">Our impact</Link><Link href="#stories">Stories</Link><Link href="#contact">Contact</Link></div>
        <div><h3>Get involved</h3><Link href="#donate">Donate</Link><Link href="#volunteer">Volunteer</Link><Link href="#partner">Partner with us</Link><Link href="#campaigns">Campaigns</Link></div>
        <div><h3>Transparency</h3><span>Annual reports</span><span>Financial disclosures</span><span>Donation receipts</span><span>Policies & legal</span></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} RB Charity Foundation.</span><span>Profits with purpose.</span></div>
    </footer>
  );
}
