import { supabase } from '@/integrations/supabase/client';

export async function uploadSupportingDocuments(files: File[], description: string = '') {
  // Get the current session for the auth token
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('No active session. Please log in.');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file); // Edge Function should use formData.getAll('files')
  });
  formData.append('description', description);

  const { data, error } = await supabase.functions.invoke('upload-supporting-document', {
    body: formData,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error('Error uploading documents:', error);
    throw error;
  }

  return data;
} 