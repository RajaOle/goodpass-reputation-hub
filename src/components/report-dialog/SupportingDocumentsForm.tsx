
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
import { Upload, X, FileText, Image, File, Check } from 'lucide-react';
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    }
    if (['pdf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
    <div className="space-y-6">
      <FormField
        control={control}
        name="supportingDocuments.documents"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel className="text-base font-medium text-gray-900">
              Supporting Documents
            </FormLabel>
            
            <FormControl>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        📎 Upload Your Documents
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Drag and drop files here, or click to browse
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
                        className="bg-white border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Document List */}
                {documents.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-4">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-base font-medium text-gray-900">
                        Uploaded Documents ({documents.length})
                      </span>
                    </div>
                    
                    {documents.map((file: File, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • Uploaded just now
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            
            <FormDescription className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              💡 <strong>Helpful documents:</strong> Loan agreements, ID cards, bank statements, payment receipts
              <br />
              📄 <strong>Accepted formats:</strong> PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB per file)
            </FormDescription>
            
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supportingDocuments.additionalNotes"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium text-gray-900">
              Additional Notes <span className="text-gray-500">(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional context, special circumstances, or details you'd like our team to know about this loan report..."
                rows={4}
                className="text-base border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-gray-500">
              Help us understand any unique aspects of this loan situation
            </FormDescription>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SupportingDocumentsForm;
