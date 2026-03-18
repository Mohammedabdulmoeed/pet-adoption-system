// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await register(name, email, password);
//       navigate("/");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-md">
//       <h1 className="text-2xl font-extrabold tracking-tight">Create account</h1>
//       <p className="mt-1 text-sm text-slate-600">Register to apply for pet adoptions.</p>

//       <form onSubmit={onSubmit} className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
//         <label className="text-xs font-semibold text-slate-600">Name</label>
//         <input
//           className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <label className="mt-4 block text-xs font-semibold text-slate-600">Email</label>
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
//           minLength={6}
//           required
//         />

//         <button
//           disabled={loading}
//           className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
//         >
//           {loading ? "Creating..." : "Register"}
//         </button>

//         <div className="mt-4 text-center text-sm text-slate-600">
//           Already have an account?{" "}
//           <Link className="font-semibold text-slate-900 underline" to="/login">
//             Login
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* 🔥 LEFT SIDE (IMAGE) */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1507146426996-ef05306b995a"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-10 left-10 text-white max-w-sm">
          <h1 className="text-4xl font-bold">
            Join Us 🐶
          </h1>
          <p className="mt-2 text-sm opacity-90">
            Start your journey of giving pets a loving home.
          </p>
        </div>
      </div>

      {/* 🔐 RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Create Account</h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign up to adopt your new best friend 🐾
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={onSubmit}
            className="mt-6 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6"
          >
            {/* NAME */}
            <label className="text-xs font-semibold text-slate-600">
              Name
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
              <User size={16} className="text-gray-400" />
              <input
                className="w-full outline-none text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* EMAIL */}
            <label className="mt-4 block text-xs font-semibold text-slate-600">
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
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl font-semibold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>

            {/* LOGIN LINK */}
            <div className="mt-4 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                className="font-semibold text-indigo-600 hover:underline"
                to="/login"
              >
                Login
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}