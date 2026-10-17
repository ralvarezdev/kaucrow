export type SupportKind = 'donate' | 'donor'

export type SupportLink = {
  kind: SupportKind
  name: string
  description: string
  url: string
}

/**
 * Where to give money or join a marrow registry. Add regional organizations here
 * (e.g. one in the person's own country); the dialog renders whatever is listed.
 */
export const SUPPORT_LINKS: readonly SupportLink[] = [
  {
    kind: 'donate',
    name: 'Leukemia & Lymphoma Society',
    description: 'Funds blood cancer research and supports patients and families.',
    url: 'https://give.lls.org',
  },
  {
    kind: 'donor',
    name: 'NMDP (Be The Match)',
    description: 'Join the US marrow registry in person or with a mailed swab kit.',
    url: 'https://www.nmdp.org/get-involved/join-the-registry',
  },
  {
    kind: 'donor',
    name: 'DKMS',
    description: 'Register as a stem cell donor from home. Rules vary by country.',
    url: 'https://www.dkms.org/register-donor',
  },
]

export const SUPPORT_HEADINGS: Record<SupportKind, string> = {
  donate: 'Donate to research and patient support',
  donor: 'Become a bone marrow donor',
}
