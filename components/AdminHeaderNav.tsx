import { Button } from "./ui/button";
import Link from "next/link";

export default function AdminHeaderNav() {
  return (
    <header className=" bg-background">
      <div className="max-w-7xl mx-auto  flex items-center justify-between px-3">
        <Link href="/admin" className="">
          <Button variant="ghost" size="sm">
            ADMIN
          </Button>
        </Link>

        <div className="flex items-center justify-end">
          <Button variant="ghost" size="sm">
            <Link href="/admin/products/add" className="">
              Add Product
            </Link>
          </Button>
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
