import { Button } from "./ui/button";
import { useSite } from "@/app/context/SiteContext";

export default function SiteSelector() {
  const { currentSite, setCurrentSite } = useSite();
  return (
    <section className=" h-[50vh] lg:h-[25vh] grid grid-cols-2 mt-8  ">
      <div
        className={`col-span-1 z-0 flex flex-col bg-[url(/flowers.png)] bg-no-repeat bg-fill bg-center`}
      >
        <div className="w-full h-full relative z-10 flex flex-col items-center justify-center ">
          <Button size="sm" onClick={() => setCurrentSite("sale")}>
            For Sale
          </Button>
        </div>
      </div>
      <div
        className={`col-span-1 z-0 flex flex-col bg-[url(/cicciolina_noise.png)] bg-no-repeat bg-fill bg-center `}
      >
        <div className="w-full h-full relative z-10 flex flex-col items-center justify-center ">
          <Button size="sm" onClick={() => setCurrentSite("rent")}>
            For Rent
          </Button>
        </div>
      </div>
    </section>
  );
}
