import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription } from "./ui/card";

import Image from "next/image";

export default function ProductsGrid() {
  return (
    <div className=" p-3">
      {/* FILTER BUTTONS */}
      <div className=" sticky top-1.5 grid grid-cols-2 lg:grid-cols-4 justify-start items-baseline mb-1.5">
        {/* LEFT NAV COL */}

        <div className="col-start-2 flex items-center">
          <Badge variant="default" className=" ">
            FILTER
          </Badge>
        </div>
        {/* RIGHT NAV COL */}
        <div className="flex  items-center px-1.5">
          <Badge variant="secondary" className=" ">
            Latest Added [x]
          </Badge>
        </div>
      </div>
      <div className="bg-blue-600 grid grid-cols-2 lg:grid-cols-4 ">
        <div className="col-span-1 ">
          <Card className="w-full">
            <CardContent>
              <Image
                src="/17122024_Bootleg-Aphex-Twin_005.webp"
                alt="login image"
                width={400}
                height={400}
                className="object-contain"
              />
            </CardContent>
            <CardDescription className="">
              <h3 className="font-bold">Short-sleeve shirt [Desigual]</h3>
              <span className="flex w-full justify-between items-baseline font-mono ">
                400 SEK <h4 className="text-xs text-gray-400">2 available</h4>
              </span>
            </CardDescription>
          </Card>
        </div>
        <div className="col-span-1 ">
          <Card className="w-full">
            <CardContent>
              <Image
                src="/250924_JWAnderson_LoaferBag_JohnMalkovich_S1_0044__R2_HKsRGB.webp"
                alt="login image"
                width={400}
                height={400}
                className="object-contain"
              />
            </CardContent>
            <CardDescription className="">
              <h3 className="font-bold">Turtleneck sweater [JW ANDERSON]</h3>
              <span className="flex w-full justify-between items-baseline font-mono ">
                400 SEK
              </span>
            </CardDescription>
          </Card>
        </div>
        <div className="col-span-1 ">
          <Card className="w-full">
            <CardContent>
              <Image
                src="/1350715.avif"
                alt="login image"
                width={400}
                height={400}
                className="object-contain"
              />
            </CardContent>
            <CardDescription className="">
              <h3 className="font-bold">T-Shirt 90's</h3>
              <span className="flex w-full justify-between items-baseline font-mono ">
                90 SEK
              </span>
            </CardDescription>
          </Card>
        </div>
        <div className="col-span-1 ">
          <Card className="w-full">
            <CardContent>
              <Image
                src="/sweatshirt_men.png"
                alt="login image"
                width={400}
                height={400}
                className="object-contain"
              />
            </CardContent>
            <CardDescription className="">
              <h3 className="font-bold">Sweater [JW ANDERSON]</h3>
              <span className="flex w-full justify-between items-baseline font-mono font-normal ">
                400 SEK <h4 className="text-xs text-gray-400">4 available</h4>
              </span>
            </CardDescription>
          </Card>
        </div>
        <div className="h-screen"></div>
      </div>
    </div>
  );
}
