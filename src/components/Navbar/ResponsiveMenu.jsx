import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Navlinks } from "./Navbar";

const ResponsiveMenu = ({ showMenu, user }) => {
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-200 md:hidden rounded-r-xl shadow-md`}
    >
      <div className="card">
        <div className="flex items-center justify-start gap-3">
          <FaUserCircle size={50} />
          <div>
            <h1>Hello {user ? user.email : "Guest"}</h1>
            <h1 className="text-sm text-slate-500">{user ? (user.role === "admin" ? "Admin user" : "Premium user") : "Guest"}</h1>
          </div>
        </div>
        <nav className="mt-12">
          <ul className="space-y-4 text-xl">
            {Navlinks.map(({ id, name, link }) => (
              (name !== "CARS" || user) && (
                <li key={id}>
                  <a href={link} className="mb-5 inline-block">
                    {name}
                  </a>
                </li>
              )
            ))}
            {user ? (
              <li>
                <a
                  href={user.role === "admin" ? "/admin-panel" : "/dashboard"}
                  className="mb-5 inline-block"
                >
                  {user.role === "admin" ? "ADMIN PANEL" : "DASHBOARD"}
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a href="/login" className="mb-5 inline-block">
                    LOGIN
                  </a>
                </li>
                <li>
                  <a href="/signup" className="mb-5 inline-block">
                    SIGNUP
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="footer">
        <h1>Car Rental</h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
