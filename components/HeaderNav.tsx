import { HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function HeaderNav() {
  return (
    <>
      {/* TOP PART OF HEADER */}
      <header className="relative top-0  p-6 grid grid-cols-2 lg:grid-cols-4 h-[50vh] lg:h-[25vh]">
        <div className="col-span-2 font-mono leading-tight text-sm pt-8">
          <h1 className="">JOJO</h1>
          <h2>
            studio of vintage couture <br /> st. paulsgatan 44, stockholm
          </h2>
        </div>

        {/* OPEN/CLOSED SIGN */}

        {/* <div className="col-span-1 flex flex-col justify-baseline items-end font-mono w-full">
          <Badge className="flex items-center space-x-1.5">
            open
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="line-through opacity-30">closed</span>
          </Badge>
          <span className="ml-3 hidden lg:flex">mon—sat 10—16</span>
        </div> */}
      </header>

      {/* 🍀 STICKY → FIXED NAVBAR */}
      <div className="fixed top-0 left-0 right-0  flex   rounded-none  ">
        <div className="hidden lg:block">
          <Button size="sm" className="font-mono text-xs">
            Menu
          </Button>
        </div>
        <div className="flex justify-end  w-full ">
          <Button variant="secondary" size="sm" className="font-mono text-xs">
            Log In
          </Button>
          <span className="flex items-center justify-end   ">
            <Button variant="secondary" size="sm" className="font-mono text-xs">
              Cart
            </Button>
          </span>
        </div>
        <div className="block lg:hidden ">
          <Button size="sm">
            <HamburgerMenuIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
