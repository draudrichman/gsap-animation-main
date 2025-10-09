import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContentSection {
    title: string;
    description: string;
}

interface Slide {
    number: string;
    title: string;
    titleEn: string;
    sections: ContentSection[];
    bgColor: string;
    gradient?: string;
}

const slides: Slide[] = [
    {
        number: '01',
        title: '渠道战略',
        titleEn: 'Channel Strategy & Roadmapping',
        sections: [
            {
                title: '渠道诊断',
                description: '基于品牌与产品特性，结合全方位深度数据调研精准匹配山姆, Costco, Walmart、Aldi...等全球各类型的零售渠道：会员店, 大卖场, 便利店, 区域性连锁及主流电商平台。'
            },
            {
                title: '入场策略制定',
                description: '评估最佳入场模式（经销、代销、直供），规划产品组合、包装规格与价格体系，满足渠道方采购需求。'
            }
        ],
        bgColor: 'text-[#EEEEEE]',
        gradient: "radial-gradient(125% 125% at 50% 10%, #000 40%, #baa18b 100%)"
    },
    {
        number: '02',
        title: '渠道合规与供应链准备',
        titleEn: 'Channel Compliance & Supply Chain Preparation',
        sections: [
            {
                title: '合规认证',
                description: '指导并落实国家产品标准、包装规范、质量控制、标签、成分等本地强制性认证和渠道要求。'
            },
            {
                title: '供应链与物流方案的设计与实施',
                description: '供应链与物流方案的设计与实施，确保产品准时送达，满足目标市场的需求。'
            },
            {
                title: '供应链与物流方案的优化与调整',
                description: '根据市场反馈优化供应链与物流方案，提升效率并降低成本。'
            }
        ],
        bgColor: 'text-[#EEEEEE]',
        gradient: "radial-gradient(125% 125% at 50% 10%, #000 40%, #cccccc 100%)"
    },
    {
        number: '03',
        title: '对投资谈判',
        titleEn: 'Negotiation & Deal-Making',
        sections: [
            {
                title: '正式渠道推荐',
                description: '由服务方Broker团队向目标商超采购决策人进行推荐。'
            },
            {
                title: '谈判支持与策略调整',
                description: '提供采购谈判策略·产品分析及定价建议，根据反馈指导最终产品调整。'
            },
            {
                title: '推动试销订单',
                description: '获取商超的试销订单（First Order）。'
            }
        ],
        bgColor: 'text-[#EEEEEE]',
        gradient: "radial-gradient(125% 125% at 50% 10%, #000 40%, #baa18b 100%)"
    },
    {
        number: '04',
        title: '试销与正式入驻',
        titleEn: 'Pilot Sales & Full Roll-Out',
        sections: [
            {
                title: '试销与验证',
                description: '根据产品特性及市场反馈，制定试销计划·确保试销周期内的销售表现。'
            },
            {
                title: '正式入驻',
                description: '试销成功后·协助品牌方与商超签订正式采购合同（PO）。'
            },
            {
                title: '品牌方推广生产',
                description: '根据试销反馈推动品牌方调整产品及生产。'
            }
        ],
        bgColor: 'text-[#EEEEEE]',
        gradient: "radial-gradient(125% 125% at 50% 10%, #000 40%, #cccccc 100%)"
    },
    {
        number: '05',
        title: '长期运营与价值增长',
        titleEn: 'Sustained Growth & Value Expansion',
        sections: [
            {
                title: '渠道营销与维护',
                description: '根据市场反馈·制定长期运营计划·维护品牌与渠道的长期合作关系。'
            },
            {
                title: '可持续发展',
                description: '支持品牌方持续优化产品组合·提升市场竞争力。'
            },
            {
                title: '持续增长',
                description: '推动品牌价值增长·实现长期盈利目标。'
            }
        ],
        bgColor: 'text-[#EEEEEE]',
        gradient: "radial-gradient(125% 125% at 50% 10%, #000 40%, #baa18b 100%)"
    }
];

const ScrollCards: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => {
            wrapperRefs.current.forEach((wrapper, i) => {
                if (!wrapper || !slideRefs.current[i]) return;

                const card = slideRefs.current[i];
                let scale = 1;
                let rotationZ = 0;
                let rotationX = 0;

                if (i !== slides.length - 1) {
                    scale = 0.4 + 0.025 * i;
                    rotationZ = 5;
                    rotationX = 40;
                }

                gsap.to(card, {
                    scale,
                    rotationX,
                    rotationZ,
                    transformOrigin: '50% center',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top top',
                        end: 'bottom bottom',
                        endTrigger: slideRefs.current[slides.length - 1],
                        scrub: 1,
                        pin: wrapper,
                        pinSpacing: false,
                        id: String(i + 1)
                    }
                });
            });
        });

        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <section ref={sectionRef} className="relative">
                <div>
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            ref={el => { wrapperRefs.current[index] = el; }}
                            style={{ perspective: '800px' }}
                            className="relative bg-black"
                        >
                            <div
                                ref={el => { slideRefs.current[index] = el; }}
                                className={`${slide.bgColor} px-4 py-12 min-h-screen xl:h-[calc(100vh-80px)]`}
                                style={{ transformStyle: 'preserve-3d', background: `${slide.gradient}` }}
                            >
                                <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center">
                                    {/* Header Section */}
                                    <div className="mb-8 xl:mb-16">
                                        <p className="text-[clamp(1rem,3vw,2rem)] opacity-50 mb-2">
                                            {slide.number + '.'}
                                        </p>
                                        <h1 className="text-[clamp(2rem,6vw,4rem)] font-bold leading-tight mb-2">
                                            {slide.title}
                                        </h1>
                                        <h2 className="text-[clamp(1rem,3vw,2rem)] leading-tight">
                                            {'' + slide.titleEn.split('&')[0].trim()}
                                        </h2>
                                        {slide.titleEn.includes('&') && (
                                            <h2 className="text-[clamp(1rem,3vw,2rem)] leading-tight">
                                                {'& ' + slide.titleEn.split('&')[1].trim()}
                                            </h2>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
                                        {slide.sections.map((section, idx) => (
                                            <div key={idx} className="space-y-4">
                                                <h3 className="text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold">
                                                    {section.title}
                                                </h3>
                                                <p className="text-[clamp(1.2rem,1.5vw,1.8rem)] leading-relaxed opacity-90">
                                                    {section.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default ScrollCards;