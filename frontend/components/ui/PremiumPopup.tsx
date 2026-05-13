"use client";

import { motion } from "framer-motion";
import { Crown, Check, X, Sparkles, Zap, Heart, Gift } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Card } from "./Card";

interface PremiumPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const premiumFeatures = [
  { icon: Sparkles, title: "100+ Premium Templates", desc: "Exclusive designs for every occasion" },
  { icon: Zap, title: "Unlimited Downloads", desc: "Save as many wishes as you want" },
  { icon: Heart, title: "Priority Support", desc: "Get help whenever you need it" },
  { icon: Gift, title: "Early Access", desc: "Be the first to try new features" },
];

export const PremiumPopup = ({ isOpen, onClose }: PremiumPopupProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Card className="p-8 shadow-card-xl border border-border max-w-lg mx-4">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-glow-purple"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Go Premium!
                </h2>
                <p className="text-text-secondary mt-1">Unlock all templates and features</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {premiumFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.05, x: 4 }}
                className="p-4 glass-light rounded-2xl border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-text-secondary text-xs mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 bg-surface rounded-3xl border-2 border-border"
            >
              <p className="text-sm text-text-secondary mb-2">Monthly</p>
              <p className="text-4xl font-bold mb-1">$4.99</p>
              <p className="text-xs text-text-secondary">per month</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-primary/25 via-secondary/25 to-accent/25 rounded-3xl border-2 border-primary relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 bg-gradient-to-r from-accent to-secondary text-white text-xs font-bold rounded-full shadow-glow-pink">
                  SAVE 50%
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-2">Yearly</p>
              <p className="text-4xl font-bold mb-1">$29.99</p>
              <p className="text-xs text-text-secondary">per year</p>
              <p className="text-xs text-green-400 mt-1 font-semibold">Just $2.50/month!</p>
            </motion.div>
          </div>

          <Button className="w-full" isGlowing size="lg">
            <Sparkles className="w-5 h-5 mr-2" />
            Upgrade to Premium Now
          </Button>

          <p className="text-center text-text-secondary text-xs mt-4">
            No credit card required · Cancel anytime
          </p>
        </Card>
      </motion.div>
    </Modal>
  );
};
