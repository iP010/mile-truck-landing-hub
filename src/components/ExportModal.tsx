
import React from 'react';
import { X, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { Tables } from '../integrations/supabase/types';
import { useLanguage } from '../contexts/LanguageContext';

type Driver = Tables<'drivers'>;
type Company = Tables<'companies'>;

interface ExportModalProps {
  data: Driver[] | Company[];
  type: 'drivers' | 'companies';
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ data, type, onClose }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const generateCSV = () => {
    if (type === 'drivers') {
      const drivers = data as Driver[];
      const headers = [
        'ID', 'Driver Name', 'Nationality', 'Phone Number', 'WhatsApp Number',
        'Truck Brand', 'Truck Type', 'Has Insurance', 'Insurance Type',
        'Referral Code', 'Invitation Code', 'Created At', 'Updated At'
      ];
      
      const csvContent = [
        headers.join(','),
        ...drivers.map(driver => [
          driver.id,
          `"${driver.driver_name}"`,
          `"${driver.nationality}"`,
          `"${driver.phone_number}"`,
          `"${driver.whatsapp_number}"`,
          `"${driver.truck_brand}"`,
          `"${driver.truck_type}"`,
          driver.has_insurance,
          `"${driver.insurance_type || ''}"`,
          `"${driver.referral_code || ''}"`,
          `"${driver.invitation_code || ''}"`,
          driver.created_at,
          driver.updated_at
        ].join(','))
      ].join('\n');

      downloadFile(csvContent, `drivers_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    } else {
      const companies = data as Company[];
      const headers = [
        'ID', 'Company Name', 'Manager Name', 'Phone Number', 'WhatsApp Number',
        'Truck Count', 'Has Insurance', 'Insurance Type', 'Created At', 'Updated At'
      ];
      
      const csvContent = [
        headers.join(','),
        ...companies.map(company => [
          company.id,
          `"${company.company_name}"`,
          `"${company.manager_name}"`,
          `"${company.phone_number}"`,
          `"${company.whatsapp_number}"`,
          company.truck_count,
          company.has_insurance,
          `"${company.insurance_type || ''}"`,
          company.created_at,
          company.updated_at
        ].join(','))
      ].join('\n');

      downloadFile(csvContent, `companies_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    }
  };

  const generateExcel = () => {
    // Generate HTML table format that Excel can read
    let htmlContent = '<table>';
    
    if (type === 'drivers') {
      const drivers = data as Driver[];
      htmlContent += '<tr><th>ID</th><th>Driver Name</th><th>Nationality</th><th>Phone Number</th><th>WhatsApp Number</th><th>Truck Brand</th><th>Truck Type</th><th>Has Insurance</th><th>Insurance Type</th><th>Referral Code</th><th>Invitation Code</th><th>Created At</th><th>Updated At</th></tr>';
      
      drivers.forEach(driver => {
        htmlContent += `<tr>
          <td>${driver.id}</td>
          <td>${driver.driver_name}</td>
          <td>${driver.nationality}</td>
          <td>${driver.phone_number}</td>
          <td>${driver.whatsapp_number}</td>
          <td>${driver.truck_brand}</td>
          <td>${driver.truck_type}</td>
          <td>${driver.has_insurance}</td>
          <td>${driver.insurance_type || ''}</td>
          <td>${driver.referral_code || ''}</td>
          <td>${driver.invitation_code || ''}</td>
          <td>${driver.created_at}</td>
          <td>${driver.updated_at}</td>
        </tr>`;
      });
    } else {
      const companies = data as Company[];
      htmlContent += '<tr><th>ID</th><th>Company Name</th><th>Manager Name</th><th>Phone Number</th><th>WhatsApp Number</th><th>Truck Count</th><th>Has Insurance</th><th>Insurance Type</th><th>Created At</th><th>Updated At</th></tr>';
      
      companies.forEach(company => {
        htmlContent += `<tr>
          <td>${company.id}</td>
          <td>${company.company_name}</td>
          <td>${company.manager_name}</td>
          <td>${company.phone_number}</td>
          <td>${company.whatsapp_number}</td>
          <td>${company.truck_count}</td>
          <td>${company.has_insurance}</td>
          <td>${company.insurance_type || ''}</td>
          <td>${company.created_at}</td>
          <td>${company.updated_at}</td>
        </tr>`;
      });
    }
    
    htmlContent += '</table>';
    
    downloadFile(htmlContent, `${type}_${new Date().toISOString().split('T')[0]}.xls`, 'application/vnd.ms-excel');
  };

  const generateSQL = () => {
    let sqlContent = '';
    
    if (type === 'drivers') {
      const drivers = data as Driver[];
      sqlContent = `-- Drivers data export\n-- Generated on ${new Date().toISOString()}\n\n`;
      
      drivers.forEach(driver => {
        sqlContent += `INSERT INTO drivers (id, driver_name, nationality, phone_number, whatsapp_number, truck_brand, truck_type, has_insurance, insurance_type, referral_code, invitation_code, created_at, updated_at) VALUES (
  '${driver.id}',
  '${driver.driver_name.replace(/'/g, "''")}',
  '${driver.nationality}',
  '${driver.phone_number}',
  '${driver.whatsapp_number}',
  '${driver.truck_brand}',
  '${driver.truck_type}',
  ${driver.has_insurance},
  ${driver.insurance_type ? `'${driver.insurance_type}'` : 'NULL'},
  ${driver.referral_code ? `'${driver.referral_code}'` : 'NULL'},
  ${driver.invitation_code ? `'${driver.invitation_code}'` : 'NULL'},
  '${driver.created_at}',
  '${driver.updated_at}'
);\n\n`;
      });
    } else {
      const companies = data as Company[];
      sqlContent = `-- Companies data export\n-- Generated on ${new Date().toISOString()}\n\n`;
      
      companies.forEach(company => {
        sqlContent += `INSERT INTO companies (id, company_name, manager_name, phone_number, whatsapp_number, truck_count, has_insurance, insurance_type, created_at, updated_at) VALUES (
  '${company.id}',
  '${company.company_name.replace(/'/g, "''")}',
  '${company.manager_name.replace(/'/g, "''")}',
  '${company.phone_number}',
  '${company.whatsapp_number}',
  ${company.truck_count},
  ${company.has_insurance},
  ${company.insurance_type ? `'${company.insurance_type}'` : 'NULL'},
  '${company.created_at}',
  '${company.updated_at}'
);\n\n`;
      });
    }
    
    downloadFile(sqlContent, `${type}_${new Date().toISOString().split('T')[0]}.sql`, 'text/sql');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isRTL ? 'تصدير البيانات' : 'Export Data'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 mb-4">
            {isRTL 
              ? `اختر تنسيق التصدير لـ ${data.length} ${type === 'drivers' ? 'سائق' : 'شركة'}`
              : `Choose export format for ${data.length} ${type === 'drivers' ? 'driver(s)' : 'company(ies)'}`
            }
          </p>

          <div className="space-y-3">
            <Button
              onClick={generateCSV}
              variant="outline"
              className="w-full justify-start"
            >
              <Download size={16} className="mr-2" />
              {isRTL ? 'تصدير CSV' : 'Export CSV'}
            </Button>

            <Button
              onClick={generateExcel}
              variant="outline"
              className="w-full justify-start"
            >
              <FileSpreadsheet size={16} className="mr-2" />
              {isRTL ? 'تصدير إلى Excel' : 'Export to Excel'}
            </Button>

            <Button
              onClick={generateSQL}
              variant="outline"
              className="w-full justify-start"
            >
              <Download size={16} className="mr-2" />
              {isRTL ? 'تصدير SQL' : 'Export SQL'}
            </Button>
          </div>

          <div className="pt-4">
            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
