// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(email, password);
//       navigate("/");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-md">
//       <h1 className="text-2xl font-extrabold tracking-tight">Login</h1>
//       <p className="mt-1 text-sm text-slate-600">Access your dashboard and submit adoption applications.</p>

//       <form onSubmit={onSubmit} className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
//         <label className="text-xs font-semibold text-slate-600">Email</label>
//         <input
//           className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           type="email"
//           required
//         />

//         <label className="mt-4 block text-xs font-semibold text-slate-600">Password</label>
//         <input
//           className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           type="password"
//           required
//         />

//         <button
//           disabled={loading}
//           className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
//         >
//           {loading ? "Signing in..." : "Login"}
//         </button>

//         <div className="mt-4 text-center text-sm text-slate-600">
//           No account?{" "}
//           <Link className="font-semibold text-slate-900 underline" to="/register">
//             Register
//           </Link>
//         </div>
//       </form>

//       <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-slate-600">
//         <div className="font-semibold text-slate-900">Seeded admin (optional)</div>
//         <div className="mt-1">
//           Email: <span className="font-mono">admin@pets.com</span> • Password: <span className="font-mono">Admin@123</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* 🔥 LEFT SIDE (IMAGE / BRANDING) */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-10 left-10 text-white max-w-sm">
          <h1 className="text-4xl font-bold">
            Welcome Back 🐾
          </h1>
          <p className="mt-2 text-sm opacity-90">
            Find your perfect companion and make a difference.
          </p>
        </div>
      </div>

      {/* 🔐 RIGHT SIDE (FORM) */}
      <div className="flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Login</h2>
            <p className="text-sm text-slate-500 mt-1">
              Access your account
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            className="mt-6 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6"
          >
            {/* EMAIL */}
            <label className="text-xs font-semibold text-slate-600">
              Email
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
              <Mail size={16} className="text-gray-400" />
              <input
                className="w-full outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* PASSWORD */}
            <label className="mt-4 block text-xs font-semibold text-slate-600">
              Password
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
              <Lock size={16} className="text-gray-400" />
              <input
                className="w-full outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl font-semibold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* REGISTER */}
            <div className="mt-4 text-center text-sm text-slate-600">
              No account?{" "}
              <Link
                className="font-semibold text-indigo-600 hover:underline"
                to="/register"
              >
                Register
              </Link>
            </div>
          </form>

          {/* DEMO CARD */}
          <div className="mt-4 bg-white border rounded-xl p-4 text-sm shadow-sm">
            <div className="font-semibold">Demo Admin</div>
            <div className="mt-1 text-slate-600">
              Email: <span className="font-mono">admin@pets.com</span>
            </div>
            <div className="text-slate-600">
              Password: <span className="font-mono">Admin@123</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}