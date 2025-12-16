import { Button } from "./ui/button";
import Link from "next/link";

export default function AdminHeaderNav() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 bg-background">
      <div className=" flex items-center justify-between">
        <span className="text-xs font-serif-book">
          <Button asChild variant="link" size="sm">
            <Link href="/" className="">
              Home
            </Link>
          </Button>
          /
          <Button asChild variant="link" size="sm">
            <Link href="/admin" className="">
              Admin Panel{" "}
            </Link>
          </Button>
        </span>

        <div className="flex items-center justify-end">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit" className="">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
