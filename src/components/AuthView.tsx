import React, { useState, useEffect, useRef } from "react";
import { ViewType } from "../types";
import { 
  Lock, 
  Phone, 
  User, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Key, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getRegisteredUsers, 
  saveRegisteredUsers, 
  hashPassword, 
  generateSalt, 
  generateOTP, 
  RegisteredUser,
  UserSession,
  normalizePhone
} from "../lib/authUtils";

interface AuthViewProps {
  onLoginSuccess: (session: UserSession) => void;
  targetRole?: "user" | "admin";
  onBack: () => void;
  // Callback when we want to display the SMS Toast from the parent App level
  triggerSmsNotification: (otp: string, phone: string) => void;
  isAuthenticated?: boolean;
}

type AuthSubView = "login" | "signup" | "otp" | "forgot" | "reset";

export default function AuthView({
  onLoginSuccess,
  targetRole = "user",
  onBack,
  triggerSmsNotification,
  isAuthenticated = false,
}: AuthViewProps) {
  // Navigation states
  const [currentSubView, setCurrentSubView] = useState<AuthSubView>("login");
  const [role, setRole] = useState<"user" | "admin">(targetRole);
  const [otpPurpose, setOtpPurpose] = useState<"login" | "reset">("login");

  // Form Fields
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Otp states
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Password reset fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Error/Success statuses
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Rate Limiting simulation
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Timer trackers
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear states when changing tabs or views
  const resetFormState = () => {
    setErrorText("");
    setSuccessText("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime) {
      const lockInterval = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setLockoutTime(null);
          setLoginAttempts(0);
          setErrorText("");
          clearInterval(lockInterval);
        }
      }, 1000);
      return () => clearInterval(lockInterval);
    }
  }, [lockoutTime]);

  // OTP Expiration countdown timer (5 minutes = 300 seconds)
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(300);
  useEffect(() => {
    if (currentSubView === "otp" && otpExpiry) {
      intervalRef.current = setInterval(() => {
        const timeLeft = Math.max(0, Math.round((otpExpiry - Date.now()) / 1000));
        setOtpSecondsLeft(timeLeft);
        if (timeLeft <= 0) {
          setErrorText("The OTP code has expired. Please request a new one.");
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSubView, otpExpiry]);

  // Resend code timer logic (60 seconds)
  useEffect(() => {
    if (resendTimer > 0) {
      resendIntervalRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (resendIntervalRef.current) clearInterval(resendIntervalRef.current);
    };
  }, [resendTimer]);

  // Sync state tab selector with initial role
  useEffect(() => {
    setRole(targetRole);
  }, [targetRole]);

  // Submit Password authentication
  const handleValidatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!phone) {
      setErrorText("Phone number is required.");
      return;
    }
    if (!password) {
      setErrorText("Password is required.");
      return;
    }

    // Clean phone input
    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 10) {
      setErrorText("Please enter a valid 10-digit phone number.");
      return;
    }

    // Rate limiter check
    if (loginAttempts >= 5 && lockoutTime && Date.now() < lockoutTime) {
      const remainingSecs = Math.ceil((lockoutTime - Date.now()) / 1000);
      setErrorText(`Too many failed attempts. Account locked. Please try again in ${remainingSecs}s.`);
      return;
    }

    setIsLoading(true);

    try {
      // Small simulated latency for hashing
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = getRegisteredUsers();
      const existingUser = users.find(u => normalizePhone(u.phone) === cleanPhone);

      if (!existingUser) {
        setLoginAttempts(prev => prev + 1);
        setErrorText("Incorrect phone number or password. Check demo credentials below!");
        setIsLoading(false);
        if (loginAttempts + 1 >= 5) {
          setLockoutTime(Date.now() + 60000); // Lockout for 60 seconds
        }
        return;
      }

      // Check role assignment boundaries
      if (role === "admin" && existingUser.role !== "admin") {
        setErrorText("Access denied. This credentials does not have Admin rights.");
        setIsLoading(false);
        return;
      }

      // Cryptographic password evaluation
      const computedHash = await hashPassword(password, existingUser.salt);
      if (computedHash !== existingUser.passwordHash) {
        setLoginAttempts(prev => prev + 1);
        setErrorText("Incorrect phone number or password. Check demo credentials below!");
        setIsLoading(false);
        if (loginAttempts + 1 >= 5) {
          setLockoutTime(Date.now() + 60000);
        }
        return;
      }

      // Success! Move to OTP screen
      setOtpPurpose("login");
      setLoginAttempts(0);
      setupAndSendOTP(existingUser.phone, existingUser.name);

    } catch (err) {
      setErrorText("An exception occurred during verification. Please reload.");
      setIsLoading(false);
    }
  };

  // OTP setup helper
  const setupAndSendOTP = (targetPhone: string, userName: string) => {
    // Generate new OTP
    const otp = generateOTP();
    setGeneratedOtp(otp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
    setOtpSecondsLeft(300);
    setResendTimer(60); // 60 seconds resend limiter
    setOtpAttempts(0);
    setOtpCode("");

    // Trigger floating device SMS notification box
    triggerSmsNotification(otp, targetPhone);

    setCurrentSubView("otp");
    setIsLoading(false);
  };

  // Submit Sign-Up Action
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!name.trim()) {
      setErrorText("Please provide your full identity name.");
      return;
    }
    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 10) {
      setErrorText("Please provide a valid 10-digit phone number.");
      return;
    }
    if (password.length < 6) {
      setErrorText("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const users = getRegisteredUsers();

      // Ensure phone isn't already taken
      if (users.some(u => normalizePhone(u.phone) === cleanPhone)) {
        setErrorText("An account has already been registered with this phone number.");
        setIsLoading(false);
        return;
      }

      // Secure cryptographic enrollment
      const salt = generateSalt();
      const passwordHash = await hashPassword(password, salt);

      const newUser: RegisteredUser = {
        name: name.trim(),
        phone: cleanPhone,
        passwordHash,
        salt,
        role: "user" // Default newly signed up accounts as user role
      };

      users.push(newUser);
      saveRegisteredUsers(users);

      setSuccessText("Registration successful! You may now log in securely.");
      // Auto pre-fill the phone for convenience
      setPhone(cleanPhone);
      setPassword("");
      setCurrentSubView("login");

    } catch (err) {
      setErrorText("Failed to register. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP Action
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (otpCode.trim().length < 6) {
      setErrorText("Please fill out the full 6-digit OTP verification code.");
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));

    // Expiry Check
    if (otpExpiry && Date.now() > otpExpiry) {
      setErrorText("Verification OTP has expired. Please try resending the code.");
      setIsLoading(false);
      return;
    }

    // Match Check
    if (otpCode.trim() !== generatedOtp) {
      const nextAttempts = otpAttempts + 1;
      setOtpAttempts(nextAttempts);
      setIsLoading(false);

      if (nextAttempts >= 3) {
        setErrorText("Too many incorrect OTP entries. Please request a new OTP.");
        setGeneratedOtp("");
        setOtpExpiry(null);
      } else {
        setErrorText(`Incorrect verification code. Attempts left: ${3 - nextAttempts}`);
      }
      return;
    }

    // Success OTP verification!
    const cleanPhone = normalizePhone(phone);
    const users = getRegisteredUsers();
    const existingUser = users.find(u => normalizePhone(u.phone) === cleanPhone);

    if (!existingUser) {
      setErrorText("Error matching account profiles. Please try again.");
      setIsLoading(false);
      return;
    }

    if (otpPurpose === "reset") {
      setIsLoading(false);
      setSuccessText("OTP Verified! Redirecting to password reset...");
      setTimeout(() => {
        setCurrentSubView("reset");
        setOtpCode("");
        setErrorText("");
        setSuccessText("");
      }, 1000);
      return;
    }

    // Generate simulated secure session token
    const token = btoa(`${existingUser.phone}-${existingUser.role}-${Date.now()}`);
    const session: UserSession = {
      phone: existingUser.phone,
      role: existingUser.role,
      name: existingUser.name,
      token,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 Days secure session
    };

    setIsLoading(false);
    setSuccessText("Authentication Verified! Launching your portal...");
    
    // Slight delay of success message
    setTimeout(() => {
      onLoginSuccess(session);
    }, 800);
  };

  // Handle Resend Request
  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    setErrorText("");
    setSuccessText("");
    
    const cleanPhone = normalizePhone(phone);
    const users = getRegisteredUsers();
    const existingUser = users.find(u => normalizePhone(u.phone) === cleanPhone);
    const targetName = existingUser ? existingUser.name : "Valued Customer";

    setupAndSendOTP(phone, targetName);
    setSuccessText("A fresh verification OTP has been generated successfully.");
  };

  // Submit Forgot Password Phone verify
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 10) {
      setErrorText("Please provide your valid 10-digit registered phone number.");
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    const users = getRegisteredUsers();
    const match = users.find(u => normalizePhone(u.phone) === cleanPhone);

    if (!match) {
      setErrorText("No account was found with that registered phone number.");
      setIsLoading(false);
      return;
    }

    // Phone matched, dispatch OTP first to authorize password rewrite
    setOtpPurpose("reset");
    setupAndSendOTP(match.phone, match.name);
    // Take note that we came from forgot password flow, so after OTP succeed, redirect to resetting password
    setCurrentSubView("otp");
    setIsLoading(false);
  };

  // Reset Password Execution
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (newPassword.length < 6) {
      setErrorText("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorText("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    try {
      const cleanPhone = normalizePhone(phone);
      const users = getRegisteredUsers();
      const matchIdx = users.findIndex(u => normalizePhone(u.phone) === cleanPhone);

      if (matchIdx === -1) {
        setErrorText("Profile error. Account was not retrieved properly.");
        setIsLoading(false);
        return;
      }

      // Hash the new password with a fresh cryptographic salt
      const salt = generateSalt();
      const newHash = await hashPassword(newPassword, salt);

      users[matchIdx].passwordHash = newHash;
      users[matchIdx].salt = salt;
      saveRegisteredUsers(users);

      setSuccessText("Password reset successfully! Redirecting you to login portal...");
      setIsLoading(false);

      setTimeout(() => {
        setCurrentSubView("login");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorText("");
        setSuccessText("");
      }, 1500);

    } catch (e) {
      setErrorText("Failed to rewrite password. Please try again.");
      setIsLoading(false);
    }
  };

  // Cancel flow & go back
  const handleBackToLogin = () => {
    setCurrentSubView("login");
    resetFormState();
  };

  // Formatter helper for minutes:seconds timer
  const formatTimeMinutes = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 py-4 px-2 sm:px-0">
      
      {/* Decorative Brand Accent */}
      <div className="text-center mb-6">
        <span className="text-2xl font-display font-black text-green-700 tracking-tight block">
          VijayRath Namkeen & Bakery
        </span>
        <span className="text-xs text-gray-500 font-sans tracking-widest uppercase font-extrabold mt-1 block">
          Secure Lock Gate
        </span>
      </div>

      {/* Main Form Box Container */}
      <div className="bg-white border border-gray-150 rounded-2xl shadow-xl overflow-hidden relative" id="auth-panel">
        
        {/* Lock / Security visual banner */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-4 flex items-center justify-between text-white border-b border-green-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 opacity-90" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              {currentSubView === "login" && `${role === "admin" ? "Admin Portal" : "Customer Area"}`}
              {currentSubView === "signup" && "Create Safe Account"}
              {currentSubView === "otp" && "SMS Verification Guard"}
              {currentSubView === "forgot" && "Reset Request"}
              {currentSubView === "reset" && "Set Secure Password"}
            </span>
          </div>
          {currentSubView === "login" && (
            <div className="flex gap-1.5">
              <button 
                type="button"
                onClick={() => {
                  setRole("user");
                  resetFormState();
                }}
                className={`text-[11px] font-extrabold px-2 py-1 rounded transition-all cursor-pointer ${
                  role === "user" ? "bg-white text-green-800 font-bold" : "bg-green-800/40 text-green-50 hover:bg-green-800/60"
                }`}
              >
                Customer
              </button>
              <button 
                type="button"
                className={`text-[11px] font-extrabold px-2 py-1 rounded transition-all cursor-pointer ${
                  role === "admin" ? "bg-white text-green-800 font-bold" : "bg-green-800/40 text-green-50 hover:bg-green-800/60"
                }`}
                onClick={() => {
                  setRole("admin");
                  resetFormState();
                }}
              >
                Admin
              </button>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Status Message Banners */}
          <AnimatePresence mode="popLayout">
            {errorText && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-red-50 border-l-4 border-red-500 p-3.5 rounded flex items-start gap-2.5"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-700 leading-normal">{errorText}</p>
              </motion.div>
            )}

            {successText && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded flex items-start gap-2.5"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-normal">{successText}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW 1: LOGIN CARD */}
          {currentSubView === "login" && (
            <form onSubmit={handleValidatePassword} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={15}
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-4 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                  <button
                    type="button"
                    onClick={() => setCurrentSubView("forgot")}
                    className="text-xs text-green-700 hover:text-green-800 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-11 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-sans text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Hashing & Authenticating...
                  </>
                ) : (
                  <>
                    Continue to OTP Verification
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {role === "user" && (
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    New to VijayRath Namkeen & Bakery?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentSubView("signup");
                        resetFormState();
                      }}
                      className="text-green-700 font-extrabold hover:underline"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              )}
            </form>
          )}

          {/* VIEW 2: REGISTER / SIGN UP */}
          {currentSubView === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-4 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210 (10 digits)"
                    maxLength={15}
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-4 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-11 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-sans text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Secure Password Hash...
                  </>
                ) : (
                  <>Create Secure Account</>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-xs font-bold text-green-700 hover:text-green-800 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: OTP CODE VERIFICATION */}
          {currentSubView === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center space-y-2 mb-2">
                <p className="text-xs text-gray-500 font-medium">
                  We've simulated sending a 6-digit verification code to
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 max-w-[240px] mx-auto">
                  <span className="text-xs font-extrabold text-slate-800 tracking-wide font-mono">
                    +91 {phone}
                  </span>
                </div>
                
                {/* Simulated SMS Badge */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 max-w-[280px] mx-auto text-center mt-2 shadow-xs">
                  <p className="text-[11px] text-amber-800 font-extrabold flex items-center justify-center gap-1.5">
                    <span>💬 Simulated OTP Code:</span>
                    <strong className="text-sm text-amber-900 select-all font-mono tracking-wider bg-white border border-amber-200 px-2 py-0.5 rounded shadow-xs">
                      {generatedOtp}
                    </strong>
                  </p>
                </div>

                {otpSecondsLeft > 0 ? (
                  <p className="text-xs font-extrabold text-emerald-700 flex items-center justify-center gap-1 mt-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Verification Code active for {formatTimeMinutes(otpSecondsLeft)}
                  </p>
                ) : (
                  <p className="text-xs font-extrabold text-red-600 mt-2">
                    OTP Expired! Click resend below to generate a fresh token.
                  </p>
                )}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center block">
                  6-Digit OTP Code
                </label>
                <div className="relative max-w-[200px] mx-auto">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").substring(0, 6))}
                    placeholder="0 0 0 0 0 0"
                    maxLength={6}
                    autoFocus
                    className="w-full bg-gray-50/50 border-2 border-emerald-500 py-2.5 pl-11 rounded-lg focus:outline-none focus:bg-white text-base tracking-[0.4em] font-mono font-extrabold text-center text-slate-800 shadow-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedOtp)}
                  className="mt-1.5 pb-1 text-[11px] text-emerald-700 hover:text-emerald-850 font-extrabold underline focus:outline-none block mx-auto cursor-pointer"
                >
                  ⚡ Auto-fill simulated OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpSecondsLeft <= 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-sans text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking credentials...
                  </>
                ) : (
                  otpPurpose === "reset" ? "Verify & Proceed to Reset" : "Verify & Complete Login"
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0}
                  className={`text-xs font-extrabold ${
                    resendTimer > 0 ? "text-gray-400 cursor-not-allowed" : "text-green-700 hover:text-green-800 hover:underline"
                  }`}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend Verification Code"}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-xs text-gray-500 font-bold hover:text-gray-700"
                >
                  Change Account
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: FORGOT PASSWORD */}
          {currentSubView === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed mb-2 text-left">
                Provide your VijayRath Namkeen & Bakery registered phone line. If valid, we will issue a verification code (OTP) to authorized reset credentials.
              </p>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Registered Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={15}
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-4 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-sans text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying Line...
                  </>
                ) : (
                  "Request Verification OTP"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-xs font-bold text-green-700 hover:text-green-800 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Log In
                </button>
              </div>
            </form>
          )}

          {/* VIEW 5: RESET NEW PASSWORD */}
          {currentSubView === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-gray-550 mb-2 text-left bg-emerald-50 border border-emerald-150 p-2.5 rounded text-emerald-800 font-medium">
                Identity verified! You may now secure your profile with a new password choice.
              </p>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-11 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-gray-50/50 border border-gray-250 py-2.5 pl-11 pr-4 rounded-xl focus:outline-none focus:border-green-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-sans text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Hashing & Writing to DB...
                  </>
                ) : (
                  "Change Password Securely"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-xs font-bold text-green-700 hover:text-green-800 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Discard and Exit
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Demo Accounts Showcase Sheet - Incredibly Helpful for the User */}
        {currentSubView === "login" && (
          <div className="bg-slate-50 border-t border-gray-150 p-5 text-left text-xs space-y-2.5">
            <h4 className="font-extrabold text-slate-800 flex items-center gap-1.5 leading-none">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              Demo Verified Test Accounts
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Copy and log in with these verified credentials to test safe access-rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                <span className="text-[10px] font-extrabold uppercase bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  Regular User
                </span>
                <p className="font-mono text-[11px] text-gray-700 mt-1">
                  Phone: <strong className="select-all font-extrabold">9876543210</strong>
                </p>
                <p className="font-mono text-[11px] text-gray-700">
                  Pass: <strong className="select-all font-extrabold">password123</strong>
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-2.5">
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                  Admin Account
                </span>
                <p className="font-mono text-[11px] text-gray-700 mt-1">
                  Phone: <strong className="select-all font-extrabold">9999999999</strong>
                </p>
                <p className="font-mono text-[11px] text-gray-700">
                  Pass: <strong className="select-all font-extrabold">adminsecure</strong>
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {isAuthenticated && (
        <div className="text-center mt-5">
          <button
            onClick={onBack}
            className="text-xs text-gray-500 hover:text-green-700 font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel and return to storefront
          </button>
        </div>
      )}

    </div>
  );
}
