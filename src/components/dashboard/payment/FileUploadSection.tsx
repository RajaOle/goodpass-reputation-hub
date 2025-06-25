
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from 'lucide-react';
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
  };

  const removeFile = (index: number) => {
    onFilesChange(proofDocuments.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Payment Proof</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-4">
              Upload bank transfer receipts, payment confirmations, or other proof of payment
            </p>
            <Input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" type="button">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </Label>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)
            </p>
          </div>

          {proofDocuments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Uploaded Files ({proofDocuments.length})
              </Label>
              {proofDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
