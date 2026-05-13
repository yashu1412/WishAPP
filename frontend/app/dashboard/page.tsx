"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { useToast } from "@/contexts/ToastContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Crown, User, Sparkles, Zap, TrendingUp, Heart, Search } from "lucide-react";
import { PremiumPopup } from "@/components/ui/PremiumPopup";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
}

interface Template {
  _id: string;
  title: string;
  imageURL: string;
  category: string | { _id: string; name: string; slug: string };
  isPremium: boolean;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPremium, setShowPremium] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState("Guest User");
  const [guestProfileImage, setGuestProfileImage] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const guest = localStorage.getItem("isGuest") === "true";
      const name = localStorage.getItem("guestName") || "Guest User";
      const guestImage = localStorage.getItem("guestImage");
      setIsGuest(guest);
      setGuestName(name);
      setGuestProfileImage(guestImage);
      setIsAppLoading(false);
    };
    
    if (isLoaded) {
      checkAuth();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && (isSignedIn || isGuest)) {
      loadData();
    }
  }, [isLoaded, isSignedIn, isGuest, selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, templatesRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch(selectedCategory ? `http://localhost:5000/api/templates?categoryId=${selectedCategory}` : "http://localhost:5000/api/templates"),
      ]);
      const categoriesData = await categoriesRes.json();
      const templatesData = await templatesRes.json();
      
      console.log("Categories API response:", categoriesData);
      console.log("Templates API response:", templatesData);
      
      let cats: Category[] = [];
      if (Array.isArray(categoriesData)) {
        cats = categoriesData;
      } else if (categoriesData && Array.isArray(categoriesData.data)) {
        cats = categoriesData.data;
      }
      
      let temps: Template[] = [];
      if (Array.isArray(templatesData)) {
        temps = templatesData;
      } else if (templatesData && Array.isArray(templatesData.data)) {
        temps = templatesData.data;
      }
      
      setCategories(cats);
      setTemplates(temps);
    } catch (error) {
      showToast("Failed to load data", "error");
      console.error(error);
      setCategories([]);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = Array.isArray(templates) 
    ? templates.filter(template =>
        template && template.title && template.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (isAppLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pattern">
        <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-glow-purple" />
      </div>
    );
  }

  const handleGuestLogout = () => {
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guestName");
    router.push("/");
  };

  const quickStats = [
    { icon: TrendingUp, label: "Popular", value: templates.length ? `${Math.floor(templates.length * 0.6)}+` : "10+" },
    { icon: Heart, label: "Loved", value: "50K+" },
    { icon: Zap, label: "New", value: "15+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-pattern">
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Wishes
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 max-w-md mx-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface/50 border border-border text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <button 
              onClick={() => router.push("/profile")}
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-surface hover:bg-white/10 transition-all border border-border hover:border-primary/30"
            >
              {guestProfileImage ? (
                <img
                  src={guestProfileImage}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-primary/30"
                />
              ) : isSignedIn && user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-primary/30"
                />
              ) : (
                <User className="w-5 h-5 text-text-secondary" />
              )}
              <span className="text-sm font-medium hidden sm:block">
                {isSignedIn ? (user?.fullName || "Profile") : guestName}
              </span>
            </button>
            {isSignedIn ? (
              <SignOutButton />
            ) : (
              <button 
                onClick={handleGuestLogout}
                className="text-text-secondary hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3">Welcome Back! 👋</h2>
            <p className="text-text-secondary text-lg">Choose a template and create beautiful wishes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {quickStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="p-6 glass-light">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow-purple/30">
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-text-secondary text-sm">{stat.label} Templates</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mb-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Browse Categories
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`px-7 py-3 rounded-2xl transition-all whitespace-nowrap font-medium ${
                  !selectedCategory
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow-purple"
                    : "bg-surface text-text-secondary hover:text-white hover:bg-white/10 border border-border"
                }`}
              >
                ✨ All Templates
              </motion.button>
              
              {categories.map((cat, i) => (
                <motion.button
                  key={cat._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-7 py-3 rounded-2xl transition-all whitespace-nowrap font-medium ${
                    selectedCategory === cat._id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow-purple"
                      : "bg-surface text-text-secondary hover:text-white hover:bg-white/10 border border-border"
                  }`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-surface h-96 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div 
                  onClick={(e) => {
                    if (template.isPremium) {
                      e.preventDefault();
                      setShowPremium(true);
                    } else {
                      router.push(`/template/${template._id}`);
                    }
                  }}
                >
                  <Card className="overflow-hidden group cursor-pointer border border-border hover:border-primary/30 transition-all shadow-card-lg hover:shadow-card-xl">
                    <div className="relative">
                      <img
                        src={template.imageURL}
                        alt={template.title}
                        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <div className="w-full">
                          <h3 className="text-xl font-bold text-white mb-3">{template.title}</h3>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-glow-purple"
                          >
                            {template.isPremium ? "Unlock Premium" : "Customize Now"}
                          </motion.button>
                        </div>
                      </div>
                      {template.isPremium && (
                        <div className="absolute top-4 right-4">
                          <motion.div
                            animate={{
                              boxShadow: [
                                "0 0 10px rgba(236, 72, 153, 0.5)",
                                "0 0 25px rgba(236, 72, 153, 0.7)",
                                "0 0 10px rgba(236, 72, 153, 0.5)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-r from-accent to-secondary px-4 py-2 rounded-full flex items-center gap-2"
                          >
                            <Crown className="w-4 h-4 text-white" />
                            <span className="text-sm font-semibold text-white">Premium</span>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No templates found</h3>
            <p className="text-text-secondary">Try adjusting your search or category filter</p>
          </motion.div>
        )}
      </main>

      <PremiumPopup isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}
