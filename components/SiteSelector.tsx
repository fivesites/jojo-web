"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "./ui/button";
import { useSite } from "@/app/context/SiteContext";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.6,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,

    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SiteSelector() {
  const { currentSite, setCurrentSite } = useSite();
  return (
    <motion.section
      className={`${
        currentSite === "neutral" ? "h-screen" : "h-[25vh]"
      } grid grid-cols-1 lg:grid-cols-2 pt-8 px-3 pb-3 gap-3`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="col-span-1 z-0 flex flex-col bg-[url(/flowers.png)] bg-no-repeat bg-fill bg-center "
        variants={columnVariants}
      >
        <div className="w-full h-full relative z-10 flex flex-col items-center justify-center ">
          <Button size="lg" className="" onClick={() => setCurrentSite("sale")}>
            For Sale
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="col-span-1 z-0 flex flex-col bg-[url(/cicciolina_noise.png)] bg-no-repeat bg-fill bg-center"
        variants={columnVariants}
      >
        <div className="w-full h-full relative z-10 flex flex-col items-center justify-center ">
          <Button size="lg" className="" onClick={() => setCurrentSite("rent")}>
            For Rent
          </Button>
        </div>
      </motion.div>
    </motion.section>
  );
}
