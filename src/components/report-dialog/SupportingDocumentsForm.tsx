
import React, { useCallback } from 'react';
import { Control, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface SupportingDocumentsFormProps {
  control: Control<ReportFormData>;
  setValue: (name: any, value: any) => void;
}

const SupportingDocumentsForm: React.FC<SupportingDocumentsFormProps> = ({ 
  control, 
  setValue 
}) => {
  const documents = useWatch({
    control,
    name: 'supportingDocuments.documents',
    defaultValue: []
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const updatedDocuments = [...documents, ...newFiles];
      setValue('supportingDocuments.documents', updatedDocuments);
    }
  }, [documents, setValue]);

  const removeDocument = useCallback((index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setValue('supportingDocuments.documents', updatedDocuments);
  }, [documents, setValue]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="supportingDocuments.documents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supporting Documents</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload loan documents, contracts, or other supporting files
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('document-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
                
                {documents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Documents:</p>
                    {documents.map((file: File, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB per file)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supportingDocuments.additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional information or context you'd like to provide"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide any additional context or details about your report
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SupportingDocumentsForm;
