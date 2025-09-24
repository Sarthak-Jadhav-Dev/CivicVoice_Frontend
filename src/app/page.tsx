"use client";
import { useState } from "react";
import { motion } from "motion/react";
import NavbarHeader from "@/components/header";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const DummyContent = () => {
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of our platform is that you use it to make your city better
              </span>{" "}
               Spot a pothole? Report it. Water leakage? Upload it. Streetlight not working? Weve got you covered. From quick issue reporting to geo-tagged proof of resolution, our system makes sure no problem is left unheard — and every solution is just a click away.
            </p>
            <img
              src="/civicVocie.jpeg"
              alt="UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-2xl"
            />
          </div>
        );
      })}
    </>
  );
};

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];


const data = [
  {
    category: "Citizen Reporting",
    title: "Raise your voice, report an issue.",
    src: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "Transparency",
    title: "Track every complaint in real time.",
    src: "https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "Accountability",
    title: "Geo-tagged proof for every resolution.",
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "Efficiency",
    title: "Faster issue resolution through smart filters.",
    src: "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "Analytics",
    title: "Data-driven insights for better planning.",
    src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "Community Impact",
    title: "Together, we build smarter and safer cities.",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
];


export default function Page() {
  const words = ["Wise", "Contributer", "Changer", "awesome"];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  const content = [
    {
      title: "Smart Issue Tracking",
      description:
        "Track and monitor issues from across states, cities, and local areas in one place. Our platform helps admins categorize problems like infrastructure, water, or electricity, ensuring nothing gets overlooked.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
          Smart Issue Tracking
        </div>
      ),
    },
    {
      title: "Real-Time Updates",
      description:
        "Admins and citizens can see live updates as issues are reported and resolved. From potholes to water leaks, every status change is instantly visible, ensuring complete transparency.",
      content: (
        <div className="flex h-full w-full items-center justify-center text-white">
          Real-Time Updates
        </div>
      ),
    },
    {
      title: "Geo-Tagged Proof",
      description:
        "When resolving issues, admins can upload geo-tagged photos with descriptions. This builds accountability and provides clear proof of work done, bridging trust between citizens and authorities.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
          Geo-Tagged Proof
        </div>
      ),
    },
    {
      title: "Data-Driven Insights",
      description:
        "Analyze recurring issues and track resolution rates with visual dashboards. Our platform helps governments and organizations make data-backed decisions to improve infrastructure and public services.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
          Data-Driven Insights
        </div>
      ),
    },
  ];

  const testimonials = [
    {
      quote:
        "The lightning-fast features streamline every step — from reporting to resolution — making issue management quicker, smarter, and more efficient than ever before.",
      name: "Lighting Fast Performace",
      designation: "Fast",
      src: "/feature(4).png",
    },
    {
      quote:
        "Built for trust and consistency, our platform delivers reliable performance you can count on — ensuring every report, update, and resolution is always in safe hands.",
      name: "Relaible",
      designation: "Optimized",
      src: "/feature(1).png",
    },
    {
      quote:
        "Every report and resolution is visible in real time, giving citizens and admins full transparency. The intuitive interface ensures clarity and accountability at every step.",
      name: "Transparency",
      designation: "Cristal Clear",
      src: "/feature(2).png",
    },
    {
      quote:
        "Robust security features protect every report and user interaction, ensuring sensitive data is safe while maintaining the integrity of the platform.",
      name: "Secure",
      designation: "Data is Secure",
      src: "/feature(3).png",
    },

  ];
  return (
    <>
      <div className="absolute top-2.5 w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Learn More</NavbarButton>
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Learn More
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
      <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="px-4 py-10 md:py-20">
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300 mt-2.5" >
            {"Make your voice Heard"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
          >
            With CivicVoice, you can make a change in the society . Try our best
            in class, state of the art, cutting edge  tools to get your issues
            up.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Explore Now
            </button>
            <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
              Admin Panel
            </button>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
            }}
            className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
              <img
                src="/banner.png"
                alt="Landing page preview"
                className="aspect-[16/9] h-auto w-full object-cover"
                height={1000}
                width={1000}
              />
            </div>
          </motion.div>
        </div>
        <AnimatedTestimonials testimonials={testimonials} />
        <div className="w-full h-full py-20">
          <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            Know More About Civic Voice
          </h2>
          <Carousel items={cards} />
        </div>
        <div className="w-full flex justify-around overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            className={cn(
              "relative mb-6 max-w-2xl text-left text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100",
            )}
            layout
          >
            <div className="inline-block ml-1.5">
              {/* Be  <ContainerTextFlip words={words} /> */}
              {/* <Blips /> */}
            </div>
          </motion.h1>
          <div className="w-full py-4">
            <StickyScroll content={content} />
          </div>
        </div>
      </div>
    </>
  );
}

const NavbarLocal = () => {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Aceternity UI</h1>
      </div>
      <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Login
      </button>
    </nav>
  );
};
