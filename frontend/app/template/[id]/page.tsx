"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/contexts/ToastContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, Share, User, ArrowLeft, Sparkles, Palette, Zap, Heart, Info, Type, Check } from "lucide-react";
import { PremiumPopup } from "@/components/ui/PremiumPopup";
import { ShareModal } from "@/components/ui/ShareModal";
import html2canvas from "html2canvas";

interface Template {
  _id: string;
  title: string;
  imageURL: string;
  isPremium: boolean;
  overlayConfig: {
    photoX: number;
    photoY: number;
    photoSize: number;
    textX: number;
    textY: number;
    fontSize: number;
    fontColor: string;
  };
  description?: string;
  category?: string | { _id: string; name: string; slug: string };
}

const colorOptions = [
  { name: "White", value: "#FFFFFF" },
  { name: "Gold", value: "#FFD700" },
  { name: "Pink", value: "#EC4899" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Black", value: "#000000" },
];

const fontOptions = [
  { name: "Elegant", value: "'Georgia', serif" },
  { name: "Modern", value: "'Inter', sans-serif" },
  { name: "Playful", value: "'Comic Sans MS', cursive" },
];

const tips = [
  "Add your name to personalize the wish",
  "Upload your photo for a special touch",
  "Share on WhatsApp to make someone's day",
  "Download the image to save forever",
];

export default function TemplatePreviewPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPremium, setShowPremium] = useState(false);
  const [name, setName] = useState("Your Name");
  const [templateImageDataUrl, setTemplateImageDataUrl] = useState<string | null>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [guestProfileImage, setGuestProfileImage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedFont, setSelectedFont] = useState("'Inter', sans-serif");

  useEffect(() => {
    const checkAuth = () => {
      const guest = localStorage.getItem("isGuest") === "true";
      const guestName = localStorage.getItem("guestName") || "Guest User";
      const guestImage = localStorage.getItem("guestImage");
      setIsGuest(guest);
      setName(isSignedIn && user ? (user.fullName || "Your Name") : guestName);
      setGuestProfileImage(guestImage);
      setIsAppLoading(false);
    };
    
    if (isLoaded) {
      checkAuth();
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (template) {
      setSelectedColor(template.overlayConfig.fontColor || "#FFFFFF");
    }
  }, [template]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    if (params.id) {
      loadTemplate();
    }
  }, [params.id]);

  const fetchImageAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const loadTemplate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/templates/${params.id}`);
      const result = await res.json();
      
      console.log("Template API response:", result);
      
      let templateData = null;
      if (result && result._id) {
        templateData = result;
      } else if (result && result.data) {
        templateData = result.data;
      }
      
      if (!templateData) {
        throw new Error("Invalid template data");
      }
      
      if (templateData.isPremium) {
        setShowPremium(true);
        setIsLoading(false);
        return;
      }
      
      setTemplate(templateData);
      
      try {
        const dataUrl = await fetchImageAsDataUrl(templateData.imageURL);
        setTemplateImageDataUrl(dataUrl);
      } catch (imgError) {
        console.warn("Failed to convert image to data URL, using original:", imgError);
        setTemplateImageDataUrl(templateData.imageURL);
      }
    } catch (error) {
      showToast("Failed to load template", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomize = () => {
    if (template?.isPremium) {
      setShowPremium(true);
      return;
    }
    showToast("Template customized!", "success");
  };

  const generateImage = async () => {
    if (!templateRef.current) return null;
    
    try {
      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: "#0F172A",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Failed to generate image:", error);
      showToast("Failed to generate image", "error");
      return null;
    }
  };

  const handleDownload = async () => {
    if (template?.isPremium) {
      setShowPremium(true);
      return;
    }

    setIsDownloading(true);
    try {
      const dataUrl = await generateImage();
      if (dataUrl) {
        const link = document.createElement("a");
        link.download = `${template?.title || "wish"}.png`;
        link.href = dataUrl;
        link.click();
        showToast("Image downloaded successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to download image", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (template?.isPremium) {
      setShowPremium(true);
      return;
    }

    setIsSharing(true);
    try {
      const dataUrl = await generateImage();
      if (dataUrl) {
        setGeneratedImageUrl(dataUrl);
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${template?.title || "wish"}.png`, { type: "image/png" });

        if (navigator.share && navigator.canShare) {
          try {
            const shareData = {
              title: template?.title || "My Wish",
              text: "Check out my personalized wish!",
              files: [file],
            };
            
            if (navigator.canShare(shareData)) {
              await navigator.share(shareData);
              showToast("Shared successfully!", "success");
              return;
            }
          } catch (shareError) {
            if ((shareError as Error).name === "AbortError") {
              return;
            }
          }
        }

        setShowShareModal(true);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to share image", "error");
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadFromModal = () => {
    if (generatedImageUrl) {
      const link = document.createElement("a");
      link.download = `${template?.title || "wish"}.png`;
      link.href = generatedImageUrl;
      link.click();
      showToast("Image downloaded successfully!", "success");
    }
  };

  const handleCopyFromModal = async () => {
    if (generatedImageUrl) {
      try {
        const blob = await (await fetch(generatedImageUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        showToast("Image copied to clipboard! Paste in WhatsApp/Instagram!", "success");
      } catch (clipboardError) {
        console.error(clipboardError);
        showToast("Failed to copy image", "error");
      }
    }
  };

  if (isAppLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-pattern">
        <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin shadow-glow-purple" />
      </div>
    );
  }

  const features = [
    { icon: Palette, title: "Custom Design", desc: "Beautiful template crafted with love" },
    { icon: Zap, title: "Instant Share", desc: "Share anywhere in one click" },
    { icon: Heart, title: "Made with Love", desc: "Perfect for any special occasion" },
  ];

  return (
    <div className="min-h-screen bg-gradient-pattern">
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="text-text-secondary hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold">{template?.title}</h1>
            {template?.category && (
              <p className="text-text-secondary text-sm">{typeof template.category === 'string' ? template.category : template.category.name || 'Category'}</p>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <Card className="p-8 shadow-card-xl border border-border">
              <div 
                ref={templateRef}
                className="relative aspect-[4/5] bg-surface rounded-3xl overflow-hidden"
              >
                {template && (
                  <>
                    <img
                      src={templateImageDataUrl || template.imageURL}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute"
                      style={{
                        left: `${template.overlayConfig.photoX}px`,
                        top: `${template.overlayConfig.photoY}px`,
                      }}
                    >
                      <div
                        className="rounded-full overflow-hidden border-4 border-white shadow-lg"
                        style={{
                          width: `${template.overlayConfig.photoSize}px`,
                          height: `${template.overlayConfig.photoSize}px`,
                        }}
                      >
                        {guestProfileImage ? (
                          <img src={guestProfileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : isSignedIn && user?.imageUrl ? (
                          <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/30 flex items-center justify-center">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className="absolute font-bold text-shadow-lg"
                      style={{
                        left: `${template.overlayConfig.textX}px`,
                        top: `${template.overlayConfig.textY}px`,
                        fontSize: `${template.overlayConfig.fontSize}px`,
                        color: selectedColor,
                        fontFamily: selectedFont,
                      }}
                    >
                      {name}
                    </div>
                  </>
                )}
              </div>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card className="p-6 glass-light">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-purple/30">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-secondary text-sm mb-1">💡 Pro Tip</p>
                    <motion.p
                      key={currentTip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="font-medium"
                    >
                      {tips[currentTip]}
                    </motion.p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-96 space-y-6"
          >
            <Card className="p-8 shadow-card-xl border border-border">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6 text-primary" />
                Customize
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm text-text-secondary mb-3 font-medium">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-surface border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-4 font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Text Color
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color, i) => (
                      <motion.button
                        key={color.value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {selectedColor === color.value && (
                          <Check className={`w-5 h-5 mx-auto ${color.value === '#FFFFFF' || color.value === '#FFD700' ? 'text-black' : 'text-white'}`} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-4 font-medium flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font Style
                  </label>
                  <div className="space-y-3">
                    {fontOptions.map((font, i) => (
                      <motion.button
                        key={font.value}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFont(font.value)}
                        className={`w-full px-5 py-3 rounded-2xl border-2 transition-all text-left ${
                          selectedFont === font.value
                            ? 'bg-primary/20 border-primary'
                            : 'bg-surface border-border hover:border-primary/30'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        <span className="text-lg">{font.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={handleCustomize} isGlowing>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Apply Changes
                </Button>
              </div>
            </Card>

            <Card className="p-8 shadow-card-xl border border-border">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Share className="w-6 h-6 text-primary" />
                Actions
              </h3>
              
              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full justify-start gap-3" variant="secondary" onClick={handleDownload} isLoading={isDownloading}>
                    <Download className="w-5 h-5" />
                    Download Image
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full justify-start gap-3" variant="secondary" onClick={handleShare} isLoading={isSharing}>
                    <Share className="w-5 h-5" />
                    Share Wish
                  </Button>
                </motion.div>
              </div>
            </Card>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: -4 }}
                >
                  <Card className="p-5 glass-light">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-text-secondary text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {template?.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="p-6 glass-light">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-secondary text-sm mb-1">About this template</p>
                      <p className="text-sm">{template.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <PremiumPopup isOpen={showPremium} onClose={() => {
        setShowPremium(false);
        router.push("/dashboard");
      }} />
      
      {generatedImageUrl && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageUrl={generatedImageUrl}
          title={template?.title || "My Wish"}
          onDownload={handleDownloadFromModal}
          onCopy={handleCopyFromModal}
        />
      )}
    </div>
  );
}
