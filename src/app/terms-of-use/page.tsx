import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use – Blizine",
  description: "Blizine's Terms of Use governing access to and use of our website, content, and services.",
  openGraph: { title: "Terms of Use – Blizine" },
}

export default function TermsOfUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: May 27, 2026</p>

      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-accent">
        <section className="mb-8">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Blizine (&quot;the Site&quot;), you agree to be bound by these Terms of Use. If you
            do not agree with any part of these terms, you must not use the Site.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Intellectual Property Rights</h2>
          <p>
            All content published on Blizine, including articles, images, graphics, logos, and code, is the
            property of Blizine or its content providers and is protected by international copyright laws.
          </p>
          <p>You may not:</p>
          <ul>
            <li>Republish material from Blizine without attribution</li>
            <li>Sell, rent, or sub-license content from Blizine</li>
            <li>Reproduce, duplicate, or copy content for commercial purposes</li>
            <li>Redistribute content from Blizine unless content is expressly made available for redistribution</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. User Conduct</h2>
          <p>When using our Site, you agree to:</p>
          <ul>
            <li>Provide accurate information when creating an account or subscribing</li>
            <li>Not use the Site for any unlawful purpose</li>
            <li>Not disrupt or interfere with the security of the Site</li>
            <li>Not post or transmit any harmful or malicious content</li>
            <li>Respect other users in comments and discussions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. User-Generated Content</h2>
          <p>
            By submitting comments, feedback, or other content to Blizine, you grant us a non-exclusive,
            royalty-free license to use, reproduce, and distribute that content in connection with our Site.
            You represent that you own the rights to any content you submit.
          </p>
          <p>
            We reserve the right to moderate, edit, or remove user-generated content that violates our policies
            or applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2>5. Affiliate Disclosure</h2>
          <p>
            Blizine participates in various affiliate marketing programs. This means we may earn commissions
            on purchases made through links on our site. These commissions come at no additional cost to you.
            Our editorial content is never influenced by affiliate partnerships.
          </p>
        </section>

        <section className="mb-8">
          <h2>6. Disclaimer</h2>
          <p>
            The information provided on Blizine is for general informational purposes only. While we strive
            to keep the information accurate and up-to-date, we make no representations or warranties of any
            kind, express or implied, about the completeness, accuracy, reliability, or suitability of the
            information.
          </p>
        </section>

        <section className="mb-8">
          <h2>7. Limitation of Liability</h2>
          <p>
            Blizine shall not be liable for any damages arising from the use or inability to use our Site,
            including but not limited to direct, indirect, incidental, punitive, and consequential damages.
          </p>
        </section>

        <section className="mb-8">
          <h2>8. External Links</h2>
          <p>
            Our Site may contain links to third-party websites. We have no control over the content, privacy
            policies, or practices of these sites and assume no responsibility for them.
          </p>
        </section>

        <section className="mb-8">
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately
            upon posting. Your continued use of the Site after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Governing Law</h2>
          <p>
            These Terms of Use shall be governed by and construed in accordance with the laws of the United
            States and the State of California, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2>11. Contact</h2>
          <p>
            For questions about these Terms of Use, please contact us at{' '}
            <a href="mailto:legal@blizine.com">legal@blizine.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
