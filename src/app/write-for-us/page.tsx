import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Write For Us – Blizine",
  description: "Contribute to Blizine. We welcome guest posts, expert insights, and original research on technology, AI, cybersecurity, and digital innovation.",
  openGraph: { title: "Write For Us – Blizine", description: "Contribute to Blizine as a guest writer." },
}

export default function WriteForUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Write For Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share your expertise with thousands of tech enthusiasts. We welcome contributions from writers,
          developers, and industry professionals.
        </p>
      </div>

      {/* Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Submission Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Original Content", desc: "All submissions must be original and not published elsewhere. We use plagiarism detection tools." },
            { title: "Length", desc: "Articles should be 1,000–2,500 words. Well-researched pieces with data and examples perform best." },
            { title: "Tone & Style", desc: "Professional yet accessible. Avoid overly promotional language. Write for a knowledgeable but general tech audience." },
            { title: "Formatting", desc: "Use clear headings, bullet points, and short paragraphs. Include at least one featured image (1200x630px)." },
            { title: "Citations", desc: "Cite all sources with hyperlinks. Fact-check all claims and statistics before submitting." },
            { title: "Author Bio", desc: "Include a short bio (2-3 sentences) and a headshot. You may include one link to your personal site or LinkedIn." },
          ].map((g) => (
            <div key={g.title} className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-1">{g.title}</h3>
              <p className="text-sm text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Topics We Cover</h2>
        <div className="flex flex-wrap gap-2">
          {["Artificial Intelligence", "Machine Learning", "Cybersecurity", "Cloud Computing", "DevOps", "Web Development", "Mobile Apps", "Gadgets & Hardware", "Startups", "Digital Business", "Programming Languages", "Open Source", "Tech Reviews", "Tutorials & How-Tos", "Tech Industry Analysis"].map((topic) => (
            <span key={topic} className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">{topic}</span>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Process</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Pitch Your Idea", desc: "Send a short outline (2-3 paragraphs) to our editorial team." },
            { step: "2", title: "Get Approved", desc: "We review your pitch and confirm within 3-5 business days." },
            { step: "3", title: "Write & Submit", desc: "Write your article following our guidelines and submit via email." },
            { step: "4", title: "Review & Publish", desc: "Our editors review for quality, accuracy, and SEO. We publish within 7 days of approval." },
          ].map((p) => (
            <div key={p.step} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shrink-0">{p.step}</div>
              <div>
                <h3 className="font-bold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Contribute?</h2>
        <p className="text-muted-foreground mb-6">
          Send your pitch or complete article to our editorial team.
        </p>
        <a href="mailto:editorial@blizine.com" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
          editorial@blizine.com
        </a>
      </section>
    </div>
  )
}
