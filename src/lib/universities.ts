export type University = {
  slug: string;
  name: string;
  emailDomain: string;
};

// MVP: あとでDB管理に移行しやすいように、まずは定数で開始
export const UNIVERSITIES: University[] = [
  { slug: "todai", name: "東京大学", emailDomain: "g.ecc.u-tokyo.ac.jp" },
  { slug: "waseda", name: "早稲田大学", emailDomain: "akane.waseda.jp" },
    { slug: "gmail", name: "香川大学(仮)", emailDomain: "gmail.com" },
  { slug: "keio", name: "慶應義塾大学", emailDomain: "keio.jp" },
];

export function findUniversityBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return UNIVERSITIES.find((u) => u.slug === slug) ?? null;
}

