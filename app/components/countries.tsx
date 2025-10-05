import gsap from "gsap";
import { useEffect, useRef, useState, useCallback } from "react";
import { CompanyDetails } from "./companies";
import type { Country } from "~/models/country";
import { countries } from "~/constant/countries";

// Animation configuration constants
const ANIMATION_CONFIG = {
  container: {
    openX: "-38%",
    openScale: 0.4,
    closedX: "0%",
    closedScale: 1,
    duration: 0.8,
    ease: "power3.out",
  },
  logo: {
    initial: { opacity: 0, scale: 0.8, filter: "blur(2px)", x: 80 },
    hoverFrom: {
      autoAlpha: 0,
      x: 90,
      scale: 0.75,
      rotation: 4,
      filter: "blur(6px)",
    },
    hoverTo: {
      autoAlpha: 1,
      x: 0,
      scale: 1,
      rotation: 0,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
    },
    leave: {
      autoAlpha: 0,
      x: 60,
      scale: 0.9,
      filter: "blur(4px)",
      duration: 0.3,
      ease: "power2.in",
    },
  },
  storeNames: {
    initial: { opacity: 0, scale: 0.85, filter: "blur(2px)", x: -80 },
    hoverFrom: { autoAlpha: 0, x: -90, scale: 0.8, filter: "blur(6px)" },
    hoverTo: {
      autoAlpha: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.55,
      ease: "power3.out",
    },
    leave: {
      autoAlpha: 0,
      x: -60,
      scale: 0.9,
      filter: "blur(4px)",
      duration: 0.3,
      ease: "power2.in",
    },
  },
  item: {
    hoverX: 32,
    hoverOpacity: 1,
    normalOpacity: 0.6,
    duration: 0.4,
    ease: "power3.out",
    highlightScale: 1.2,
    fadeScale: 0.9,
    fadeOpacity: 0.3,
  },
} as const;

export function Countries() {
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const companiesRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const storeNamesRef = useRef<HTMLDivElement>(null);

  // State
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Initialize GSAP states
  useEffect(() => {
    if (logoRef.current) {
      gsap.set(logoRef.current, ANIMATION_CONFIG.logo.initial);
    }
    if (storeNamesRef.current) {
      gsap.set(storeNamesRef.current, ANIMATION_CONFIG.storeNames.initial);
    }
    if (containerRef.current) {
      gsap.set(containerRef.current, { clearProps: "transform" });
    }
  }, []);

  // Highlight/fade country items based on selection
  const updateCountryHighlight = useCallback((country: Country) => {
    if (!companiesRef.current) return;

    const companyItems = companiesRef.current.querySelectorAll("li");
    companyItems.forEach((item, index) => {
      const isSelected = countries[index].name === country.name;
      gsap.to(item, {
        scale: isSelected
          ? ANIMATION_CONFIG.item.highlightScale
          : ANIMATION_CONFIG.item.fadeScale,
        opacity: isSelected
          ? ANIMATION_CONFIG.item.hoverOpacity
          : ANIMATION_CONFIG.item.fadeOpacity,
        fontWeight: isSelected ? "bold" : "normal",
        duration: ANIMATION_CONFIG.item.duration,
        ease: isSelected ? "back.out(1.7)" : "power2.out",
      });
    });
  }, []);

  // Animate container to left/center based on details state
  const animateContainer = useCallback((isOpening: boolean) => {
    if (!containerRef.current) return;

    const config = ANIMATION_CONFIG.container;
    gsap.to(containerRef.current, {
      x: isOpening ? config.openX : config.closedX,
      scale: isOpening ? config.openScale : config.closedScale,
      duration: config.duration,
      ease: config.ease,
    });
  }, []);

  // Reset all country items to normal state
  const resetCountryItems = useCallback(() => {
    if (!companiesRef.current) return;

    const companyItems = companiesRef.current.querySelectorAll("li");
    gsap.to(companyItems, {
      scale: 1,
      opacity: ANIMATION_CONFIG.item.normalOpacity,
      fontWeight: "normal",
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.04,
    });
  }, []);

  // Handle country selection
  const handleCountryClick = useCallback(
    (country: Country) => {
      // Prevent re-clicking the same country when details are open
      if (isDetailsOpen && selectedCountry?.name === country.name) {
        return;
      }

      setSelectedCountry(country);
      updateCountryHighlight(country);

      // Animate container only on first open
      if (!isDetailsOpen) {
        setIsDetailsOpen(true);
        animateContainer(true);
      }
    },
    [isDetailsOpen, selectedCountry, updateCountryHighlight, animateContainer]
  );

  // Handle closing details
  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedCountry(null);
    setHoveredCountry(null);
    animateContainer(false);
    resetCountryItems();
  }, [animateContainer, resetCountryItems]);

  // Animate side panels on hover
  const animateSidePanels = useCallback((show: boolean) => {
    if (storeNamesRef.current) {
      gsap.killTweensOf(storeNamesRef.current);
      if (show) {
        gsap.fromTo(
          storeNamesRef.current,
          ANIMATION_CONFIG.storeNames.hoverFrom,
          ANIMATION_CONFIG.storeNames.hoverTo
        );
      } else {
        gsap.to(storeNamesRef.current, ANIMATION_CONFIG.storeNames.leave);
      }
    }

    if (logoRef.current) {
      gsap.killTweensOf(logoRef.current);
      if (show) {
        gsap.fromTo(logoRef.current, ANIMATION_CONFIG.logo.hoverFrom, {
          ...ANIMATION_CONFIG.logo.hoverTo,
          delay: 0.05,
        });
      } else {
        gsap.to(logoRef.current, ANIMATION_CONFIG.logo.leave);
      }
    }
  }, []);

  // Handle country item hover
  const handleCountryHover = useCallback(
    (country: Country, element: HTMLLIElement) => {
      if (isDetailsOpen) return;

      setHoveredCountry(country);
      gsap.to(element, {
        x: ANIMATION_CONFIG.item.hoverX,
        opacity: ANIMATION_CONFIG.item.hoverOpacity,
        duration: ANIMATION_CONFIG.item.duration,
        ease: ANIMATION_CONFIG.item.ease,
      });
      animateSidePanels(true);
    },
    [isDetailsOpen, animateSidePanels]
  );

  // Handle country item leave
  const handleCountryLeave = useCallback(
    (element: HTMLLIElement) => {
      if (isDetailsOpen) return;

      setHoveredCountry(null);
      gsap.to(element, {
        x: 0,
        opacity: ANIMATION_CONFIG.item.normalOpacity,
        duration: ANIMATION_CONFIG.item.duration,
        ease: "power3.inOut",
      });
      animateSidePanels(false);
    },
    [isDetailsOpen, animateSidePanels]
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-white flex items-center justify-center h-screen relative overflow-hidden"
      >
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center">
            {/* Left: Store names panel */}
            <div className="fixed left-4 lg:left-48 md:left-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex flex-col gap-4 items-center justify-center text-center">
              <div
                ref={storeNamesRef}
                className="opacity-0 flex items-center justify-center"
              >
                {hoveredCountry &&
                  !isDetailsOpen &&
                  hoveredCountry.details?.companies && (
                    <ul className="space-y-1 text-center">
                      {hoveredCountry.details.companies.slice(0, 5).map((c) => (
                        <li key={c.name}>
                          <span className="text-xs md:text-lg lg:text-2xl font-semibold leading-none opacity-80">
                            {c.name}
                          </span>
                        </li>
                      ))}
                      {hoveredCountry.details.companies.length > 5 && (
                        <li>
                          <span className="text-xs md:text-lg lg:text-2xl font-semibold leading-none opacity-80">
                            & {hoveredCountry.details.companies.length - 5} more
                          </span>
                        </li>
                      )}
                    </ul>
                  )}
              </div>
            </div>

            {/* Right: Flag panel */}
            <div className="fixed right-4 md:right-10 lg:right-48 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex flex-col gap-4 items-center justify-center">
              <div
                ref={logoRef}
                className="opacity-0 flex items-center justify-center"
              >
                {hoveredCountry && !isDetailsOpen && (
                  <div className="w-40 h-28 md:w-48 md:h-32 flex items-center justify-center">
                    <img
                      src={hoveredCountry.logo}
                      alt={hoveredCountry.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Country list */}
            <ul
              ref={companiesRef}
              className="flex flex-col justify-center items-center gap-2 px-4"
            >
              {countries.map((country) => (
                <li
                  key={country.name}
                  className="group text-center p-2 md:p-4 rounded-lg text-[#201a39] cursor-pointer opacity-60"
                  onClick={() => handleCountryClick(country)}
                  onMouseEnter={(e) =>
                    handleCountryHover(country, e.currentTarget)
                  }
                  onMouseLeave={(e) => handleCountryLeave(e.currentTarget)}
                >
                  <h3 className="font-semibold whitespace-nowrap text-[30px] md:text-[40px] lg:text-[56px] leading-none">
                    {country.name}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Company Details Component */}
      {isDetailsOpen && selectedCountry && (
        <CompanyDetails
          country={selectedCountry}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
}
