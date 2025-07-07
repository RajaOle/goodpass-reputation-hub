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
import { Upload, File, X, FileText, Info } from 'lucide-react';
import { ReportFormData } from '@/types/report';
import { toast } from '@/hooks/use-toast';

interface SupportingDocumentsFormProps {
  control: Control<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

const SupportingDocumentsForm: React.FC<SupportingDocumentsFormProps> = ({ 
  control, 
  setValue,
  isRestructure = false,
  isAddInfo = false
}) => {
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files && !isRestructure) {
      const currentFiles = control._formValues.supportingDocuments?.documents || [];
      const newFiles = Array.from(files);

      // Filter and warn for unsupported types
      const validFiles = [];
      const invalidFiles = [];
      for (const file of newFiles) {
        if (ALLOWED_TYPES.includes(file.type)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      }
      if (invalidFiles.length > 0) {
        toast({
          title: "Unsupported file type",
          description: `These files are not allowed: ${invalidFiles.join(', ')}`,
          variant: "destructive",
        });
      }
      setValue('supportingDocuments.documents', [...currentFiles, ...validFiles]);
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

  const isEditable = !isRestructure;

  return (
    <div className="space-y-6">
      {isAddInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">
              📎 You can add new documents or update notes to provide additional information for this report.
            </p>
          </div>
        </div>
      )}

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
              : isAddInfo
              ? "Add new documents or view existing ones to support your report:"
              : "Upload documents that support your loan report (contracts, agreements, receipts, etc.)"
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditable && (
            <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
              isAddInfo ? "border-green-300 bg-green-50 hover:border-green-400" : "border-gray-300"
            }`}>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="document-upload"
              />
              <label htmlFor="document-upload" className="cursor-pointer">
                <Upload className={`h-8 w-8 mx-auto mb-2 ${isAddInfo ? "text-green-500" : "text-gray-400"}`} />
                <p className={`text-sm mb-1 ${isAddInfo ? "text-green-700" : "text-gray-600"}`}>
                  Click to upload or drag and drop files here
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: PDF, JPG, JPEG, PNG (Max 10MB each)
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
                  isRestructure ? 'bg-gray-50 border-gray-200' : 
                  isAddInfo ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <File className={`h-5 w-5 ${isAddInfo ? "text-green-500" : "text-blue-500"}`} />
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
                  {isEditable && (
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

          {isEditable && (
            <div className={`border rounded-lg p-4 ${
              isAddInfo ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
            }`}>
              <h4 className={`text-sm font-medium mb-2 ${
                isAddInfo ? "text-green-900" : "text-blue-900"
              }`}>
                {isAddInfo ? "Suggested Additional Documents:" : "Recommended Documents:"}
              </h4>
              <ul className={`text-xs space-y-1 ${
                isAddInfo ? "text-green-800" : "text-blue-800"
              }`}>
                {isAddInfo ? (
                  <>
                    <li>• Updated financial statements or bank records</li>
                    <li>• Recent communication with the reportee</li>
                    <li>• Payment receipts or transaction evidence</li>
                    <li>• Any new agreements or modifications</li>
                    <li>• Additional contact information or references</li>
                    <li>• Updated identification or verification documents</li>
                  </>
                ) : (
                  <>
                    <li>• Loan agreement or contract</li>
                    <li>• Identity verification documents</li>
                    <li>• Bank statements or financial records</li>
                    <li>• Communication records (emails, messages)</li>
                    <li>• Payment receipts or transaction history</li>
                    <li>• Any other relevant supporting evidence</li>
                  </>
                )}
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
                  {isRestructure ? "Original Notes" : isAddInfo ? "Additional Information & Updates" : "Additional Information (Optional)"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      isRestructure 
                        ? "These are the original notes from the report..."
                        : isAddInfo
                        ? "Add new information, updates, or changes since the original report was submitted..."
                        : "Provide any additional context, details, or explanations that might be helpful..."
                    }
                    rows={4}
                    {...field}
                    readOnly={isRestructure}
                    className={isRestructure ? "bg-gray-100" : isAddInfo ? "border-green-200 bg-green-50" : ""}
                  />
                </FormControl>
                <FormMessage />
                {isEditable && (
                  <p className="text-xs text-gray-500 mt-1">
                    {isAddInfo 
                      ? "Describe any new developments, changed circumstances, or additional details that weren't in the original report"
                      : "Include timeline of events, communication attempts, or any special circumstances"
                    }
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
