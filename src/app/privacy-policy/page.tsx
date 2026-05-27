import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy – Blizine",
  description: "Blizine's Privacy Policy explains how we collect, use, and protect your personal information in compliance with GDPR, CCPA, and Google AdSense policies.",
  openGraph: { title: "Privacy Policy – Blizine", description: "How Blizine handles your data." },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-purple-600/20 border border-blue-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative px-8 py-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Blizine collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: May 27, 2026</p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-accent">
        <section className="!mb-0">
          <h2>1. Introduction</h2>
          <p>
            Blizine (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section className="mb-8">
          <h2>2. Information We Collect</h2>
          <h3>Personal Data</h3>
          <p>We may collect personally identifiable information such as your name and email address when you:</p>
          <ul>
            <li>Subscribe to our newsletter</li>
            <li>Submit a contact form</li>
            <li>Leave a comment</li>
            <li>Create an account</li>
          </ul>
          <h3>Non-Personal Data</h3>
          <p>We automatically collect certain information when you visit our site, including:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referral source</li>
            <li>IP address (anonymized where possible)</li>
            <li>Device type and operating system</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>3. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze site
            traffic, and serve personalized advertisements. You can control cookie preferences through your
            browser settings.
          </p>
          <h3>Types of Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the basic functionality of our site.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads and measure ad performance.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>4. Google AdSense</h2>
          <p>
            We use Google AdSense to display advertisements. Google and its partners use cookies to serve ads
            based on your previous visits to our site or other websites. You can opt out of personalized
              advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google&apos;s Ads Settings</a>.
          </p>
          <p>
            As part of Google&apos;s EU user consent policy, we obtain consent for the use of cookies for
            personalization of ads in compliance with GDPR.
          </p>
        </section>

        <section className="mb-8">
          <h2>5. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>To operate and maintain our website</li>
            <li>To send newsletters and promotional emails (with consent)</li>
            <li>To respond to your inquiries and comments</li>
            <li>To analyze usage patterns and improve our content</li>
            <li>To serve targeted advertisements</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>6. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party vendors who help us operate our site (analytics, email delivery, hosting).</li>
            <li><strong>Advertising Partners:</strong> Google AdSense and other ad networks for ad delivery.</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary for the purposes outlined in this policy.
            Newsletter subscribers can unsubscribe at any time, and we will delete your data upon request.
          </p>
        </section>

        <section className="mb-8">
          <h2>8. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of your personal data.</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data (&quot;Right to be Forgotten&quot;).</li>
            <li><strong>Right to Restrict Processing:</strong> Limit how we use your data.</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured format.</li>
            <li><strong>Right to Object:</strong> Object to data processing for marketing purposes.</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:privacy@blizine.com">privacy@blizine.com</a>.</p>
        </section>

        <section className="mb-8">
          <h2>9. Third-Party Links</h2>
          <p>
            Our site may contain links to third-party websites. We are not responsible for the privacy practices
            of these sites. We encourage you to review their privacy policies before providing any personal
            information.
          </p>
        </section>

        <section className="mb-8">
          <h2>10. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 13. We do not knowingly collect
            personal information from children. If we become aware that a child has provided us with personal
            data, we will take steps to delete it.
          </p>
        </section>

        <section className="mb-8">
          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@blizine.com">privacy@blizine.com</a> or through our{' '}
            <a href="/contact">Contact page</a>.
          </p>
        </section>
      </div>
      </div>
    </div>
  )
}
