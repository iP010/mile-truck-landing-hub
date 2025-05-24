
export type Language = 'ar' | 'en' | 'ur' | 'hi';

export interface Translation {
  nav: {
    home: string;
    about: string;
    contact: string;
    driverRegistration: string;
    companyRegistration: string;
    admin: string;
  };
  hero: {
    title: string;
    subtitle: string;
    quote: string;
    driverBtn: string;
    companyBtn: string;
  };
  driverForm: {
    title: string;
    name: string;
    nationality: string;
    truckBrand: string;
    truckType: string;
    hasInsurance: string;
    insuranceType: string;
    phone: string;
    whatsapp: string;
    invitationCode: string;
    submit: string;
    success: string;
    alreadyRegistered: string;
    referralLink: string;
  };
  companyForm: {
    title: string;
    companyName: string;
    truckCount: string;
    hasInsurance: string;
    insuranceType: string;
    managerName: string;
    phone: string;
    whatsapp: string;
    submit: string;
    success: string;
    alreadyRegistered: string;
  };
  contact: {
    title: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    social: string;
  };
  about: {
    title: string;
    content: string;
  };
  admin: {
    title: string;
    drivers: string;
    companies: string;
    name: string;
    phone: string;
    details: string;
    registrationDate: string;
  };
  common: {
    yes: string;
    no: string;
    optional: string;
    search: string;
  };
}
