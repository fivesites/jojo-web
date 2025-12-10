import { HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function HeaderNav() {
  return (
    <>
      {/* TOP PART OF HEADER */}
      <header className="relative top-0  px-6 pt-18 grid grid-cols-2 lg:grid-cols-4 h-[50vh]">
        <div className="col-span-2 font-mono leading-tight text-sm">
          <strong>JOJO</strong> studio of vintage couture <br /> st. paulsgatan
          44, stockholm
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
      <div className="fixed top-0 w-full grid grid-cols-2  bg-gray-200 rounded-none">
        <div>
          <Button size="sm">MENU</Button>
        </div>

        <div className="flex justify-between w-full ">
          <Button size="sm" className="font-mono text-xs">
            LOG IN
          </Button>
          <span className="flex items-center justify-end   ">
            <Button size="sm" className="font-mono text-xs">
              Cart
            </Button>
            <Button size="sm">
              <PersonIcon />
            </Button>
            <Button size="sm">
              <HamburgerMenuIcon />
            </Button>
          </span>
        </div>
      </div>
    </>
  );
}
