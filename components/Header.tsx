"use client";

import { useState } from "react";
import Link from "next/link";

const links = ["About", "Causes", "Campaigns", "Impact", "Stories", "Volunteer", "Contact"];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>An initiative of the RB Group</span>
          <span>Business growth. Shared impact.</span>
        </div>
      </div>
      <div className="container nav-wrap">
        <Link href="#home" className="brand" aria-label="RB Charity Foundation home">
          <span className="brand-mark">RB</span>
          <span><strong>RB Charity</strong><small>Foundation</small></span>
        </Link>
        <button className="menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation" aria-expanded={open}>☰</button>
        <nav className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          {links.map((link) => <Link key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}>{link}</Link>)}
          <Link className="donate-nav" href="#donate" onClick={() => setOpen(false)}>Donate Now</Link>
        </nav>
      </div>
    </header>
  );
}
