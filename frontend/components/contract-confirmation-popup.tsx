"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

interface ContractConfirmationPopupProps {
  onClose: () => void
  onNext: () => void
}

export default function ContractConfirmationPopup({ onClose, onNext }: ContractConfirmationPopupProps) {
  const [showNextButton, setShowNextButton] = useState(false)

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    const timer = setTimeout(() => {
      setShowNextButton(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
          className="bg-white rounded-lg p-8 max-w-md w-full space-y-4 text-center"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-[#7C3AED]"
          >
            Contract Confirmed!
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Congratulations! Your contract has been successfully established.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            {showNextButton ? (
              <Button onClick={onNext} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                Next
              </Button>
            ) : (
              <div className="h-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7C3AED]"></div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

