
import React, { useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { ReportFormData } from '@/types/report';

interface SocialMediaSectionProps {
  control: Control<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
  isRestructure?: boolean;
  isAddInfo?: boolean;
  showSensitiveData?: boolean;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  control,
  setValue,
  isRestructure = false,
  isAddInfo = false,
  showSensitiveData = false
}) => {
  const [socialMediaInput, setSocialMediaInput] = useState('');
  const isEditable = !isRestructure;

  const addSocialMediaLink = () => {
    if (socialMediaInput.trim() && !isRestructure) {
      const currentLinks = control._formValues.reporteeInformation?.socialMediaLinks || [];
      setValue('reporteeInformation.socialMediaLinks', [...currentLinks, socialMediaInput.trim()]);
      setSocialMediaInput('');
    }
  };

  const removeSocialMediaLink = (index: number) => {
    if (!isRestructure) {
      const currentLinks = control._formValues.reporteeInformation?.socialMediaLinks || [];
      const updatedLinks = currentLinks.filter((_, i) => i !== index);
      setValue('reporteeInformation.socialMediaLinks', updatedLinks);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Social Media (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditable && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter social media profile URL"
              value={socialMediaInput}
              onChange={(e) => setSocialMediaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialMediaLink())}
              className={isAddInfo ? "border-green-200 bg-green-50" : ""}
            />
            <Button type="button" onClick={addSocialMediaLink} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Divider and colored box for previously registered links */}
        {control._formValues.reporteeInformation?.socialMediaLinks?.length > 0 && (
          <div className="my-2">
            <div className="text-xs font-semibold text-green-700 mb-1">Previously Registered</div>
            <div className="border-t border-green-200 mb-2" />
            <div className="flex flex-wrap gap-2 bg-green-50 p-2 rounded">
              {control._formValues.reporteeInformation.socialMediaLinks.map((link, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                  <span className={isRestructure && !showSensitiveData ? "blur-sm" : ""}>
                    {link}
                  </span>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => removeSocialMediaLink(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
