import { supabase } from '@/integrations/supabase/client';
import { ReportFormData } from '@/types/report';

export interface SubmitReportResponse {
  success: boolean;
  reportId?: number;
  error?: string;
}

export const submitReport = async (formData: ReportFormData): Promise<SubmitReportResponse> => {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Step 1: Insert loan information
    const { data: loanInfo, error: loanError } = await supabase
      .from('report_info')
      .insert({
        loan_name: formData.loanInformation.loanName,
        amount: formData.loanInformation.loanAmount,
        agreement_date: formData.loanInformation.agreementDate,
        disbursement_date: formData.loanInformation.disbursementDate,
        due_date: formData.loanInformation.dueDate || null,
        purpose: formData.loanInformation.loanPurpose,
        custom_loan_purpose: formData.loanInformation.customLoanPurpose || null,
        repayment_type: formData.loanInformation.repaymentPlan,
        repayment_frequency: formData.loanInformation.installmentCount || null,
        interest_rate: formData.loanInformation.applicationInterest,
        late_fee_rate: formData.loanInformation.applicationLateFee,
        collateral: formData.loanInformation.collateral !== 'none',
        collateral_description: formData.loanInformation.collateralDescription || null,
        collateral_value: formData.loanInformation.collateralValue || null,
      })
      .select()
      .single();

    if (loanError) {
      console.error('Loan info error:', loanError);
      return { success: false, error: 'Failed to save loan information' };
    }

    // Step 2: Insert reportee information
    const { data: reporteeInfo, error: reporteeError } = await supabase
      .from('reportee_info')
      .insert({
        name: formData.reporteeInformation.fullName,
        phone: formData.reporteeInformation.phoneNumber,
        email: formData.reporteeInformation.email || null,
        id_type: formData.reporteeInformation.idType || null,
        ktp_number: formData.reporteeInformation.idType === 'national-id' ? formData.reporteeInformation.nationalId : null,
        passport_number: formData.reporteeInformation.idType === 'passport' ? formData.reporteeInformation.nationalId : null,
        driver_license_number: formData.reporteeInformation.idType === 'driver-license' ? formData.reporteeInformation.nationalId : null,
      })
      .select()
      .single();

    if (reporteeError) {
      console.error('Reportee info error:', reporteeError);
      return { success: false, error: 'Failed to save reportee information' };
    }

    // Step 3: Handle supporting documents (simplified for now)
    let supportingDocumentId = null;
    if (formData.supportingDocuments.documents.length > 0 || formData.supportingDocuments.additionalNotes) {
      const { data: docData, error: docError } = await supabase
        .from('supporting_documents')
        .insert({
          description: formData.supportingDocuments.additionalNotes || 'Supporting documents',
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (docError) {
        console.error('Documents error:', docError);
        return { success: false, error: 'Failed to save supporting documents' };
      }
      supportingDocumentId = docData.id;
    }

    // Step 4: Create the main report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        loan_info_id: loanInfo.id,
        reportee_info_id: reporteeInfo.id,
        supporting_document_id: supportingDocumentId,
        progress_status: 'under_review',
        verification_status: 'not-verified',
        reporter_verification_status: 'not-verified',
        reportee_verification_status: 'not-verified',
      })
      .select()
      .single();

    if (reportError) {
      console.error('Report error:', reportError);
      return { success: false, error: 'Failed to create report' };
    }

    return { success: true, reportId: report.id };
  } catch (error) {
    console.error('Submit report error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const fetchUserReports = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        report_code,
        progress_status,
        verification_status,
        created_at,
        updated_at,
        report_info:loan_info_id (
          loan_name,
          amount,
          agreement_date,
          disbursement_date,
          due_date,
          purpose,
          custom_loan_purpose,
          repayment_type,
          repayment_frequency,
          interest_rate,
          late_fee_rate,
          collateral,
          collateral_description,
          collateral_value
        ),
        reportee_info:reportee_info_id (
          name,
          phone,
          email,
          id_type,
          ktp_number,
          passport_number,
          driver_license_number
        ),
        supporting_documents:supporting_document_id (
          description,
          file_url
        )
      `)
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch reports error:', error);
      throw new Error('Failed to fetch reports');
    }

    return data || [];
  } catch (error) {
    console.error('Fetch user reports error:', error);
    throw error;
  }
};