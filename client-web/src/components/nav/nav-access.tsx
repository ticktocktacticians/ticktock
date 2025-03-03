"use client"; // Mark this file as a client component

import Navbar from "@/components/nav/navbar";
import { usePathname } from "next/navigation";

export default function NavAccess() {
    const pathname = usePathname();

    return (
        <>
            {/* Conditionally render the Navbar for all /public/* routes */}
            {!pathname.startsWith("/public/") && <Navbar />}
        </>
    );
}