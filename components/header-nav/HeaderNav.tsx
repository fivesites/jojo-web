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
  const [admin, setAdmin] = useState(false);

  const ifAdmin = usePathname().startsWith("/admin");

  useEffect(() => {
    setAdmin(ifAdmin);
  }, [ifAdmin]);

  return (
    <>
      {/* TOP PART OF HEADER */}
      <header
        className={` ${
          admin ? " pl-3 lg:pl-12 bg-secondary" : "pl-1 bg-background"
        } fixed z-40 top-0 left-0  right-0 w-full pr-1    h-9`}
      >
        <span className="flex justify-between items-center w-full ">
          <h1 className="text-base px-1   font-serif-display flex items-center justify-center   leading-tight tracking-wide text-primary    ">
            <Link href="/">JOJO STUDIO</Link>
          </h1>
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-end space-x-6 
           "
          >
            <motion.div variants={headerItemVariants}>
              <div role="button" className="space-x-0" onClick={toggleSite}>
                <Badge className={` `}>
                  {currentSite === "sale" ? "For Rent" : "For Sale"}
                </Badge>
                <Badge
                  variant="outline"
                  className=" transition-colors line-through "
                >
                  {currentSite === "sale" ? "Sale" : "Rent"}
                </Badge>
              </div>
            </motion.div>
            <span className="hidden lg:block">
              <motion.div variants={headerItemVariants}>
                <ThemeSwitch />
              </motion.div>
            </span>

            <motion.div variants={headerItemVariants}>
              {/* LOG IN BUTTON / NAMN */}
              <LogInButton openLogin={openLogin} setOpenLogin={setOpenLogin} />
            </motion.div>
            <motion.div variants={headerItemVariants}>
              <Button variant="link" size="sm" className="">
                Cart
              </Button>
            </motion.div>

            <motion.div variants={headerItemVariants}>
              <Badge onClick={() => setOpen(!open)} variant="outline">
                MENU
              </Badge>
            </motion.div>
          </motion.div>
        </span>
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
