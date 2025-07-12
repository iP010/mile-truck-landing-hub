
import { Badge } from "@/components/ui/badge";

interface CompanyPricing {
  id: string;
  company_name: string;
  membership_number: string;
  insurance_type: string | null;
  is_editing_enabled: boolean;
}

interface CompanyHeaderProps {
  company: CompanyPricing;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">
        قائمة أسعار الشحن لـ {company.company_name}
      </h1>
      <div className="flex justify-center gap-4 mb-4">
        <Badge variant="secondary">رقم العضوية: {company.membership_number}</Badge>
        {company.insurance_type && (
          <Badge variant="outline">{company.insurance_type}</Badge>
        )}
        <Badge variant={company.is_editing_enabled ? "default" : "destructive"}>
          {company.is_editing_enabled ? "التحرير مفعل" : "التحرير معطل"}
        </Badge>
      </div>
    </div>
  );
}
