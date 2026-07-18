'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Bell, 
  Lock, 
  Building, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  LogOut
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface SettingsItem {
  id: string;
  label: string;
  value?: string;
  Icon: React.ComponentType<any>;
  bgColor: string;
  onClick: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function StudentSettingsPage() {
  const { currentUser, setCurrentUser, logout } = useUser();
  const router = useRouter();

  // Overlay modal state triggers
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notifConfig, setNotifConfig] = useState({
    push: true,
    email: true,
    reminders: true
  });

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const updatePrivacy = async (key: 'going' | 'saved' | 'hosted' | 'organizations', value: 'public' | 'private') => {
    if (!currentUser) return;
    const updatedPrivacy = {
      going: currentUser.privacy?.going || 'public',
      saved: currentUser.privacy?.saved || 'private',
      hosted: currentUser.privacy?.hosted || 'public',
      organizations: currentUser.privacy?.organizations || 'private',
      [key]: value
    };

    const updatedUser = {
      ...currentUser,
      privacy: updatedPrivacy
    };

    // Update context immediately
    setCurrentUser(updatedUser);

    // Save to backend database
    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          privacy: updatedPrivacy
        })
      });
    } catch (e) {
      console.error('Failed to save privacy settings:', e);
    }
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', value: 'MC', Icon: User, bgColor: '#FD5C05', onClick: () => router.push('/student/profile') },
        { id: 'notifications', label: 'Notifications', value: 'On', Icon: Bell, bgColor: '#3b82f6', onClick: () => setActiveModal('notifications') },
        { id: 'privacy', label: 'Privacy & Security', value: 'Private', Icon: Lock, bgColor: '#10b981', onClick: () => setActiveModal('privacy') },
        { id: 'college', label: 'Linked College', value: currentUser.school || 'Livingstone College', Icon: Building, bgColor: '#8b5cf6', onClick: () => setActiveModal('college') },
      ]
    },
    {
      title: 'Support & Feedback',
      items: [
        { id: 'report', label: 'Report a Problem', Icon: AlertTriangle, bgColor: '#ef4444', onClick: () => setActiveModal('report') },
        { id: 'feedback', label: 'Send Feedback', Icon: MessageSquare, bgColor: '#10b981', onClick: () => setActiveModal('feedback') },
      ]
    },
    {
      title: 'Legal',
      items: [
        { id: 'terms', label: 'Terms of Service', Icon: FileText, bgColor: '#6b7280', onClick: () => setActiveModal('terms') },
        { id: 'policy', label: 'Privacy Policy', Icon: Lock, bgColor: '#374151', onClick: () => setActiveModal('policy') },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F0] text-[#2A2621] font-sans pb-32">
      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        
        {/* ── Native Grouped Settings Header ── */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
          <button 
            onClick={() => router.push('/student/profile')}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#5A554E] hover:text-[#2A2621] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <h1 className="text-[15px] font-semibold text-[#2A2621]">
            Settings
          </h1>
          
          <div className="w-12" /> {/* spacer balance */}
        </div>

        {/* ── Grouped Sections ── */}
        <div className="space-y-4">
          {sections.map(sec => (
            <div key={sec.title} className="space-y-1.5 text-left">
              <h3 className="text-[10px] font-black uppercase text-[#5A554E] tracking-widest pl-4">
                {sec.title}
              </h3>
              
              <div className="bg-white border border-black/[0.03] rounded-2xl overflow-hidden shadow-sm divide-y divide-black/[0.04]">
                {sec.items.map(item => (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/70 active:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs shrink-0 shadow-sm"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <item.Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-[#2A2621] uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#5A554E]/60 text-[10px] font-bold">
                      {item.value && <span className="truncate max-w-[120px]">{item.value}</span>}
                      <ChevronRight className="h-4 w-4 text-[#5A554E]/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Independent Native Sign Out ── */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl py-3.5 text-center text-xs font-black uppercase tracking-wider text-red-600 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />
            Sign Out
          </button>
        </div>

      </div>

      {/* ── Sub-Modals overlay for preferences / help configs ── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-black/10 shadow-xl max-w-sm w-full p-6 text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-black/[0.04] pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2A2621]">{activeModal} Configuration</h4>
                <button onClick={() => setActiveModal(null)} className="text-red-500 text-xs font-bold hover:underline cursor-pointer">Close</button>
              </div>

              {activeModal === 'notifications' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">Push Alerts</p>
                      <p className="text-[10px] text-[#5A554E]">Recieve updates on your device</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifConfig.push}
                      onChange={e => setNotifConfig(p => ({ ...p, push: e.target.checked }))}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">Email Digest</p>
                      <p className="text-[10px] text-[#5A554E]">Weekly digests of saved events</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifConfig.email}
                      onChange={e => setNotifConfig(p => ({ ...p, email: e.target.checked }))}
                    />
                  </div>
                </div>
              )}

              {activeModal === 'college' && (
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold uppercase text-[9px] text-[#5A554E]">Connected Campus</p>
                  <p className="font-extrabold text-[#2A2621]">{currentUser.school || 'Livingstone College'}</p>
                  <p className="text-[10px] text-[#5A554E]">Your account is verified under this institution's official email domain directory.</p>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-4 text-xs">
                  <div className="border-b border-black/[0.04] pb-2 text-left">
                    <p className="font-bold text-[10px] uppercase text-[#5A554E] tracking-wider">Profile Visibility Settings</p>
                    <p className="text-[10px] text-[#5A554E] mt-0.5">Control which tabs and contents are visible to other campus members visiting your profile.</p>
                  </div>
                  
                  {([
                    { key: 'going', label: 'Going Tab', desc: 'Lists events you plan to attend' },
                    { key: 'saved', label: 'Saved Tab', desc: 'Lists events you have saved for later' },
                    { key: 'hosted', label: 'Hosted Tab', desc: 'Lists events and promotions you host' },
                    { key: 'organizations', label: 'Organizations Tab', desc: 'Lists organizations you manage or belong to' }
                  ] as const).map(setting => {
                    const currentVal = currentUser.privacy?.[setting.key] || (setting.key === 'saved' || setting.key === 'organizations' ? 'private' : 'public');
                    return (
                      <div key={setting.key} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-black/[0.02]">
                        <div className="text-left max-w-[60%]">
                          <p className="font-bold text-[#2A2621]">{setting.label}</p>
                          <p className="text-[9px] text-[#5A554E] mt-0.5 leading-tight">{setting.desc}</p>
                        </div>
                        <div className="flex bg-black/[0.04] p-0.5 rounded-lg">
                          {(['public', 'private'] as const).map(val => (
                            <button
                              key={val}
                              onClick={() => updatePrivacy(setting.key, val)}
                              className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-md transition-all ${
                                currentVal === val 
                                  ? 'bg-[#FD5C05] text-[#2A2621] shadow-sm' 
                                  : 'text-[#5A554E] hover:text-[#2A2621]'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {['report', 'feedback', 'terms', 'policy'].includes(activeModal) && (
                <div className="space-y-1.5 text-xs text-[#5A554E] leading-relaxed">
                  <p className="font-bold uppercase text-[9px] text-[#2A2621]">
                    {activeModal === 'report' && 'Report a Problem'}
                    {activeModal === 'feedback' && 'Send Feedback'}
                    {activeModal === 'terms' && 'Terms of Service'}
                    {activeModal === 'policy' && 'Privacy Policy'}
                  </p>
                  {activeModal === 'report' && (
                    <p>To report a problem, please email support@evida.app with details and screenshots of the issue.</p>
                  )}
                  {activeModal === 'feedback' && (
                    <p>We value your feedback! Send your suggestions or ideas to hello@evida.app.</p>
                  )}
                  {activeModal === 'terms' && (
                    <p>By using Evida, you agree to our campus terms of service and standard user conduct guidelines.</p>
                  )}
                  {activeModal === 'policy' && (
                    <p>Your privacy is protected. We do not sell or share student directory data with external entities.</p>
                  )}
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                className="w-full bg-[#2A2621] text-white hover:bg-[#FD5C05] hover:text-[#2A2621] border-none font-bold"
                onClick={() => setActiveModal(null)}
              >
                Done
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
