import { supabase } from '@/integrations/supabase/client';

export async function uploadKycDocument({
  file,
  documentType,
  documentNumber,
  userId
}: {
  file: File;
  documentType: string;
  documentNumber: string;
  userId: string;
}) {
  // 1. Upload file to Supabase Storage
  const ext = file.name.split('.').pop();
  const filePath = `${userId}/${documentType}/${Date.now()}.${ext}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('kyc-document')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // 2. Get public URL
  const { data: urlData } = supabase.storage.from('kyc-document').getPublicUrl(filePath);
  const fileUrl = urlData.publicUrl;

  // 3. Save metadata to kyc_verifications
  const kycData = {
    documentType,
    documentNumber,
    fileUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadedAt: new Date().toISOString()
  };
  const { error: dbError } = await supabase
    .from('kyc_verifications')
    .upsert({
      user_id: userId,
      kyc_data: kycData,
      kyc_status: 'pending',
      created_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  if (dbError) {
    return { success: false, error: dbError.message };
  }
  return { success: true, fileUrl };
} 