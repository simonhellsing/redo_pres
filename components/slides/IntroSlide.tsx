'use client'

import { motion } from 'framer-motion'

interface IntroSlideProps {
  customerCompanyName: string
  customerLogoUrl: string | null
  presentationTitle: string
  presenterName: string
  presenterLogoUrl: string | null
  primaryColor: string
  onStart?: () => void
}

export function IntroSlide({
  customerCompanyName,
  customerLogoUrl,
  presentationTitle,
  presenterName,
  presenterLogoUrl,
  primaryColor,
  onStart,
}: IntroSlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center relative">
      {/* Animated background circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: primaryColor }}
          initial={{ x: '-50%', y: '-50%', left: '30%', top: '30%' }}
          animate={{
            x: ['-50%', '-40%', '-50%'],
            y: ['-50%', '-60%', '-50%'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: primaryColor }}
          initial={{ x: '50%', y: '50%', right: '20%', bottom: '20%' }}
          animate={{
            x: ['50%', '60%', '50%'],
            y: ['50%', '40%', '50%'],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Customer Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mb-8"
      >
        {customerLogoUrl ? (
          <img
            src={customerLogoUrl}
            alt={customerCompanyName}
            className="h-24 md:h-32 object-contain rounded-xl"
          />
        ) : (
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            {customerCompanyName[0]}
          </div>
        )}
      </motion.div>

      {/* Customer Company Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold text-foreground mb-2"
      >
        {customerCompanyName}
      </motion.h1>

      {/* Presentation Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xl md:text-2xl text-foreground-muted mb-12"
      >
        {presentationTitle}
      </motion.h2>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-24 h-1 rounded-full mb-12"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Presenter branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex items-center gap-2 text-foreground-subtle"
      >
        <span className="text-sm">Presenteras av</span>
{presenterLogoUrl && (
          <img src={presenterLogoUrl} alt={presenterName} className="h-5 object-contain rounded" />
        )}
        <span className="text-sm font-medium text-foreground-muted">{presenterName}</span>
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full text-white text-xs font-medium transition-shadow hover:shadow-lg"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: `0 4px 20px ${primaryColor}40`,
          }}
        >
          Starta presentation
        </motion.button>
      </motion.div>
    </div>
  )
}
