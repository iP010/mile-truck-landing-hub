
import { useState } from "react"
import { Circle, Square, Triangle, Star, Hexagon, FileText, BarChart3, MapPin, Calculator, Settings, Users, Building, UserCog, List } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "إدارة الأسعار", url: "/pricing-management", icon: FileText },
  { title: "إدارة الشركات", url: "/companies-management", icon: Building },
  { title: "إدارة السائقين", url: "/drivers-management", icon: UserCog },
  { title: "أسعار الرحلات", url: "/trip-pricing", icon: BarChart3 },
  { title: "إدارة المدن", url: "/cities-vehicles-management", icon: MapPin },
  { title: "حاسبة الأسعار", url: "/price-calculator", icon: Calculator },
  { title: "التقارير", url: "/pricing-reports", icon: Settings },
  { title: "قائمة انتظار السائقين", url: "/driver-waitlist", icon: List },
  { title: "قائمة انتظار الشركات", url: "/company-waitlist", icon: List },
]

export function PricingSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isExpanded = items.some((i) => isActive(i.url))
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>إدارة الأسعار</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
