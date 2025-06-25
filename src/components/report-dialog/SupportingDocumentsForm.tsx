
import React, { useCallback } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, FileText } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface SupportingDocumentsFormProps {
  control: Control<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  isRestructure?: boolean;
}

const SupportingDocumentsForm: React.FC<SupportingDocumentsFormProps> = ({ 
  control, 
  setValue,
  isRestructure = false 
}) => {
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files && !isRestructure) {
      const currentFiles = control._formValues.supportingDocuments?.documents || [];
      const newFiles = Array.from(files);
      setValue('supportingDocuments.documents', [...currentFiles, ...newFiles]);
    }
  }, [control._formValues.supportingDocuments?.documents, setValue, isRestructure]);

  const removeFile = useCallback((index: number) => {
    if (!isRestructure) {
      const currentFiles = control._formValues.supportingDocuments?.documents || [];
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      setValue('supportingDocuments.documents', updatedFiles);
    }
  }, [control._formValues.supportingDocuments?.documents, setValue, isRestructure]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {isRestructure && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800 font-medium">
              Supporting documents are read-only during restructure. Original documents remain attached to the report.
            </p>
          </div>
        </div>
      )}

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supporting Documents</CardTitle>
          <p className="text-sm text-gray-600">
            {isRestructure 
              ? "These documents were originally submitted with the report:"
              : "Upload documents that support your loan report (contracts, agreements, receipts, etc.)"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isRestructure && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="document-upload"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop files here
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT (Max 10MB each)
                </p>
              </label>
            </div>
          )}

          {/* File List */}
          <div className="space-y-2">
            {control._formValues.supportingDocuments?.documents?.map((file, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  isRestructure ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </Badge>
                  {!isRestructure && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {control._formValues.supportingDocuments?.documents?.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                {isRestructure ? "No documents were attached to the original report" : "No documents uploaded yet"}
              </p>
            </div>
          )}

          {!isRestructure && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Recommended Documents:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Loan agreement or contract</li>
                <li>• Identity verification documents</li>
                <li>• Bank statements or financial records</li>
                <li>• Communication records (emails, messages)</li>
                <li>• Payment receipts or transaction history</li>
                <li>• Any other relevant supporting evidence</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="supportingDocuments.additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isRestructure ? "Original Notes" : "Additional Information (Optional)"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      isRestructure 
                        ? "These are the original notes from the report..."
                        : "Provide any additional context, details, or explanations that might be helpful..."
                    }
                    rows={4}
                    {...field}
                    readOnly={isRestructure}
                    className={isRestructure ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
                {!isRestructure && (
                  <p className="text-xs text-gray-500 mt-1">
                    Include timeline of events, communication attempts, or any special circumstances
                  </p>
                )}
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportingDocumentsForm;
