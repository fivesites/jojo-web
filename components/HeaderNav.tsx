"use client";

import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useSite } from "@/app/context/SiteContext";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const headerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -12,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1], // editorial ease
    },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

function MenuOverlay({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const categories = ["Clothing", "Accessories", "Shoes", "Bags"];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 w-sm bg-accent shadow-2xl  "
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="flex justify-between w-full items-center "
        variants={sectionVariants}
      >
        <Link href="/">
          <h1 className="text-sm tracking-wider font-serif-display flex items-center justify-center  px-3 leading-tight     ">
            JOJO STUDIO
          </h1>
        </Link>

        <div className="flex justify-end items-center  ">
          <ThemeSwitch />
          <Button variant="link" size="sm" className=" ">
            Log In
          </Button>
          <Button variant="link" size="sm" className=" ">
            Cart
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="link"
            size="sm"
            className=""
          >
            Close
          </Button>
        </div>
      </motion.div>

      {/* HEADER CONTENT */}
      <div className=" mt-[10vh] lg:mt-[20vh] h-full w-full flex flex-col lg:flex-row bg-accent">
        <motion.div
          className="h-auto w-full  lg:w-1/2 py-9  px-3   flex flex-col  space-y-6"
          variants={sectionVariants}
        >
          <div className="grid w-full  items-center   text-xs  px-3">
            <Input
              className=" border-black placeholder:text-black placeholder:text-xs max-w-sm  text-xs rounded-none shadow-none "
              id="text"
              type="text"
              placeholder="Search JOJO STUDIO..."
            />
          </div>
          <nav>
            <motion.ul
              className="flex flex-col  text-sm font-mono"
              variants={listVariants}
            >
              {[
                { label: "Products", href: "/" },
                { label: "Visit The Store", href: "/" },
                { label: "About JOJO", href: "/pages/about" },
                { label: "Privacy Policy", href: "/" },
                { label: "Imprint", href: "/" },
                { label: "Admin", href: "/admin" },
              ].map((item) => (
                <motion.li key={item.label} variants={itemVariants}>
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    <Button variant="link" size="sm">
                      {item.label}
                    </Button>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        </motion.div>
        <motion.div
          className=" w-full h-full lg:h-screen lg:w-1/2 bg-accent text-accent-foreground flex flex-col px-3 py-9 space-y-6"
          variants={sectionVariants}
        >
          <div className="">
            <Button variant="link" size="sm" className="">
              Latest Added
            </Button>
          </div>

          {/* Categories */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-0"
            variants={listVariants}
          >
            {categories.map((category) => (
              <motion.div key={category} variants={itemVariants}>
                <Button variant="link" size="sm">
                  {category}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HeaderNav() {
  const { currentSite, toggleSite } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP PART OF HEADER */}
      <header className="bg-background fixed z-50 top-0 left-0 right-0 w-full h-8">
        <span className="flex justify-between items-center w-full ">
          <Link href="/">
            <h1 className="text-sm tracking-wider font-serif-display flex items-center justify-center  px-3 leading-tight  mt-0.75   ">
              JOJO STUDIO
            </h1>
          </Link>

          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-start"
          >
            <motion.div variants={headerItemVariants}>
              <Button
                variant="link"
                size="sm"
                className=""
                onClick={toggleSite}
              >
                <span className={` `}>
                  {currentSite === "sale" ? "For Rent" : "For Sale"}
                </span>{" "}
                /{" "}
                <span className=" transition-colors line-through opacity-30">
                  {" "}
                  {currentSite === "sale" ? "Sale" : "Rent"}
                </span>
              </Button>
            </motion.div>
            <span className="hidden lg:block">
              <motion.div variants={headerItemVariants}>
                <ThemeSwitch />
              </motion.div>
            </span>
            <motion.div variants={headerItemVariants}>
              <Button variant="link" size="sm" className="">
                Cart
              </Button>
            </motion.div>

            <motion.div variants={headerItemVariants}>
              <Button
                onClick={() => setOpen(!open)}
                variant="link"
                className=" "
                size="sm"
              >
                MENU
              </Button>
            </motion.div>
          </motion.div>
        </span>
      </header>
      <AnimatePresence>
        {open && <MenuOverlay open={open} setOpen={setOpen} />}
      </AnimatePresence>
    </>
  );
}
