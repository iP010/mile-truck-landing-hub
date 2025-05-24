import { Translation, Language } from '../types/language';

export const translations: Record<Language, Translation> = {
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عن الشركة',
      contact: 'اتصل بنا',
      driverRegistration: 'تسجيل السائقين',
      companyRegistration: 'تسجيل الشركات',
      admin: 'الإدارة'
    },
    hero: {
      title: 'Mile Truck - وسيط شحن موثوق',
      subtitle: 'خدمات وساطة شحن موثوقة للسائقين والشركات',
      quote: 'إذا كنتم تمتلكون أسطول شاحنات أو حتى شاحنة واحدة، فنحن هنا لدعمكم في توسيع دائرة أعمالكم من خلال توفير طلبات تحميل موثوقة وفرص نقل مستمرة تساعد على زيادة العائد وتطوير النشاط.',
      driverBtn: 'تسجيل السائقين',
      companyBtn: 'تسجيل الشركات'
    },
    driverForm: {
      title: 'تسجيل السائقين',
      name: 'اسم السائق',
      nationality: 'الجنسية',
      truckBrand: 'نوع السيارة',
      truckType: 'نوع القاطرة',
      hasInsurance: 'هل يوجد تأمين؟',
      insuranceType: 'نوع التأمين',
      phone: 'رقم الجوال',
      whatsapp: 'رقم الواتساب',
      invitationCode: 'كود الدعوة (اختياري)',
      submit: 'تسجيل',
      success: 'تم التسجيل بنجاح!',
      alreadyRegistered: 'تم التسجيل مسبقاً برقم الجوال هذا',
      referralLink: 'رابط الدعوة الخاص بك',
      namePlaceholder: 'أدخل اسم السائق',
      nationalityPlaceholder: 'اختر الجنسية',
      truckBrandPlaceholder: 'اختر نوع السيارة',
      truckTypePlaceholder: 'اختر نوع القاطرة',
      insuranceTypePlaceholder: 'اختر نوع التأمين',
      phonePlaceholder: 'أدخل رقم الجوال',
      whatsappPlaceholder: 'أدخل رقم الواتساب',
      invitationCodePlaceholder: 'أدخل كود الدعوة (اختياري)'
    },
    companyForm: {
      title: 'تسجيل الشركات',
      companyName: 'اسم الشركة',
      truckCount: 'عدد الشاحنات',
      hasInsurance: 'هل يوجد تأمين؟',
      insuranceType: 'نوع التأمين',
      managerName: 'اسم المسؤول',
      phone: 'رقم الجوال',
      whatsapp: 'رقم الواتساب',
      submit: 'تسجيل',
      success: 'تم التسجيل بنجاح!',
      alreadyRegistered: 'تم التسجيل مسبقاً برقم الجوال هذا'
    },
    contact: {
      title: 'اتصل بنا',
      phone: 'رقم الجوال',
      whatsapp: 'واتساب',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      social: 'وسائل التواصل الاجتماعي'
    },
    about: {
      title: 'عن شركة Mile Truck',
      content: 'نحن شركة وساطة شحن موثوقة نقدم خدمات النقل والشحن للسائقين والشركات. نهدف إلى ربط أصحاب الشاحنات بفرص النقل المناسبة لزيادة العائد وتطوير الأعمال.'
    },
    admin: {
      title: 'لوحة الإدارة',
      drivers: 'السائقين',
      companies: 'الشركات',
      name: 'الاسم',
      phone: 'رقم الجوال',
      details: 'التفاصيل',
      registrationDate: 'تاريخ التسجيل'
    },
    common: {
      yes: 'نعم',
      no: 'لا',
      optional: 'اختياري',
      search: 'بحث'
    },
    phoneInput: {
      placeholder: 'أدخل رقم الهاتف',
      validation: {
        tooShort: 'رقم الهاتف يجب أن يكون على الأقل {min} أرقام',
        tooLong: 'رقم الهاتف يجب أن يكون بحد أقصى {max} أرقام',
        valid: '✓ رقم هاتف صحيح'
      },
      countries: {
        saudi: 'السعودية',
        uae: 'الإمارات',
        qatar: 'قطر',
        kuwait: 'الكويت',
        bahrain: 'البحرين',
        oman: 'عُمان',
        jordan: 'الأردن',
        lebanon: 'لبنان',
        egypt: 'مصر',
        morocco: 'المغرب',
        iraq: 'العراق',
        syria: 'سوريا',
        yemen: 'اليمن',
        algeria: 'الجزائر',
        tunisia: 'تونس',
        libya: 'ليبيا',
        sudan: 'السودان'
      }
    },
    options: {
      nationalities: [
        'السعودية', 'مصر', 'الأردن', 'الإمارات', 'الكويت', 'قطر', 'البحرين', 'عمان',
        'العراق', 'سوريا', 'لبنان', 'اليمن', 'ليبيا', 'تونس', 'الجزائر',
        'المغرب', 'السودان', 'الصومال', 'جيبوتي', 'موريتانيا', 'جزر القمر',
        'الهند', 'باكستان', 'بنغلاديش', 'الفلبين', 'إندونيسيا', 'نيبال', 'سريلانكا',
        'أفغانستان', 'ميانمار', 'تايلاند', 'فيتنام', 'ماليزيا', 'إثيوبيا', 'كينيا',
        'أوغندا', 'تنزانيا', 'رواندا', 'بوروندي', 'الكونغو', 'نيجيريا', 'غانا',
        'تركيا', 'إيران', 'أذربيجان', 'جورجيا', 'أرمينيا', 'كازاخستان', 'أوزبكستان',
        'قرغيزستان', 'طاجيكستان', 'تركمانستان', 'أخرى'
      ],
      truckBrands: [
        'مرسيدس', 'مان', 'سكانيا', 'فولفو', 'دي أيه أف', 'إيفيكو', 'رينو',
        'فوتون', 'هينو', 'إيسوزو', 'ميتسوبيشي فوسو', 'تاتا', 'أشوك ليلاند',
        'ماك', 'فريتلاينر', 'كينوورث', 'بيتيربيلت', 'فولفو', 'ويسترن ستار',
        'هياندي', 'كيا', 'دونغ فنغ', 'فاو', 'سينوتروك', 'شاكمان', 'أخرى'
      ],
      truckTypes: [
        'براد', 'براد مع تبريد', 'سطحة', 'جوانب', 'جوانب ألماني', 'صهريج', 'نقل ثقيل', 'أخرى'
      ],
      driverInsuranceTypes: [
        'شامل مع البضاعة', 'شامل', 'ضد الغير'
      ],
      companyInsuranceTypes: [
        'تأمين شركة أو مؤسسة شامل المركبات', 'شامل مع البضاعة', 'شامل', 'ضد الغير'
      ]
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      driverRegistration: 'Driver Registration',
      companyRegistration: 'Company Registration',
      admin: 'Admin'
    },
    hero: {
      title: 'Mile Truck - Trusted Shipping Broker',
      subtitle: 'Reliable shipping brokerage services for drivers and companies',
      quote: 'If you own a fleet of trucks or even a single truck, we are here to support you in expanding your business by providing reliable loading orders and continuous transportation opportunities that help increase revenue and develop business.',
      driverBtn: 'Driver Registration',
      companyBtn: 'Company Registration'
    },
    driverForm: {
      title: 'Driver Registration',
      name: 'Driver Name',
      nationality: 'Nationality',
      truckBrand: 'Truck Brand',
      truckType: 'Truck Type',
      hasInsurance: 'Do you have insurance?',
      insuranceType: 'Insurance Type',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      invitationCode: 'Invitation Code (Optional)',
      submit: 'Register',
      success: 'Registration successful!',
      alreadyRegistered: 'Already registered with this phone number',
      referralLink: 'Your referral link',
      namePlaceholder: 'Enter driver name',
      nationalityPlaceholder: 'Select nationality',
      truckBrandPlaceholder: 'Select truck brand',
      truckTypePlaceholder: 'Select truck type',
      insuranceTypePlaceholder: 'Select insurance type',
      phonePlaceholder: 'Enter phone number',
      whatsappPlaceholder: 'Enter WhatsApp number',
      invitationCodePlaceholder: 'Enter invitation code (optional)'
    },
    companyForm: {
      title: 'Company Registration',
      companyName: 'Company Name',
      truckCount: 'Number of Trucks',
      hasInsurance: 'Do you have insurance?',
      insuranceType: 'Insurance Type',
      managerName: 'Manager Name',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      submit: 'Register',
      success: 'Registration successful!',
      alreadyRegistered: 'Already registered with this phone number'
    },
    contact: {
      title: 'Contact Us',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      email: 'Email',
      address: 'Address',
      social: 'Social Media'
    },
    about: {
      title: 'About Mile Truck',
      content: 'We are a trusted shipping brokerage company providing transportation and shipping services for drivers and companies. We aim to connect truck owners with suitable transportation opportunities to increase revenue and develop business.'
    },
    admin: {
      title: 'Admin Panel',
      drivers: 'Drivers',
      companies: 'Companies',
      name: 'Name',
      phone: 'Phone',
      details: 'Details',
      registrationDate: 'Registration Date'
    },
    common: {
      yes: 'Yes',
      no: 'No',
      optional: 'Optional',
      search: 'Search'
    },
    phoneInput: {
      placeholder: 'Enter phone number',
      validation: {
        tooShort: 'Phone number must be at least {min} digits',
        tooLong: 'Phone number must be at most {max} digits',
        valid: '✓ Valid phone number'
      },
      countries: {
        saudi: 'Saudi Arabia',
        uae: 'UAE',
        qatar: 'Qatar',
        kuwait: 'Kuwait',
        bahrain: 'Bahrain',
        oman: 'Oman',
        jordan: 'Jordan',
        lebanon: 'Lebanon',
        egypt: 'Egypt',
        morocco: 'Morocco',
        iraq: 'Iraq',
        syria: 'Syria',
        yemen: 'Yemen',
        algeria: 'Algeria',
        tunisia: 'Tunisia',
        libya: 'Libya',
        sudan: 'Sudan'
      }
    },
    options: {
      nationalities: [
        'Saudi Arabia', 'Egypt', 'Jordan', 'UAE', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
        'Iraq', 'Syria', 'Lebanon', 'Yemen', 'Libya', 'Tunisia', 'Algeria',
        'Morocco', 'Sudan', 'Somalia', 'Djibouti', 'Mauritania', 'Comoros',
        'India', 'Pakistan', 'Bangladesh', 'Philippines', 'Indonesia', 'Nepal', 'Sri Lanka',
        'Afghanistan', 'Myanmar', 'Thailand', 'Vietnam', 'Malaysia', 'Ethiopia', 'Kenya',
        'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Congo', 'Nigeria', 'Ghana',
        'Turkey', 'Iran', 'Azerbaijan', 'Georgia', 'Armenia', 'Kazakhstan', 'Uzbekistan',
        'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Other'
      ],
      truckBrands: [
        'Mercedes', 'MAN', 'Scania', 'Volvo', 'DAF', 'Iveco', 'Renault',
        'Foton', 'Hino', 'Isuzu', 'Mitsubishi Fuso', 'Tata', 'Ashok Leyland',
        'Mack', 'Freightliner', 'Kenworth', 'Peterbilt', 'Volvo', 'Western Star',
        'Hyundai', 'Kia', 'Dongfeng', 'FAW', 'Sinotruk', 'Shacman', 'Other'
      ],
      truckTypes: [
        'Refrigerated', 'Refrigerated with Cooling', 'Flatbed', 'Sideboard', 'German Sideboard', 'Tanker', 'Heavy Transport', 'Other'
      ],
      driverInsuranceTypes: [
        'Comprehensive with Cargo', 'Comprehensive', 'Third Party'
      ],
      companyInsuranceTypes: [
        'Company/Institution Comprehensive Vehicle Insurance', 'Comprehensive with Cargo', 'Comprehensive', 'Third Party'
      ]
    }
  },
  ur: {
    nav: {
      home: 'ہوم',
      about: 'کمپنی کے بارے میں',
      contact: 'رابطہ کریں',
      driverRegistration: 'ڈرائیور رجسٹریشن',
      companyRegistration: 'کمپنی رجسٹریشن',
      admin: 'ایڈمن'
    },
    hero: {
      title: 'Mile Truck - قابل اعتماد شپنگ بروکر',
      subtitle: 'ڈرائیورز اور کمپنیوں کے لیے قابل اعتماد شپنگ بروکریج خدمات',
      quote: 'اگر آپ کے پاس ٹرکوں کا بیڑا ہے یا صرف ایک ٹرک ہے، تو ہم یہاں ہیں آپ کے کاروبار کو بڑھانے میں مدد کرنے کے لیے قابل اعتماد لوڈنگ آرڈرز اور مسلسل نقل و حمل کے مواقع فراہم کرکے جو آمدنی بڑھانے اور کاروبار کو ترقی دینے میں مدد کرتے ہیں۔',
      driverBtn: 'ڈرائیور رجسٹریشن',
      companyBtn: 'کمپنی رجسٹریشن'
    },
    driverForm: {
      title: 'ڈرائیور رجسٹریشن',
      name: 'ڈرائیور کا نام',
      nationality: 'قومیت',
      truckBrand: 'ٹرک برانڈ',
      truckType: 'ٹرک کی قسم',
      hasInsurance: 'کیا آپ کے پاس انشورنس ہے؟',
      insuranceType: 'انشورنس کی قسم',
      phone: 'فون نمبر',
      whatsapp: 'واٹس ایپ نمبر',
      invitationCode: 'دعوت کوڈ (اختیاری)',
      submit: 'رجسٹر کریں',
      success: 'رجسٹریشن کامیاب!',
      alreadyRegistered: 'اس فون نمبر سے پہلے سے رجسٹرڈ ہے',
      referralLink: 'آپ کا ریفرل لنک',
      namePlaceholder: 'ڈرائیور کا نام درج کریں',
      nationalityPlaceholder: 'قومیت منتخب کریں',
      truckBrandPlaceholder: 'ٹرک برانڈ منتخب کریں',
      truckTypePlaceholder: 'ٹرک کی قسم منتخب کریں',
      insuranceTypePlaceholder: 'انشورنس کی قسم منتخب کریں',
      phonePlaceholder: 'فون نمبر درج کریں',
      whatsappPlaceholder: 'واٹس ایپ نمبر درج کریں',
      invitationCodePlaceholder: 'دعوت کوڈ درج کریں (اختیاری)'
    },
    companyForm: {
      title: 'کمپنی رجسٹریشن',
      companyName: 'کمپنی کا نام',
      truckCount: 'ٹرکوں کی تعداد',
      hasInsurance: 'کیا آپ کے پاس انشورنس ہے؟',
      insuranceType: 'انشورنس کی قسم',
      managerName: 'منیجر کا نام',
      phone: 'فون نمبر',
      whatsapp: 'واٹس ایپ نمبر',
      submit: 'رجسٹر کریں',
      success: 'رجسٹریشن کامیاب!',
      alreadyRegistered: 'اس فون نمبر سے پہلے سے رجسٹرڈ ہے'
    },
    contact: {
      title: 'رابطہ کریں',
      phone: 'فون',
      whatsapp: 'واٹس ایپ',
      email: 'ای میل',
      address: 'پتہ',
      social: 'سوشل میڈیا'
    },
    about: {
      title: 'Mile Truck کے بارے میں',
      content: 'ہم ایک قابل اعتماد شپنگ بروکریج کمپنی ہیں جو ڈرائیورز اور کمپنیوں کے لیے نقل و حمل اور شپنگ کی خدمات فراہم کرتی ہے۔ ہمارا مقصد ٹرک مالکان کو مناسب نقل و حمل کے مواقع سے جوڑنا ہے تاکہ آمدنی بڑھائی جا سکے اور کاروبار کو ترقی دی جا سکے۔'
    },
    admin: {
      title: 'ایڈمن پینل',
      drivers: 'ڈرائیورز',
      companies: 'کمپنیاں',
      name: 'نام',
      phone: 'فون',
      details: 'تفصیلات',
      registrationDate: 'رجسٹریشن کی تاریخ'
    },
    common: {
      yes: 'ہاں',
      no: 'نہیں',
      optional: 'اختیاری',
      search: 'تلاش'
    },
    phoneInput: {
      placeholder: 'فون نمبر درج کریں',
      validation: {
        tooShort: 'فون نمبر کم از کم {min} ہندسوں کا ہونا چاہیے',
        tooLong: 'فون نمبر زیادہ سے زیادہ {max} ہندسوں کا ہونا چاہیے',
        valid: '✓ درست فون نمبر'
      },
      countries: {
        saudi: 'سعودی عرب',
        uae: 'متحدہ عرب امارات',
        qatar: 'قطر',
        kuwait: 'کویت',
        bahrain: 'بحرین',
        oman: 'عمان',
        jordan: 'اردن',
        lebanon: 'لبنان',
        egypt: 'مصر',
        morocco: 'مراکش',
        iraq: 'عراق',
        syria: 'شام',
        yemen: 'یمن',
        algeria: 'الجزائر',
        tunisia: 'تیونس',
        libya: 'لیبیا',
        sudan: 'سوڈان'
      }
    },
    options: {
      nationalities: [
        'سعودی عرب', 'مصر', 'اردن', 'متحدہ عرب امارات', 'کویت', 'قطر', 'بحرین', 'عمان',
        'عراق', 'شام', 'لبنان', 'یمن', 'لیبیا', 'تیونس', 'الجزائر',
        'مراکش', 'سوڈان', 'صومالیہ', 'جبوتی', 'موریطانیہ', 'جزائر قمر',
        'بھارت', 'پاکستان', 'بنگلہ دیش', 'فلپائن', 'انڈونیشیا', 'نیپال', 'سری لنکا',
        'افغانستان', 'میانمار', 'تھائی لینڈ', 'ویتنام', 'ملائیشیا', 'ایتھوپیا', 'کینیا',
        'یوگنڈا', 'تنزانیہ', 'روانڈا', 'برونڈی', 'کانگو', 'نائیجیریا', 'گھانا',
        'ترکی', 'ایران', 'آذربائیجان', 'جارجیا', 'آرمینیا', 'قازقستان', 'ازبکستان',
        'کرغیزستان', 'تاجکستان', 'ترکمانستان', 'دیگر'
      ],
      truckBrands: [
        'مرسیڈیز', 'مین', 'اسکینیا', 'وولوو', 'ڈی اے ایف', 'آئیویکو', 'رینالٹ',
        'فوٹن', 'ہینو', 'ایسوزو', 'مٹسوبیشی فوسو', 'ٹاٹا', 'اشوک لیلینڈ',
        'میک', 'فریٹ لائنر', 'کین ورتھ', 'پیٹر بلٹ', 'وولوو', 'ویسٹرن اسٹار',
        'ہیونڈائی', 'کیا', 'ڈونگ فینگ', 'ایف اے ڈبلیو', 'سائنو ٹرک', 'شیک مین', 'دیگر'
      ],
      truckTypes: [
        'ریفریجریٹیڈ', 'کولنگ کے ساتھ ریفریجریٹیڈ', 'فلیٹ بیڈ', 'سائیڈ بورڈ', 'جرمن سائیڈ بورڈ', 'ٹینکر', 'ہیوی ٹرانسپورٹ', 'دیگر'
      ],
      driverInsuranceTypes: [
        'کارگو کے ساتھ جامع', 'جامع', 'تیسری پارٹی'
      ],
      companyInsuranceTypes: [
        'کمپنی/ادارہ جامع گاڑی انشورنس', 'کارگو کے ساتھ جامع', 'جامع', 'تیسری پارٹی'
      ]
    }
  },
  hi: {
    nav: {
      home: 'होम',
      about: 'कंपनी के बारे में',
      contact: 'संपर्क करें',
      driverRegistration: 'ड्राइवर पंजीकरण',
      companyRegistration: 'कंपनी पंजीकरण',
      admin: 'एडमिन'
    },
    hero: {
      title: 'Mile Truck - विश्वसनीय शिपिंग ब्रोकर',
      subtitle: 'ड्राइवरों और कंपनियों के लिए विश्वसनीय शिपिंग ब्रोकरेज सेवाएं',
      quote: 'यदि आपके पास ट्रकों का बेड़ा है या सिर्फ एक ट्रक है, तो हम यहाँ हैं आपके व्यवसाय को बढ़ाने में मदद करने के लिए विश्वसनीय लोडिंग ऑर्डर और निरंतर परिवहन के अवसर प्रदान करके जो आय बढ़ाने और व्यवसाय को विकसित करने में मदद करते हैं।',
      driverBtn: 'ड्राइवर पंजीकरण',
      companyBtn: 'कंपनी पंजीकरण'
    },
    driverForm: {
      title: 'ड्राइवर पंजीकरण',
      name: 'ड्राइवर का नाम',
      nationality: 'राष्ट्रीयता',
      truckBrand: 'ट्रक ब्रांड',
      truckType: 'ट्रक का प्रकार',
      hasInsurance: 'क्या आपके पास बीमा है?',
      insuranceType: 'बीमा का प्रकार',
      phone: 'फोन नंबर',
      whatsapp: 'व्हाट्सएप नंबर',
      invitationCode: 'निमंत्रण कोड (वैकल्पिक)',
      submit: 'पंजीकरण करें',
      success: 'पंजीकरण सफल!',
      alreadyRegistered: 'इस फोन नंबर से पहले से पंजीकृत है',
      referralLink: 'आपका रेफरल लिंक',
      namePlaceholder: 'ड्राइवर का नाम दर्ज करें',
      nationalityPlaceholder: 'राष्ट्रीयता चुनें',
      truckBrandPlaceholder: 'ट्रक ब्रांड चुनें',
      truckTypePlaceholder: 'ट्रक का प्रकार चुनें',
      insuranceTypePlaceholder: 'बीमा का प्रकार चुनें',
      phonePlaceholder: 'फोन नंबर दर्ज करें',
      whatsappPlaceholder: 'व्हाट्सएप नंबर दर्ज करें',
      invitationCodePlaceholder: 'निमंत्रण कोड दर्ज करें (वैकल्पिक)'
    },
    companyForm: {
      title: 'कंपनी पंजीकरण',
      companyName: 'कंपनी का नाम',
      truckCount: 'ट्रकों की संख्या',
      hasInsurance: 'क्या आपके पास बीमा है?',
      insuranceType: 'बीमा का प्रकार',
      managerName: 'प्रबंधक का नाम',
      phone: 'फोन नंबर',
      whatsapp: 'व्हाट्सएप नंबर',
      submit: 'पंजीकरण करें',
      success: 'पंजीकरण सफल!',
      alreadyRegistered: 'इस फोन नंबर से पहले से पंजीकृत है'
    },
    contact: {
      title: 'संपर्क करें',
      phone: 'फोन',
      whatsapp: 'व्हाट्सएप',
      email: 'ईमेल',
      address: 'पता',
      social: 'सोशल मीडिया'
    },
    about: {
      title: 'Mile Truck के बारे में',
      content: 'हम एक विश्वसनीय शिपिंग ब्रोकरेज कंपनी हैं जो ड्राइवरों और कंपनियों के लिए परिवहन और शिपिंग सेवाएं प्रदान करती है। हमारा लक्ष्य ट्रक मालिकों को उपयुक्त परिवहन के अवसरों से जोड़ना है ताकि आय बढ़ाई जा सके और व्यवसाय को विकसित किया जा सके।'
    },
    admin: {
      title: 'एडमिन पैनल',
      drivers: 'ड्राइवर',
      companies: 'कंपनियां',
      name: 'नाम',
      phone: 'फोन',
      details: 'विवरण',
      registrationDate: 'पंजीकरण तिथि'
    },
    common: {
      yes: 'हाँ',
      no: 'नहीं',
      optional: 'वैकल्पिक',
      search: 'खोजें'
    },
    phoneInput: {
      placeholder: 'फोन नंबर दर्ज करें',
      validation: {
        tooShort: 'फोन नंबर कम से कम {min} अंकों का होना चाहिए',
        tooLong: 'फोन नंबर अधिकतम {max} अंकों का होना चाहिए',
        valid: '✓ वैध फोन नंबर'
      },
      countries: {
        saudi: 'सऊदी अरब',
        uae: 'संयुक्त अरब अमीरात',
        qatar: 'कतर',
        kuwait: 'कुवैत',
        bahrain: 'बहरीन',
        oman: 'ओमान',
        jordan: 'जॉर्डन',
        lebanon: 'लेबनान',
        egypt: 'मिस्र',
        morocco: 'मोरक्को',
        iraq: 'इराक',
        syria: 'सीरिया',
        yemen: 'यमन',
        algeria: 'अल्जीरिया',
        tunisia: 'ट्यूनीशिया',
        libya: 'लीबिया',
        sudan: 'सूडान'
      }
    },
    options: {
      nationalities: [
        'सऊदी अरब', 'मिस्र', 'जॉर्डन', 'संयुक्त अरब अमीरात', 'कुवैत', 'कतर', 'बहरीन', 'ओमान',
        'इराक', 'सीरिया', 'लेबनान', 'यमन', 'लीबिया', 'ट्यूनीशिया', 'अल्जीरिया',
        'मोरक्को', 'सूडान', 'सोमालिया', 'जिबूती', 'मॉरिटानिया', 'कोमोरोस',
        'भारत', 'पाकिस्तान', 'बांग्लादेश', 'फिलीपींस', 'इंडोनेशिया', 'नेपाल', 'श्रीलंका',
        'अफगानिस्तान', 'म्यांमार', 'थाईलैंड', 'वियतनाम', 'मलेशिया', 'इथियोपिया', 'केन्या',
        'युगांडा', 'तंजानिया', 'रवांडा', 'बुरुंडी', 'कांगो', 'नाइजीरिया', 'घाना',
        'तुर्की', 'ईरान', 'अजरबैजान', 'जॉर्जिया', 'आर्मेनिया', 'कजाकिस्तान', 'उज्बेकिस्तान',
        'किर्गिज़स्तान', 'ताजिकिस्तान', 'तुर्कमेनिस्तान', 'अन्य'
      ],
      truckBrands: [
        'मर्सिडीज', 'मैन', 'स्कैनिया', 'वोल्वो', 'डीएएफ', 'इवेको', 'रेनॉल्ट',
        'फोटन', 'हिनो', 'इसुजु', 'मित्सुबिशी फुसो', 'टाटा', 'अशोक लेलैंड',
        'मैक', 'फ्रेटलाइनर', 'केनवर्थ', 'पीटरबिल्ट', 'वोल्वो', 'वेस्टर्न स्टार',
        'हुंडई', 'किया', 'डोंगफेंग', 'एफएडब्ल्यू', साइनोट्रक', 'शैकमैन', 'अन्य'
      ],
      truckTypes: [
        'रेफ्रिजरेटेड', 'कूलिंग के साथ रेफ्रिजरेटेड', 'फ्लैटबेड', 'साइडबोर्ड', 'जर्मन साइडबोर्ड', 'टैंकर', 'हेवी ट्रांसपोर्ट', 'अन्य'
      ],
      driverInsuranceTypes: [
        'कार्गो के साथ व्यापक', 'व्यापक', 'तीसरी पार्टी'
      ],
      companyInsuranceTypes: [
        'कंपनी/संस्थान व्यापक वाहन बीमा', 'कार्गो के साथ व्यापक', 'व्यापक', 'तीसरी पार्टी'
      ]
    }
  }
};
