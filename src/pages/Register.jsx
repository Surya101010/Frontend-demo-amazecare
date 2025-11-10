import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Too short")
      .max(30, "Too long")
      .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers"),
    email: z
      .string()
      .email("Invalid email")
      .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email format"),
    password: z
      .string()
      .min(6, "Too short")
      .max(50, "Too long")
      .regex(/^\S+$/, "No spaces"),
    role: z.enum(["doctor", "patient"], {
      required_error: "Select a role",
    }),
    confirmPassword: z.string().min(6, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords mismatch",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        username: formatted.username?._errors[0],
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
        confirmPassword: formatted.confirmPassword?._errors[0],
        role: formatted.role?._errors[0],
      });
      return;
    }

    setErrors({});
    try {
      const endpoint =
        form.role === "doctor"
          ? "http://localhost:8081/register/doctor"
          : "http://localhost:8081/register/patient";

      await axios.post(endpoint, {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Registration successful");
      navigate("/");
    } catch (error) {
      alert("Registration failed: " + (error.response?.data || "Server error"));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full mb-1 p-2 border rounded"
          value={form.username}
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-600 text-sm mb-2">{errors.username}</p>}

        <input
          name="email"
          placeholder="Email"
          className="w-full mb-1 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email}</p>}

        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full mb-1 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}

        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          className="w-full mb-1 p-2 border rounded"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mb-2">{errors.confirmPassword}</p>
        )}

        <div className="flex justify-around mb-3">
          <label>
            <input
              type="radio"
              name="role"
              value="doctor"
              checked={form.role === "doctor"}
              onChange={handleChange}
            />{" "}
            Doctor
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="patient"
              checked={form.role === "patient"}
              onChange={handleChange}
            />{" "}
            Patient
          </label>
        </div>
        {errors.role && <p className="text-red-600 text-sm mb-2 text-center">{errors.role}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
        >
          Register
        </button>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
