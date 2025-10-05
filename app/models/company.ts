export interface Company {
  name: string;
  src: string; // or type: StaticImageData if you're using Next.js image imports
}

export interface CountryCompanies {
  [country: string]: Company[];
}
