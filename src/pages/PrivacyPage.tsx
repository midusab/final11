import React from 'react';

export const PrivacyPage: React.FC = () => {
  React.useEffect(() => { document.title = 'Privacy Policy — FINALL 11'; }, []);

  return (
    <div className="pt-40 pb-24 min-h-screen max-w-3xl mx-auto px-6">
      <h1 className="text-5xl font-display font-black tracking-tighter uppercase mb-4">Privacy <span className="text-brand-red">Policy</span></h1>
      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-16">Last updated: May 2026</p>

      {[
        {
          title: '1. Information We Collect',
          body: `We collect information you provide directly to us, including your name, email address, and order details when you create an account or make a purchase. We also collect usage data such as pages visited and products viewed to improve your experience.`
        },
        {
          title: '2. How We Use Your Information',
          body: `Your information is used to process orders, send order confirmations via WhatsApp, respond to inquiries, and send you promotional emails if you have subscribed to our newsletter. We do not sell your personal data to third parties.`
        },
        {
          title: '3. Cookies',
          body: `We use cookies to maintain your session, preserve your shopping cart between visits, and understand how our website is used. You may decline non-essential cookies via the cookie banner. Your cart preference is stored in your browser's local storage.`
        },
        {
          title: '4. Data Storage',
          body: `Your data is stored securely using Supabase, a cloud database platform. All data is encrypted in transit using industry-standard TLS. We retain your data for as long as your account is active or as needed to provide services.`
        },
        {
          title: '5. Your Rights',
          body: `You have the right to access, correct, or delete your personal information at any time. To request deletion of your account or data, contact us at the inquiry page. We will process your request within 30 days.`
        },
        {
          title: '6. Contact',
          body: `If you have any questions about this Privacy Policy, please contact us via WhatsApp at +254 794 900 546 or through the Inquiry page on this website.`
        }
      ].map(section => (
        <div key={section.title} className="mb-12 border-l-2 border-brand-red pl-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">{section.title}</h2>
          <p className="text-sm text-white/60 leading-relaxed">{section.body}</p>
        </div>
      ))}
    </div>
  );
};
