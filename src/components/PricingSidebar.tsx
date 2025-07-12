import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Route,
  BarChart3,
  Settings,
  FileText,
  Calculator
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';

const menuItems = [
  {
    title: {
      ar: 'إدارة الشركات',
      en: 'Companies Management',
      ur: 'کمپنیوں کا انتظام'
    },
    url: '/pricing-management',
    icon: Building2,
  },
  {
    title: {
      ar: 'أسعار الرحلات',
      en: 'Trip Pricing',
      ur: 'سفری قیمتیں'
    },
    url: '/trip-pricing',
    icon: Route,
  },
  {
    title: {
      ar: 'تقارير الأسعار',
      en: 'Pricing Reports',
      ur: 'قیمت کی رپورٹس'
    },
    url: '/pricing-reports',
    icon: BarChart3,
  },
  {
    title: {
      ar: 'حاسبة الأسعار',
      en: 'Price Calculator',
      ur: 'قیمت کیلکولیٹر'
    },
    url: '/price-calculator',
    icon: Calculator,
  },
  {
    title: {
      ar: 'إعدادات الأسعار',
      en: 'Pricing Settings',
      ur: 'قیمت کی ترتیبات'
    },
    url: '/pricing-settings',
    icon: Settings,
  },
];

export function PricingSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar 
      className={`${isCollapsed ? 'w-14' : 'w-60'}`} 
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className={`flex items-center gap-2 px-2 py-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <FileText className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <h2 className={`text-lg font-semibold text-sidebar-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'إدارة الأسعار' : 
               language === 'ur' ? 'قیمت کا انتظام' : 
               'Pricing Management'}
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={isRTL ? 'text-right' : 'text-left'}>
        <SidebarGroup>
          <SidebarGroupLabel className={isRTL ? 'text-right justify-end' : 'text-left justify-start'}>
            {language === 'ar' ? 'القائمة الرئيسية' : 
             language === 'ur' ? 'مین مینو' : 
             'Main Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    className={`${isRTL ? 'flex-row-reverse' : ''} ${
                      isActive(item.url) 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                        : 'hover:bg-sidebar-accent/50'
                    }`}
                   >
                     <NavLink to={item.url} className={`w-full flex items-center ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                       <item.icon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                       {!isCollapsed && (
                         <span className={`truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                           {item.title[language as keyof typeof item.title]}
                         </span>
                       )}
                     </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}