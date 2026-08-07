-- Phase 9: Contact Inquiries, Booking Calendar & Social Testimonials CMS
-- Seeds the validated `contact_config` document in site_settings (contact
-- section/quick links, booking settings, testimonial display settings) and adds
-- support columns for messages (archived) and testimonials (featured, logo).
--
-- NOTE: The app code is resilient and uses DEFAULT_CONTACT_CONFIG fallback and
-- tolerant column handling, so the site works even before this is applied.

-- Part B: support columns (idempotent)
alter table public.messages add column if not exists archived boolean not null default false;
alter table public.testimonials add column if not exists featured boolean not null default false;
alter table public.testimonials add column if not exists logo text;

-- Part A: contact configuration
insert into public.site_settings (key, value)
values (
  'contact_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "📬 যোগাযোগ",
      "badgeEn": "📬 Contact",
      "titleBn": "আমার সাথে যোগাযোগ করুন",
      "titleEn": "Get in Touch",
      "subtitleBn": "প্রজেক্ট, সহযোগিতা বা যেকোনো প্রশ্নের জন্য আমাকে বার্তা পাঠান",
      "subtitleEn": "Send me a message for projects, collaboration, or any questions"
    },
    "quickLinks": {
      "whatsappBn": "হোয়াটসঅ্যাপ",
      "whatsappEn": "WhatsApp",
      "whatsappUrl": "https://wa.me/8801XXXXXXXXX",
      "emailBn": "ইমেইল",
      "emailEn": "Email",
      "emailAddress": "hello@rahatverse.dev",
      "phoneBn": "ফোন",
      "phoneEn": "Phone",
      "phoneNumber": "+880 1XXX-XXXXXX",
      "responseTimeBn": "সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই",
      "responseTimeEn": "I usually reply within 24 hours"
    },
    "booking": {
      "headingBn": "অ্যাপয়েন্টমেন্ট বুকিং",
      "headingEn": "Appointment Booking",
      "timeSlots": ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
      "bufferMinutes": 15,
      "maxPerWeek": 10,
      "purposes": [
        { "id": "purpose-consult", "value": "consultation", "labelBn": "কনসালটেশন", "labelEn": "Consultation", "visible": true },
        { "id": "purpose-project", "value": "project", "labelBn": "প্রজেক্ট আলোচনা", "labelEn": "Project Discussion", "visible": true },
        { "id": "purpose-blood", "value": "blood", "labelBn": "রক্তদান", "labelEn": "Blood Donation", "visible": true }
      ],
      "confirmationMessageBn": "আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।",
      "confirmationMessageEn": "Your appointment is confirmed. We will contact you shortly."
    },
    "testimonials": {
      "headingBn": "মানুষ যা বলছে",
      "headingEn": "What People Say",
      "subtitleBn": "আমার সাথে কাজ করেছেন এমন ক্লায়েন্ট ও সহযোগীদের অভিজ্ঞতা",
      "subtitleEn": "Experiences of clients and collaborators I've worked with",
      "carouselCount": 5,
      "autoPlaySeconds": 5
    }
  }
  $$
)
on conflict (key) do nothing;
