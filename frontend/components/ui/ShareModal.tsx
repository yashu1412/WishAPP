"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { MessageSquare, Instagram, Mail, Copy, Download, X, Share2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  onDownload: () => void;
  onCopy: () => void;
}

export const ShareModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title, 
  onDownload, 
  onCopy 
}: ShareModalProps) => {
  const shareViaWhatsApp = () => {
    const text = `Check out my personalized ${title}!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareViaInstagram = () => {
    alert("To share on Instagram:\n1. First download the image\n2. Open Instagram and create a new post/story\n3. Select the downloaded image");
  };

  const shareViaEmail = () => {
    const subject = `My ${title} Wish`;
    const body = `Check out my personalized ${title}!`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-background rounded-3xl p-8 max-w-md mx-4 shadow-card-xl border border-border"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Share Your Wish</h2>
              <p className="text-text-secondary text-sm">Choose how to share</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-text-secondary hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-card-lg border border-border">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full aspect-[4/5] object-cover" 
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareViaWhatsApp}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageSquare className="w-10 h-10" />
            <span className="font-bold text-sm">WhatsApp</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareViaInstagram}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 text-white bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90"
          >
            <Instagram className="w-10 h-10" />
            <span className="font-bold text-sm">Instagram</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareViaEmail}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 text-white"
            style={{ backgroundColor: "#6D28D9" }}
          >
            <Mail className="w-10 h-10" />
            <span className="font-bold text-sm">Email</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopy}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 text-white bg-surface border-2 border-border hover:bg-white/10 hover:border-primary/30"
          >
            <Copy className="w-10 h-10" />
            <span className="font-bold text-sm">Copy</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={onDownload} className="w-full" isGlowing size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download Image
          </Button>
        </motion.div>

        <p className="text-center text-text-secondary text-xs mt-4">
          Make someone's day special! ✨
        </p>
      </motion.div>
    </Modal>
  );
};
