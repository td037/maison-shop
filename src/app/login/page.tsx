"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", submit: "" });
  const { login } = useAuth();
  const redirectPath = searchParams.get("redirect");

  const getSafeRedirectPath = () => {
    if (redirectPath && redirectPath.startsWith("/")) {
      return redirectPath;
    }

    return "/";
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "", submit: "" };

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace(getSafeRedirectPath());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng nhập thất bại";
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
            src="https://images.unsplash.com/photo-1549887534-7fad68001a0e?w=800&q=80"
            alt="Editorial Fashion"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 via-[#1a1a2e]/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <p className="text-sm tracking-widest font-display font-semibold mb-4 opacity-80">
              KHOẢNH KHẮC
            </p>
            <h2
              className="font-display font-black leading-tight mb-6"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Khám phá thế giới thời trang cao cấp
            </h2>
            <p className="text-sm leading-relaxed opacity-90 max-w-xs">
              Gia nhập cộng đồng những tín đồ thời trang. Trải nghiệm các bộ sưu
              tập độc quyền và nhận thông báo ưu tiên cho các sản phẩm mới.
            </p>
          </div>
        </div>

        {/* ── FORM SECTION (Right) ── */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16 bg-surface">
          <div className="max-w-md mx-auto w-full lg:mx-0 lg:max-w-sm">
            {/* Header */}
            <div className="mb-12">
              <h1
                className="font-display font-black text-[#1a1a2e] mb-3"
                style={{
                  fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Đăng nhập
              </h1>
              <p className="text-on-surface-muted text-sm leading-relaxed">
                Chào mừng bạn quay trở lại. Hãy đăng nhập vào tài khoản của bạn
                để tiếp tục.
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-error-container/20 border border-error rounded-btn">
                <p className="text-error text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-display font-bold text-[#1a1a2e] mb-3 tracking-wider uppercase"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="tran.minh@example.com"
                    className={`w-full px-5 py-3.5 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none
                      ${errors.email ? "bg-error-container placeholder-error/50" : "bg-surface-low"}
                      focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle`}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-error text-xs font-body mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label
                    htmlFor="password"
                    className="block text-xs font-display font-bold text-[#1a1a2e] tracking-wider uppercase"
                  >
                    Mật khẩu
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary font-body hover:underline transition-all"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validateForm()}
                    placeholder="••••••••"
                    className={`w-full px-5 py-3.5 bg-surface-low rounded-btn font-body text-sm transition-all duration-200 outline-none pr-12
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
                        width="18"
                        height="18"
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
                        width="18"
                        height="18"
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
                  {errors.password && (
                    <p className="text-error text-xs font-body mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2.5 text-sm font-body text-on-surface-muted cursor-pointer select-none hover:text-on-surface transition-colors"
                >
                  Ghi nhớ tôi
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-container text-white font-display font-bold text-sm py-3.5 rounded-btn transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
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
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng nhập
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

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-outline-variant/40" />
              <span className="text-xs text-on-surface-muted font-body uppercase tracking-wide">
                Hoặc
              </span>
              <div className="flex-1 h-px bg-outline-variant/40" />
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-8">
              <button
                className="w-full border border-outline-variant/40 hover:bg-surface-low text-on-surface font-body text-sm py-3 rounded-btn transition-all duration-200
                  flex items-center justify-center gap-3"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                className="w-full border border-outline-variant/40 hover:bg-surface-low text-on-surface font-body text-sm py-3 rounded-btn transition-all duration-200
                  flex items-center justify-center gap-3"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.6 11.9h-2.4v7.9h-3v-7.9h-1.4v-2.4h1.4v-1.5c0-1.1.3-2.8 2.7-2.8h2.1v2.3h-1.5c-.3 0-.4.1-.4.5v1.4h2l-.4 2.4z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm font-body text-on-surface-muted">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/signup"
                className="text-primary font-semibold hover:underline transition-all"
              >
                Đăng ký tại đây
              </Link>
            </p>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-outline-variant/20 flex items-center justify-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-on-surface-muted hover:text-on-surface font-body transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms"
                className="text-xs text-on-surface-muted hover:text-on-surface font-body transition-colors"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}
