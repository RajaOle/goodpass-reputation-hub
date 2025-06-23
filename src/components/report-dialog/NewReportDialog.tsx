import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ReportFormData } from '@/types/report';
import LoanInformationForm from './LoanInformationForm';
import ReporteeInformationForm from './ReporteeInformationForm';
import SupportingDocumentsForm from './SupportingDocumentsForm';

const reportSchema = z.object({
  loanInformation: z.object({
    loanType: z.enum(['personal', 'business', 'mortgage', 'auto', 'student', 'other']),
    loanAmount: z.number().min(1, 'Loan amount must be greater than 0'),
    interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100, 'Interest rate cannot exceed 100%'),
    loanTerm: z.number().min(1, 'Loan term must be at least 1 month'),
    monthlyPayment: z.number().min(0, 'Monthly payment cannot be negative'),
    loanPurpose: z.string().min(10, 'Please provide a detailed loan purpose (at least 10 characters)'),
    collateral: z.string().optional(),
  }),
  reporteeInformation: z.object({
    type: z.enum(['personal', 'business']),
    personalInfo: z.object({
      firstName: z.string().min(2, 'First name must be at least 2 characters'),
      lastName: z.string().min(2, 'Last name must be at least 2 characters'),
      phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
      email: z.string().email('Please enter a valid email address'),
      address: z.string().min(10, 'Please provide a complete address'),
    }).optional(),
    businessInfo: z.object({
      companyName: z.string().min(2, 'Company name must be at least 2 characters'),
      contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
      phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
      email: z.string().email('Please enter a valid email address'),
      address: z.string().min(10, 'Please provide a complete address'),
      website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    }).optional(),
  }).refine((data) => {
    if (data.type === 'personal') {
      return data.personalInfo && Object.values(data.personalInfo).every(val => val && val.trim() !== '');
    }
    if (data.type === 'business') {
      return data.businessInfo && data.businessInfo.companyName && data.businessInfo.contactPerson && 
             data.businessInfo.phoneNumber && data.businessInfo.email && data.businessInfo.address;
    }
    return false;
  }, {
    message: 'Please fill in all required fields for the selected reportee type',
  }),
  supportingDocuments: z.object({
    documents: z.array(z.instanceof(File)),
    additionalNotes: z.string().optional(),
  }),
});

interface NewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewReportDialog: React.FC<NewReportDialogProps> = ({ open, onOpenChange }) => {
  const [currentTab, setCurrentTab] = useState('loan');
  const { toast } = useToast();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      loanInformation: {
        loanType: 'personal',
        loanAmount: 0,
        interestRate: 0,
        loanTerm: 0,
        monthlyPayment: 0,
        loanPurpose: '',
        collateral: '',
      },
      reporteeInformation: {
        type: 'personal',
        personalInfo: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          address: '',
        },
        businessInfo: {
          companyName: '',
          contactPerson: '',
          phoneNumber: '',
          email: '',
          address: '',
          website: '',
        },
      },
      supportingDocuments: {
        documents: [],
        additionalNotes: '',
      },
    },
  });

  const getTabProgress = () => {
    switch (currentTab) {
      case 'loan':
        return 33;
      case 'reportee':
        return 66;
      case 'documents':
        return 100;
      default:
        return 33;
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      console.log('Submitting report:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report Submitted",
        description: "Your report has been submitted successfully and is under review.",
      });
      
      form.reset();
      setCurrentTab('loan');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ReportFormData)[] = [];
    
    switch (currentTab) {
      case 'loan':
        fieldsToValidate = ['loanInformation'];
        break;
      case 'reportee':
        fieldsToValidate = ['reporteeInformation'];
        break;
      case 'documents':
        fieldsToValidate = ['supportingDocuments'];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      switch (currentTab) {
        case 'loan':
          setCurrentTab('reportee');
          break;
        case 'reportee':
          setCurrentTab('documents');
          break;
      }
    }
  };

  const handlePrevious = () => {
    switch (currentTab) {
      case 'reportee':
        setCurrentTab('loan');
        break;
      case 'documents':
        setCurrentTab('reportee');
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
          <DialogDescription>
            Fill out the form below to submit a new report. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{getTabProgress()}%</span>
            </div>
            <Progress value={getTabProgress()} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="loan">Loan Information</TabsTrigger>
                  <TabsTrigger value="reportee">Reportee Information</TabsTrigger>
                  <TabsTrigger value="documents">Supporting Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="loan" className="space-y-4">
                  <LoanInformationForm control={form.control} />
                </TabsContent>

                <TabsContent value="reportee" className="space-y-4">
                  <ReporteeInformationForm control={form.control} />
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <SupportingDocumentsForm 
                    control={form.control} 
                    setValue={form.setValue}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex justify-between">
                <div className="flex space-x-2">
                  {currentTab !== 'loan' && (
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  
                  {currentTab !== 'documents' ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Submit Report
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewReportDialog;
