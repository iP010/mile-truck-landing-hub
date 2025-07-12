
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Company {
  id: string;
  company_name: string;
  membership_number: string;
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: string;
  onCompanyChange: (companyId: string) => void;
}

export function CompanySelector({ companies, selectedCompany, onCompanyChange }: CompanySelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>اختيار الشركة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>الشركة</Label>
            <Select value={selectedCompany} onValueChange={onCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر شركة..." />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.company_name} - {company.membership_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
