"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/providers";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const { signup } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    }

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!agreed) {
      newErrors.agreed = "Bạn phải đồng ý với điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await signup(fullName, formData.email, formData.password, formData.phone);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng ký thất bại";
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface overflow-hidden">
      {/* Layout: Image Left, Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* ── HERO SECTION (Left) ── */}
        <div className="relative hidden lg:block overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
            alt="Editorial Fashion Signup"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 via-[#1a1a2e]/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <p className="text-sm tracking-widest font-display font-semibold mb-4 opacity-80">
              BẮT ĐẦU HÀNH TRÌNH
            </p>
            <h2
              className="font-display font-black leading-tight mb-6"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Gia nhập cộng đồng thời trang
            </h2>
            <p className="text-sm leading-relaxed opacity-90 max-w-xs">
              Tạo tài khoản để lưu yêu thích, theo dõi đơn hàng và nhận các ưu
              đãi độc quyền dành riêng cho thành viên.
            </p>
          </div>
        </div>

        {/* ── FORM SECTION (Right) ── */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-8 bg-surface overflow-y-auto">
          <div className="max-w-md mx-auto w-full lg:mx-0 lg:max-w-sm py-8">
            {/* Header */}
            <div className="mb-10">
              <h1
                className="font-display font-black text-[#1a1a2e] mb-3"
                style={{
                  fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Đăng ký tài khoản
              </h1>
              <p className="text-on-surface-muted text-sm leading-relaxed">
                Tạo tài khoản mới để bắt đầu mua sắm với những lợi ích đặc biệt.
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-error-container/20 border border-error rounded-btn">
                <p className="text-error text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-display font-bold text-[#1a1a2e] mb-2 tracking-wider uppercase"
                  >
                    Tên
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Minh"
                    className={`w-full px-4 py-3 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none
                      ${errors.firstName ? "bg-error-container placeholder-error/50" : "bg-surface-low"}
                      focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle`}
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-error text-xs font-body mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-display font-bold text-[#1a1a2e] mb-2 tracking-wider uppercase"
                  >
                    Họ
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Trần"
                    className="w-full px-4 py-3 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none
                      focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-display font-bold text-[#1a1a2e] mb-2 tracking-wider uppercase"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="minh.tran@example.com"
                  className={`w-full px-4 py-3 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none
                    ${errors.email ? "bg-error-container placeholder-error/50" : "bg-surface-low"}
                    focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-error text-xs font-body mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-display font-bold text-[#1a1a2e] mb-2 tracking-wider uppercase"
                >
                  Số điện thoại (tùy chọn)
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+84 9xx xxx xxx"
                  className="w-full px-4 py-3 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none
                    focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-display font-bold text-[#1a1a2e] mb-2 tracking-wider uppercase"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ít nhất 8 ký tự"
                    className={`w-full px-4 py-3 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none pr-12
                      ${errors.password ? "bg-error-container placeholder-error/50" : "bg-surface-low"}
                      focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs font-body mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-display font-bold text-[#1a1a2e] mb-2 tracking-wider uppercase"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none
                    ${errors.confirmPassword ? "bg-error-container placeholder-error/50" : "bg-surface-low"}
                    focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-error text-xs font-body mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="pt-2">
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 accent-primary rounded mt-0.5 cursor-pointer flex-shrink-0"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs font-body text-on-surface-muted cursor-pointer select-none leading-relaxed"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline font-semibold"
                    >
                      Điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline font-semibold"
                    >
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>
                {errors.agreed && (
                  <p className="text-error text-xs font-body mt-2 ml-8">
                    {errors.agreed}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-primary hover:bg-primary-container text-white font-display font-bold text-sm py-3.5 rounded-btn transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  hover:shadow-lg hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    Tạo tài khoản
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm font-body text-on-surface-muted mt-8">
              Bạn đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline transition-all"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
