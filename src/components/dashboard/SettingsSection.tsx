import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User, Mail, Phone, BadgeCheck, FileUp, Copy } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useKyc } from '@/contexts/KycContext';
import { useAuth } from '@/contexts/AuthContext';
import { uploadKycDocument } from '@/lib/kycUtils';
import { supabase } from '@/integrations/supabase/client';
import { KycStatus } from '@/contexts/KycContext';

const SettingsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const { kycStatus, setKycStatus } = useKyc();
  const [kycType, setKycType] = useState<string>('');
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [clientId] = useState('goodpass_demo_client_id_123456');
  const [clientSecret, setClientSecret] = useState('sk_test_abcdef1234567890');
  const [idNumber, setIdNumber] = useState('');
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle radio selection
  const handleKycTypeChange = (value: string) => {
    setKycType(value);
    setKycStatus('pending' as KycStatus);
  };

  // Handle file upload
  const handleKycUpload = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setKycFile(file);
      setKycStatus('pending' as KycStatus);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) return;
      
      console.log('Fetching profile for user:', user.id);
      console.log('Current user object:', user);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Profile data:', data);
      console.log('Profile error:', error);
      
      if (!error && data) {
        setUserProfile(data);
      }
    }
    
    fetchUserProfile();
  }, [user?.id]);

  // Fetch the real KYC status from the database on mount and after upload
  useEffect(() => {
    async function fetchKycStatus() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('kyc_status')
        .eq('user_id', user.id)
        .single();
      if (!error && data && data.kyc_status) {
        setKycStatus(data.kyc_status as KycStatus);
      } else {
        setKycStatus('pending' as KycStatus);
      }
    }
    fetchKycStatus();
  }, [user?.id]);

  // Copy to clipboard
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleKycSubmit = async () => {
    // Debug logging to identify validation issues
    console.log('KYC Submit Debug:', {
      hasUser: !!user?.id,
      hasFile: !!kycFile,
      hasType: !!kycType,
      hasIdNumber: !!idNumber.trim(),
      userId: user?.id,
      fileName: kycFile?.name,
      documentType: kycType,
      idNumberLength: idNumber.trim().length
    });

    if (!user?.id || !kycFile || !kycType || !idNumber.trim()) {
      setUploadError('Please select a document type, upload a file, and enter the document number.');
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    const result = await uploadKycDocument({
      file: kycFile,
      documentType: kycType,
      documentNumber: idNumber.trim(),
      userId: user.id,
    });
    setIsUploading(false);
    if (result.success) {
      // Fetch the new status after upload
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('kyc_status')
        .eq('user_id', user.id)
        .single();
      if (!error && data && data.kyc_status) {
        setKycStatus(data.kyc_status as KycStatus);
      } else {
        setKycStatus('pending' as KycStatus);
      }
      setKycFile(null);
      setIdNumber('');
      setKycType('');
    } else {
      setUploadError(result.error || 'Upload failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                defaultValue={userProfile?.full_name?.split(' ')[0] || ''} 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                defaultValue={userProfile?.full_name?.split(' ').slice(1).join(' ') || ''} 
                className="mt-1" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user?.email || userProfile?.email || ''} 
                className="mt-1" 
                disabled 
              />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
              <BadgeCheck className="h-4 w-4" /> Verified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                defaultValue={user?.phone || userProfile?.phone || ''} 
                className="mt-1" 
                disabled 
              />
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold ${
              userProfile?.phone_verified 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              <BadgeCheck className="h-4 w-4" /> 
              {userProfile?.phone_verified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* KYC Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>KYC Verification</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              kycStatus === 'verified'
                ? 'bg-green-100 text-green-700'
                : kycStatus === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {kycStatus === 'verified' ? 'Verified' : kycStatus === 'pending' ? 'Pending' : 'Rejected'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>KYC Document Type</Label>
            <RadioGroup
              className="flex flex-row gap-6 mt-2"
              value={kycType}
              onValueChange={handleKycTypeChange}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="idCard" id="idCard" />
                <Label htmlFor="idCard" className="cursor-pointer">ID Card</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="driverLicense" id="driverLicense" />
                <Label htmlFor="driverLicense" className="cursor-pointer">Driver License</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="passport" id="passport" />
                <Label htmlFor="passport" className="cursor-pointer">Passport</Label>
              </div>
            </RadioGroup>
          </div>
          {kycType && (
            <div>
              <Label>Upload {kycType === 'idCard' ? 'ID Card' : kycType === 'driverLicense' ? 'Driver License' : 'Passport'}</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={isUploading}
                  onChange={handleKycUpload}
                />
                {kycFile && (
                  <span className="text-green-600 flex items-center gap-1 text-xs">
                    <FileUp className="h-4 w-4" /> {kycFile.name}
                  </span>
                )}
              </div>
              {/* ID Number Field */}
              <div className="mt-4">
                <Label htmlFor="idNumber">
                  {kycType === 'idCard' ? 'ID Number' : kycType === 'driverLicense' ? 'Driver License Number' : 'Passport Number'}
                </Label>
                <Input
                  id="idNumber"
                  type="text"
                  placeholder={kycType === 'idCard' ? 'Enter your ID number' : kycType === 'driverLicense' ? 'Enter your driver license number' : 'Enter your passport number'}
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  className="mt-1"
                  disabled={isUploading}
                />
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleKycSubmit}
                  disabled={isUploading || !kycFile || !idNumber.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? 'Uploading...' : 'Submit KYC Document'}
                </Button>
              </div>
              {uploadError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-sm font-medium">Upload Error</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                </div>
              )}
            </div>
          )}
          {kycStatus === 'verified' && (
            <div className="mt-2 text-green-700 font-semibold flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" /> KYC Verified!
            </div>
          )}
          {kycStatus === 'pending' && (
            <div className="mt-2 text-yellow-700 font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 animate-pulse" /> KYC Pending Verification...
            </div>
          )}
          {kycStatus === 'rejected' && (
            <div className="mt-2 text-red-700 font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" /> KYC Rejected
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>API Credentials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Client ID</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={clientId} readOnly className="font-mono" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleCopy(clientId)}
                title="Copy Client ID"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Client Secret</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={clientSecret} readOnly className="font-mono" type="password" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleCopy(clientSecret)}
                title="Copy Client Secret"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {/* Placeholder for regenerate button */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="ml-2"
                disabled
              >
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Keep your client secret safe. Do not share it publicly.</p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-600" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about your reports and account</p>
              </div>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-600" />
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-600">Get important alerts via text message</p>
              </div>
            </div>
            <Switch 
              checked={smsNotifications} 
              onCheckedChange={setSmsNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-600" />
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-600">Receive news and product updates</p>
              </div>
            </div>
            <Switch 
              checked={marketingEmails} 
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" className="mt-1" />
          </div>
          <div className="flex space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Update Password
            </Button>
            <Button variant="outline">
              Enable Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
            <p className="text-sm text-red-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
