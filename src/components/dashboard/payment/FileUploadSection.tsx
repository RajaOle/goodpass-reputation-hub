
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Camera, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  proofDocuments: File[];
  onFilesChange: (files: File[]) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  proofDocuments,
  onFilesChange
}) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== files.length) {
      toast({
        title: "File Size Warning",
        description: "Some files were too large (max 10MB) and were not uploaded.",
        variant: "destructive"
      });
    }
    
    onFilesChange([...proofDocuments, ...validFiles]);
    
    // Clear the input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    onFilesChange(proofDocuments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-slate-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-gray-900">Upload Payment Proof</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Secure document upload</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
          <Input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload" className="cursor-pointer block">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload bank transfer receipts, payment confirmations, or other proof of payment
              </p>
              
              <Button variant="outline" type="button" className="mb-4">
                <Camera className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>JPG, PNG, PDF, DOC</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Max 10MB each</span>
              </div>
            </div>
          </Label>
        </div>

        {/* Uploaded Files */}
        {proofDocuments.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold text-gray-900">
                Uploaded Files ({proofDocuments.length})
              </Label>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                Ready to submit
              </div>
            </div>
            
            <div className="space-y-3">
              {proofDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Secure Upload</p>
              <p className="text-blue-700">
                Your documents are encrypted and securely stored. Only authorized personnel can access your payment proofs.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
