'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'Secure Email', value: 'contact@dictuzz.me', target: 'mailto:contact@dictuzz.me' },
  { label: 'Professional Network', value: 'linkedin.com/in/dictuzz', target: 'https://linkedin.com/in/dictuzz' },
  { label: 'Code Repository', value: 'github.com/dictuzz', target: 'https://github.com/dictuzz' },
  { label: 'Meeting Matrix', value: 'calendar.app.google', target: 'https://calendar.app.google/39u2qGH6ybaFenhdA' },
];

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStep('SENDING');
    setTimeout(() => { setStep('SUCCESS'); }, 2000);
  };

  const handleReset = () => {
    setStep('IDLE');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section 
      ref={containerRef} 
      id="contact" 
      className="relative min-h-screen bg-[#050505] flex items-center justify-center py-32 overflow-hidden selection:bg-[#e8e4db] selection:text-black"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-white opacity-[0.015] blur-[200px] pointer-events-none" />
      
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-24 z-10">
        
        {/* Left Column: Massive Serif Header */}
        <div className="xl:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-6 mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#e8e4db]/50 font-semibold mb-2 block">
              Section 05
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#e8e4db] mb-2 block">
              The Transmission
            </span>
          </div>

          <h2 className="font-display italic text-6xl md:text-8xl lg:text-[7.5rem] text-[#e8e4db] tracking-tighter leading-[0.9] mb-12">
            Initiate<br/>Contact.
          </h2>
          <p className="font-serif italic text-xl md:text-2xl text-[#e8e4db]/70 font-light leading-relaxed max-w-md">
            Whether for systems architecture, workflow automation, or strategic direction—the lines are open.
          </p>
        </div>

        {/* Right Column: Ultra-clean Form & Links */}
        <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mt-12 xl:mt-0">
          
          {/* Form */}
          <div className="md:col-span-1 border-l border-[#e8e4db]/10 pl-0 md:pl-16">
            <h3 className="font-sans text-sm uppercase tracking-widest text-[#e8e4db]/80 font-bold mb-12 border-b border-[#e8e4db]/10 pb-4">
              Direct Inquiry
            </h3>

            <AnimatePresence mode="wait">
              {step === 'IDLE' ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-12"
                >
                  <div className="relative group">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      className="w-full bg-transparent border-b border-[#e8e4db]/20 focus:border-[#e8e4db] text-[#e8e4db] py-2 font-serif text-lg tracking-tight outline-none placeholder:text-[#e8e4db]/30 transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b border-[#e8e4db]/20 focus:border-[#e8e4db] text-[#e8e4db] py-2 font-serif text-lg tracking-tight outline-none placeholder:text-[#e8e4db]/30 transition-colors"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <textarea 
                      required
                      rows={1}
                      placeholder="Project details / Message"
                      className="w-full bg-transparent border-b border-[#e8e4db]/20 focus:border-[#e8e4db] text-[#e8e4db] py-2 font-serif text-lg tracking-tight outline-none placeholder:text-[#e8e4db]/30 transition-colors resize-none overflow-hidden"
                      value={formData.message}
                      onChange={e => {
                        e.target.style.height = 'inherit';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                        setFormData({...formData, message: e.target.value});
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="group w-full bg-[#e8e4db] text-black py-5 mt-8 border border-[#e8e4db] hover:bg-transparent hover:text-[#e8e4db] transition-colors duration-300 flex items-center justify-center gap-4"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
                      Send Transmission
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </button>
                </motion.form>
              ) : step === 'SENDING' ? (
                <motion.div 
                  key="sending"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[300px] border border-[#e8e4db]/10 bg-[#e8e4db]/[0.02]"
                >
                  <div className="w-24 h-[2px] bg-[#e8e4db]/10 relative overflow-hidden mb-8">
                    <div className="absolute top-0 bottom-0 left-0 bg-[#e8e4db] w-1/3 animate-ping" />
                  </div>
                  <p className="font-mono text-sm uppercase tracking-widest text-[#e8e4db]/50 animate-pulse">
                    Routing...
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className="flex flex-col items-center justify-center h-[300px] border border-[#e8e4db]/10 bg-[#e8e4db]/[0.02] p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 text-[#e8e4db] font-serif italic text-3xl">✓</div>
                  <h3 className="font-display italic text-3xl text-[#e8e4db] mb-2 tracking-tighter">Received.</h3>
                  <button 
                    onClick={handleReset}
                    className="font-mono text-xs uppercase tracking-widest text-[#e8e4db]/50 hover:text-[#e8e4db] transition-colors mt-8 border-b border-transparent hover:border-[#e8e4db]/40 pb-1"
                  >
                    Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social Links */}
          <div className="md:col-span-1 border-l border-[#e8e4db]/10 pl-0 md:pl-16">
            <h3 className="font-sans text-sm uppercase tracking-widest text-[#e8e4db]/80 font-bold mb-12 border-b border-[#e8e4db]/10 pb-4">
              Alternative Nodes
            </h3>
            
            <ul className="flex flex-col border-t border-[#e8e4db]/10">
              {LINKS.map((link, i) => (
                <li key={i}>
                  <a 
                    href={link.target} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-center border-b border-[#e8e4db]/10 py-8 hover:bg-[#e8e4db]/[0.03] px-6 -mx-6 transition-all duration-300"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-[#e8e4db]/50 mb-2 flex items-center justify-between">
                      {link.label}
                      <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-transform duration-300 font-sans tracking-normal">↗</span>
                    </span>
                    <span className="font-display italic text-2xl text-[#e8e4db] tracking-tighter group-hover:pl-2 transition-all duration-300">
                      {link.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
