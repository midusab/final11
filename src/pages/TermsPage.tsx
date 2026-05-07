import React from 'react';

export const TermsPage: React.FC = () => {
  React.useEffect(() => { document.title = 'Terms & Conditions — FINALL 11'; }, []);

  return (
    <div className="pt-40 pb-24 min-h-screen max-w-3xl mx-auto px-6">
      <h1 className="text-5xl font-display font-black tracking-tighter uppercase mb-4">Terms & <span className="text-brand-red">Conditions</span></h1>
      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-16">Last updated: May 2026</p>

      {[
        {
          title: '1. Acceptance of Terms',
          body: `By accessing and using the FINALL 11 website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.`
        },
        {
          title: '2. Products & Pricing',
          body: `All prices are listed in Kenyan Shillings (KES) and are inclusive of applicable taxes. FINALL 11 reserves the right to modify prices at any time without notice. Products are subject to availability. We reserve the right to limit quantities.`
        },
        {
          title: '3. Orders & Payments',
          body: `Orders are placed via WhatsApp and confirmed upon receipt of payment. Payment must be made in full before dispatch. FINALL 11 accepts M-Pesa and bank transfers. Order confirmation will be sent via WhatsApp.`
        },
        {
          title: '4. Shipping & Delivery',
          body: `Delivery times vary by location. FINALL 11 is not responsible for delays caused by third-party couriers. Risk of loss passes to you upon dispatch. Shipping costs are communicated at the time of order.`
        },
        {
          title: '5. Returns & Exchanges',
          body: `Items may be returned or exchanged within 7 days of delivery, provided they are in their original, unworn condition with all tags attached. Custom or limited-edition items are non-returnable. Contact us via WhatsApp to initiate a return.`
        },
        {
          title: '6. Intellectual Property',
          body: `All content on this website, including images, designs, and branding, is the property of FINALL 11 and is protected by copyright law. You may not reproduce, distribute, or use any content without prior written permission.`
        },
        {
          title: '7. Limitation of Liability',
          body: `FINALL 11 shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or purchase of products. Our liability is limited to the purchase price of the affected item.`
        },
        {
          title: '8. Governing Law',
          body: `These Terms are governed by the laws of Kenya. Any disputes shall be resolved under Kenyan jurisdiction.`
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
