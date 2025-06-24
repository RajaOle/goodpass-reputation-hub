
import React from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, User, Phone, Mail, IdCard, Globe, Upload, Banknote } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReportFormData } from '@/types/report';
import CountryCodeSelector from '@/components/CountryCodeSelector';

interface ReporteeInformationFormProps {
  control: Control<ReportFormData>;
  setValue: UseFormSetValue<ReportFormData>;
}

const banks = [
  'Bank Central Asia (BCA)',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank Mandiri',
  'Bank Tabungan Negara (BTN)',
  'Bank Danamon',
  'Bank CIMB Niaga',
  'Bank Permata',
  'Bank Maybank Indonesia',
  'Bank OCBC NISP',
  'Other'
];

const ReporteeInformationForm: React.FC<ReporteeInformationFormProps> = ({ control, setValue }) => {
  const [socialLinks, setSocialLinks] = React.useState<string[]>(['']);
  const [countryCode, setCountryCode] = React.useState('+62');
  
  // State for toggling optional sections
  const [showEmail, setShowEmail] = React.useState(false);
  const [showIdInfo, setShowIdInfo] = React.useState(false);
  const [showBankInfo, setShowBankInfo] = React.useState(false);
  const [showSocialMedia, setShowSocialMedia] = React.useState(false);

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const handleIdPictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('reporteeInformation.idPicture', file);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="reporteeInformation.fullName"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>Full Name</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter the reportee's full legal name"
                className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="reporteeInformation.phoneNumber"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span>Phone Number</span>
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="flex">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className="h-12 text-base border-2 border-l-0 border-gray-200 focus:border-blue-500 transition-colors rounded-l-none"
                  value={field.value?.replace(/^\+\d+\s?/, '') || ''}
                  onChange={(e) => {
                    const phoneWithoutCode = e.target.value;
                    const fullPhone = `${countryCode} ${phoneWithoutCode}`;
                    field.onChange(fullPhone);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription className="text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
              📱 <strong>Important:</strong> Phone numbers must be unique in our system for accurate credit tracking
            </FormDescription>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />

      {/* Optional sections toggles */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Add Additional Information (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-email"
              checked={showEmail}
              onCheckedChange={(checked) => setShowEmail(checked as boolean)}
            />
            <label htmlFor="show-email" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-1">
              <Mail className="h-4 w-4 text-purple-600" />
              <span>Email Address</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-id"
              checked={showIdInfo}
              onCheckedChange={(checked) => setShowIdInfo(checked as boolean)}
            />
            <label htmlFor="show-id" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-1">
              <IdCard className="h-4 w-4 text-orange-600" />
              <span>ID Information</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-bank"
              checked={showBankInfo}
              onCheckedChange={(checked) => setShowBankInfo(checked as boolean)}
            />
            <label htmlFor="show-bank" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-1">
              <Banknote className="h-4 w-4 text-green-600" />
              <span>Bank Account</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-social"
              checked={showSocialMedia}
              onCheckedChange={(checked) => setShowSocialMedia(checked as boolean)}
            />
            <label htmlFor="show-social" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center space-x-1">
              <Globe className="h-4 w-4 text-indigo-600" />
              <span>Social Media</span>
            </label>
          </div>
        </div>
      </div>

      {/* Email section */}
      {showEmail && (
        <FormField
          control={control}
          name="reporteeInformation.email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-600" />
                <span>Email Address</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="reportee@example.com"
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      )}

      {/* ID Information section */}
      {showIdInfo && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
            <IdCard className="h-4 w-4 text-orange-600" />
            <span>ID Information</span>
          </FormLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="reporteeInformation.idType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    ID Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="national-id">National ID / KTP</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driver-license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="reporteeInformation.nationalId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    ID Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 1234567890123456"
                      className="h-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm">
                    For verification purposes only
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="reporteeInformation.idPicture"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <span>ID Picture</span>
                </FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdPictureUpload}
                      className="hidden"
                      id="id-picture-upload"
                    />
                    <label
                      htmlFor="id-picture-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {field.value ? field.value.name : 'Click to upload ID picture'}
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Bank Account Information Section */}
      {showBankInfo && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
            <Banknote className="h-4 w-4 text-green-600" />
            <span>Bank Account Information</span>
          </FormLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="reporteeInformation.bankName"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Bank Name
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Choose bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border shadow-lg z-50 max-h-48 overflow-y-auto">
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="reporteeInformation.bankAccountNumber"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Account Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter account number"
                      className="h-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          
          <FormDescription className="text-gray-500 text-sm">
            💡 Bank account information helps with identity verification and payment processing
          </FormDescription>
        </div>
      )}

      {/* Social Media section */}
      {showSocialMedia && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <FormLabel className="text-base font-medium text-gray-900 flex items-center space-x-2">
            <Globe className="h-4 w-4 text-indigo-600" />
            <span>Social Media Links</span>
          </FormLabel>
          
          <p className="text-sm text-gray-600 mb-4">
            💡 Social media profiles can help verify identity and improve credit assessment
          </p>
          
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-3 mb-3">
              <Input
                placeholder="https://facebook.com/username or @twitter_handle"
                value={link}
                onChange={(e) => updateSocialLink(index, e.target.value)}
                className="flex-1 h-10 border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
              {socialLinks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSocialLink}
            className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Social Link</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReporteeInformationForm;
