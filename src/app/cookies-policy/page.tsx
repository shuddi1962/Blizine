import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Cookies Policy – Blizine",
  description: "Blizine's Cookies Policy explains how we use cookies and similar technologies to enhance your experience, analyze traffic, and serve personalized ads.",
  openGraph: { title: "Cookies Policy – Blizine", description: "How Blizine uses cookies and tracking technologies." },
}

export default function CookiesPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-12 min-h-[280px] flex items-center">
        <Image src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg" alt="Cookies and tracking" fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0000CD]/90 via-[#0000CD]/70 to-transparent" />
        <div className="relative z-10 px-8 py-12 text-white max-w-xl">
          <div className="text-5xl mb-4">🍪</div>
          <h1 className="text-4xl font-bold mb-2">Cookies Policy</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            How Blizine uses cookies and similar tracking technologies to improve your experience.
          </p>
          <p className="text-sm text-white/60 mt-4">Last updated: May 27, 2026</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Introduction */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl shrink-0">📖</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile)
                when you visit a website. They help websites remember your preferences, understand how you
                use the site, and deliver relevant content and advertisements.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                This Cookies Policy explains what cookies we use, why we use them, and how you can manage
                your cookie preferences. By continuing to use Blizine, you consent to the use of cookies
                as described in this policy.
              </p>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl shrink-0">📋</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Types of Cookies We Use</h2>
              <p className="text-muted-foreground">We use the following categories of cookies:</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm">✓</span>
                <h3 className="font-bold text-lg">Essential Cookies</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                These cookies are necessary for the basic functionality of our site. They enable core
                features like page navigation, secure access, and maintaining your session. The site
                cannot function properly without these cookies.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">📊</span>
                <h3 className="font-bold text-lg">Analytics Cookies</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                These cookies help us understand how visitors interact with our site by collecting and
                reporting information anonymously. We use this data to improve our content, optimize
                site performance, and enhance user experience. We use services like Google Analytics.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm">🎯</span>
                <h3 className="font-bold text-lg">Advertising Cookies</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                These cookies are set by our advertising partners (including Google AdSense) to deliver
                relevant advertisements based on your browsing history and interests. They also help
                measure the effectiveness of advertising campaigns and prevent the same ad from appearing
                too frequently.
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm">⚙️</span>
                <h3 className="font-bold text-lg">Preference Cookies</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                These cookies remember your settings and preferences, such as your preferred theme
                (light/dark mode), language, and region. They enhance your experience by providing
                personalized features.
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl shrink-0">🏢</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We work with trusted third-party service providers who may set their own cookies on your
                device. These include:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-muted-foreground">
                <li><strong>Google AdSense & Ad Partners</strong> &mdash; For serving personalized advertisements</li>
                <li><strong>Google Analytics</strong> &mdash; For analyzing site traffic and user behavior</li>
                <li><strong>Social Media Platforms</strong> &mdash; For content sharing and social features</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                These third parties have their own privacy and cookie policies governing the use of your
                information. We recommend reviewing their policies for complete transparency.
              </p>
            </div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl shrink-0">🔧</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have full control over cookies. Here is how you can manage them:
              </p>
            </div>
          </div>
          <div className="space-y-4 ml-16">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-bold mb-1">Browser Settings</h3>
              <p className="text-sm text-muted-foreground">
                Most web browsers allow you to control cookies through their settings. You can choose to
                block all cookies, accept all cookies, or clear cookies when you close your browser. Check
                your browser&apos;s help section for instructions.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-bold mb-1">Opt Out of Personalized Ads</h3>
              <p className="text-sm text-muted-foreground">
                You can opt out of personalized advertising by visiting{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener" className="text-accent hover:underline">Google&apos;s Ads Settings</a>.
                You can also visit{' '}
                <a href="https://optout.aboutads.info" target="_blank" rel="noopener" className="text-accent hover:underline">aboutads.info</a>{' '}
                to opt out of interest-based advertising from participating companies.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-bold mb-1">Cookie Consent Tools</h3>
              <p className="text-sm text-muted-foreground">
                When you first visit our site, you may see a cookie consent banner that allows you to
                customize your cookie preferences for Blizine.
              </p>
            </div>
          </div>
        </section>

        {/* GDPR Compliance */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xl shrink-0">🇪🇺</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">GDPR Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                For users in the European Economic Area (EEA), we comply with the General Data Protection
                Regulation (GDPR). We obtain your explicit consent before placing non-essential cookies
                on your device. You have the right to withdraw your consent at any time.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                For more information about how we handle your personal data, please see our{' '}
                <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="bg-card border rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">🔄</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookies Policy from time to time to reflect changes in technology,
                regulation, or our data practices. Any changes will be posted on this page with an updated
                &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-br from-orange-500/5 to-accent/5 border border-orange-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Have Questions About Cookies?</h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about our use of cookies, please contact us.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  )
}
