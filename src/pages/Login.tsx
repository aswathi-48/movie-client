// // import React, { useState } from 'react';
// // import api, { setToken } from '../api';
// // import { useNavigate } from 'react-router-dom';

// // export default function Login(){
// //   const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
// //   const nav = useNavigate();
// //   const submit = async (e:any)=>{
// //     e.preventDefault();
// //     try{
// //       const res = await api.post('/auth/login', { email, password });
// //       setToken(res.data.token);
// //       nav('/');
// //     }catch(err:any){ alert(err?.response?.data?.error || 'Error'); }
// //   };
// //   return (
// //     <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded">
// //       <h2 className="mb-4 text-xl">Login</h2>
// //       <input className="w-full p-2 mb-2 border" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
// //       <input type="password" className="w-full p-2 mb-2 border" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
// //       <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
// //     </form>
// //   )
// // }

// // import React, { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";

// // export default function Login() {
// //   const [form, setForm] = useState({ email: "", password: "" });
// //   const navigate = useNavigate();

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     console.log("Login with", form);
// //     navigate("/"); // redirect to home after login
// //   };

// //   return (
// //     <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg mt-10">
// //       <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="email"
// //           name="email"
// //           placeholder="Email"
// //           value={form.email}
// //           onChange={handleChange}
// //           className="w-full border rounded-md p-2"
// //         />
// //         <input
// //           type="password"
// //           name="password"
// //           placeholder="Password"
// //           value={form.password}
// //           onChange={handleChange}
// //           className="w-full border rounded-md p-2"
// //         />
// //         <button
// //           type="submit"
// //           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
// //         >
// //           Login
// //         </button>
// //       </form>

// //       <p className="text-sm text-center mt-4">
// //         Don’t have an account?{" "}
// //         <Link to="/register" className="text-blue-600 hover:underline">
// //           Register
// //         </Link>
// //       </p>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api, { setToken } from "../api";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/auth/login", form);
//       const { token, user } = res.data;
//       setToken(token);
//       alert(`Welcome ${user.name}`);
//       navigate("/");
//     } catch (err: any) {
//       alert(err?.response?.data?.error || "Login failed");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg mt-10">
//       <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full border rounded-md p-2"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full border rounded-md p-2"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
//         >
//           Login
//         </button>
//       </form>

//       <p className="text-sm text-center mt-4">
//         Don’t have an account?{" "}
//         <Link to="/register" className="text-blue-600 hover:underline">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setToken } from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;
      setToken(token);
      alert(`Welcome ${user.name || user.email}`);
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
