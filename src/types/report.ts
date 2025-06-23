
export interface LoanInformation {
  loanType: 'personal' | 'business' | 'mortgage' | 'auto' | 'student' | 'other';
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  loanPurpose: string;
  collateral?: string;
}

export interface ReporteeInformation {
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  website?: string;
}

export interface SupportingDocuments {
  documents: File[];
  additionalNotes?: string;
}

export interface ReportFormData {
  loanInformation: LoanInformation;
  reporteeInformation: ReporteeInformation;
  supportingDocuments: SupportingDocuments;
}
