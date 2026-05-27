import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us – Blizine",
  description: "Get in touch with the Blizine team. Reach out for editorial inquiries, advertising, partnerships, or general feedback.",
  openGraph: { title: "Contact Us – Blizine", description: "Reach out to the Blizine team." },
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We value your feedback and inquiries. Here is how you can reach the right team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3">Editorial Inquiries</h2>
          <p className="text-sm text-muted-foreground mb-4">
            For story tips, press releases, corrections, or content suggestions.
          </p>
          <a href="mailto:editorial@blizine.com" className="text-accent hover:underline font-medium">editorial@blizine.com</a>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3">Advertising & Partnerships</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Interested in advertising with us or exploring partnership opportunities?
          </p>
          <a href="mailto:ads@blizine.com" className="text-accent hover:underline font-medium">ads@blizine.com</a>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3">Privacy & Legal</h2>
          <p className="text-sm text-muted-foreground mb-4">
            For privacy-related requests or legal inquiries.
          </p>
          <a href="mailto:legal@blizine.com" className="text-accent hover:underline font-medium">legal@blizine.com</a>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3">General Feedback</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Something on your mind? We read every message.
          </p>
          <a href="mailto:hello@blizine.com" className="text-accent hover:underline font-medium">hello@blizine.com</a>
        </div>
      </div>

      <section className="bg-card border rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input type="text" className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea rows={5} className="w-full bg-background border rounded-lg px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none" placeholder="Write your message..." />
          </div>
          <button type="submit" className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
            Send Message
          </button>
        </form>
      </section>

      <div className="text-center text-sm text-muted-foreground">
        You can also write to us at: <span className="font-medium text-foreground">Blizine Media, 123 Innovation Drive, San Francisco, CA 94105</span>
      </div>
    </div>
  )
}
