"use client";

import { Button } from "../ui/button";
import { useSite } from "@/context/SiteContext";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";

import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Login from "../Login";
import MenuOverlay from "./MenuOverlay";
import { usePathname } from "next/navigation";
import LogInButton from "./LogInButton";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

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

export default function HeaderNav() {
  const { currentSite, toggleSite } = useSite();
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isAccent = open || isAdminPage;

  return (
    <>
      {/* TOP PART OF HEADER */}
      <header
        className={`
    fixed z-40 top-0 left-0 right-0 w-full  pr-1  h-11 pt-1 
    ${isAccent ? "bg-accent" : "bg-background"}
    ${isAdminPage ? "pl-1 lg:pl-10 " : "pl-1 "}
    ${isAdminPage && open ? "pl-3 lg:pl-10  " : "pl-1"}
  `}
      >
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-start items-center w-full 
           "
        >
          <motion.h1 className="" variants={headerItemVariants}>
            <Button
              size="sm"
              asChild
              className=" font-serif-display tracking-widest pt-0.25 whitespace-nowrap h-9 "
            >
              <Link className="" href="/">
                JOJO STUDIO
              </Link>
            </Button>
          </motion.h1>

          <motion.div variants={headerItemVariants}>
            <div
              role="button"
              className="flex justify-start space-x-0 "
              onClick={toggleSite}
            >
              <Button size="sm" variant="secondary" className={`h-9 `}>
                {currentSite === "sale" ? "For Rent" : "For Sale"}
              </Button>
              <Button
                size="sm"
                variant="default"
                className="  transition-colors line-through h-9 "
              >
                {currentSite === "sale" ? "Sale" : "Rent"}
              </Button>
            </div>
          </motion.div>
          <div className="flex justify-end items-baseline w-full">
            <motion.div
              className="hidden lg:block"
              variants={headerItemVariants}
            >
              {/* LOG IN BUTTON / NAMN */}
              <LogInButton openLogin={openLogin} setOpenLogin={setOpenLogin} />
            </motion.div>
            <motion.div
              className="hidden lg:block"
              variants={headerItemVariants}
            >
              <Button variant="link" size="sm" className="">
                Cart
              </Button>
            </motion.div>

            <motion.div
              className="block lg:hidden"
              variants={headerItemVariants}
            >
              <Button
                onClick={() => setOpen(!open)}
                className="aspect-square h-9"
                variant="outline"
                size="sm"
              >
                {open ? <Cross1Icon /> : <HamburgerMenuIcon />}
              </Button>
            </motion.div>
            <motion.div
              className="hidden lg:block"
              variants={headerItemVariants}
            >
              <Button
                onClick={() => setOpen(!open)}
                className="aspect-square h-9"
                variant="outline"
                size="sm"
              >
                {open ? "Close" : "Menu"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open && <MenuOverlay open={open} setOpen={setOpen} />}
      </AnimatePresence>

      <AnimatePresence>
        {openLogin && (
          <Login openLogin={openLogin} setOpenLogin={setOpenLogin} />
        )}
      </AnimatePresence>
    </>
  );
}
