import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us – Blizine",
  description: "Blizine is your trusted source for breaking tech news, in-depth reviews, and expert analysis on AI, cybersecurity, gadgets, and digital innovation.",
  openGraph: { title: "About Us – Blizine", description: "Learn about Blizine's mission, team, and editorial standards." },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-heading)]">About Blizine</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your trusted destination for technology news, expert reviews, and in-depth analysis since 2024.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          At Blizine, we believe that understanding technology is essential for everyone. Our mission is to
          demystify complex tech topics and deliver accurate, timely, and actionable information to our readers.
          Whether you are a seasoned developer, a business leader, or a curious enthusiast, we provide the
          insights you need to stay ahead in a rapidly evolving digital world.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We are committed to journalistic integrity, editorial independence, and the highest standards of
          accuracy. Every article undergoes rigorous fact-checking and review before publication.
        </p>
      </section>

      {/* Editorial Standards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Editorial Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Fact-Checking</h3>
            <p className="text-sm text-muted-foreground">Every story is verified against multiple authoritative sources before publication. Corrections are promptly issued when errors are identified.</p>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Independence</h3>
            <p className="text-sm text-muted-foreground">Our editorial team operates independently of advertisers and sponsors. Sponsored content is clearly labelled to maintain transparency.</p>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Diversity & Inclusion</h3>
            <p className="text-sm text-muted-foreground">We strive to represent diverse perspectives in our coverage and ensure our content is accessible to a global audience.</p>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Privacy Respect</h3>
            <p className="text-sm text-muted-foreground">We minimize data collection and never sell personal information. See our <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> for details.</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Blizine is powered by a global network of experienced journalists, technology experts, and content
          creators who share a passion for innovation. Our team brings decades of combined experience from
          leading technology publications and the software industry.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
        <p className="text-muted-foreground mb-6">
          Have a tip, question, or feedback? We would love to hear from you.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Contact Us
        </Link>
      </section>
    </div>
  )
}
