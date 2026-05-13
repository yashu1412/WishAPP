"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { useToast } from "@/contexts/ToastContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, Check, User, ArrowLeft, Crown, Sparkles, Gift, Zap, Heart } from "lucide-react";

const achievements = [
  { icon: Gift, title: "First Wish", description: "Created your first wish", unlocked: true },
  { icon: Sparkles, title: "Template Explorer", description: "Used 5+ templates", unlocked: false },
  { icon: Heart, title: "Social Star", description: "Shared 10+ wishes", unlocked: false },
  { icon: Zap, title: "Power User", description: "Premium member", unlocked: false },
];

const activityStats = [
  { label: "Wishes Created", value: "12" },
  { label: "Templates Used", value: "8" },
  { label: "Times Shared", value: "24" },
];

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const guest = localStorage.getItem("isGuest") === "true";
      const name = localStorage.getItem("guestName") || "Guest User";
      const guestImage = localStorage.getItem("guestImage");
      setIsGuest(guest);
      setName(name);
      if (guestImage) {
        setProfileImage(guestImage);
      }
      setIsAppLoading(false);
    };
    
    if (isLoaded) {
      checkAuth();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setName(user.fullName || "");
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      if (isSignedIn && user) {
        const updateData: any = {
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" "),
        };
        
        if (profileImage) {
          const file = dataURLtoFile(profileImage, "profile.jpg");
          await user.setProfileImage({ file });
        }
        
        await user.update(updateData);
      } else if (isGuest) {
        localStorage.setItem("guestName", name);
        if (profileImage) {
          localStorage.setItem("guestImage", profileImage);
        }
      }
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };
  
  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuestLogout = () => {
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guestName");
    router.push("/");
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pattern">
        <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-glow-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-pattern">
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="text-text-secondary hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-xl font-bold">Your Profile</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 shadow-card-xl border border-border">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-2">Profile Settings</h2>
                  <p className="text-text-secondary">Update your personal information</p>
                </div>
                
                <form onSubmit={handleSave} className="space-y-8">
                  <div className="flex justify-center">
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <div className="w-36 h-36 rounded-full bg-surface border-4 border-dashed border-border flex items-center justify-center overflow-hidden shadow-glow-purple/30">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : isSignedIn && user?.imageUrl ? (
                          <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-text-secondary" />
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:from-secondary hover:to-primary transition-all shadow-glow-purple"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-3 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-surface border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-3 font-medium">Email</label>
                    <div className="w-full px-5 py-4 rounded-2xl bg-surface/50 border border-border text-text-secondary">
                      {isSignedIn ? (user?.primaryEmailAddress?.emailAddress || "No email") : "Guest User"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-3 font-medium">Account Status</label>
                    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-surface border border-border">
                      {isSignedIn ? (
                        <>
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <span className="font-semibold">Signed In</span>
                            <p className="text-text-secondary text-sm">Full access to all features</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <span className="font-semibold">Guest</span>
                            <p className="text-text-secondary text-sm">Limited features available</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button className="w-full" type="submit" isGlowing isLoading={isSaving}>
                      <Check className="w-5 h-5 mr-2" />
                      Save Changes
                    </Button>
                    
                    {isSignedIn ? (
                      <SignOutButton>
                        <Button className="w-full" variant="ghost" type="button">
                          <User className="w-5 h-5 mr-2" />
                          Log Out
                        </Button>
                      </SignOutButton>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="ghost"
                        type="button"
                        onClick={handleGuestLogout}
                      >
                        <User className="w-5 h-5 mr-2" />
                        Log Out
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 shadow-card-xl border border-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Stats
                </h3>
                <div className="space-y-4">
                  {activityStats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 glass-light rounded-2xl"
                    >
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-text-secondary text-sm">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 shadow-card-xl border border-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`p-4 rounded-2xl border ${achievement.unlocked ? 'glass-light border-primary/30' : 'bg-surface/30 border-border opacity-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${achievement.unlocked ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-surface'}`}>
                          <achievement.icon className={`w-5 h-5 ${achievement.unlocked ? 'text-white' : 'text-text-secondary'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{achievement.title}</h4>
                          <p className="text-text-secondary text-xs">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {!isSignedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="p-6 shadow-card-xl border border-primary/30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-purple">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Sign In for More!</h3>
                    <p className="text-text-secondary text-sm mb-4">Get full access to all features and save your progress</p>
                    <Button className="w-full" onClick={() => router.push("/")}>
                      Sign In Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
