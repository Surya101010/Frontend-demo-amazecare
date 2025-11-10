import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Stethoscope, Pill, Hospital } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Floating medical icons */}
      <motion.div
        className="absolute top-10 left-10 text-blue-400 opacity-60"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <HeartPulse size={50} />
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-20 text-pink-400 opacity-60"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <Pill size={48} />
      </motion.div>

      <motion.div
        className="absolute top-20 right-20 text-teal-400 opacity-60"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        <Stethoscope size={55} />
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-16 text-indigo-300 opacity-60"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <Hospital size={55} />
      </motion.div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl md:text-7xl font-extrabold text-blue-700 tracking-tight text-center mt-10"
      >
        AmazeCare
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-gray-600 mt-4 text-lg md:text-xl text-center max-w-2xl"
      >
        Empowering doctors, simplifying care, and connecting patients to better health — all in one platform.
      </motion.p>

      {/* Hero Illustration / Section */}
      <motion.div
        className="mt-12 flex flex-col md:flex-row items-center justify-center gap-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <motion.img
          src='https://img.icons8.com/clouds/500/medical-doctor.png'
          alt="Doctor Illustration"
          className="w-64 md:w-80 lg:w-96 drop-shadow-xl"
          whileHover={{ scale: 1.05 }}
        />

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-center md:text-left max-w-md"
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-3">
            Smart. Secure. Seamless.
          </h2>
          <p className="text-gray-600 mb-6">
            From appointment scheduling to prescription tracking — AmazeCare helps you manage your healthcare experience effortlessly.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/reg")}
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Register
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-5 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        © {new Date().getFullYear()} AmazeCare. All rights reserved.
      </motion.footer>
    </div>
  );
}
