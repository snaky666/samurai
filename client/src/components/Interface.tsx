import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import logoImg from '@assets/generated_images/japanese_brush_calligraphy_logo.png';
import sushiImg from '@assets/generated_images/high_end_sushi_platter.png';
import steakImg from '@assets/generated_images/wagyu_beef_steak.png';
import { MapPin, Phone, Clock, ArrowRight, Star } from 'lucide-react';

// Re-using the components from the previous Home.tsx
const MenuItem = ({ title, price, desc, img, delay }: { title: string, price: string, desc: string, img: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border border-white/5 hover:border-primary/50 transition-colors duration-500 tilt-3d"
  >
    <div className="flex flex-col md:flex-row h-full">
      <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-center">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-xl md:text-2xl font-cinzel text-foreground group-hover:text-primary transition-colors">{title}</h3>
          <span className="text-accent font-mono text-lg">{price}</span>
        </div>
        <p className="text-muted-foreground font-sans-jp text-sm md:text-base mb-4">{desc}</p>
        <div className="w-0 group-hover:w-full h-[1px] bg-primary transition-all duration-500" />
      </div>
    </div>
  </motion.div>
);

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle: string }) => (
  <div className="mb-16 text-center relative z-10">
    <motion.span 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="block text-accent font-serif-jp tracking-[0.3em] text-sm mb-4 uppercase"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-4xl md:text-6xl font-cinzel text-foreground relative inline-block steel-shine"
    >
      {children}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary" />
    </motion.h2>
  </div>
);

export default function Interface() {
  return (
    <div className="w-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 mix-blend-difference text-white pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto cursor-pointer">
           <img src={logoImg} className="w-12 h-12 invert opacity-90" alt="Ronin Logo" />
           <span className="font-cinzel text-xl tracking-widest hidden md:block">RONIN</span>
        </div>
        <div className="flex gap-8 font-serif-jp text-xs md:text-sm tracking-widest pointer-events-auto">
          {['MENU', 'STORY', 'RESERVE'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors relative group">
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center px-4 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-9xl font-cinzel font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 drop-shadow-lg glow-gold">
              RONIN
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-lg md:text-2xl font-serif-jp tracking-[0.5em] text-accent uppercase">
              Honor. Fire. Flavor.
            </p>
            <Separator className="w-12 bg-primary h-[2px] my-4" />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-primary/50 bg-black/50 backdrop-blur-md text-white font-cinzel tracking-widest hover:bg-primary hover:border-primary transition-all duration-300 group steel-shine glow-ember"
            >
              ENTER THE DOJO
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <SectionHeading subtitle="Culinary Art">The Blade & The Flame</SectionHeading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MenuItem 
            title="Wagyu Ishiyaki" 
            price="¥12,000" 
            desc="A5 Miyazaki Wagyu, hot stone, truffled ponzu, smoked sea salt."
            img={steakImg}
            delay={0.2}
          />
          <MenuItem 
            title="Omakase Nigiri" 
            price="¥8,500" 
            desc="Chef's selection of 12 seasonal catches, warm red vinegar rice."
            img={sushiImg}
            delay={0.4}
          />
           <MenuItem 
            title="Sakura Smoked Duck" 
            price="¥4,200" 
            desc="Slow-roasted duck breast, cherry wood smoke, plum glaze."
            img={steakImg} 
            delay={0.6}
          />
          <MenuItem 
            title="Gold Leaf Toro" 
            price="¥3,800" 
            desc="Bluefin tuna belly, caviar, 24k gold leaf, fresh wasabi."
            img={sushiImg} 
            delay={0.8}
          />
        </div>
        
        <div className="text-center mt-16">
          <button className="text-accent hover:text-white transition-colors font-serif-jp tracking-widest text-sm border-b border-accent pb-1 pointer-events-auto">
            VIEW FULL MENU
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="story" className="py-32 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-accent font-serif-jp text-lg mb-8 tracking-[0.2em]">BUSHIDO • THE WAY OF THE WARRIOR</h3>
            <p className="text-2xl md:text-4xl font-cinzel leading-relaxed text-white/90 mb-12">
              "We do not just cook. We forge flavors with the same discipline a samurai forges their spirit. Every cut is decisive. Every ingredient is honored."
            </p>
            <div className="flex justify-center gap-12 text-muted-foreground font-serif-jp text-sm tracking-widest">
              <div className="flex flex-col items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span>MASTERY</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span>HONOR</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span>TRADITION</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact / Reservation */}
      <section id="reserve" className="py-32 px-6 relative z-10 pb-64">
         <div className="max-w-5xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             
             {/* Info */}
             <div>
               <SectionHeading subtitle="Join Us">Reservations</SectionHeading>
               <div className="space-y-8 font-serif-jp text-muted-foreground">
                 <p className="text-lg leading-relaxed">
                   Experience the silence before the strike. Tables are limited to ensure the highest quality of service and atmosphere.
                 </p>
                 
                 <div className="space-y-4">
                   <div className="flex items-center gap-4">
                     <MapPin className="text-primary w-5 h-5" />
                     <span>1080 Blade Street, Roppongi District, Tokyo</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <Phone className="text-primary w-5 h-5" />
                     <span>+81 3-1234-5678</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <Clock className="text-primary w-5 h-5" />
                     <span>Daily: 17:00 - 02:00</span>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Form */}
             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 relative overflow-hidden pointer-events-auto"
             >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-red-500 to-primary shadow-[0_0_20px_rgba(220,20,60,0.5)]" />
               
               <form className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-xs uppercase tracking-widest text-muted-foreground">Date</label>
                     <input type="date" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs uppercase tracking-widest text-muted-foreground">Guests</label>
                     <select className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-primary focus:outline-none transition-colors">
                       <option>2 Guests</option>
                       <option>4 Guests</option>
                       <option>6 Guests</option>
                       <option>Private Room</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                   <input type="text" placeholder="Enter your name" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                   <input type="email" placeholder="Enter your email" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                 </div>
                 
                 <button type="button" className="w-full bg-primary text-white py-4 font-cinzel tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2 group steel-shine">
                   CONFIRM RESERVATION
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
               </form>
             </motion.div>

           </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/10 text-center relative z-10">
        <img src={logoImg} className="w-16 h-16 mx-auto mb-6 invert opacity-50" alt="Logo" />
        <p className="text-muted-foreground font-serif-jp text-xs tracking-widest">© 2024 RONIN DINING. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}