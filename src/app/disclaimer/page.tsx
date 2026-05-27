import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Disclaimer – Blizine",
  description: "Blizine's Disclaimer covering affiliate relationships, advertising, paid content, and professional advice.",
  openGraph: { title: "Disclaimer – Blizine", description: "Important disclaimers about Blizine's content." },
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-br from-amber-600/20 via-accent/10 to-red-600/20 border border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(239,68,68,0.08),transparent_50%)]" />
        <div className="relative px-8 py-12 text-center">
          <div className="text-5xl mb-4">⚖️</div>
          <h1 className="text-4xl font-bold mb-2">Disclaimer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparency matters. Here is everything you need to know about our affiliate relationships,
            advertising practices, paid content, and more.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: May 27, 2026</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Affiliate Disclosure */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl shrink-0">🔗</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Affiliate Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                Blizine participates in various affiliate marketing programs. When you click on links to
                products or services on our site and make a purchase, we may earn a commission at no
                additional cost to you. These commissions help us maintain our editorial independence and
                continue producing high-quality content.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Our affiliate relationships never influence our product reviews, recommendations, or
                editorial coverage. We only promote products and services we genuinely believe will
                provide value to our readers.
              </p>
            </div>
          </div>
        </section>

        {/* Advertising Disclosure */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl shrink-0">📢</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Advertising Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                Blizine displays advertisements from third-party networks, including Google AdSense and
                direct advertising partners. These ads are clearly distinguished from editorial content.
                We do not endorse any products or services advertised on our site unless explicitly stated
                as a sponsored endorsement.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Advertisements displayed on Blizine may use cookies and tracking technologies to serve
                personalized ads based on your browsing history. You can manage your cookie preferences
                through your browser settings or visit our{' '}
                <Link href="/cookies-policy" className="text-accent hover:underline">Cookies Policy</Link> for more information.
              </p>
            </div>
          </div>
        </section>

        {/* Paid Content / Sponsored Posts */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl shrink-0">💳</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Paid Content & Sponsored Posts</h2>
              <p className="text-muted-foreground leading-relaxed">
                From time to time, Blizine publishes sponsored content or paid partnerships. All such
                content is clearly labeled with a &ldquo;Sponsored&rdquo; or &ldquo;Paid Partnership&rdquo; designation at the
                top of the article. Sponsored content is produced in collaboration with our partners but
                always adheres to our editorial standards.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Our editorial team maintains full editorial control over sponsored content to ensure it
                meets our quality guidelines and provides genuine value to our readers. We do not publish
                sponsored content that contradicts our editorial principles.
              </p>
            </div>
          </div>
        </section>

        {/* Payment Processing Disclaimer */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl shrink-0">💳</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Any payments processed through Blizine, including advertising fees, subscriptions, or
                product purchases via affiliate links, are handled by third-party payment processors.
                Blizine does not store, process, or have access to your full payment details.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                By making a payment through our site, you agree to the terms and conditions of the
                respective payment processor. Please review their privacy policy and terms of service
                before completing a transaction.
              </p>
            </div>
          </div>
        </section>

        {/* Cookie & Tracking */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl shrink-0">🍪</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Cookies & Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                Blizine uses cookies and similar tracking technologies to enhance your browsing
                experience, analyze site traffic, and serve personalized advertisements. By using our
                site, you consent to the use of cookies in accordance with our{' '}
                <Link href="/cookies-policy" className="text-accent hover:underline">Cookies Policy</Link> and{' '}
                <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                You can control cookie preferences through your browser settings. Disabling certain
                cookies may affect the functionality of our site.
              </p>
            </div>
          </div>
        </section>

        {/* No Professional Advice */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl shrink-0">⚠️</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">No Professional Advice</h2>
              <p className="text-muted-foreground leading-relaxed">
                The content on Blizine is for informational and educational purposes only. It does not
                constitute professional advice, including but not limited to financial, legal, medical,
                or technical advice. You should consult with a qualified professional for advice
                specific to your situation.
              </p>
            </div>
          </div>
        </section>

        {/* Accuracy Disclaimer */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">📝</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Accuracy & Completeness</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide accurate and up-to-date information, Blizine makes no
                representations or warranties of any kind, express or implied, about the completeness,
                accuracy, reliability, suitability, or availability of the information on our site.
                Any reliance you place on such information is strictly at your own risk.
              </p>
            </div>
          </div>
        </section>

        {/* External Links */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-xl shrink-0">🔗</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">External Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our site may contain links to external websites that are not provided or maintained by
                Blizine. We do not guarantee the accuracy, relevance, timeliness, or completeness of
                any information on these external sites. The inclusion of any link does not imply
                endorsement by Blizine.
              </p>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xl shrink-0">🔄</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Changes to This Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to update or change this Disclaimer at any time. Changes will be
                effective immediately upon posting. We encourage you to review this page periodically
                for any updates. Your continued use of the site after changes constitutes acceptance
                of the updated Disclaimer.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-br from-accent/5 to-amber-500/5 border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Questions About Our Disclaimers?</h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions or concerns about any of our disclaimers, please reach out to us.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  )
}
