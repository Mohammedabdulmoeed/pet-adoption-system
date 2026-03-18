import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PawPrint, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageTransition from "./PageTransition";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-semibold ${
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const { user, isAuthenticated, logout, refreshMe } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshMe().catch(() => {
      // ignore (token may be absent/expired)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-full">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(900px_circle_at_85%_20%,rgba(168,85,247,0.16),transparent_55%),radial-gradient(1100px_circle_at_50%_90%,rgba(34,197,94,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      </div>

      <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="group inline-flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <motion.span
              initial={false}
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm"
            >
              <PawPrint size={18} />
            </motion.span>
            <span className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-600 bg-clip-text text-transparent">
              Pet Adoption
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavItem to="/">Home</NavItem>
            {isAuthenticated && user?.role === "user" && <NavItem to="/dashboard">Dashboard</NavItem>}
            {isAuthenticated && user?.role === "admin" && <NavItem to="/admin">Admin</NavItem>}
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="hidden text-sm text-slate-600 md:block">
                  {user.name}{" "}
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    {user.role === "admin" ? <ShieldCheck size={14} /> : null}
                    ({user.role})
                  </span>
                </div>
                <button
                  className="rounded-lg border bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-white"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white/70" to="/login">
                  Login
                </Link>
                <Link
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Pet Adoption Management System
        </div>
      </footer>
    </div>
  );
}

