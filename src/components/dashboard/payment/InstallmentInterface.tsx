
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Calendar, CreditCard } from 'lucide-react';
import { Report } from '@/types/report';
import { formatCurrency, calculateInstallmentAmount, generateInstallments } from './paymentUtils';

interface InstallmentInterfaceProps {
  report: Report;
  selectedInstallment: string;
  onInstallmentChange: (installment: string) => void;
}

const InstallmentInterface: React.FC<InstallmentInterfaceProps> = ({
  report,
  selectedInstallment,
  onInstallmentChange
}) => {
  const installments = generateInstallments(report);
  const unpaidInstallments = installments.filter(i => i.status === 'unpaid');
  const installmentAmount = calculateInstallmentAmount(report);

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-gray-900">Installment Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Fixed monthly payments</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="bg-white rounded-xl p-6 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Fixed Amount</div>
              <div className="text-2xl font-bold text-blue-700">{formatCurrency(installmentAmount)}</div>
              <div className="text-xs text-blue-600 mt-1">Per installment</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Remaining</div>
              <div className="text-2xl font-bold text-orange-700">{unpaidInstallments.length}</div>
              <div className="text-xs text-orange-600 mt-1">of {installments.length} installments</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Progress</div>
              <div className="text-2xl font-bold text-green-700">
                {Math.round(((installments.length - unpaidInstallments.length) / installments.length) * 100)}%
              </div>
              <div className="text-xs text-green-600 mt-1">Complete</div>
            </div>
          </div>
        </div>

        {/* Installment Selection */}
        {unpaidInstallments.length > 0 ? (
          <div className="bg-white rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-semibold text-gray-900">
                Select Installment to Pay
              </Label>
            </div>
            
            <RadioGroup value={selectedInstallment} onValueChange={onInstallmentChange}>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {unpaidInstallments.map((installment) => (
                  <div 
                    key={installment.id} 
                    className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200 ${
                      selectedInstallment === installment.id 
                        ? 'border-blue-300 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem 
                        value={installment.id} 
                        id={installment.id}
                        className="border-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="font-semibold text-gray-900">
                            Installment #{installment.number}
                          </div>
                          {installment.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Due: {new Date(installment.dueDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(installment.amount)}
                      </div>
                      <div className="text-xs text-gray-500">Fixed amount</div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border border-green-100 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Installments Paid!</h3>
            <p className="text-gray-600">
              Congratulations! All scheduled installments have been successfully completed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstallmentInterface;
