"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Film,
  LogIn,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import { useGenerateTranscript } from "@/hooks/useGenerateTranscript";
import { useGetOtp } from "@/hooks/useGetOtp";
import { useLogin } from "@/hooks/useLogin";
import { TranscriptProvider } from "@/contexts/TranscriptContext";

export default function VideoSummary() {
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    countryCode: string;
  } | null>(null);

  const {
    mutate: generateTranscript,
    isPending: isGenerateTranscriptPending,
    error: generateTranscriptError,
    data,
  } = useGenerateTranscript();

  const {
    mutate: getOtpMutate,
    isPending: isGetOtpPending,
    error: getOtpError,
  } = useGetOtp();

  const {
    mutate: loginMutate,
    isPending: isLoginPending,
    error: loginError,
  } = useLogin();

  useEffect(() => {
    const url = searchParams.get("video");
    if (url) {
      generateTranscript(
        { videoUrl: url },
        {
          onSuccess: (data) => {
            console.log("Transcript generated successfully:", data);
          },
          onError: (error) => {
            console.error("Failed to generate transcript:", error);
          },
        }
      );
    }
  }, [searchParams, generateTranscript]);

  const handleGetOTP = async () => {
    if (!username.trim()) {
      setError("Please enter your username/phone number");
      return;
    }

    getOtpMutate(
      {
        username: username,
        countryCode: countryCode,
        organizationId: "5eb393ee95fab7468a79d189",
      },
      {
        onSuccess: (data) => {
          setOtpSent(true);
          setError("");
          console.log("OTP Sent successfully:", data);
        },
        onError: (err) => {
          setError(err.message || "Failed to send OTP. Please try again.");
          console.error("Failed to send OTP:", err);
        },
      }
    );
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    loginMutate(
      {
        username: username,
        otp: otp,
        client_id: "system-admin",
        client_secret: "KjPXuAVfC5xbmgreETNMaL7z",
        grant_type: "password",
        organizationId: "5eb393ee95fab7468a79d189",
        latitude: 0,
        longitude: 0,
      },
      {
        onSuccess: (data) => {
          console.log("Login successful:", data);
          setIsLoggedIn(true);
          setUserInfo({ username, countryCode });
          setIsLoginOpen(false);
          setOtpSent(false);
          setUsername("");
          setOtp("");
          setError("");
        },
        onError: (err) => {
          setError(
            err.message || "Login failed. Please check OTP and try again."
          );
          console.error("Login failed:", err);
        },
      }
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  const resetLoginModal = () => {
    setOtpSent(false);
    setUsername("");
    setOtp("");
    setError("");
    setCountryCode("+91");
  };

  const transcript = data?.data?.transcript || "";
  const videoId = data?.data?.videoId || null;
  const truncatedTranscript = transcript.slice(0, 200);
  const shouldShowToggle = transcript.length > 200;

  return (
    <TranscriptProvider
      value={{
        videoId,
        transcript,
        isPending: isGenerateTranscriptPending,
        error: generateTranscriptError,
      }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Film className="h-6 w-6" />
              <span>Video Transcript</span>
            </CardTitle>

            {/* Login/User Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-white text-sm">
                  <span className="opacity-90">Welcome, </span>
                  <span className="font-semibold">{userInfo?.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Dialog
                open={isLoginOpen}
                onOpenChange={(open) => {
                  setIsLoginOpen(open);
                  if (!open) resetLoginModal();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-medium px-4 py-2"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-pw-orange-600 flex items-center gap-2">
                      <User className="w-6 h-6" />
                      {otpSent ? "Verify OTP" : "Login to PW"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {!otpSent ? (
                      <>
                        <div className="space-y-2">
                          <Label
                            htmlFor="countryCode"
                            className="text-sm font-medium text-pw-gray-700"
                          >
                            Country Code
                          </Label>
                          <Select
                            value={countryCode}
                            onValueChange={setCountryCode}
                          >
                            <SelectTrigger className="border-2 border-pw-orange-200 focus:border-pw-orange-400">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">
                                🇮🇳 +91 (India)
                              </SelectItem>
                              <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                              <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="username"
                            className="text-sm font-medium text-pw-gray-700"
                          >
                            Phone Number / Username
                          </Label>
                          <Input
                            id="username"
                            type="text"
                            placeholder="Enter your phone number or username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-2 border-pw-orange-200 focus:border-pw-orange-400 focus:ring-pw-orange-400 py-3"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleGetOTP()
                            }
                          />
                        </div>

                        {error && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                              {error}
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          onClick={handleGetOTP}
                          disabled={isGetOtpPending}
                          className="w-full bg-pw-orange-500 hover:bg-pw-orange-600  py-3 text-lg font-semibold"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            "Get OTP"
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center p-4 bg-pw-orange-50 rounded-lg border-2 border-pw-orange-200">
                          <p className="text-pw-orange-800 font-medium">
                            OTP sent to {countryCode} {username}
                          </p>
                          <p className="text-pw-orange-600 text-sm mt-1">
                            Please check your messages
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="otp"
                            className="text-sm font-medium text-pw-gray-700"
                          >
                            Enter OTP
                          </Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border-2 border-pw-orange-200 focus:border-pw-orange-400 focus:ring-pw-orange-400 py-3 text-center text-lg tracking-widest"
                            maxLength={6}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleVerifyOTP()
                            }
                          />
                        </div>

                        {error && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                              {error}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-3">
                          <Button
                            onClick={handleVerifyOTP}
                            disabled={isLoginPending}
                            className="w-full bg-pw-orange-500 hover:bg-pw-orange-600 text-white py-3 text-lg font-semibold"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              "Verify OTP"
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => setOtpSent(false)}
                            className="w-full border-2 border-pw-orange-200 text-pw-orange-600 hover:bg-pw-orange-50"
                          >
                            Back to Login
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isGenerateTranscriptPending ? (
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-100 rounded animate-pulse w-4/6"></div>
            </div>
          ) : generateTranscriptError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">
                Error:{" "}
                {generateTranscriptError?.message ||
                  getOtpError?.message ||
                  loginError?.message ||
                  "An error occurred"}
              </p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <p className="text-gray-700 leading-relaxed">
                {isExpanded ? transcript : truncatedTranscript}
                {!isExpanded && shouldShowToggle && "..."}
              </p>

              {shouldShowToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-3 p-0 h-auto font-medium text-indigo-600 transition-all duration-200 hover:text-white"
                >
                  {isExpanded ? (
                    <>
                      See Less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TranscriptProvider>
  );
}
