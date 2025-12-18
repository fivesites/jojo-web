import { Card, CardAction, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CookieModal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-end p-1 "
    >
      <Card className="flex flex-col gap-2 text-sm text-foreground max-w-sm bg-accent p-1 items-start justify-start">
        <CardDescription className="w-full  font-serif-book pt-6 pb-3 px-6 ">
          This website uses cookies to enhance the user experience. <br />
          By continuing to use this website, you agree to our use of cookies.
        </CardDescription>
        <CardAction className="flex gap-2 items-end justify-end w-full">
          <Button asChild variant="secondary" size="lg" className="">
            <Link href="/pages/privacy-policy">Learn more</Link>
          </Button>

          <Button size="lg" className="">
            Agree & Close
          </Button>
        </CardAction>
      </Card>
    </motion.div>
  );
}
