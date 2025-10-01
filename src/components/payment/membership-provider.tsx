"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { MembershipModal } from './membership-modal';
import { useSmartAuth } from '@/components/auth/smart-auth-context';

interface MembershipContextType {
  openMembershipModal: () => void;
  closeMembershipModal: () => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export function useMembership() {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
}

interface MembershipProviderProps {
  children: ReactNode;
}

export function MembershipProvider({ children }: MembershipProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, updateCredits } = useSmartAuth();

  const openMembershipModal = () => {
    setIsModalOpen(true);
  };

  const closeMembershipModal = () => {
    setIsModalOpen(false);
  };

  const handlePurchaseSuccess = (plan: any, newCredits: number) => {
    // 更新用户积分
    updateCredits(newCredits);
    
    // 可以在这里添加其他成功处理逻辑
    console.log('购买成功:', plan.name, '新积分:', newCredits);
  };

  return (
    <MembershipContext.Provider value={{ openMembershipModal, closeMembershipModal }}>
      {children}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={closeMembershipModal}
        currentCredits={user?.credits || 0}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </MembershipContext.Provider>
  );
}






