
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Calendar, CreditCard, Clock, TrendingUp } from 'lucide-react';
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
  const paidInstallments = installments.filter(i => i.status === 'paid');
  const installmentAmount = calculateInstallmentAmount(report);
  const overdueInstallments = unpaidInstallments.filter(i => i.isOverdue);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900">Installment Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Fixed monthly payments with scheduled due dates</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Payment Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-blue-100 text-center">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Fixed Amount</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(installmentAmount)}</div>
            <div className="text-xs text-blue-600 mt-1">Per installment</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-green-100 text-center">
            <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">Paid</div>
            <div className="text-2xl font-bold text-green-700">{paidInstallments.length}</div>
            <div className="text-xs text-green-600 mt-1">installments</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-orange-100 text-center">
            <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">Remaining</div>
            <div className="text-2xl font-bold text-orange-700">{unpaidInstallments.length}</div>
            <div className="text-xs text-orange-600 mt-1">installments</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-purple-100 text-center">
            <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">Progress</div>
            <div className="text-2xl font-bold text-purple-700">
              {Math.round((paidInstallments.length / installments.length) * 100)}%
            </div>
            <div className="text-xs text-purple-600 mt-1">Complete</div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="bg-white rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Installments Completed</span>
              <span>{paidInstallments.length} of {installments.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(paidInstallments.length / installments.length) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-green-700">{formatCurrency(paidInstallments.length * installmentAmount)}</div>
                <div className="text-gray-600">Paid</div>
              </div>
              <div>
                <div className="font-semibold text-orange-700">{formatCurrency(unpaidInstallments.length * installmentAmount)}</div>
                <div className="text-gray-600">Remaining</div>
              </div>
              <div>
                <div className="font-semibold text-blue-700">{formatCurrency(installments.length * installmentAmount)}</div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Warning */}
        {overdueInstallments.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-semibold text-red-800">
                  {overdueInstallments.length} Overdue Installment{overdueInstallments.length > 1 ? 's' : ''}
                </div>
                <div className="text-sm text-red-600">
                  Please prioritize overdue payments to avoid additional fees
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Installment Selection */}
        {unpaidInstallments.length > 0 ? (
          <div className="bg-white rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-gray-600" />
              <Label className="text-lg font-semibold text-gray-900">
                Select Installment to Pay
              </Label>
            </div>
            
            <RadioGroup value={selectedInstallment} onValueChange={onInstallmentChange}>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {unpaidInstallments.map((installment) => (
                  <div 
                    key={installment.id} 
                    className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      selectedInstallment === installment.id 
                        ? 'border-blue-400 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${installment.isOverdue ? 'ring-2 ring-red-200' : ''}`}
                    onClick={() => onInstallmentChange(installment.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem 
                        value={installment.id} 
                        id={installment.id}
                        className="border-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-semibold text-gray-900 text-lg">
                            Installment #{installment.number}
                          </div>
                          {installment.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Due: {new Date(installment.dueDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        {installment.isOverdue && (
                          <div className="text-xs text-red-600 mt-1">
                            {Math.ceil((new Date().getTime() - new Date(installment.dueDate).getTime()) / (1000 * 3600 * 24))} days overdue
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
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
            <CheckCircle2 className="h-20 w-20 mx-auto mb-6 text-green-500" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">All Installments Paid!</h3>
            <p className="text-gray-600 text-lg">
              Congratulations! All scheduled installments have been successfully completed.
            </p>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700">
                Total Amount Paid: <span className="font-semibold">{formatCurrency(installments.length * installmentAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstallmentInterface;
