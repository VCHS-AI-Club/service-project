import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "./ui";

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  current?: boolean;
}> = ({ href, children, current }) => {
  return (
    <Link
      href={href}
      className={
        " border-b-2 py-1 text-gray-800 hover:border-indigo-400" +
        (current ? " border-indigo-500 " : " border-transparent ")
      }
    >
      {children}
    </Link>
  );
};

export const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  return (
    <nav className="fixed top-0 z-50 min-w-full space-y-1 bg-gray-50 px-16 py-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Image src="/logo.svg" height={48} width={48} alt="logo" />
          {session && (
            <>
              <NavLink current={pathname === "/"} href="/">
                Home
              </NavLink>
              <NavLink current={pathname === "/service"} href="/service">
                Service
              </NavLink>
              <NavLink current={pathname === "/dashboard"} href="/dashboard">
                Dashboard
              </NavLink>
            </>
          )}
          {session?.user?.role == "ADMIN" && (
            <>
              <NavLink current={pathname === "/create"} href="/create">
                Create
              </NavLink>
              <NavLink current={pathname === "/edit"} href="/edit">
                Edit
              </NavLink>
            </>
          )}
        </div>
        <div className="flex items-center gap-8">
          <div>Search Bar</div>
          {session ? (
            <Button variant="secondary" onClick={() => signOut()}>
              Log Out
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => signIn("google")}>
              Log In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
