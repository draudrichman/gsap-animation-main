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
          className="px-12 pt-8 bg-gradient-to-br from-stone-50 to-white"
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
        className="px-12 pb-10 bg-gradient-to-br from-slate-50 to-white"
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          市场表现对比
        </h1>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-stone-100 border-b border-stone-200">
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">品牌</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">年销售额（人民币）</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">门店数量</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">会员规模</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">线上占比</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">山姆会员店</td>
                  <td className="py-4 px-6 text-stone-600">1000亿+</td>
                  <td className="py-4 px-6 text-stone-600">54</td>
                  <td className="py-4 px-6 text-stone-600">近900万</td>
                  <td className="py-4 px-6 text-stone-600">&gt;50%</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">开市客</td>
                  <td className="py-4 px-6 text-stone-600">87亿+</td>
                  <td className="py-4 px-6 text-stone-600">7</td>
                  <td className="py-4 px-6 text-stone-600">未公开（全球8100万）</td>
                  <td className="py-4 px-6 text-stone-600"></td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">奥乐齐</td>
                  <td className="py-4 px-6 text-stone-600">20亿+</td>
                  <td className="py-4 px-6 text-stone-600">78</td>
                  <td className="py-4 px-6 text-stone-600">未公开</td>
                  <td className="py-4 px-6 text-stone-600"></td>
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
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100">
          <h2 className="text-xl leading-relaxed text-slate-700 tracking-wide">
            美国作为全球最成熟的线下零售市场，以其庞大的体量与强劲的消费力持续引领全球零售格局。尽管电商渗透率已攀升至22.7%的历史高位，实体零售仍展现出强大的生命力——预计到2028年，线下渠道将贡献美国零售总额的72%。这一数据印证了实体店凭借其商品即得性、沉浸式体验和专业服务优势，在未来数年内仍将是零售生态的核心支柱。
            当前美国零售市场呈现出高度多元化的渠道格局，从大众平价零售到高端专业卖场，各渠道凭借精准定位与差异化策略占据独特生态位。对于计划进入美国市场的品牌而言，深入理解各渠道特性、销售数据及消费者趋势，是制定有效市场进入策略的基石。
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
                    市场格局多元且成熟
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    美国零售市场由全国性巨头与专业连锁共同主导，形成了从大众平价到高端精选、从全品类到垂直领域的完整生态体系。
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
                    规模效应与供应链为王
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    领先企业如沃尔玛、克罗格凭借其庞大的门店网络与高效物流体系，在采购和分销上拥有极强的成本优势与定价权。
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
                    全渠道融合成为标配
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    线上线下无缝衔接的购物体验已成为竞争基础，巨头们通过自建电商平台、强化即时配送来满足消费者需求。
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
                    自有品牌战略深化
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    为提升毛利和构建差异化，各零售商均大力发展自有品牌，如塔吉特的“Target Favorite”系列，以建立独特的商品护城河。
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
                    专业化与体验式转型
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    面对电商冲击，实体店更注重专业化服务与场景化体验，如百思买的店内顾问、全食超市的体验式餐饮，以重塑线下价值。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="px-12 pb-10 bg-gradient-to-br from-slate-50 to-white"
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          市场表现对比
        </h1>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-stone-100 border-b border-stone-200">
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">品牌</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">核心业态</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">门店数量</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">代表性财务数据（美金）</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">市场定位与核心战略</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">沃尔玛 (Walmart)</td>
                  <td className="py-4 px-6 text-stone-600">全品类大卖场</td>
                  <td className="py-4 px-6 text-stone-600">5,000家</td>
                  <td className="py-4 px-6 text-stone-600">2025财年全年收入6810亿美元</td>
                  <td className="py-4 px-6 text-stone-600">全球零售巨头，其美国本土门店的平均年销售额达到8900万美元。</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">塔吉特 (Target)</td>
                  <td className="py-4 px-6 text-stone-600">折扣零售/全品类</td>
                  <td className="py-4 px-6 text-stone-600">1,981家</td>
                  <td className="py-4 px-6 text-stone-600">2025财年Q2净销售额252.1亿</td>
                  <td className="py-4 px-6 text-stone-600">定位“期待更多，支付更少”的中产阶级家庭，以时尚家居、自有品牌和店仓合一的全渠道模式著称。</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">克罗格 (The Kroger Co.)</td>
                  <td className="py-4 px-6 text-stone-600">传统超市/杂货</td>
                  <td className="py-4 px-6 text-stone-600">2,800家</td>
                  <td className="py-4 px-6 text-stone-600">2024年零售额1,507.9亿</td>
                  <td className="py-4 px-6 text-stone-600">美国最大的传统超市运营商之一，通过强大的自有品牌和全渠道布局，深耕生鲜食品领域。</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">家得宝 (The Home Depot)</td>
                  <td className="py-4 px-6 text-stone-600">家居建材零售</td>
                  <td className="py-4 px-6 text-stone-600">2,353家</td>
                  <td className="py-4 px-6 text-stone-600">2025财年Q2净销售额453亿</td>
                  <td className="py-4 px-6 text-stone-600">美国国民级建材零售品牌，渗透率最高，品种齐全，会员规模庞大。</td>
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
              沃尔玛 · 全球零售巨头的全渠道霸主
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              作为全球最大零售商，沃尔玛以“每日低价”策略覆盖全美超
              <span className="font-semibold text-blue-700">4,700家门店</span>，
              2025财年总营收达
              <span className="font-semibold text-blue-700">6,810亿美元</span>。
              其电商销售额同比增长
              <span className="font-semibold text-blue-700">20.8%</span>，
              通过“Walmart+”会员服务强化全渠道战略，聚焦中低收入家庭，依托强大的供应链效率维持竞争优势。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              沃尔玛的成功得益于其无与伦比的规模效应与物流体系，结合数字化转型，确保了在大众综合零售领域的领导地位。
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              塔吉特 · 中产家庭的时尚零售选择
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              塔吉特精准定位中产阶级家庭，拥有
              <span className="font-semibold text-blue-700">1,981家门店</span>，
              2025财年Q2净销售额达
              <span className="font-semibold text-blue-700">252.1亿美元</span>。
              通过设计师联名商品与“Good & Gather”等自有品牌提升溢价能力，其“Drive Up”线下取货服务推动数字销售额占比超
              <span className="font-semibold text-blue-700">15%</span>，
              展现了体验式零售的强大潜力。
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              好市多 · 会员制仓储的全球标杆
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              好市多（Costco）凭借独特的会员制与极致性价比模式，2025财年第三季度净销售额达
              <span className="font-semibold text-green-700">619.6亿美元</span>，
              可比销售额增长
              <span className="font-semibold text-green-700">8.0%</span>，电商销售增长
              <span className="font-semibold text-green-700">14.8%</span>。
              其高粘性会员模式确保了稳定的收入来源，持续巩固市场地位。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  会员制基石
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  高续费率与会员费再投入机制，支撑长期价值循环。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  商品价值感
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  精简SKU与自有品牌Kirkland，结合寻宝式体验，打造价格与品质护城河。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  全渠道增长
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  电商与即时配送布局，满足消费者多样化需求。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              克罗格与全食 · 生鲜零售的双雄
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              克罗格凭借
              <span className="font-semibold text-amber-700">2,800家门店</span>，
              2024年零售额达
              <span className="font-semibold text-amber-700">1,507.9亿美元</span>，
              通过“Simple Truth”等自有品牌和数据驱动营销，稳坐传统超市龙头地位，生鲜品类贡献约
              <span className="font-semibold text-amber-700">55%收入</span>。
              全食超市（Whole Foods）则坚守高端有机定位，面临区域性特色零售商如Mitsuwa Marketplace的挑战。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  生鲜品类优势
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  克罗格通过生鲜品类与自有品牌，深耕食品零售市场。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  数据驱动营销
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  精准营销与客户洞察，提升消费者忠诚度与复购率。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  高端有机定位
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  全食超市专注有机食品，迎合健康消费趋势。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-2xl font-semibold text-stone-900">
              核心市场趋势
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  全渠道融合
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  零售商大数据分析市场预计2032年达986.6亿美元，品牌需优化BOPIS与线上展示。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-green-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  健康与可持续性
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  绿色食品包装市场至2032年预计达7.99亿美元，可降解包装与环保供应链成关键。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-amber-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  自有品牌崛起
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  零售商扩大自有品牌占比，品牌方需强化技术壁垒或OEM合作。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-emerald-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  区域市场潜力
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  如ACE Hardware通过社区服务，品牌需加强店员培训与场景化营销。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-violet-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  体验式零售
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  百思买通过“Geek Squad”顾问服务，构建智能家居与健康科技新增长点。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-rose-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  细分市场突破
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  区域性零售如Mitsuwa Marketplace，专注文化消费细分领域。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-semibold text-stone-900">
              品牌战略启示
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              美国零售生态正经历深刻变革，线下渠道保持主体地位的同时，积极拥抱数字化与体验升级。品牌方需精准把握各渠道特性，结合消费趋势动态调整产品策略与资源配置。
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-blue-900 mb-2 text-lg">沃尔玛</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  规模与供应链优势，适合高性价比产品与大规模分销合作。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-green-900 mb-2 text-lg">塔吉特</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  中产客群与时尚定位，适合联名设计与自有品牌合作。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-amber-900 mb-2 text-lg">克罗格</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  生鲜与自有品牌驱动，适合高品质食品与数据驱动营销合作。
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-stone-600 leading-relaxed">
                以上分析为品牌与渠道适配提供框架，建议结合品类结构、毛利模型与市场渗透效率进一步优化合作策略。
              </p>
            </div>
          </section>
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
        <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100">
          <h2 className="text-xl leading-relaxed text-slate-700 tracking-wide">
            加拿大零售市场格局多元且成熟，形成实体为王与全渠道融合的韧性生态。在“实体店为王”的北美商业土壤中，线下销售占比90%以上的超庞大市场份额。既有国际零售巨头占据重要地位，也有众多本土连锁品牌深耕细分领域。超过70%的商超开通“线上下单+到店自提”（BOPIS），这不仅是便利，更是驱动交叉销售的成熟多元生态体系。尽管年轻群体是线上渗透的主力，但85%的中老年消费者（55岁以上）购物仍发生在实体店。类似数据凸显了实体店在覆盖全龄段客户、维系社区纽带方面的社会价值与经济价值。主流零售品牌的门店网络，是其应对人口结构变化、保持基本盘的稳定器。
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
                    市场格局稳固
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    全国市场由少数几家巨头主导，形成了全品类、建材、便利店等多业态并存的成熟零售生态，供应链与网点布局完善。
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
                    本土与全球巨头共存
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    既有Costco、Walmart等全球巨头深耕，亦有Couche-Tard、METRO等本土巨头崛起并成功进行国际扩张，展现出强大的商业活力。
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
                    区域化深度运营
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    众多品牌如IGA、RONA等采用区域特许经营模式，深入社区，在各省形成了强大的品牌忠诚度和市场渗透。
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
                    多业态覆盖全客群
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    从大型仓储会员店、标准超市到社区便利店、专业药妆店，业态丰富，精准满足不同客群的全方位消费需求。
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
                    供应链与自有品牌强大
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    领先企业建有高效供应链体系，通过高比例自有品牌商品（如Costco的Kirkland Signature）巩固利润壁垒和差异化优势。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="px-12 pb-10 bg-gradient-to-br from-slate-50 to-white"
      >
        <h1 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          市场表现对比
        </h1>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-stone-100 border-b border-stone-200">
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">品牌</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">所属业态</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">门店数量（约）</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">代表性财务数据（加元）</th>
                  <th className="text-left py-4 px-6 text-stone-900 font-semibold">核心特征</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">Walmart Canada</td>
                  <td className="py-4 px-6 text-stone-600">全品类</td>
                  <td className="py-4 px-6 text-stone-600">403家</td>
                  <td className="py-4 px-6 text-stone-600">2025年Q1净销售额72.8亿</td>
                  <td className="py-4 px-6 text-stone-600">以“天天平价”策略覆盖广泛客群，是美国以外的核心市场之一，食品杂货占据重要销售比例。</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">Loblaw Companies Ltd.</td>
                  <td className="py-4 px-6 text-stone-600">食品零售/药房</td>
                  <td className="py-4 px-6 text-stone-600">2,400+家</td>
                  <td className="py-4 px-6 text-stone-600">2025年Q2营收147亿</td>
                  <td className="py-4 px-6 text-stone-600">加拿大最大的食品零售商，拥有PC Optimum忠诚度计划，通过硬折扣和超级中心捕捉价值型消费。</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">Canadian Tire</td>
                  <td className="py-4 px-6 text-stone-600">综合零售/汽车服务</td>
                  <td className="py-4 px-6 text-stone-600">500+家</td>
                  <td className="py-4 px-6 text-stone-600">2025年Q2零售收入38.1亿</td>
                  <td className="py-4 px-6 text-stone-600">独特的“生活用品+汽车服务”一站式模式，拥有强大的Triangle Rewards忠诚度体系。</td>
                </tr>
                <tr className="border-b border-stone-100 hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-stone-800 font-medium">Costco Wholesale Canada</td>
                  <td className="py-4 px-6 text-stone-600">仓储会员店</td>
                  <td className="py-4 px-6 text-stone-600">109家</td>
                  <td className="py-4 px-6 text-stone-600">2025财年Q1同店销售增长6.7%</td>
                  <td className="py-4 px-6 text-stone-600">全球会员制零售巨头，凭借会员费模式和明星自有品牌深耕市场，消费者多为中高收入家庭。</td>
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
              全品类超市与便利店 · 万家门店构筑日常消费网络
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              加拿大全品类超市及便利店市场高度发达，主要由国际大型连锁品牌与区域型本地超市共同构成，覆盖都会区至偏远社区，形成密集的零售服务网络。
            </p>
          </section>

          <section className="space-y-5">
            <h3 className="text-2xl font-semibold text-stone-900">
              国际巨头主导大众市场
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              Costco：以会员制仓储式卖场模式著称，凭借大批量、低单价的商品策略吸引家庭及中小企业客户。其自有品牌
              <span className="font-semibold text-blue-700">Kirkland Signature</span>
              覆盖食品、日用品等多品类，品质与价格优势明显。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              Walmart：作为全渠道零售领导者，Walmart在加拿大拥有庞大的超级中心与线上平台，以
              <span className="font-semibold text-blue-700">“天天低价”</span>
              策略占据市场份额，商品范围从生鲜食品到家电服装一应俱全。
            </p>
          </section>

          <section className="space-y-5">
            <h3 className="text-2xl font-semibold text-stone-900">
              本土连锁超市区域深耕
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              Metro、Provigo、IGA、Longo’s等品牌在魁北克、安大略等省份拥有较强影响力，注重本地化选品与社区服务。例如，Metro强调生鲜品质与店内体验，Provigo（隶属Loblaw集团）则以多样自有品牌及积分系统增强用户黏性。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              Sobeys及其旗下品牌如FreshCo、Foodland等覆盖全国，尤其在东部地区占据重要地位，通过差异化门店形态适应不同客群需求。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  本地化选品
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Metro、Provigo等注重区域化商品与社区服务，增强消费者黏性。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  差异化门店
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Sobeys通过FreshCo、Foodland等品牌，适应多样化客群需求。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  积分系统
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Provigo等通过积分与自有品牌，提升用户忠诚度。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-2xl font-semibold text-stone-900">
              便利店与药妆集成零售
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              Couche-Tard（旗下包括Circle K）是全球便利店巨头之一，在加拿大布局密集，提供即时消费品、零食及加油服务，满足便捷性与应急需求。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              Shoppers Drug Mart（Pharmaprix为其在魁省名称）与Jean Coutu等将药房服务与日用零售深度结合，美妆、健康品类尤为突出，成为社区健康与美容消费的重要节点。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  便利店布局
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Couche-Tard提供即时消费品与加油服务，满足便捷需求。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  药妆集成
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Shoppers Drug Mart结合药房与美妆，服务社区健康消费。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  社区服务
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Jean Coutu等通过健康与美容品类，强化社区联结。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-3xl font-bold text-stone-900">
              建材家居类超市 · 千店规模的专业与DIY双轨并行
            </h2>
            <p className="text-stone-700 leading-loose text-lg">
              加拿大建材家居零售市场集中度较高，主要玩家包括全国性大型连锁与区域性专业经销商，满足专业建筑商与DIY家装用户的双重需求。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              Home Depot作为全球头部家居建材零售商，在加拿大凭借齐全的商品种类、专业建议及工具租赁服务，占据市场主导地位，深受专业承包商与DIY爱好者信赖。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              RONA（后被Lowe’s收购，部分门店正进行整合）是加拿大本土重要品牌，通过
              <span className="font-semibold text-amber-700">“RONA+”</span>
              等大型门店与社区门店网络结合，覆盖不同区域市场，强调本地化供应链与产品适配性。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  专业服务
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Home Depot提供专业建议与工具租赁，服务承包商与DIY用户。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  本地化供应链
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  RONA通过区域化产品适配，增强市场覆盖力。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  DIY趋势
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  家居改造需求上升，推动建材与软装品类增长。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-2xl font-semibold text-stone-900">
              区域与专业型零售商
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              Réno-Dépôt（属Lowe’s加拿大体系）在魁北克等地具有影响力，定位与Home Depot类似，主打建材全品类与家装解决方案。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              BMR、Canac、Patrick Morin等区域品牌在魁省及沿海省份深耕，注重建筑材料批发及农场景观类产品，服务专业客户群体。
            </p>
            <p className="text-stone-700 leading-loose text-lg">
              JYSK来自丹麦，以平价北欧风格的家居装饰与实用家具见长，填补了中低端软装市场的需求。
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  区域影响力
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Réno-Dépôt、BMR等深耕魁省，服务专业客户。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  平价软装
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  JYSK以北欧风格家具，满足中低端家装需求。
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  绿色建材
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  绿色建材与智能家居产品成为新的增长点。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-2xl font-semibold text-stone-900">
              核心战略支柱
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  高度集中与区域差异
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  少数大型连锁控制主要市场份额，区域品牌如IGA、BMR凭借本地化运营保持竞争力。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-green-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  多元化业态
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  从Costco的仓储式购物到Shoppers的药妆集成，精准对应消费场景。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-amber-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  自有品牌竞争力
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Costco的Kirkland、Loblaw的President’s Choice通过供应链控制提升利润。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-emerald-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  全渠道转型
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  电商与店内科技应用加速，线上线下融合提升客户体验。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-violet-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  健康与有机趋势
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  健康、有机产品需求增长，推动零售商调整选品策略。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-stone-200 bg-gradient-to-br from-white to-rose-50 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-stone-900 mb-2 text-lg">
                  社区联结
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  本土品牌通过社区服务与本地化运营，增强消费者忠诚度。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-semibold text-stone-900">
              竞争与整合的零售图景
            </h3>
            <p className="text-stone-700 leading-loose text-lg">
              加拿大零售市场在全球化与本土化之间形成了独特平衡，主流品牌不仅在规模与效率上竞争，更通过深度理解本地需求、强化社区联结，持续塑造着该国稳定而富有韧性的零售生态。在未来，能够持续优化线下体验、并无缝整合线上线下服务的零售商，将继续在这一稳健而充满活力的市场中占据主导地位。
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-blue-900 mb-2 text-lg">Costco</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  会员制与自有品牌驱动，适合高品质、大批量商品合作。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-green-900 mb-2 text-lg">Walmart</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  全渠道与低价策略，适合广泛客群的高性价比产品分销。
                </p>
              </div>
              <div className="p-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-amber-900 mb-2 text-lg">Home Depot</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  专业建材与DIY服务，适合家装与绿色建材产品合作。
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-stone-600 leading-relaxed">
                以上分析为后续品牌/产品与渠道适配策略奠定框架基础，可进一步结合品类结构、毛利模型与渠道渗透效率展开量化评估。
              </p>
            </div>
          </section>
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