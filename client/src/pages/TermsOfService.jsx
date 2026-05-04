import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, AlertCircle } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the SmartLocal platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service. These Terms apply to all users of the platform, including customers, service providers, and administrators.`,
  },
  {
    title: '2. Description of Service',
    content: `SmartLocal is an online marketplace that connects individuals seeking home services ("Customers") with independent service professionals ("Providers"). SmartLocal does not directly provide home services; we facilitate the booking process and provide a platform for Customers and Providers to interact. All services listed are offered by independent third-party professionals.`,
  },
  {
    title: '3. User Accounts',
    content: `To access certain features, you must create an account. You agree to:\n• Provide accurate, current, and complete information during registration.\n• Maintain the security of your password and accept responsibility for all activity under your account.\n• Notify us immediately at support@smartlocal.in if you suspect unauthorized account use.\n\nWe reserve the right to suspend or terminate accounts that violate these Terms.`,
  },
  {
    title: '4. Booking & Payments',
    content: `All bookings are subject to provider availability. Payment is due upon completion of the service unless otherwise specified. SmartLocal accepts UPI, debit/credit cards, net banking, and cash. All prices are inclusive of applicable taxes.\n\nSmartLocal charges a platform fee of 15–20% on each transaction to maintain the platform and provide customer support. This is already included in the displayed price — there are no additional charges to customers.`,
  },
  {
    title: '5. Cancellation & Refund Policy',
    content: `Customers may cancel a booking free of charge up to 2 hours before the scheduled service time. Cancellations within 2 hours may incur a ₹50 cancellation fee.\n\nIf a Provider cancels, Customers will receive a full refund or the option to rebook with a different provider.\n\nRefunds for completed services are evaluated on a case-by-case basis in accordance with our Satisfaction Guarantee. Approved refunds are credited within 5–7 business days.`,
  },
  {
    title: '6. Provider Responsibilities',
    content: `Service Providers on SmartLocal agree to:\n• Maintain valid licenses, certifications, and insurance applicable to their trade.\n• Arrive on time and complete services professionally.\n• Not solicit customers outside SmartLocal for bookings originally referred through our platform.\n• Comply with all applicable local laws and regulations.\n\nSmartLocal reserves the right to delist providers who receive repeated negative reviews or violate our code of conduct.`,
  },
  {
    title: '7. Prohibited Activities',
    content: `You agree not to:\n• Use the platform for any unlawful purpose.\n• Post false, misleading, or defamatory reviews.\n• Attempt to circumvent SmartLocal's booking system to transact off-platform.\n• Reverse engineer, scrape, or extract data from our platform.\n• Upload malware, spam, or any harmful content.\n\nViolation of these prohibitions may result in immediate account termination and legal action.`,
  },
  {
    title: '8. Intellectual Property',
    content: `All content on SmartLocal — including logos, text, graphics, UI design, and code — is the intellectual property of SmartLocal Technologies Pvt. Ltd. and is protected under Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without written permission.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by law, SmartLocal shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data, loss of revenue, or property damage caused by a Service Provider.\n\nSmartLocal's total liability in any matter arising from these Terms shall not exceed the amount paid by you to SmartLocal in the 3 months preceding the claim.`,
  },
  {
    title: '10. Dispute Resolution',
    content: `Any disputes arising from these Terms or your use of SmartLocal will first be attempted to be resolved through our Customer Support team. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India, in accordance with the laws of India.`,
  },
  {
    title: '11. Changes to Terms',
    content: `SmartLocal reserves the right to modify these Terms at any time. We will notify users of significant changes via email or an in-app notification. Continued use of the platform after changes constitutes acceptance of the revised Terms.`,
  },
  {
    title: '12. Contact Us',
    content: `If you have any questions about these Terms, please contact us at:\n📧 legal@smartlocal.in\n📞 +91 9876-543-210\n🏢 SmartLocal Technologies Pvt. Ltd., 5th Floor, Cyber Hub, Gurugram, Haryana — 122002`,
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-slate-300 text-sm">
            Last updated: <strong>April 1, 2026</strong> · Effective: April 1, 2026
          </p>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Please read these terms carefully before using SmartLocal. By using our platform you agree to be legally bound by these terms.
          </p>
        </div>
      </section>

      {/* Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Important:</strong> These Terms constitute a legally binding agreement between you and SmartLocal Technologies Pvt. Ltd. If you disagree with any part, please discontinue use of the platform.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* TOC Sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#section-${i}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 leading-relaxed transition-colors">
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
              <section key={i} id={`section-${i}`}>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                  {s.title}
                </h2>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              </section>
            ))}

            <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
              <Link to="/privacy" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
                <Shield className="w-4 h-4" /> View Privacy Policy
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Contact Us with Questions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
