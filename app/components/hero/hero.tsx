import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import "./hero.css";
import { HERO_TEXT } from "../../constant/hero-text";

export function Hero() {
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const animatedTextRef = useRef(null);
  const webglRef = useRef(null);

  // Array of different text content for each scroll section

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Dynamically import ScrollTrigger on client side
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      // Canvas / Starfield logic (same as original)
      const canvas = canvasRef.current as any;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const numStars = 2000;
      const focalLength = canvas.width * 2;
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;
      const baseTrailLength = 2;
      const maxTrailLength = 30;
      let stars: any[] = [];
      let warpSpeed = 0;
      let animationActive = true;

      function initializeStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            o: 0.5 + Math.random() * 0.5,
            trail: [],
          });
        }
      }

      function moveStars() {
        for (let star of stars) {
          const speed = 1 + warpSpeed * 50;
          star.z -= speed;
          if (star.z < 1) {
            star.z = canvas.width;
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.trail = [];
          }
        }
      }

      function drawStars() {
        if (
          canvas.width !== canvas.offsetWidth ||
          canvas.height !== canvas.offsetHeight
        ) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          centerX = canvas.width / 2;
          centerY = canvas.height / 2;
        }
        const trailLength = Math.floor(
          baseTrailLength + warpSpeed * (maxTrailLength - baseTrailLength)
        );
        const clearAlpha = 1 - warpSpeed * 0.8;
        ctx.fillStyle = `rgba(17,17,17,${clearAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let star of stars) {
          const px = (star.x - centerX) * (focalLength / star.z) + centerX;
          const py = (star.y - centerY) * (focalLength / star.z) + centerY;

          star.trail.push({ x: px, y: py });
          if (star.trail.length > trailLength) star.trail.shift();

          if (star.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(star.trail[0].x, star.trail[0].y);
            for (let j = 1; j < star.trail.length; j++) {
              ctx.lineTo(star.trail[j].x, star.trail[j].y);
            }
            ctx.strokeStyle = `rgba(209,255,255,${star.o})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.fillStyle = `rgba(209,255,255,${star.o})`;
          ctx.fillRect(px, py, 1, 1);
        }
      }

      function animate() {
        if (animationActive) {
          requestAnimationFrame(animate);
          moveStars();
          drawStars();
        }
      }

      // Track if we've already appended (stacked) the second slide
      let secondSlideAdded = false;
      let combinedFirstSecondHTML = "";

      // Simple text setter with one-time stacking behavior for index 1
      function setTextContent(index: number) {
        const textElement = animatedTextRef.current as HTMLElement | null;
        if (!textElement) return;

        // Normal slides (except special handling for slide 1)
        if (index !== 1) {
          const currentSection = HERO_TEXT[index];
          textElement.innerHTML = currentSection.content || "";
          return;
        }

        // Slide 1 logic (append only once, then reuse same combined HTML)
        if (!secondSlideAdded) {
          const firstHTML = textElement.innerHTML || HERO_TEXT[0].content || "";
          const secondHTML = HERO_TEXT[1].content || "";
          combinedFirstSecondHTML = firstHTML + secondHTML;
          textElement.innerHTML = combinedFirstSecondHTML;
          secondSlideAdded = true;
        } else {
          // When revisiting slide 1 (scrolling back), just restore combined content, no re-append
          textElement.innerHTML = combinedFirstSecondHTML;
        }
      }

      // Crossfade animation for text changes
      let currentTextIndex = 0;
      let isTransitioning = false;

      function crossfadeToIndex(nextIndex: number) {
        if (nextIndex === currentTextIndex || isTransitioning) return;
        const textElement = animatedTextRef.current as HTMLElement | null;
        if (!textElement) return;

        // If target is the second slide (index 1), switch instantly without animation
        if (nextIndex === 1) {
          gsap.killTweensOf(textElement);
          setTextContent(1); // Will append only first time
          gsap.set(textElement, { opacity: 1, y: 0, filter: "blur(0px)" });
          currentTextIndex = 1;
          return;
        }

        isTransitioning = true;
        gsap.killTweensOf(textElement);

        gsap
          .timeline({
            onComplete: () => {
              isTransitioning = false;
            },
          })
          .to(textElement, {
            opacity: 0,
            y: 20,
            filter: "blur(4px)",
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
              setTextContent(nextIndex);
              currentTextIndex = nextIndex;
            },
          })
          .fromTo(
            textElement,
            { opacity: 0, y: -20, filter: "blur(4px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.5,
              ease: "power3.out",
            }
          );
      }

      initializeStars();
      animate();

      // Main scroll animation with text changes
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            // Update warp speed
            if (progress <= 0.6) warpSpeed = progress / 0.6;
            else if (progress <= 0.8) warpSpeed = 1;
            else warpSpeed = 1 - (progress - 0.8) / 0.2;

            // Calculate which text section to show and trigger crossfade
            const sectionProgress = progress * (HERO_TEXT.length - 1);
            const targetIndex = Math.round(sectionProgress);
            const clampedIndex = Math.min(targetIndex, HERO_TEXT.length - 1);

            crossfadeToIndex(clampedIndex);
          },
        },
      });

      // Text fade in animation at the beginning
      gsap.set(animatedTextRef.current, {
        opacity: 0,
        y: 50,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: stickyRef.current,
            start: "5% top",
            end: "15% top",
            scrub: 0.8,
          },
        })
        .to(animatedTextRef.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power3.out",
        });

      // Remove per-section animations since crossfade handles all transitions

      // Exit animation
      // Delay exit so last text stays longer (start later in scroll)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: stickyRef.current,
            start: "97% top", // was 90%
            end: "105% top", // extend a bit beyond to smooth fade
            scrub: true,
          },
        })
        .to(
          animatedTextRef.current,
          {
            opacity: 0,
            y: -30,
            filter: "blur(8px)",
            scale: 0.9,
            duration: 0.4,
            ease: "power2.in",
          },
          0
        )
        .to(
          webglRef.current,
          {
            opacity: 0,
            scale: 0.95,
            ease: "power2.inOut",
          },
          0
        );

      const handleResize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
      };

      window.addEventListener("resize", handleResize);

      // Initialize with first text (no animation)
      setTextContent(0);
      if (animatedTextRef.current) {
        gsap.set(animatedTextRef.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
      }

      // Cleanup function
      return () => {
        animationActive = false;
        window.removeEventListener("resize", handleResize);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    });
  }, []);

  return (
    <div className="footer relative min-h-screen flex flex-col  text-white">
      <div className="container"></div>
      <div
        ref={stickyRef}
        className="sticky-container relative h-[600vh] w-full" /* increased from 500vh to prolong final section */
      >
        <div
          ref={webglRef}
          className="webgl-section sticky top-0 w-full h-screen flex items-center justify-center"
        >
          <div className="canvas-container relative w-full h-full">
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            ></canvas>
            <div
              ref={animatedTextRef}
              className="animated-text absolute text-center uppercase opacity-0"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
