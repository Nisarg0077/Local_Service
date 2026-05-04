import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Bell, FileText } from 'lucide-react';

const sections = [
  {
    icon: <Database className="w-5 h-5" />,
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us and information we gather automatically.

**Information you provide:**
• Name, email address, phone number when you register
• Delivery address and location details for service bookings
• Payment information (processed securely via PCI-compliant gateways — we do not store card numbers)
• Communications with our support team
• Reviews and ratings you submit

**Information collected automatically:**
• Device information (model, OS, browser type)
• IP address and approximate geographic location
• Usage data (pages visited, features used, time spent)
• Cookies and similar tracking technologies`,
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:
• Create and manage your account
• Facilitate bookings and connect you with service providers
• Process payments and send receipts
• Send booking confirmations, reminders, and service updates (SMS/email)
• Improve our platform through analytics and user research
• Detect and prevent fraud and unauthorized access
• Comply with legal obligations
• Send marketing communications (only with your consent — you can opt out anytime)`,
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: '3. Data Sharing & Disclosure',
    content: `We do not sell your personal data. We share information only in these circumstances:

• **With Service Providers:** Your name, phone number, and service address are shared with the assigned professional to complete your booking.
• **Payment Processing:** Payment data is handled by Razorpay and Stripe under their respective privacy policies.
• **Analytics Partners:** Anonymized, aggregated usage data with Google Analytics to improve our service.
• **Legal Compliance:** We may disclose data if required by Indian law, court order, or government authority.
• **Business Transfers:** In the event of a merger or acquisition, data may be transferred with notice to users.`,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: '4. Data Security',
    content: `We take data security seriously and implement industry-standard measures:
• All data transmitted between your device and our servers is encrypted using TLS 1.3.
• Passwords are hashed using bcrypt — we never store plaintext passwords.
• Our servers are hosted on AWS with access controls, firewalls, and regular security audits.
• We conduct penetration testing quarterly.

While we use best practices, no system is 100% secure. Please use a strong, unique password and enable any available two-factor authentication.`,
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: '5. Cookies & Tracking',
    content: `We use cookies and similar technologies to:
• Keep you logged in across sessions
• Remember your preferences (dark mode, city, etc.)
• Analyze traffic and usage patterns
• Show relevant promotional offers

You can manage cookie preferences in your browser settings. Disabling cookies may affect certain features of the platform. We use Google Analytics (with IP anonymization) for usage analytics.`,
  },
  {
    title: '6. Your Rights & Choices',
    icon: <Eye className="w-5 h-5" />,
    content: `As a user, you have the following rights regarding your personal data:
• **Access:** Request a copy of all personal data we hold about you.
• **Correction:** Update or correct inaccurate information via your profile settings.
• **Deletion:** Request deletion of your account and associated data (subject to legal retention requirements).
• **Portability:** Request your data in a portable, machine-readable format.
• **Opt-out:** Unsubscribe from marketing emails at any time via the link in any email.

To exercise these rights, email us at privacy@smartlocal.in with subject "Data Request".`,
  },
  {
    title: '7. Data Retention',
    icon: <Database className="w-5 h-5" />,
    content: `We retain your personal data for as long as your account is active or as needed to provide services. After account deletion:
• Basic account data is deleted within 30 days.
• Transaction records are retained for 7 years as required by Indian taxation laws (GST).
• Anonymized analytics data may be retained indefinitely.

Backup data may take up to 90 days to be fully purged.`,
  },
  {
    title: '8. Children\'s Privacy',
    icon: <Shield className="w-5 h-5" />,
    content: `SmartLocal is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have collected data from a child under 18 without parental consent, we will promptly delete that information. Parents or guardians with concerns may contact us at support@smartlocal.in.`,
  },
  {
    title: '9. Third-Party Links',
    icon: <Eye className="w-5 h-5" />,
    content: `Our platform may contain links to third-party websites (e.g., social media, payment gateways). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any personal information.`,
  },
  {
    title: '10. Updates to This Policy',
    icon: <Bell className="w-5 h-5" />,
    content: `We may update this Privacy Policy periodically. When we make material changes, we will notify you via email and/or an in-app notification at least 14 days before the changes take effect. The "Last Updated" date at the top of this page reflects the most recent revision. Continued use of the platform after the effective date constitutes acceptance of the revised policy.`,
  },
  {
    title: '11. Contact & Grievance Officer',
    icon: <FileText className="w-5 h-5" />,
    content: `For privacy-related questions, requests, or complaints, please contact:\n\n📧 privacy@smartlocal.in\n\nGrievance Officer (as per IT Act 2000):\nMs. Neha Gupta\nSmartLocal Technologies Pvt. Ltd.\n5th Floor, Cyber Hub, Gurugram, Haryana — 122002\nResponse time: Within 30 days of receipt.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-emerald-700 to-green-700 text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-emerald-200 text-sm mb-4">
            Last updated: <strong>April 1, 2026</strong>
          </p>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm leading-relaxed">
            At SmartLocal, your privacy is not just a legal checkbox — it's a core value. Here's exactly how we collect, use, and protect your data.
          </p>
        </div>
      </section>

      {/* Quick Summary */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold text-slate-800 dark:text-white mb-4 text-center">The Short Version</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🚫', text: 'We never sell your data to third parties' },
              { icon: '🔒', text: 'All data is encrypted in transit and at rest' },
              { icon: '👁', text: 'You can access, correct, or delete your data anytime' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* TOC */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Sections</h3>
              <ul className="space-y-2">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#priv-section-${i}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 transition-colors">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-10">
            {sections.map((s, i) => (
              <section key={i} id={`priv-section-${i}`}>
                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    {s.icon}
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">{s.title}</h2>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              </section>
            ))}

            <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
              <Link to="/terms" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
                <FileText className="w-4 h-4" /> View Terms of Service
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Contact Us with Questions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
