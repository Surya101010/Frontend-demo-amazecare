import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); 
  const navigate = useNavigate();

  async function sendOtp() {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await axios.post(`http://localhost:8081/otp/send?email=${email}`);
      setOtpSent(true);
      setTimer(120);
      alert("OTP sent successfully. Please check your email.");
    } catch (e) {
      alert("Failed to send OTP. Try again.");
    }
  }

  async function validateOtp() {
    try {
      await axios.post(
        `http://localhost:8081/otp/validate?email=${email}&otp=${otp}`
      );
      alert("OTP verified successfully");
      navigate("/reset-password", { state: { email } });
    } catch (e) {
      alert("Invalid or expired OTP");
    }
  }

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  function formatTime() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        {!otpSent ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Forgot Password
            </h2>
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Verify OTP
            </h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <button
              onClick={validateOtp}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2"
            >
              Validate OTP
            </button>

            <p className="text-center text-sm mb-2">
              Time left:{" "}
              <span className="text-red-500 font-semibold">
                {formatTime()}
              </span>
            </p>

            {timer <= 0 && (
              <button
                onClick={sendOtp}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Resend OTP
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
