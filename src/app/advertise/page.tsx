import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Advertise With Us – Blizine",
  description: "Reach a highly engaged tech audience. Explore advertising opportunities on Blizine including display ads, sponsored content, and newsletter placements.",
  openGraph: { title: "Advertise With Us – Blizine", description: "Explore advertising opportunities on Blizine." },
}

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Advertise With Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect your brand with thousands of tech-savvy professionals and enthusiasts who trust Blizine daily.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: "50K+", label: "Monthly Visitors" },
          { value: "8K+", label: "Newsletter Subscribers" },
          { value: "95%", label: "Reader Satisfaction" },
          { value: "4M+", label: "Monthly Impressions" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ad Formats */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Ad Formats</h2>
        <div className="space-y-4">
          {[
            { title: "Display Ads", desc: "Banner and sidebar placements in premium positions throughout the site. Available in multiple sizes (728x90, 300x250, 160x600).", price: "From $500/week" },
            { title: "Sponsored Content", desc: "Native articles that blend seamlessly with our editorial content. Includes social media promotion and newsletter feature.", price: "From $1,500/post" },
            { title: "Newsletter Sponsorship", desc: "Get your brand in front of our engaged email subscribers with a dedicated placement in our weekly newsletter.", price: "From $750/send" },
            { title: "Affiliate Partnerships", desc: "Promote your products through our trusted affiliate network with performance-based pricing.", price: "Commission-based" },
          ].map((fmt) => (
            <div key={fmt.title} className="bg-card border rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{fmt.title}</h3>
                <p className="text-sm text-muted-foreground">{fmt.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-accent font-bold">{fmt.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Blizine */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Why Advertise With Blizine?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Targeted Audience", desc: "Reach decision-makers, developers, and tech enthusiasts actively seeking quality content." },
            { title: "High Engagement", desc: "Our readers spend an average of 4+ minutes per session, ensuring your message is seen." },
            { title: "Brand Safety", desc: "Your ads appear alongside professionally curated, family-safe content in a trusted environment." },
          ].map((item) => (
            <div key={item.title} className="bg-card border rounded-xl p-6">
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Contact our advertising team for a customized proposal.
        </p>
        <a href="mailto:ads@blizine.com" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
          ads@blizine.com
        </a>
      </section>
    </div>
  )
}
