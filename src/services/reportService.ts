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
    const repaymentTypeMap: Record<string, string> = {
      'single-payment': 'single',
      'installment': 'installment',
      'open-payment': 'open',
    };
    const repaymentType = repaymentTypeMap[formData.loanInformation.repaymentPlan];
    console.log('Repayment type being sent:', repaymentType);
    if (!repaymentType) {
      console.error('Invalid repayment plan value:', formData.loanInformation.repaymentPlan);
      return { success: false, error: 'Invalid repayment plan selected. Please choose a valid option.' };
    }
    const loanInfoPayload = {
      loan_name: formData.loanInformation.loanName,
      amount: formData.loanInformation.loanAmount,
      agreement_date: formData.loanInformation.agreementDate,
      disbursement_date: formData.loanInformation.disbursementDate,
      due_date: formData.loanInformation.dueDate || null,
      purpose: formData.loanInformation.loanPurpose,
      custom_loan_purpose: formData.loanInformation.customLoanPurpose || null,
      repayment_type: repaymentType,
      repayment_frequency: formData.loanInformation.installmentCount || null,
      interest_rate: formData.loanInformation.applicationInterest,
      late_fee_rate: formData.loanInformation.applicationLateFee,
      collateral: formData.loanInformation.collateral !== 'none',
      collateral_description: formData.loanInformation.collateralDescription || null,
      collateral_value: formData.loanInformation.collateralValue || null,
    };
    console.log('Loan info payload:', loanInfoPayload);
    const { data: loanInfo, error: loanError } = await supabase
      .from('report_info')
      .insert(loanInfoPayload)
      .select()
      .single();

    if (loanError) {
      console.error('Loan info error:', loanError);
      return { success: false, error: 'Failed to save loan information' };
    }

    // Step 2: Upload identification file to Supabase Storage if present
    let nationalIdPictureUrl = null;
    let passportPictureUrl = null;
    let driverLicensePictureUrl = null;
    if (formData.reporteeInformation.idPicture && formData.reporteeInformation.idType) {
      const file = formData.reporteeInformation.idPicture;
      const idType = formData.reporteeInformation.idType;
      // Generate a unique file path: userId/idType-timestamp-filename
      const filePath = `${user.id}/${idType}-${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reportee-documents')
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error('Failed to upload identification file:', uploadError);
        // Optionally handle error (e.g., return or continue)
      } else {
        // File uploaded, get the private URL (path)
        const fileUrl = filePath;
        if (idType === 'national-id') nationalIdPictureUrl = fileUrl;
        if (idType === 'passport') passportPictureUrl = fileUrl;
        if (idType === 'driver-license') driverLicensePictureUrl = fileUrl;
      }
    }

    // Step 3: Insert reportee information (now Step 3, after file upload)
    const idTypeMap: Record<string, string> = {
      'passport': 'passport',
      'national-id': 'national_id',
      'driver-license': 'driver_license',
    };
    const idType = idTypeMap[formData.reporteeInformation.idType] || null;
    const nationalId = idType === 'national_id' ? formData.reporteeInformation.nationalId : null;
    const passportNumber = idType === 'passport' ? formData.reporteeInformation.nationalId : null;
    const driverLicenseNumber = idType === 'driver_license' ? formData.reporteeInformation.nationalId : null;
    const reporteePayload = {
      name: formData.reporteeInformation.fullName,
      phone: formData.reporteeInformation.phoneNumber,
      email: formData.reporteeInformation.email || null,
      id_type: idType,
      ktp_number: nationalId,
      passport_number: passportNumber,
      driver_license_number: driverLicenseNumber,
      national_id_picture_url: nationalIdPictureUrl,
      passport_picture_url: passportPictureUrl,
      driver_license_picture_url: driverLicensePictureUrl,
    };
    console.log('Reportee info payload:', reporteePayload);
    const { data: reporteeInfo, error: reporteeError } = await supabase
      .from('reportee_info')
      .insert(reporteePayload)
      .select()
      .single();

    if (reporteeError) {
      console.error('Reportee info error (full):', reporteeError);
      console.error('Reportee info error:', reporteeError);
      return { success: false, error: 'Failed to save reportee information' };
    }

    // Insert bank account info if provided
    if (formData.reporteeInformation.bankName && formData.reporteeInformation.bankAccountNumber) {
      const { data: bankAccount, error: bankError } = await supabase
        .from('reportee_bank_accounts')
        .insert({
          reportee_info_id: reporteeInfo.id,
          bank_name: formData.reporteeInformation.bankName,
          account_number: formData.reporteeInformation.bankAccountNumber,
          // Add other fields if you collect them
        })
        .select()
        .single();
      if (bankError) {
        console.error('Bank account insert error:', bankError);
        // Optionally handle error
      }
    }

    // Insert social profiles if provided
    if (formData.reporteeInformation.socialMediaLinks && formData.reporteeInformation.socialMediaLinks.length > 0) {
      const socialProfiles = formData.reporteeInformation.socialMediaLinks.map(link => ({
        reportee_info_id: reporteeInfo.id,
        profile_url: link,
        // Add platform, username, display_name, notes if you collect them
      }));
      const { data: socialData, error: socialError } = await supabase
        .from('reportee_social_profiles')
        .insert(socialProfiles);
      if (socialError) {
        console.error('Social profile insert error:', socialError);
        // Optionally handle error
      }
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
    const progressStatus = 'under_review'; // Always use underscore for DB
    console.log('Progress status being sent:', progressStatus);
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        loan_info_id: loanInfo.id,
        reportee_info_id: reporteeInfo.id,
        supporting_document_id: supportingDocumentId,
        progress_status: progressStatus,
        verification_status: 'not_verified',
        reporter_verification_status: 'not_verified',
        reportee_verification_status: 'not_verified',
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