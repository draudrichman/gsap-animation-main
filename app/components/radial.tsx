"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface Stat {
    number: string
    description: string
    position: number // 0-1 position along the arc (the base position)
    arc: 0 | 1 | 2 | 3 // which arc (0=center bottom, 1=inner, 2=middle, 3=outer)
    offsetX?: number // Manual horizontal offset in pixels (we'll scale these too)
    offsetY?: number // Manual vertical offset in pixels
}

// Define the reference width used in the SVG viewBox
const SVG_VIEWBOX_WIDTH = 800
const SVG_VIEWBOX_HEIGHT = 400

export default function RadialStats() {
    const containerRef = useRef<HTMLDivElement>(null)
    const arc1Ref = useRef<SVGPathElement>(null)
    const arc2Ref = useRef<SVGPathElement>(null)
    const arc3Ref = useRef<SVGPathElement>(null)
    const hasAnimatedRef = useRef(false)
    const gsapCtxRef = useRef<any>(null)

    // 1. STATE to track the container width and force recalculation
    const [containerWidth, setContainerWidth] = useState(SVG_VIEWBOX_WIDTH)

    const stats: Stat[] = [
        // Outer Arc (largest)
        { number: "1800+", description: "十足便利店", position: 0.06, arc: 3 },
        { number: "850+", description: "开市客亚洲区域\n日本30+\n中国大陆6家\n台湾14家", position: 0.20, arc: 3 },
        { number: "800+", description: "山姆会员连锁亚洲区域\n中国47家营业\n2025年7月止56家", position: 0.41, arc: 3, offsetX: 0, offsetY: 25 },
        { number: "3500+", description: "世纪联华超市", position: 0.60, arc: 3 },
        { number: "10000+", description: "奥乐齐全球10000+\n中国50+", position: 0.75, arc: 3 },
        { number: "22", description: "家\nFUDI会员店和\n精选超市", position: 0.85, arc: 3 },

        // Middle Arc
        { number: "318+", description: "盒马门店", position: 0.28, arc: 2 },
        { number: "10000+", description: "锅圈食汇\n火锅超市", position: 0.6, arc: 2, offsetY: 15 },
        { number: "130+", description: "Ole +BLT\n精选超市", position: 0.85, arc: 2, offsetX: -10 },

        // Inner Arc (smallest)
        { number: "2200+", description: "全家便利店", position: 0.15, arc: 1 },
        { number: "8", description: "家\n大润发M会员店", position: 0.45, arc: 1, offsetY: 20 },
        { number: "2600+", description: "罗森便利店", position: 0.85, arc: 1 },
        { number: "450+", description: "711便利店", position: 0.5, arc: 0, offsetY: -15 },
    ]

    // 2. Initial Pixel Radii (from your original code)
    const BASE_ARC1_RADIUS = 150
    const BASE_ARC2_RADIUS = 250
    const BASE_ARC3_RADIUS = 350

    // 3. EFFECT to handle resizing and update containerWidth
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                // Use clientWidth for the actual size of the SVG container on the screen
                setContainerWidth(containerRef.current.clientWidth)
            }
        }

        // Set initial size
        handleResize()

        // Add event listener for responsiveness
        window.addEventListener("resize", handleResize)

        // Use IntersectionObserver to trigger the GSAP animation when this section enters the viewport
        let observer: IntersectionObserver | null = null
        if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !hasAnimatedRef.current) {
                            hasAnimatedRef.current = true

                            // Create a gsap context scoped to the container for easier cleanup
                            gsapCtxRef.current = gsap.context(() => {
                                const arcs = [arc1Ref.current, arc2Ref.current, arc3Ref.current]
                                arcs.forEach((arc, index) => {
                                    if (arc) {
                                        const length = arc.getTotalLength()
                                        gsap.fromTo(
                                            arc,
                                            {
                                                strokeDasharray: length,
                                                strokeDashoffset: length,
                                            },
                                            {
                                                strokeDashoffset: 0,
                                                duration: 1.5,
                                                delay: index * 0.3,
                                                ease: "power2.inOut",
                                            },
                                        )
                                    }
                                })

                                // Animate stat text opacity in parallel with arcs
                                const statEls = containerRef.current?.querySelectorAll<HTMLDivElement>(".radial-stat") || []
                                gsap.to(statEls, {
                                    opacity: 1,
                                    duration: 2.0, // longer duration for a smoother fade
                                    delay: 0.2, // slight delay to let the initial arc animation begin
                                    ease: "power3.out", // smoother easing curve
                                    stagger: 0.08, // slightly larger stagger for a gentle cascade
                                })
                            }, containerRef)

                            // We only need to run once; stop observing
                            if (observer && containerRef.current) observer.unobserve(containerRef.current)
                        }
                    })
                },
                { root: null, rootMargin: "0px", threshold: 0.25 },
            )

            if (containerRef.current) observer.observe(containerRef.current)
        } else {
            // Fallback: if IntersectionObserver not available, run animation immediately once
            if (!hasAnimatedRef.current) {
                hasAnimatedRef.current = true
                gsapCtxRef.current = gsap.context(() => {
                    const arcs = [arc1Ref.current, arc2Ref.current, arc3Ref.current]
                    arcs.forEach((arc, index) => {
                        if (arc) {
                            const length = arc.getTotalLength()
                            gsap.fromTo(
                                arc,
                                {
                                    strokeDasharray: length,
                                    strokeDashoffset: length,
                                },
                                {
                                    strokeDashoffset: 0,
                                    duration: 1.5,
                                    delay: index * 0.3,
                                    ease: "power2.inOut",
                                },
                            )
                        }
                    })

                    // Animate stat text opacity in parallel with arcs (fallback path)
                    const statEls = containerRef.current?.querySelectorAll<HTMLDivElement>(".radial-stat") || []
                    gsap.to(statEls, {
                        opacity: 1,
                        duration: 2.0,
                        delay: 0.2,
                        ease: "power3.out",
                        stagger: 0.08,
                    })
                }, containerRef)
            }
        }

        return () => {
            window.removeEventListener("resize", handleResize)
            if (observer) observer.disconnect()
            if (gsapCtxRef.current) gsapCtxRef.current.revert()
        }
    }, []) // Empty dependency array ensures this runs once

    // 4. Calculate the Scale Factor
    // How much the current container width has shrunk/grown relative to the SVG's viewBox width (800)
    const scaleFactor = containerWidth / SVG_VIEWBOX_WIDTH

    // 5. Scaled Radii
    const arc1Radius = BASE_ARC1_RADIUS * scaleFactor
    const arc2Radius = BASE_ARC2_RADIUS * scaleFactor
    const arc3Radius = BASE_ARC3_RADIUS * scaleFactor

    const getArcPosition = (position: number, radius: number) => {
        const angle = Math.PI * (1 - position)
        return {
            x: Math.cos(angle) * radius,
            y: -Math.sin(angle) * radius,
        }
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-7xl mx-auto px-4 pt-20">
            <div
                className="relative w-full"
                // 6. Calculate height based on scale factor to ensure container height scales with the arcs
                style={{ height: `${SVG_VIEWBOX_HEIGHT * scaleFactor}px` }}
            >
                <svg
                    className="absolute bottom-0 left-0 w-full h-full"
                    viewBox={`-${SVG_VIEWBOX_WIDTH / 2} -${SVG_VIEWBOX_HEIGHT - 20} ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMax meet"
                >
                    {/* NOTE: We must use the BASE radii in the SVG path definition, 
             as the SVG's internal coordinate system is fixed by the viewBox (800 wide). 
             The browser's scaling handles the visual arc size. */}
                    <path ref={arc1Ref} d={`M ${-BASE_ARC1_RADIUS} 0 A ${BASE_ARC1_RADIUS} ${BASE_ARC1_RADIUS} 0 0 1 ${BASE_ARC1_RADIUS} 0`} stroke="currentColor" strokeWidth="1.5" fill="none" className="text-foreground/40" />
                    <path ref={arc2Ref} d={`M ${-BASE_ARC2_RADIUS} 0 A ${BASE_ARC2_RADIUS} ${BASE_ARC2_RADIUS} 0 0 1 ${BASE_ARC2_RADIUS} 0`} stroke="currentColor" strokeWidth="1.5" fill="none" className="text-foreground/40" />
                    <path ref={arc3Ref} d={`M ${-BASE_ARC3_RADIUS} 0 A ${BASE_ARC3_RADIUS} ${BASE_ARC3_RADIUS} 0 0 1 ${BASE_ARC3_RADIUS} 0`} stroke="currentColor" strokeWidth="1.5" fill="none" className="text-foreground/40" />
                </svg>

                {/* Text Stats Positioning */}
                {stats.map((stat, index) => {
                    // Determine if this stat should be placed outside the arcs at the bottom
                    const isCenterBottom = stat.arc === 0; // Our new indicator

                    let finalX, finalY;

                    if (isCenterBottom) {
                        // For center bottom items, position them at the very bottom center
                        finalX = (stat.offsetX || 0) * scaleFactor; // Only apply X offset if provided
                        finalY = (stat.offsetY || 0) * scaleFactor; // Directly use offsetY for downward movement
                    } else {
                        // Existing logic for items on an arc
                        const radius = stat.arc === 1 ? arc1Radius : stat.arc === 2 ? arc2Radius : arc3Radius;
                        const pos = getArcPosition(stat.position, radius);

                        const scaledOffsetX = (stat.offsetX || 0) * scaleFactor;
                        const scaledOffsetY = (stat.offsetY || 0) * scaleFactor;
                        const baseOffset = -10 * scaleFactor; // Scale the -10px lift-off from the line

                        finalX = pos.x + scaledOffsetX;
                        finalY = pos.y + scaledOffsetY + baseOffset;
                    }

                    return (
                        <div
                            key={index}
                            className="absolute radial-stat"
                            style={{
                                left: "50%",
                                bottom: "0",
                                // This transform applies the correct, final position immediately on render
                                // For isCenterBottom, finalY will be positive (moving downwards from bottom:0)
                                transform: `translateX(calc(-50% + ${finalX}px)) translateY(${finalY}px)`,
                                zIndex: stat.arc + 10,
                                // Scale Text Size based on the factor
                                fontSize: `${Math.max(0.6, scaleFactor)}rem`, // Ensure text doesn't get too tiny (0.6rem min)
                                opacity: 0, // start hidden; will fade in via GSAP when section becomes visible
                            }}
                        >
                            <div
                                className="flex flex-col items-center bg-white"
                            >
                                <div className="font-bold text-foreground whitespace-nowrap" style={{ fontSize: `calc(1.5rem * ${scaleFactor})` }}>
                                    {stat.number}
                                </div>
                                <div className="text-foreground/70 whitespace-pre-line text-center mt-0.5 leading-tight" style={{ fontSize: `calc(0.75rem * ${scaleFactor})` }}>
                                    {stat.description}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}