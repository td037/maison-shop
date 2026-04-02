"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setError("Email không được để trống");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setEmail("");
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-surface overflow-hidden">
      {/* Layout: Image Left, Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* ── HERO SECTION (Left) ── */}
        <div className="relative hidden lg:block overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
            alt="Reset Password"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 via-[#1a1a2e]/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <p className="text-sm tracking-widest font-display font-semibold mb-4 opacity-80">
              KHÔI PHỤC TÀI KHOẢN
            </p>
            <h2
              className="font-display font-black leading-tight mb-6"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Quay lại với MAISON.
            </h2>
            <p className="text-sm leading-relaxed opacity-90 max-w-xs">
              Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục quyền truy cập vào
              tài khoản của bạn một cách nhanh chóng.
            </p>
          </div>
        </div>

        {/* ── FORM SECTION (Right) ── */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16 bg-surface">
          <div className="max-w-md mx-auto w-full lg:mx-0 lg:max-w-sm">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-12">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-primary font-body text-sm mb-6 hover:underline transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Quay lại đăng nhập
                  </Link>

                  <h1
                    className="font-display font-black text-[#1a1a2e] mb-3"
                    style={{
                      fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Quên mật khẩu?
                  </h1>
                  <p className="text-on-surface-muted text-sm leading-relaxed">
                    Nhập email đăng ký của bạn và chúng tôi sẽ gửi cho bạn liên
                    kết đặt lại mật khẩu.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-display font-bold text-[#1a1a2e] mb-3 tracking-wider uppercase"
                    >
                      Email đăng ký
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={validateEmail}
                      placeholder="tran.minh@example.com"
                      className={`w-full px-5 py-3.5 rounded-btn font-body text-sm transition-all duration-200 outline-none
                        ${error ? "bg-error-container placeholder-error/50" : "bg-surface-low"}
                        focus:bg-surface-lowest focus:ring-1 focus:ring-primary/30 placeholder-on-surface-subtle`}
                      disabled={isLoading}
                    />
                    {error && (
                      <p className="text-error text-xs font-body mt-2">
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-surface-low rounded-btn p-4 border border-outline-variant/20">
                    <p className="text-xs font-body text-on-surface-muted leading-relaxed">
                      ✓ Bạn sẽ nhận được một email có chứa liên kết đặt lại mật
                      khẩu trong vòng 5 phút.
                    </p>
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
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi liên kết đặt lại
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
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-low/50 border border-outline-variant/40 mb-6">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ab2e00"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>

                  <h2
                    className="font-display font-black text-[#1a1a2e] mb-3"
                    style={{
                      fontSize: "clamp(1.35rem, 4vw, 1.75rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Kiểm tra email của bạn
                  </h2>
                  <p className="text-on-surface-muted text-sm leading-relaxed mb-6">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu tới{" "}
                    <span className="font-semibold text-on-surface">
                      {email}
                    </span>
                  </p>

                  {/* Info Box */}
                  <div className="bg-surface-low rounded-btn p-4 border border-outline-variant/20 mb-8 text-left">
                    <p className="text-xs font-body text-on-surface-muted leading-relaxed mb-3">
                      <strong>Gợi ý:</strong>
                    </p>
                    <ul className="text-xs font-body text-on-surface-muted space-y-2 list-disc list-inside">
                      <li>
                        Kiểm tra thư mục Spam hoặc Khác nếu bạn không thấy email
                      </li>
                      <li>Liên kết sẽ hết hạn sau 24 giờ</li>
                      <li>Nếu không nhận được, hãy thử lại với email khác</li>
                    </ul>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleReset}
                    className="w-full bg-primary hover:bg-primary-container text-white font-display font-bold text-sm py-3.5 rounded-btn transition-all duration-200
                      flex items-center justify-center gap-2
                      hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Dùng email khác
                  </button>
                  <Link
                    href="/login"
                    className="block w-full text-center bg-surface-low hover:bg-surface-mid text-on-surface font-display font-bold text-sm py-3.5 rounded-btn transition-all duration-200"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
              </>
            )}

            {/* Footer Links */}
            {!submitted && (
              <div className="mt-12 pt-8 border-t border-outline-variant/20 flex items-center justify-center gap-6">
                <Link
                  href="/privacy"
                  className="text-xs text-on-surface-muted hover:text-on-surface font-body transition-colors"
                >
                  Chính sách bảo mật
                </Link>
                <Link
                  href="/contact"
                  className="text-xs text-on-surface-muted hover:text-on-surface font-body transition-colors"
                >
                  Liên hệ hỗ trợ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
