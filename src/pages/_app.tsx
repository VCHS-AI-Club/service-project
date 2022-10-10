import "../styles/globals.css";

import type AppType from "next/app";
import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import Image from "next/image";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

// const NavBar = () => {
//   const { data: session, status } = useSession();
//   if (status === "loading") return <div>Loading...</div>;
//   return (
//     <>
//       <nav className="bg-gray-800 ">
//         <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
//           <div className="hidden sm:ml-6 sm:block">
//             <div className="flex space-x-4">
//               <Link href="/">
//                 <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                   Home
//                 </a>
//               </Link>{" "}
//               <Link href="/admin/create">
//                 <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                   Create
//                 </a>
//               </Link>{" "}
//               <Link href="/service">
//                 <a
//                   className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
//                   aria-current="page"
//                 >
//                   Service
//                 </a>
//               </Link>
//               <button
//                 className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//                 onClick={() => (session?.user ? signOut() : signIn("google"))}
//               >
//                 {session?.user ? "Sign Out" : "Sign In"}
//               </button>
//             </div>
//           </div>
//           {session?.user && (
//             <div className="text-white px-3 py-2 rounded-md text-sm font-medium">
//               Signed in as {session?.user?.name}
//             </div>
//           )}
//           {session?.user?.image && (
//             <>
//               <Image src={session?.user?.image} width="36" height="1" />
//               <div className="text-white">{session?.user?.id}</div>
//             </>
//           )}
//         </div>
//       </nav>
//     </>
//   );
// };
const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </SessionProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};
// const MyApp: AppType<{ session: Session | null }> = ({
//   Component,
//   pageProps: { session, ...pageProps },
// }) => {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// };

export default MyApp;
