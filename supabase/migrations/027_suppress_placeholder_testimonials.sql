-- Phase 4A: Suppress placeholder testimonial content at the data layer.
-- Targeted, idempotent migration: it un-approves ONLY rows that match the
-- known placeholder seed values ("Client Name" / "Role" / "Company" /
-- "Testimonial content") so no fabricated review can appear publicly.
-- Real, admin-approved testimonials are untouched, and the submission +
-- moderation workflow is fully preserved for future genuine testimonials.

update public.testimonials
set is_approved = false
where is_approved = true
  and (
    btrim(name) ilike 'Client Name'
    or btrim(content) ilike 'Testimonial content'
    or (
      coalesce(btrim(role), '') ilike 'Role'
      and coalesce(btrim(company), '') ilike 'Company'
    )
  );
