"use client";

import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useSite } from "@/app/context/SiteContext";
import { useState } from "react";
import { Input } from "./ui/input";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";

function MenuOverlay({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const categories = ["Clothing", "Accessories", "Shoes", "Bags"];

  return (
    <div
      className={`  fixed top-0 left-0 right-0 z-50  w-full bg-accent text-accent-foreground `}
    >
      <div className="flex justify-between w-full items-center  ">
        <Link href="/">
          <h1 className="text-sm tracking-wider font-serif-display flex items-center justify-center  px-4 leading-tight  mt-0.75   ">
            JOJO STUDIO
          </h1>
        </Link>

        <div className="flex justify-end items-center  ">
          <ThemeSwitch />
          <Button variant="ghost" size="sm" className=" ">
            Log In
          </Button>
          <Button variant="ghost" size="sm" className=" ">
            Cart
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            size="sm"
            className=""
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>
      <div className=" h-full w-full flex flex-col lg:flex-row ">
        <div className=" h-[50vh] w-full lg:h-screen lg:w-1/2 pt-12 px-6 flex flex-col">
          <div className="grid w-full max-w-sm items-center gap-1.5 font-mono font-normal text-xs rounded-none mb-12 px-3">
            <Input
              className=" border-black placeholder:text-black placeholder:text-xs font-mono text-xs rounded-none shadow-none "
              id="text"
              type="text"
              placeholder="Search..."
            />
          </div>
          <nav>
            <ul className="flex flex-col gap-2 text-sm font-mono">
              <li>
                <Link href="/" onClick={() => setOpen(false)}>
                  <Button variant="link" size="sm">
                    Products
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setOpen(false)}>
                  <Button variant="link" size="sm">
                    Visit The Store
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/pages/about" onClick={() => setOpen(false)}>
                  <Button variant="link" size="sm">
                    About JOJO
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setOpen(false)}>
                  <Button variant="link" size="sm">
                    Privacy Policy
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setOpen(false)}>
                  <Button variant="link" size="sm">
                    Imprint
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/admin" onClick={() => setOpen(false)}>
                  <Button variant="link" size="sm">
                    Admin
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="h-[50vh] w-full lg:h-screen lg:w-1/2 bg-accent text-accent-foreground pt-12 px-6">
          <div className="mb-4">
            <Button variant="link" size="sm" className="">
              Latest Added
            </Button>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 ">
            {categories.map((category, index) => (
              <div key={index} className="col-span-1  ">
                <Button variant="link" size="sm" className="">
                  {category}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeaderNav() {
  const { currentSite, toggleSite } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP PART OF HEADER */}
      <header
        className={`bg-background fixed z-30 top-0 left-0 right-0   w-full h-8 `}
      >
        {/* OPEN/CLOSED SIGN */}

        {/* <div className="col-span-1 flex flex-col justify-baseline items-end font-mono w-full">
          <Badge className="flex items-center space-x-1.5">
            open
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="line-through opacity-30">closed</span>
          </Badge>
          <span className="ml-3 hidden lg:flex">mon—sat 10—16</span>
        </div> */}

        {/* 🍀 STICKY → FIXED NAVBAR */}

        <span className="flex justify-between items-center w-full ">
          <Link href="/">
            <h1 className="text-sm tracking-wider font-serif-display flex items-center justify-center  px-4 leading-tight  mt-0.75   ">
              JOJO STUDIO
            </h1>
          </Link>

          <div className="flex justify-start">
            <Button variant="ghost" size="sm" className="" onClick={toggleSite}>
              <span className={` `}>
                {currentSite === "sale" ? "FOR RENT" : "FOR SALE"}
              </span>{" "}
              /{" "}
              <span className=" transition-colors line-through opacity-30">
                {" "}
                {currentSite === "sale" ? "SALE" : "RENT"}
              </span>
            </Button>
            <span className="hidden lg:block">
              <ThemeSwitch />
            </span>
            <Button variant="ghost" size="sm" className="">
              Cart
            </Button>
            <Button
              onClick={() => setOpen(!open)}
              variant="ghost"
              className=" "
              size="sm"
            >
              MENU
            </Button>
          </div>
        </span>
        <div className="flex  w-full items-baseline     "></div>
      </header>
      {open && <MenuOverlay setOpen={setOpen} />}

      {/* <div className="z-40 fixed bottom-0 left-0 right-0  flex items-baseline justify-between font-serif-densed  w-full text-sm py-1.5 px-3 text-black ">
        J<div className="w-2.5 aspect-square rounded-full bg-black" />J
        <span className="font-serif-wide">O</span>
      </div> */}
    </>
  );
}
