import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import type { Country } from "~/models/country";
import ScrollLogos from "~/components/store-logos";
import CompanyLogos from "../constant/companies-logos";
import type { Company, CountryCompanies } from "~/models/company";
import RadialStats from "./radial";
import StoreTable from "./store-table";

interface CompanyDetailsProps {
  country: Country;
  onClose: () => void;
}

const getCountryCompanies = (id: string): Company[] => {
  const found = CompanyLogos.find((company: CountryCompanies) => company[id]);
  return found ? found[id] : [];
};

export function CompanyDetails({ country, onClose }: CompanyDetailsProps) {
  const detailsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const topLogosRef = useRef<HTMLDivElement>(null);
  const companyDetailsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const circularStatsRef = useRef<HTMLDivElement>(null);
  const prevCompanyRef = useRef<Country | null>(null);
  const firstRenderRef = useRef(true);
  const [countryCompanies, setCountryCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    if (detailsRef.current) {
      detailsRef.current.focus();
    }

    const handleScroll = (e: WheelEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      if (
        (isAtTop && e.deltaY < 0) ||
        (isAtBottom && e.deltaY > 0)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      const touch = e.touches[0];
      const startY = touch.clientY;

      if (!container.dataset.startY) {
        container.dataset.startY = startY.toString();
        return;
      }

      const deltaY = startY - parseFloat(container.dataset.startY);

      if (
        (isAtTop && deltaY > 0) ||
        (isAtBottom && deltaY < 0)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchStart = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.dataset.startY = "";
      }
    };

    if (detailsRef.current) {
      detailsRef.current.addEventListener("wheel", handleScroll, {
        passive: false,
      });
      detailsRef.current.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      detailsRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    const isFirst = firstRenderRef.current;
    const isCompanyChange =
      prevCompanyRef.current && prevCompanyRef.current.name !== country.name;

    if (isFirst) {
      if (detailsRef.current) {
        gsap.set(detailsRef.current, { x: "100%", opacity: 0 });
        gsap.to(detailsRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        });
      }
      firstRenderRef.current = false;
    } else if (isCompanyChange) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      const sections = [
        topLogosRef,
        companyDetailsRef,
        statsRef,
        circularStatsRef,
        logoRef,
        aboutRef,
        comparisonRef,
        actionsRef,
      ];

      sections.forEach((ref, index) => {
        if (ref.current) {
          gsap
            .timeline({ delay: index * 0.1 })
            .to(ref.current, {
              y: 30,
              opacity: 0,
              duration: 0.3,
              ease: "power1.out",
            })
            .to(ref.current, {
              y: 0,
              opacity: 1,
              duration: 0.3,
            });
        }
      });
    }

    setCountryCompanies(getCountryCompanies(country.id));

    prevCompanyRef.current = country;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;

      if (detailsRef.current) {
        detailsRef.current.removeEventListener("wheel", handleScroll);
        detailsRef.current.removeEventListener("touchstart", handleTouchStart);
        detailsRef.current.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [country]);

  const handleClose = () => {
    if (detailsRef.current) {
      gsap.to(detailsRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
        onComplete: onClose,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={detailsRef}
      className="fixed top-0 right-0 w-3/4 h-full overflow-hidden shadow-2xl z-50 transform"
      tabIndex={-1}
      style={{
        background: `
          linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)
        `,
      }}
    >
      <button
        onClick={handleClose}
        className="fixed top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-white hover:border-stone-300 transition-all duration-200 shadow-lg hover:shadow-xl"
        aria-label="Close details"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#a8a29e #f5f5f4",
        }}
      >
        {/* <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-200">
          <div className="px-12 py-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-14 flex items-center justify-center">
                <img
                  src={country.logo}
                  alt={country.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-stone-900 mb-1">{country.name}</h1>
                <p className="text-stone-600 text-lg">{country.details?.companies?.length || 0} Partner Companies</p>
              </div>
            </div>
          </div>
        </div> */}

        <div
          ref={topLogosRef}
          className="px-12 py-8 bg-gradient-to-br from-stone-50 to-white"
        >
          {countryCompanies.length > 0 && (
            <ScrollLogos companies={countryCompanies} />
          )}
        </div>

        {country.id === "china" && (
          <China companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
        {country.id === "usa" && (
          <USA companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
        {country.id === "canada" && (
          <Canada companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
        {country.id === "australia" && (
          <Australia companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
        {country.id === "zealand" && (
          <NewZealand companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
        {country.id === "cambodia" && (
          <Cambodia companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
        {country.id === "japan" && (
          <Japan companyDetailsRef={companyDetailsRef} statsRef={statsRef} />
        )}
      </div>
    </div>
  );
}


const China = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {

  return (
    <>
      <div
        ref={companyDetailsRef}
        className="px-12 py-10 bg-white relative"
      >
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100">
          <h2 className="text-xl leading-relaxed text-slate-700 tracking-wide">
            山姆预测在未来十年,有望在中国实现100+店铺,开市客作为全球第一会员店连锁,全力开店深耕中国市场,将提前进入超快开店计划,并打开即时零售,以最快速度追逐山姆。届时双方有望销售额进入6000亿人民币/年。目前所知山姆会员连锁、已经快速介入三线高消费力城市扩展例如广州、深圳、北京等地区。而开市客更多抢占一二线大市场。
          </h2>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">
            Key Areas
          </h2>

          <div className="grid grid-cols-5 gap-6">
            <div className="group bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-stone-900 font-semibold mb-2 text-lg">
                    全渠道深耕
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    成熟的 "店仓一体化"
                    网络与高效的会员数据系统,实现线上销售占比超50%,极速达服务覆盖核心市场。
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-stone-900 font-semibold mb-2 text-lg">
                    全国化布局
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    持续向三线高消费力城市下沉,全国门店已突破50家,会员数近900万,续卡率行业领先
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-stone-900 font-semibold mb-2 text-lg">
                    卓越商品力
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    严控SKU数量,自有品牌Member's
                    Mark占比超30%,打造多款年销售破20亿明星单品。
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-stone-900 font-semibold mb-2 text-lg">
                    稳健增长
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    年销售额突破千亿,保持双位数增长,成为沃尔玛中国业绩核心引擎。
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg hover:border-violet-300 hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col space-y-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-stone-900 font-semibold mb-2 text-lg">
                    行业标杆
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    中国付费会员制零售开创者与模式定义者,持续引领行业标准与消费体验升级。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="px-12 py-10 bg-gradient-to-br from-slate-50 to-white"
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          市场表现对比
        </h1>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-stone-100 border-b border-stone-200">
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">
                    Company
                  </th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">
                    Market Cap
                  </th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">
                    Revenue
                  </th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">
                    Growth Rate
                  </th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">
                    Employees
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Apple Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$2.8T</td>
                  <td className="py-4 px-6 text-stone-600">$394.3B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+8.2%</span></td>
                  <td className="py-4 px-6 text-stone-600">164,000</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Microsoft Corp.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$2.5T</td>
                  <td className="py-4 px-6 text-stone-600">$211.9B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+12.1%</span></td>
                  <td className="py-4 px-6 text-stone-600">221,000</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Alphabet Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$1.7T</td>
                  <td className="py-4 px-6 text-stone-600">$307.4B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+9.8%</span></td>
                  <td className="py-4 px-6 text-stone-600">182,000</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Amazon.com Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$1.4T</td>
                  <td className="py-4 px-6 text-stone-600">$574.8B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+15.3%</span></td>
                  <td className="py-4 px-6 text-stone-600">1,540,000</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Tesla Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$789B</td>
                  <td className="py-4 px-6 text-stone-600">$96.8B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+18.9%</span></td>
                  <td className="py-4 px-6 text-stone-600">127,855</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Meta Platforms
                  </td>
                  <td className="py-4 px-6 text-stone-600">$845B</td>
                  <td className="py-4 px-6 text-stone-600">$134.9B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+22.7%</span></td>
                  <td className="py-4 px-6 text-stone-600">77,805</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    NVIDIA Corp.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$1.8T</td>
                  <td className="py-4 px-6 text-stone-600">$79.8B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+126.0%</span></td>
                  <td className="py-4 px-6 text-stone-600">26,196</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Netflix Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$195B</td>
                  <td className="py-4 px-6 text-stone-600">$33.7B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+6.7%</span></td>
                  <td className="py-4 px-6 text-stone-600">13,000</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Adobe Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$234B</td>
                  <td className="py-4 px-6 text-stone-600">$19.4B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+11.2%</span></td>
                  <td className="py-4 px-6 text-stone-600">28,775</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Salesforce Inc.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$267B</td>
                  <td className="py-4 px-6 text-stone-600">$34.9B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+10.9%</span></td>
                  <td className="py-4 px-6 text-stone-600">79,390</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    Oracle Corp.
                  </td>
                  <td className="py-4 px-6 text-stone-600">$368B</td>
                  <td className="py-4 px-6 text-stone-600">$50.0B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">+4.8%</span></td>
                  <td className="py-4 px-6 text-stone-600">143,000</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">
                    PayPal Holdings
                  </td>
                  <td className="py-4 px-6 text-stone-600">$67B</td>
                  <td className="py-4 px-6 text-stone-600">$29.8B</td>
                  <td className="py-4 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">-2.1%</span></td>
                  <td className="py-4 px-6 text-stone-600">30,900</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="px-12 py-12 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              山姆会员店 · 会员制仓储巨头深耕中国
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              作为沃尔玛旗下的高端会员制商店,山姆自1996年进入中国后,已成为沃尔玛中国业务的重要增长引擎,其
              2024 年销售额已突破
              <span className="font-semibold text-blue-700"> 1000 亿元人民币</span>
              ,贡献了沃尔玛中国约七成的销售额。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              截至 2025 年初,山姆在中国拥有{" "}
              <span className="font-semibold text-blue-700">54 家门店</span>
              ,并预计在年底突破 60。其会员数已逼近
              <span className="font-semibold text-blue-700">
                {" "}
                900 万
              </span>,会员续费率高达{" "}
              <span className="font-semibold text-blue-700">80%</span>
              ,卓越会员续卡率更是达到
              <span className="font-semibold text-blue-700">
                {" "}
                92%
              </span>。线上销售占比已超过{" "}
              <span className="font-semibold text-blue-700">50%</span>,超过 80%
              的订单可在一小时内送达,形成高粘性服务闭环。
            </p>
          </section>

          <section className="space-y-5">
            <h3 className="text-2xl font-semibold text-stone-900">
              山姆预测与市场扩展
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              山姆预测在未来十年,有望在中国实现{" "}
              <span className="font-semibold text-blue-700">100+ 店铺</span>
              。开市客作为全球第一会员店连锁,将全力开店深耕中国市场,预计将提前进入"超快开店计划",并全面发力即时零售,以最快速度追逐山姆。双方在成熟市场与高线城市的深耕下,有望推动整体销售规模进入{" "}
              <span className="font-semibold text-blue-700">6000 亿元人民币 / 年</span>{" "}
              级别。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              当前山姆已加速进入具备高消费力的三线城市与富裕县域(如晋江、昆山等),而开市客更多集中在一二线核心圈层,形成不同节奏的渗透策略差异。
            </p>
          </section>

          <section className="space-y-8">
            <h3 className="text-2xl font-semibold text-stone-900">
              核心战略支柱
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  全渠道深耕
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  "店仓一体化 + 会员数据体系" 支撑极速配送及高复购;线上占比超
                  50%。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-green-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  全国化布局
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  加速下沉至高消费潜力区域,渠道结构层次化推进,提升边缘市场渗透。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-amber-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  卓越商品力
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  严控 SKU(≈4000),自有品牌 Member's Mark 占比
                  30%+,打造爆品矩阵。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-emerald-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  稳健增长
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  持续双位数增长态势,驱动沃尔玛中国整体盈利结构优化。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-violet-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  行业标杆
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  付费会员模式定义者,体验标准与运营效率持续被同行对标。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-rose-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  高质量下沉
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  拓展至富裕县域结合服务履约半径优化,实现结构性新增。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              开市客 · 全球巨头的本土化探索
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              作为全球仓储会员店的开创者,开市客于 2019
              年进入中国大陆。虽然门店数量尚少,但单店影响力与开业声量极高。截止
              2025 年 9 月,开市客在中国大陆拥有{" "}
              <span className="font-semibold text-green-700">7 家门店</span>
              ,覆盖上海、苏州、深圳等 6 座城市;2024 年中国业务销售额达到{" "}
              <span className="font-semibold text-green-700">87 亿元人民币</span>
              ,单店销售逼近 13 亿元,苏州店销售增速位居其全球体系前列。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  会员制基石
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  全球续费率≈89.8%,会员费再投入机制支撑长期价值循环。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  商品价值感
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  精简 SKU + Kirkland 自有品牌 +
                  寻宝式体验,塑造价格与品质复合护城河。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  审慎本土化
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  在电商 &
                  即时零售补课中,逐步构建与中国消费者的持续交互触点。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              奥乐齐 · 硬折扣鼻祖的质价比模式
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              来自德国的奥乐齐(ALDI),依托"硬折扣"模式在华东区域稳步拓展。截至
              2025 年 7 月,在中国拥有{" "}
              <span className="font-semibold text-amber-700">78 家门店</span>
              ,主要集中于上海,并进入苏州、无锡等扩张带。2024 年销售额约{" "}
              <span className="font-semibold text-amber-700">20 亿元人民币</span>
              ,同比增速高达 100%,位列中国超市 Top100 增长前列。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  极致质价比
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  大量 9.9 元以下商品 +
                  "长期降价"策略,抓住价格敏感与理性消费共振。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  自有品牌核心
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  自有品牌占比≈90%,与国内优质生产商深度协同,降低中间成本。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  精细化运营
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  精简 SKU + 整箱上货 + 智能订货 + 即时零售(3km / 30
                  分钟达)提升结构效率。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-semibold text-stone-900">
              PRISM 瓴境对合作路径的研判
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              三种模式在中国形成差异化通道:山姆以"规模 +
              会员结构价值"拉升运营深度;开市客依靠"全球供应链 +
              价值感体验"稳步推进;奥乐齐以"高结构效率 +
              自有品牌驱动"在局部市场做深做透。
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-blue-900 mb-2 text-lg">山姆</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  扩张节奏快,履约半径与数字化成熟,适配高客单复购型合作。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-green-900 mb-2 text-lg">开市客</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  价值密度高,商品精选属性强,适合差异化组合与品牌表达。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-amber-900 mb-2 text-lg">奥乐齐</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  性价比人群聚焦,适合结构优化与快速试错型新品验证。
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-stone-600 leading-relaxed">
                以上分析为后续品牌/产品与渠道适配策略奠定框架基础,可进一步结合品类结构、毛利模型与渠道渗透效率展开量化评估。
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-white">
        <StoreTable />
        <RadialStats />
      </div>

    </>
  )
}

const USA = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {
  return (
    <>
      <div
        ref={companyDetailsRef}
        className="px-12 py-10 bg-white relative"
      >
        <div className="mb-12 p-8 bg-gradient-to-br from-sky-50 to-slate-50 rounded-2xl border border-sky-100">
          <h2 className="text-xl leading-relaxed text-slate-700 tracking-wide">
            美国作为全球最成熟的线下零售市场，以其庞大的体量与强劲的消费力持续引领全球零售
            格局。尽管电商渗透率已攀升至 22.7%的历史高位，实体零售仍展现出强大的生命力——预
            计到 2028 年，线下渠道将贡献美国零售总额的 72%。这一数据印证了实体店凭借其商品即得
            性、沉浸式体验和专业服务优势，在未来数年内仍将是零售生态的核心支柱。
          </h2>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">一、多元渠道格局与核心运营数据</h2>

          <div className="space-y-4">
            <p className="text-stone-700 leading-loose text-lg">
              当前美国零售市场呈现出高度多元化的渠道格局，从大众平价零售到高端专业卖场，各渠道
              凭借精准定位与差异化策略占据独特生态位。对于计划进入美国市场的品牌而言，深入理解
              各渠道特性、销售数据及消费者趋势，是制定有效市场进入策略的基石。
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">大众综合零售 — Walmart</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  大众综合零售领域，Walmart（沃尔玛）作为全球最大零售商，以“每日低价”策略覆盖全美
                  超 4,700 家门店。2025 财年总营收达 6,810 亿美元，其中电商销售额同比增长 20.8%，印证其
                  通过“Walmart+”会员服务强化的全渠道战略成效。其主要客群聚焦中低收入家庭，依托无
                  与伦比的供应链效率维持竞争优势。
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">体验式零售 — Target</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  与之形成差异化竞争的是 Target（塔吉特），其精准定位中产客群，通过设计师联名商品与
                  “Good & Gather”等自有品牌提升溢价能力。该品牌的“Drive Up”线下取货服务成为全渠
                  道增长引擎，2023 年数字销售额占比已超 15%，展示了体验式零售的强大潜力。
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">会员制仓储与专业零售 — Costco / Best Buy</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  会员制仓储与专业零售赛道中，Costco（好市多）凭借独特的会员制与极致性价比模式持续增
                  长。2025 财年第三季度净销售额达 619.6 亿美元，可比销售额增长 8.0%，电商销售也保持
                  14.8%的稳健增长，彰显其会员模式的高粘性。而在专业零售领域，Best Buy（百思买）通过
                  “Geek Squad”专业顾问服务构建竞争壁垒，在智能家居与健康科技品类开辟增长第二曲线。
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">食品生鲜与细分市场 — Kroger / Whole Foods</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  食品生鲜与细分市场方面，Kroger（克罗格）凭借“Simple Truth”等自有品牌线与数据驱动营
                  销，稳坐传统超市龙头地位。其近 2,800 家门店中，生鲜品类贡献约 55%收入，凸显品类专注
                  的优势。而被亚马逊收购后的 Whole Foods（全食超市）则坚守高端有机定位，不过正面临来
                  自 Mitsuwa Marketplace 等区域性特色零售商在特定文化消费领域的挑战。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="px-12 py-10 bg-gradient-to-br from-slate-50 to-white"
      >
        <h3 className="text-2xl font-semibold text-stone-900 mb-4">二、核心市场趋势与品牌战略启示</h3>

        <div className="space-y-6">
          <p className="text-stone-700 leading-loose text-lg">
            全渠道融合已成为零售标配。零售商大数据分析市场预计至 2032 年达 986.6 亿美元，年复合
            增长率 11.41%。品牌方需积极优化线上产品展示（包括高清图片与精准搜索关键词），并无缝
            适配 BOPIS（线上购买店内取货）等混合购物模式。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-stone-200 bg-white">
              <h4 className="font-semibold text-stone-900 mb-2">健康与可持续性</h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                健康与可持续性正成为增长关键驱动力。绿色食品包装市场预计将从 2024 年的 3.73 亿美元
                增长至 2032 年的 7.99 亿美元。品牌方可通过可降解包装、成分透明化与环保供应链建设，在
                激烈竞争中建立差异化优势。
              </p>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-white">
              <h4 className="font-semibold text-stone-900 mb-2">自有品牌崛起</h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                自有品牌崛起重构竞争格局。Kroger、Target 等零售商持续扩大自有品牌占比以提升毛利。面
                对这一趋势，品牌方需强化核心技术壁垒，或考虑与零售商建立 OEM 合作，同时注重品牌故
                事叙述与性价比的平衡。
              </p>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-white">
              <h4 className="font-semibold text-stone-900 mb-2">区域与细分市场</h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                区域与细分市场蕴含巨大潜力。如 ACE Hardware 通过深度社区服务与专业建议牢牢把握 DIY
                客群，这提示品牌方在特定品类市场需加强店员培训与场景化营销，以精准触达目标消费群
                体。
              </p>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-white">
              <h4 className="font-semibold text-stone-900 mb-2">未来展望</h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                美国零售生态正经历深刻变革，线下渠道在保持主体地位的同时，积极拥抱数字化与体验升
                级。对品牌方面言，成功的关键在于精准把握各渠道特性，结合消费趋势动态调整产品策略
                与资源配置，在这一全球最发达的零售市场中找到自身的增长路径。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


const Canada = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {
  return (
    <>
      <div
        ref={companyDetailsRef}
        className="px-12 py-10 bg-white relative"
      >
        <div className="mb-12 p-8 bg-gradient-to-br from-red-50 to-slate-50 rounded-2xl border border-red-100">
          <h2 className="text-xl leading-relaxed text-slate-700 tracking-wide">
            加拿大零售市场格局多元且成熟，形成实体为王与全渠道融合的韧性生态。
            在线下销售占比 90%以上的超庞大市场份额中，既有国际零售巨头占据重要地位，也有众多本土连锁品牌深耕细分领域。
            超过 70%的商超开通“线上下单+到店自提”（BOPIS），这不仅是便利，更是驱动交叉销售的成熟多元生态体系。
            85%的中老年消费者（55 岁以上）购物仍在实体店，凸显了实体店在覆盖全龄段客户、维系社区纽带方面的社会与经济价值。
            主流零售品牌的门店网络，是其应对人口结构变化、保持基本盘的稳定器。
          </h2>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">一、全品类超市与便利店：万家门店构筑日常消费网络</h2>

          <div className="space-y-4">
            <p className="text-stone-700 leading-loose text-lg">
              加拿大全品类超市及便利店市场高度发达，由国际大型连锁品牌与区域型本地超市共同构成，形成密集的零售服务网络。
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">国际巨头主导大众市场：Costco / Walmart</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  <strong>Costco</strong> 以会员制仓储式卖场模式著称，凭借大批量、低单价的商品策略吸引家庭及中小企业客户，自有品牌 <strong>Kirkland Signature</strong> 品质与价格优势明显。
                  <strong>Walmart</strong> 作为全渠道零售领导者，拥有庞大的超级中心与线上平台，以“天天低价”策略占据市场份额，商品范围一应俱全。
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">本土连锁超市区域深耕：Metro / Sobeys 等</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  <strong>Metro</strong>、<strong>Provigo</strong>、<strong>IGA</strong>、<strong>Longo’s</strong> 等在魁北克、安大略等省份影响力较强，注重本地化选品与社区服务。
                  <strong>Sobeys</strong> 及其旗下品牌如 <strong>FreshCo</strong>、<strong>Foodland</strong> 等覆盖全国，尤其在东部地区重要，通过差异化门店形态适应不同客群需求。
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">便利店与药妆集成零售：Couche-Tard / Shoppers Drug Mart</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  <strong>Couche-Tard</strong>（旗下包括 <strong>Circle K</strong>）是全球便利店巨头，在加拿大布局密集，提供即时消费品及加油服务。
                  <strong>Shoppers Drug Mart</strong>（魁省为 <strong>Pharmaprix</strong>）与 <strong>Jean Coutu</strong> 将药房服务与日用零售深度结合，成为社区健康与美容消费的重要节点。
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 mb-2">全品类市场特点总结</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  该板块体现了加拿大零售市场的高度整合与区域差异性。国际品牌以规模与效率取胜，本土企业则依靠地域渗透与商品差异化竞争。
                  线上线下融合、自有品牌开发及健康、有机产品增长成为关键趋势。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="px-12 py-10 bg-gradient-to-br from-slate-50 to-white"
      >
        <h3 className="text-2xl font-semibold text-stone-900 mb-4">二、建材家居类超市：千店规模的专业与 DIY 双轨并行</h3>

        <div className="space-y-6">
          <p className="text-stone-700 leading-loose text-lg">
            加拿大建材家居零售市场集中度较高，主要玩家包括全国性大型连锁与区域性专业经销商，满足专业建筑商与 DIY 家装用户的双重需求。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-stone-200 bg-white">
              <h4 className="font-semibold text-stone-900 mb-2">全国领导品牌格局稳固：Home Depot / RONA</h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong>Home Depot</strong> 凭借齐全的商品种类、专业建议及工具租赁服务，占据市场主导地位，深受专业承包商与 DIY 爱好者信赖。
                <strong>RONA</strong>（后被 <strong>Lowe’s</strong> 收购）通过大型门店与社区门店网络结合，覆盖不同区域市场，强调本地化供应链与产品适配性。
              </p>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-white">
              <h4 className="font-semibold text-stone-900 mb-2">区域与专业型零售商：Réno-Dépôt / JYSK 等</h4>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong>Réno-Dépôt</strong>（属 <strong>Lowe’s</strong> 加拿大体系）在魁北克等地有影响力。
                <strong>BMR</strong>、<strong>Canac</strong> 等区域品牌深耕，注重建筑材料批发及农场景观类产品。
                来自丹麦的 <strong>JYSK</strong> 以平价北欧风格家居装饰与实用家具见长，填补中低端软装市场。
              </p>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-white md:col-span-2">
              <h4 className="font-semibold text-stone-900 mb-2">三、总结：竞争、整合与本土化并存的零售图景</h4>
              <ul className="list-disc pl-5 text-sm text-stone-700 leading-relaxed space-y-2">
                <li><strong>高度集中与区域差异并存</strong>：少数大型连锁控制主要市场份额，但区域品牌如 <strong>IGA</strong>、<strong>BMR</strong> 等凭借本地化运营在特定区域保持竞争力。</li>
                <li><strong>多元化业态满足不同客群</strong>：从 <strong>Costco</strong> 的仓储式购物到 <strong>Shoppers</strong> 的药妆集成，再到 <strong>Home Depot</strong> 的专业家装，不同零售形态精准对应消费场景。</li>
                <li><strong>自有品牌与供应链是关键竞争力</strong>：各大零售商大力发展自有品牌（如 <strong>Costco</strong> 的 <strong>Kirkland</strong>、<strong>Loblaw</strong> 的 <strong>President’s Choice</strong>），通过控制供应链降低成本、提升利润。</li>
                <li><strong>数字化与全渠道转型加速</strong>：电商、移动购物及店内科技应用成为标准配置，线上线下融合成为留住客户的重要手段。</li>
              </ul>
              <p className="text-xs text-stone-600 mt-4">
                总体来看，加拿大零售市场在全球化与本土化之间形成了独特平衡，未来能够持续优化线下体验、并无缝整合线上线下服务的零售商，将继续占据主导地位。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Canada;


const Australia = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {

  return (
    <>
    </>
  )
}



const NewZealand = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {

  return (
    <>
    </>
  )
}


const Cambodia = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {

  return (
    <>
    </>
  )
}

const Japan = ({ companyDetailsRef, statsRef }: { companyDetailsRef: RefObject<HTMLDivElement | null>; statsRef: RefObject<HTMLDivElement | null>; }) => {

  return (
    <>
    </>
  )
}