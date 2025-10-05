import type { Country } from "~/models/country";

export const countries: Country[] = [
  {
    id: "china",
    name: "CHINA 中国",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/1920px-Flag_of_the_People%27s_Republic_of_China.svg.png",

    details: {
      companies: [{ name: "Sam's Club" }, { name: "Aldi" }, { name: "Costco" }],
    },
  },
  {
    id: "usa",
    name: "United States 美国",
    logo: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",

    details: {
      companies: [
        { name: "Best Buy" },
        { name: "CVS" },
        { name: "H Mart" },
        { name: "Kroger" },
        { name: "Mitsuwa" },
        { name: "Ranch Market" },
        { name: "Rite Aid" },
        { name: "Walgreens" },
      ],
    },
  },
  {
    id: "canada",
    name: "Canada 加拿大",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Canada.svg",
    details: {
      companies: [
        { name: "7-Eleven" },
        { name: "BMR" },
        { name: "Brunet" },
        { name: "Canac" },
        { name: "Canadian Tire" },
        { name: "Costco" },
        { name: "Couche-Tard" },
        { name: "Filgo" },
        { name: "Giant Tiger" },
        { name: "Harnois Énergies" },
        { name: "IGA" },
        { name: "Jean Coutu" },
        { name: "Matériaux Audet" },
        { name: "Maxi" },
        { name: "MP Materials" },
        { name: "Patrick Morin" },
        { name: "Pharmaprix" },
        { name: "Réno-Dépôt" },
        { name: "RONA" },
        { name: "Super C" },
        { name: "Walmart" },
      ],
    },
  },
  {
    id: "australia",
    name: "Australia 澳洲",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/Flag_of_Australia.svg",
    details: {
      companies: [
        { name: "BHP" },
        {
          name: "Commonwealth Bank",
        },
        {
          name: "Woolworths",
        },
      ],
    },
  },
  {
    id: "zealand",
    name: "New Zealand 新西兰",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg",

    details: {
      companies: [
        { name: "Fonterra" },
        {
          name: "Air New Zealand",
        },
        { name: "Spark" },
      ],
    },
  },
  {
    id: "cambodia",
    name: "Cambodia 柬埔寨",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg",

    details: {
      companies: [
        {
          name: "Cambodia Angkor Air",
        },
        {
          name: "ACLEDA Bank",
        },
      ],
    },
  },
  {
    id: "japan",
    name: "Japan 日本",
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg",
    details: {
      companies: [
        { name: "Toyota" },
        { name: "Sony" },
        { name: "Nintendo" },
        { name: "Honda" },
      ],
    },
  },
];
