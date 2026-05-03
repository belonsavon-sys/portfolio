/**
 * Single source of truth for contact links across the site.
 * Flip LINKEDIN_URL between a real URL and `null` to enable/disable
 * the LinkedIn icon everywhere it renders (header, footer, contact page,
 * sidebar, resume).
 */

export const LINKEDIN_URL: string | null =
  "https://www.linkedin.com/in/pierre-belon-8366b8407";
export const GITHUB_URL = "https://github.com/belonsavon-sys";
export const PHONE_TEL = "tel:+13606602460";
export const PHONE_DISPLAY = "360-660-2460";
export const EMAIL_MAILTO = "mailto:belonsavon@gmail.com";
export const EMAIL_DISPLAY = "belonsavon@gmail.com";

export type ContactLink = {
  href: string;
  label: string;
  rel?: string;
  target?: "_blank";
};

export function getContactLinks(): ContactLink[] {
  const base: ContactLink[] = [
    { href: GITHUB_URL, label: "GitHub", rel: "noreferrer", target: "_blank" },
  ];

  if (LINKEDIN_URL) {
    base.push({
      href: LINKEDIN_URL,
      label: "LinkedIn",
      rel: "noreferrer",
      target: "_blank",
    });
  }

  base.push(
    { href: EMAIL_MAILTO, label: "Email" },
    { href: PHONE_TEL, label: "Phone" },
  );

  return base;
}
