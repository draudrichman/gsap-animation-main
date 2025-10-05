export interface Country {
  id: string;
  name: string;
  logo: string;
  details: {
    companies: {
      name: string;
    }[];
  };
}
