'use client';

import React, { useState, useRef } from 'react';

type VisionKey = 'Students' | 'Schools' | 'Discovery' | 'Connection' | 'Community' | 'Memories';

interface VisionContent {
  leftHeadline: string;
  leftText: string;
  bottomHeadline: string;
  bottomText: string;
  targetRotation: { x: number; y: number };
}

const visionData: Record<VisionKey, VisionContent> = {
  Students: {
    leftHeadline: "STUDENTS FIRST.",
    leftText: "College is more than classes. Evida helps every student discover opportunities, connect with others, and never miss what makes campus life memorable.",
    bottomHeadline: "ONE PLATFORM. TWO COMMUNITIES.",
    bottomText: "By bringing students and schools together, Evida transforms scattered campus information into one connected experience.",
    targetRotation: { x: -10, y: 25 }
  },
  Schools: {
    leftHeadline: "EMPOWERING SCHOOLS.",
    leftText: "Empower your student body. Evida provides administrators with the tools to manage events, approve promotions, and track engagement in real-time.",
    bottomHeadline: "SECURE & SCALEABLE.",
    bottomText: "Designed to meet school policies while giving student organizations the freedom to share, promote, and grow.",
    targetRotation: { x: -10, y: -65 }
  },
  Discovery: {
    leftHeadline: "DISCOVER MORE.",
    leftText: "Stop searching through dozens of group chats, emails, and flyers. Evida centralizes all campus activities into a single, intuitive feed.",
    bottomHeadline: "ALWAYS IN THE LOOP.",
    bottomText: "Filter by your interests, save events to your calendar, and receive notifications for updates that matter to you.",
    targetRotation: { x: -10, y: 25 }
  },
  Connection: {
    leftHeadline: "CONNECT DEEPLY.",
    leftText: "Great college memories are made with others. Evida makes it easy to find clubs, join student groups, and meet people who share your passions.",
    bottomHeadline: "CLUBS & ORGANIZATIONS.",
    bottomText: "Give your student organization a digital home. Expand your reach, track your members, and simplify event promotion.",
    targetRotation: { x: -10, y: -20 }
  },
  Community: {
    leftHeadline: "BUILD COMMUNITY.",
    leftText: "A vibrant campus is an engaged campus. Evida fosters a sense of belonging by making student-led initiatives visible to everyone.",
    bottomHeadline: "STRONGER TOGETHER.",
    bottomText: "When students and administration collaborate on a single platform, the entire campus culture becomes more connected.",
    targetRotation: { x: -10, y: -65 }
  },
  Memories: {
    leftHeadline: "UNFORGETTABLE MEMORIES.",
    leftText: "Your college years are some of the most impactful years of your life. Evida ensures you don't miss the moments that turn into lifelong memories.",
    bottomHeadline: "COLLEGE ENDS, MEMORIES DON'T.",
    bottomText: "Capturing the spirit of campus life. Because what you do outside the classroom matters just as much as what you do inside.",
    targetRotation: { x: -10, y: 25 }
  }
};

export default function OurVisionSection() {
  const [activeItem, setActiveItem] = useState<VisionKey>('Students');
  const [rotation, setRotation] = useState({ x: -10, y: 25 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });

  const handleMenuHover = (item: VisionKey) => {
    if (isDragging) return;
    setActiveItem(item);
    setRotation(visionData[item].targetRotation);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragRotation.current = { x: rotation.x, y: rotation.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    // Sensitivity factor
    const factor = 0.5;
    
    setRotation({
      x: dragRotation.current.x - deltaY * factor,
      y: dragRotation.current.y + deltaX * factor
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    dragRotation.current = { x: rotation.x, y: rotation.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.current.x;
    const deltaY = touch.clientY - dragStart.current.y;
    
    const factor = 0.5;
    
    setRotation({
      x: dragRotation.current.x - deltaY * factor,
      y: dragRotation.current.y + deltaX * factor
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="w-full bg-white py-24 border-y border-gray-100 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-gray-900 font-black text-4xl tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-lufga)' }}>
            OUR VISION
          </h2>
          <div className="w-12 h-1 bg-black mx-auto" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Cube and Paragraphs */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Cube Area */}
            <div className="flex justify-center items-center h-[320px] md:h-[380px] relative">
              <div 
                className="relative w-[240px] h-[240px] select-none"
                style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="w-full h-full relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                >
                  {/* Front Face (STUDENTS) */}
                  <div 
                    className="absolute inset-0 bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.15)]"
                    style={{
                      transform: 'rotateY(0deg) translateZ(120px)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-evida-coral)]">Pillar 01</span>
                    </div>
                    <div className="my-auto text-left">
                      <h3 className="text-black font-black text-3xl tracking-tighter leading-none uppercase" style={{ fontFamily: 'var(--font-lufga)' }}>
                        STUDENTS
                      </h3>
                      <p className="text-gray-600 text-[11px] mt-3 font-semibold leading-relaxed">
                        Discover events. Meet people. Create memories. Experience campus life.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Evida App</span>
                    </div>
                  </div>

                  {/* Right Face (SCHOOLS) */}
                  <div 
                    className="absolute inset-0 bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.15)]"
                    style={{
                      transform: 'rotateY(90deg) translateZ(120px)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-evida-blue)]">Pillar 02</span>
                    </div>
                    <div className="my-auto text-left">
                      <h3 className="text-black font-black text-3xl tracking-tighter leading-none uppercase" style={{ fontFamily: 'var(--font-lufga)' }}>
                        SCHOOLS
                      </h3>
                      <p className="text-gray-600 text-[11px] mt-3 font-semibold leading-relaxed">
                        Organize events. Increase engagement. Strengthen your campus community.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Evida Portal</span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div 
                    className="absolute inset-0 bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.15)]"
                    style={{
                      transform: 'rotateY(180deg) translateZ(120px)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-evida-lime)]">Vision</span>
                    </div>
                    <div className="my-auto text-left">
                      <h3 className="text-black font-black text-3xl tracking-tighter leading-none uppercase" style={{ fontFamily: 'var(--font-lufga)' }}>
                        EVIDA
                      </h3>
                      <p className="text-gray-600 text-[11px] mt-3 font-semibold leading-relaxed">
                        The digital home of campus life and community connection.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Est. 2024</span>
                    </div>
                  </div>

                  {/* Left Face */}
                  <div 
                    className="absolute inset-0 bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,0.15)]"
                    style={{
                      transform: 'rotateY(-90deg) translateZ(120px)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-left">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-evida-coral)]">Core</span>
                    </div>
                    <div className="my-auto text-left">
                      <h3 className="text-black font-black text-3xl tracking-tighter leading-none uppercase" style={{ fontFamily: 'var(--font-lufga)' }}>
                        COMMUNITY
                      </h3>
                      <p className="text-gray-600 text-[11px] mt-3 font-semibold leading-relaxed">
                        Bringing students and schools together into one connected experience.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Evida Hub</span>
                    </div>
                  </div>

                  {/* Top Face */}
                  <div 
                    className="absolute inset-0 bg-gray-50 border-4 border-black p-6 flex items-center justify-center"
                    style={{
                      transform: 'rotateX(90deg) translateZ(120px)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <span className="text-black font-black text-xl uppercase tracking-widest">EVIDA</span>
                  </div>

                  {/* Bottom Face */}
                  <div 
                    className="absolute inset-0 bg-gray-50 border-4 border-black p-6 flex items-center justify-center"
                    style={{
                      transform: 'rotateX(-90deg) translateZ(120px)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <span className="text-black font-black text-xl uppercase tracking-widest">EVIDA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paragraphs under the Cube */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left border-t border-gray-100 pt-8">
              {/* Left Paragraph */}
              <div className="space-y-3">
                <h4 className="text-black font-black text-lg md:text-xl uppercase tracking-wider" style={{ fontFamily: 'var(--font-lufga)' }}>
                  {visionData[activeItem].leftHeadline}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium min-h-[80px] transition-all duration-300">
                  {visionData[activeItem].leftText}
                </p>
              </div>

              {/* Bottom Middle Paragraph */}
              <div className="space-y-3">
                <h4 className="text-black font-black text-lg md:text-xl uppercase tracking-wider" style={{ fontFamily: 'var(--font-lufga)' }}>
                  {visionData[activeItem].bottomHeadline}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium min-h-[80px] transition-all duration-300">
                  {visionData[activeItem].bottomText}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Menu */}
          <div className="lg:col-span-4 flex flex-col text-left">
            <div className="border-t border-gray-900 w-full mb-4 opacity-10" />
            <ul className="flex flex-col w-full">
              {(Object.keys(visionData) as VisionKey[]).map((item) => {
                const isActive = activeItem === item;
                return (
                  <li key={item} className="w-full relative group">
                    <button
                      onClick={() => handleMenuHover(item)}
                      onMouseEnter={() => handleMenuHover(item)}
                      className={`w-full py-4 text-left font-black uppercase text-xl md:text-2xl transition-all duration-300 flex justify-between items-center tracking-wider cursor-pointer ${
                        isActive ? 'text-black' : 'text-gray-300 hover:text-gray-600'
                      }`}
                      style={{ fontFamily: 'var(--font-lufga)' }}
                    >
                      <span>{item}</span>
                      {isActive && (
                        <span className="w-2.5 h-2.5 bg-[var(--color-evida-coral)] inline-block animate-pulse" />
                      )}
                    </button>
                    <div className={`h-[1px] w-full transition-colors duration-300 ${
                      isActive ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
