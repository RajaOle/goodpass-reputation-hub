import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report } from '@/types/report';
import { fetchUserReports } from '@/services/reportService';

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
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
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUserReports();
      
      // Transform database data to match Report interface
      const transformedReports: Report[] = data.map((dbReport: any) => ({
        id: dbReport.id.toString(),
        status: dbReport.verification_status === 'fully_verified' ? 'verified' : 
                dbReport.verification_status === 'partial_verified' ? 'pending' : 'draft',
        reportStatus: dbReport.progress_status === 'live' ? 'live' : 
                     dbReport.progress_status === 'under_review' ? 'under-review' : 'active',
        loanInformation: {
          loanName: dbReport.report_info?.loan_name || '',
          loanType: 'personal',
          loanAmount: Number(dbReport.report_info?.amount) || 0,
          agreementDate: dbReport.report_info?.agreement_date || '',
          disbursementDate: dbReport.report_info?.disbursement_date || '',
          dueDate: dbReport.report_info?.due_date || '',
          loanPurpose: dbReport.report_info?.purpose || 'business-expansion',
          customLoanPurpose: dbReport.report_info?.custom_loan_purpose,
          repaymentPlan: (() => {
            const dbRepaymentType = dbReport.report_info?.repayment_type;
            console.log('Database repayment_type:', dbRepaymentType, 'for report:', dbReport.id);
            // Map database values to frontend enum values
            switch (dbRepaymentType) {
              case 'single-payment':
              case 'single_payment':
              case 'one-time':
                return 'single-payment';
              case 'installment':
              case 'installments':
                return 'installment';
              case 'open-payment':
              case 'open_payment':
                return 'open-payment';
              default:
                console.warn('Unknown repayment type:', dbRepaymentType, 'defaulting to installment');
                return 'installment';
            }
          })(),
          installmentCount: dbReport.report_info?.repayment_frequency,
          applicationInterest: Number(dbReport.report_info?.interest_rate) || 0,
          applicationLateFee: Number(dbReport.report_info?.late_fee_rate) || 0,
          collateral: dbReport.report_info?.collateral ? 'property' : 'none',
          collateralDescription: dbReport.report_info?.collateral_description,
          collateralValue: Number(dbReport.report_info?.collateral_value) || 0,
        },
        reporteeInformation: {
          fullName: dbReport.reportee_info?.name || '',
          phoneNumber: dbReport.reportee_info?.phone || '',
          email: dbReport.reportee_info?.email || '',
          nationalId: dbReport.reportee_info?.ktp_number || 
                     dbReport.reportee_info?.passport_number || 
                     dbReport.reportee_info?.driver_license_number || '',
          idType: dbReport.reportee_info?.id_type as any,
        },
        supportingDocuments: {
          documents: [],
          additionalNotes: dbReport.supporting_documents?.description || '',
        },
        createdAt: dbReport.created_at,
        updatedAt: dbReport.updated_at,
        submittedAt: dbReport.created_at,
      }));
      
      setReports(transformedReports);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const refreshReports = async () => {
    await loadReports();
  };

  return (
    <ReportsContext.Provider value={{ reports, isLoading, error, refreshReports }}>
      {children}
    </ReportsContext.Provider>
  );
};
