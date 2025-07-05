-- Create storage policies for kyc-document bucket to fix RLS upload issue

-- Policy to allow authenticated users to upload their own KYC documents
CREATE POLICY "Users can upload their own KYC documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'kyc-document' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to view their own KYC documents
CREATE POLICY "Users can view their own KYC documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'kyc-document' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to update their own KYC documents
CREATE POLICY "Users can update their own KYC documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'kyc-document' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to delete their own KYC documents
CREATE POLICY "Users can delete their own KYC documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'kyc-document' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);