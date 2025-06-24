
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Report } from '@/types/report';

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Report) => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      status: 'pending',
      loanInformation: {
        loanType: 'personal',
        loanAmount: 50000000,
        loanTerm: 24,
        monthlyPayment: 2500000,
        loanPurpose: 'Home renovation and improvement',
        paymentMethod: 'installments'
      },
      reporteeInformation: {
        fullName: 'John Doe',
        phoneNumber: '+6281234567890',
        email: 'john@example.com'
      },
      supportingDocuments: {
        documents: [],
        additionalNotes: 'All documents provided'
      },
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      submittedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      status: 'verified',
      loanInformation: {
        loanType: 'business',
        loanAmount: 100000000,
        loanTerm: 36,
        monthlyPayment: 3500000,
        loanPurpose: 'Business expansion',
        paymentMethod: 'one-time'
      },
      reporteeInformation: {
        fullName: 'Jane Smith',
        phoneNumber: '+6281234567891',
        email: 'jane@example.com'
      },
      supportingDocuments: {
        documents: [],
        additionalNotes: 'Business license attached'
      },
      createdAt: '2024-01-18T10:00:00Z',
      updatedAt: '2024-01-18T10:00:00Z',
      submittedAt: '2024-01-18T10:00:00Z'
    }
  ]);

  const addReport = (report: Report) => {
    setReports(prev => [report, ...prev]);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
};
