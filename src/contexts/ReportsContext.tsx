
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
        loanName: 'Home Renovation Loan',
        loanType: 'personal',
        loanAmount: 50000000,
        agreementDate: '2024-01-15',
        disbursementDate: '2024-01-20',
        dueDate: '2026-01-20',
        loanPurpose: 'home-improvement',
        repaymentPlan: 'installment',
        installmentCount: 24,
        applicationInterest: 0,
        applicationLateFee: 0,
        collateral: 'none',
        // Legacy fields for backward compatibility
        loanTerm: 24,
        monthlyPayment: 2500000,
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
      paymentInfo: {
        method: 'installment',
        status: 'unpaid',
        installments: [
          { number: 1, amount: 2083333, dueDate: '2024-02-20', status: 'paid' },
          { number: 2, amount: 2083333, dueDate: '2024-03-20', status: 'paid' },
          { number: 3, amount: 2083333, dueDate: '2024-04-20', status: 'unpaid' },
          { number: 4, amount: 2083333, dueDate: '2024-05-20', status: 'unpaid' }
        ]
      },
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
      submittedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      status: 'verified',
      loanInformation: {
        loanName: 'Business Expansion Loan',
        loanType: 'business',
        loanAmount: 100000000,
        agreementDate: '2024-01-10',
        disbursementDate: '2024-01-18',
        dueDate: '2027-01-18',
        loanPurpose: 'business-expansion',
        repaymentPlan: 'open-payment',
        installmentCount: undefined,
        applicationInterest: 0,
        applicationLateFee: 0,
        collateral: 'none',
        // Legacy fields for backward compatibility
        loanTerm: undefined,
        monthlyPayment: undefined,
        paymentMethod: 'open-payment'
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
      paymentInfo: {
        method: 'open-payment',
        status: 'unpaid',
        openPayments: [
          {
            id: '1',
            amount: 25000000,
            date: '2024-01-15',
            notes: 'First payment',
            runningBalance: 75000000
          },
          {
            id: '2',
            amount: 15000000,
            date: '2024-01-25',
            notes: 'Second payment',
            runningBalance: 60000000
          }
        ],
        totalPaid: 40000000,
        remainingBalance: 60000000
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
