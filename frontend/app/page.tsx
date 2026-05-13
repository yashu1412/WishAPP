"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, SignIn, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Sparkles, Gift, Zap, Heart, Stars, CheckCircle2, Share2, Palette } from "lucide-react";

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const guest = localStorage.getItem("isGuest") === "true";
      if (isSignedIn || guest) {
        setShouldRedirect(true);
        router.push("/dashboard");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pattern">
        <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-glow-purple" />
      </div>
    );
  }

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      localStorage.setItem("guestName", "Guest User");
      localStorage.setItem("isGuest", "true");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsGuestLoading(false);
    }
  };

  const features = [
    { icon: Palette, title: "Beautiful Templates", description: "100+ professionally designed wishes for every occasion" },
    { icon: Sparkles, title: "Easy Customization", description: "Add your name and photo in seconds" },
    { icon: Share2, title: "Share Anywhere", description: "WhatsApp, Instagram, Email - all in one tap" },
    { icon: Heart, title: "Premium Collection", description: "Unlock exclusive templates for special moments" },
  ];

  const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "100+", label: "Templates" },
    { number: "50K+", label: "Wishes Shared" },
  ];

  return (
    <div className="min-h-screen bg-gradient-pattern">
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-accent/15" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Wishes
                </h1>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Create Personalized Wishes<br />in Seconds
              </h2>
              <p className="text-text-secondary text-xl mb-8 max-w-lg">
                Beautiful templates, easy customization, share anywhere. Make every occasion special.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-8 mb-12"
            >
              {[
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&h=280&fit=crop",
                "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=220&h=280&fit=crop",
                "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=220&h=280&fit=crop",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0 }}
                  animate={{ y: [0, -25, 0] }}
                  transition={{ duration: 4, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-64 rounded-3xl overflow-hidden shadow-2xl shadow-glow-purple/20 border-2 border-white/10"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <img src={src} alt="Template" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-text-secondary text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 gap-6 mt-12 max-w-3xl"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                  className="flex items-start gap-4 p-6 glass-light rounded-3xl"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-purple/30">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-text-secondary text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
            }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-6"
          >
            <div className="text-center mb-2 lg:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Wishes
                </h1>
              </div>
            </div>

            <Card className="p-8 shadow-card-xl">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple"
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Welcome Aboard!</h2>
                <p className="text-text-secondary">Sign in or continue as guest to get started</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-surface text-text-secondary">Get Started</span>
                  </div>
                </div>
                
                <SignIn routing="hash" />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-surface text-text-secondary">or continue with</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="ghost"
                  isLoading={isGuestLoading}
                  onClick={handleGuestLogin}
                >
                  <User className="w-5 h-5 mr-2" />
                  Continue as Guest
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center text-text-secondary text-sm"
            >
              <p>By continuing, you agree to our Terms of Service</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
