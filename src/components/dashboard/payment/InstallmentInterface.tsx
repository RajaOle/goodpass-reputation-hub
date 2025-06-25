
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installment Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Per Installment</div>
              <div className="font-semibold">{formatCurrency(calculateInstallmentAmount(report))}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="font-semibold">{unpaidInstallments.length} of {installments.length}</div>
            </div>
          </div>

          <div>
            <Label>Select Installment to Pay</Label>
            <RadioGroup value={selectedInstallment} onValueChange={onInstallmentChange}>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {unpaidInstallments.map((installment) => (
                  <div key={installment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={installment.id} id={installment.id} />
                      <div>
                        <div className="font-medium">Installment #{installment.number}</div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(installment.amount)} - Due: {new Date(installment.dueDate).toLocaleDateString()}
                        </div>
                        {installment.isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {unpaidInstallments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p className="text-lg font-medium">All installments have been paid!</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallmentInterface;
