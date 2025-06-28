import React, { createContext, useContext, useState } from 'react';

export type KycStatus = 'pending' | 'verified' | 'rejected';

interface KycContextType {
  kycStatus: KycStatus;
  setKycStatus: (status: KycStatus) => void;
}

const KycContext = createContext<KycContextType | undefined>(undefined);

export const KycProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kycStatus, setKycStatus] = useState<KycStatus>('pending');
  return (
    <KycContext.Provider value={{ kycStatus, setKycStatus }}>
      {children}
    </KycContext.Provider>
  );
};

export const useKyc = () => {
  const context = useContext(KycContext);
  if (!context) throw new Error('useKyc must be used within a KycProvider');
  return context;
}; 