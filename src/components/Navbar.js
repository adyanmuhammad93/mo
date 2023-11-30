import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="mx-auto py-4 w-[90%] max-w-[1200px]">
        <div className="navbar rounded-xl shadow">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">
              Class Management
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 gap-2">
              <li>
                <Link href="/classes">Classes</Link>
              </li>
              <li>
                <Link href="/teachers">Teachers</Link>
              </li>
              <li>
                <Link href="/subjects">Subjects</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
