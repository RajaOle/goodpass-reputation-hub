import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle, Search, User, CreditCard, Clock, X } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useKyc } from '@/contexts/KycContext';

// Mock data for demonstration
const MOCK_RECORDS = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    phone: '+1234567890',
    email: 'alice@example.com',
    nationalId: 'A1234567',
    driverLicense: 'D9876543',
    passport: 'P1234567',
    socialMedia: '@alicejohnson',
    bankAccount: '123-456-789',
    loans: [
      {
        loanId: 'L001',
        lender: 'Bob Smith',
        amount: 500,
        currency: 'USD',
        agreementDate: '2024-04-01',
        dueDate: '2024-05-01',
        status: 'repaid',
        repaidDate: '2024-04-28',
      },
      {
        loanId: 'L002',
        lender: 'Carol Lee',
        amount: 300,
        currency: 'USD',
        agreementDate: '2024-02-10',
        dueDate: '2024-03-10',
        status: 'late',
        repaidDate: '2024-03-20',
      },
    ],
  },
  {
    id: '2',
    fullName: 'David Kim',
    phone: '+1987654321',
    email: 'david.kim@example.com',
    nationalId: 'B7654321',
    driverLicense: 'D1234567',
    passport: 'P7654321',
    socialMedia: '@davidkim',
    bankAccount: '987-654-321',
    loans: [
      {
        loanId: 'L003',
        lender: 'Eve Adams',
        amount: 1000,
        currency: 'USD',
        agreementDate: '2024-01-15',
        dueDate: '2024-02-15',
        status: 'outstanding',
        repaidDate: null,
      },
    ],
  },
];

const ADDITIONAL_TERMS = (
  <div className="space-y-4 text-gray-700 text-sm max-h-72 overflow-y-auto pr-2">
    <p>
      <strong>Additional Terms of Use</strong><br />
      <span className="text-xs text-gray-500">Last Modified 26 October 2021</span>
    </p>
    <p>
      Credit report Inquiry is provided by Goodpass Pte. Ltd ("Goodpass") as part of a community-based character building report for any individual or companies who do not have a credit track record on any financial institutions. Goodpass provided this service on an as-is basis. Goodpass Pte. Ltd ("Goodpass") will try to verify the validity of the report to the best of its ability, however, the accuracy and the quality of the report lies on the details given by the community reporter.
    </p>
    <p>
      As an Individual or Company who requested the Credit Inquiry, you understand that the information given on the Credit Report may contain very sensitive and confidential information, hence you are solely responsible to keep the information strictly confidential to you, and for the use of credit report character assessment only.
    </p>
    <p>After inquiring about the information, you may not:</p>
    <ol className="list-decimal list-inside space-y-2 ml-4">
      <li>
        Make a copy, make a screenshot, take a picture, alter, modify, or any other duplication activities, other than the information that Goodpass Pte. Ltd ("Goodpass") has provided to you.
      </li>
      <li>
        You may not share, make it public, or tell information about the individuals/companies to other parties, other than for yourself.
      </li>
    </ol>
    <p>
      Failure to comply with the rules. 2, could risk yourself being subject to criminal prosecution under the UU ITE, or Confidential Information Act.
    </p>
    <p>
      Goodpass Pte. Ltd ("Goodpass") will not be responsible for any misuse of information provided to you by the use of this Credit Report Inquiry feature.
    </p>
    <p>
      You have read, understood and agreed to comply with{' '}
      <a href="https://goodpass.id/about-us/terms-of-use/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
        https://goodpass.id/about-us/terms-of-use/
      </a>{' '}
      in this Credit Report Request feature.
    </p>
  </div>
);

const INITIAL_CREDITS = 50;

// PDF styles
const pdfStyles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  subheading: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  label: { fontWeight: 'bold' },
  loanCard: { marginBottom: 10, padding: 8, border: '1px solid #eee', borderRadius: 4 },
});

// PDF Document component
const RecordPDF = ({ record }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.heading}>Goodpass Record for {record.fullName}</Text>
        <Text><Text style={pdfStyles.label}>Email:</Text> {record.email}</Text>
        <Text><Text style={pdfStyles.label}>Phone:</Text> {record.phone}</Text>
        <Text><Text style={pdfStyles.label}>National ID:</Text> {record.nationalId}</Text>
        <Text><Text style={pdfStyles.label}>Driver License:</Text> {record.driverLicense}</Text>
        <Text><Text style={pdfStyles.label}>Passport:</Text> {record.passport}</Text>
        <Text><Text style={pdfStyles.label}>Social Media:</Text> {record.socialMedia}</Text>
        <Text><Text style={pdfStyles.label}>Bank Account:</Text> {record.bankAccount}</Text>
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subheading}>Loan & Repayment History</Text>
        {record.loans.map((loan, idx) => (
          <View key={loan.loanId} style={pdfStyles.loanCard}>
            <Text>Loan #{idx + 1}</Text>
            <Text>Lender: {loan.lender}</Text>
            <Text>Amount: {loan.amount} {loan.currency}</Text>
            <Text>Agreement: {loan.agreementDate} | Due: {loan.dueDate}</Text>
            <Text>Status: {loan.status}</Text>
            {loan.repaidDate && <Text>Repaid: {loan.repaidDate}</Text>}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const SearchRecordsSection = () => {
  const { kycStatus } = useKyc();
  const [search, setSearch] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  if (kycStatus !== 'done') {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">KYC Required</h2>
        <p className="text-yellow-700 mb-4">You must complete KYC verification in your account settings before you can search records.</p>
      </div>
    );
  }

  // Filter recommendations as user types
  const recommendations =
    search.length > 1
      ? MOCK_RECORDS.filter((rec) => {
          const q = search.toLowerCase();
          return (
            rec.fullName.toLowerCase().includes(q) ||
            rec.phone.includes(q) ||
            rec.email.toLowerCase().includes(q) ||
            rec.nationalId.toLowerCase().includes(q) ||
            rec.driverLicense.toLowerCase().includes(q) ||
            rec.passport.toLowerCase().includes(q) ||
            rec.socialMedia.toLowerCase().includes(q) ||
            rec.bankAccount.includes(q)
          );
        })
      : [];

  // When user clicks a recommendation
  const handleRecommendationClick = (rec) => {
    setSelectedRecord(rec);
    setShowTerms(true);
    setAgreed(false);
    setShowResults(false);
    setError('');
  };

  // Confirm terms and deduct credits
  const handleConfirm = () => {
    if (credits < 10) {
      setError('Insufficient credits. Please purchase more to view records.');
      return;
    }
    setCredits((c) => c - 10);
    setShowResults(true);
    setShowTerms(false);
    setError('');
  };

  // UI for a single record's loan history
  const renderLoanHistory = (record) => (
    <div className="space-y-4">
      {record.loans.map((loan) => (
        <Card key={loan.loanId} className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Loan from {loan.lender}</span>
              </div>
              <div className="text-gray-700 text-sm">
                Amount: <span className="font-medium">{loan.amount} {loan.currency}</span>
              </div>
              <div className="text-gray-700 text-sm">
                Agreement: {loan.agreementDate} | Due: {loan.dueDate}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                {loan.status === 'repaid' && (
                  <span className="flex items-center text-green-600 font-medium"><CheckCircle className="h-4 w-4 mr-1" /> Repaid</span>
                )}
                {loan.status === 'late' && (
                  <span className="flex items-center text-yellow-600 font-medium"><Clock className="h-4 w-4 mr-1" /> Late Repaid</span>
                )}
                {loan.status === 'outstanding' && (
                  <span className="flex items-center text-red-600 font-medium"><X className="h-4 w-4 mr-1" /> Outstanding</span>
                )}
              </div>
              {loan.repaidDate && (
                <div className="text-xs text-gray-500">Repaid: {loan.repaidDate}</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Goodpass Search</h1>
        <p className="text-gray-600 text-center max-w-lg mb-4">Search for people's financial record by email/phone/ID/social media/bank account. Results are community based</p>
        <div className="w-full relative">
          <Input
            className="pl-10 pr-4 py-3 text-lg rounded-full shadow focus:ring-2 focus:ring-blue-500"
            placeholder="Type a name, phone, email, or any ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {recommendations.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {recommendations.map((rec) => (
                <button
                  key={rec.id}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-100 transition flex items-center gap-3"
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <User className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{rec.fullName}</span>
                  <span className="text-xs text-gray-500">{rec.email} | {rec.phone}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">Credits: <span className="font-semibold text-blue-600">{credits}</span></div>
      </div>

      {/* Terms of Use Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-lg">
          <h2 className="text-xl font-bold mb-2">Additional Terms of Use</h2>
          {ADDITIONAL_TERMS}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-gray-700">I agree and wish to proceed (10 credits will be deducted)</label>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTerms(false)}>Cancel</Button>
            <Button disabled={!agreed} onClick={handleConfirm}>Proceed</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Section */}
      {showResults && selectedRecord && (
        <div className="mt-8">
          <Card className="mb-6 border-blue-500 border-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-6 w-6 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900">{selectedRecord.fullName}</span>
                  </div>
                  <div className="text-gray-700 text-sm mb-1">Email: {selectedRecord.email}</div>
                  <div className="text-gray-700 text-sm mb-1">Phone: {selectedRecord.phone}</div>
                  <div className="text-gray-700 text-sm mb-1">National ID: {selectedRecord.nationalId}</div>
                  <div className="text-gray-700 text-sm mb-1">Driver License: {selectedRecord.driverLicense}</div>
                  <div className="text-gray-700 text-sm mb-1">Passport: {selectedRecord.passport}</div>
                  <div className="text-gray-700 text-sm mb-1">Social Media: {selectedRecord.socialMedia}</div>
                  <div className="text-gray-700 text-sm mb-1">Bank Account: {selectedRecord.bankAccount}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-blue-600 font-bold text-lg">Credit Worthiness</div>
                  <div className="text-gray-700 text-sm">(Summary coming soon)</div>
                  <PDFDownloadLink
                    document={<RecordPDF record={selectedRecord} />}
                    fileName={`${selectedRecord.fullName}-goodpass-record.pdf`}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <Button variant="outline" disabled={loading}>
                        {loading ? 'Preparing PDF...' : 'Download as PDF'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            </CardContent>
          </Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Loan & Repayment History</h3>
          {renderLoanHistory(selectedRecord)}
        </div>
      )}

      {/* No results found */}
      {search.length > 1 && recommendations.length === 0 && !showResults && (
        <div className="text-center text-gray-500 mt-10">No matching records found.</div>
      )}
    </div>
  );
};

export default SearchRecordsSection;
