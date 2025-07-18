
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Briefcase, 
  FileText, 
  Building2, 
  Phone, 
  Package, 
  Gem,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: UsersIcon },
  { href: "/deals", label: "Opportunities", icon: Briefcase },
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/customers", label: "Customers", icon: Building2 },
  { href: "/contacts", label: "Contacts", icon: Phone },
  { href: "/products", label: "Products & Services", icon: Package },
];

const adminNavItems = [
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/roles", label: "Roles", icon: UserCog },
]

export default function Nav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 justify-center">
          <Gem className="w-8 h-8 text-primary" />
           <h2 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">CRM</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <Separator className="my-2"/>
            <Collapsible>
              <SidebarMenuItem>
                 <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Admin" className="justify-between">
                       <div className="flex items-center gap-2">
                        <Shield />
                        <span>Admin</span>
                      </div>
                       <ChevronLeft className="w-4 h-4 transition-transform ease-in-out duration-200 group-data-[state=open]:-rotate-90"/>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {adminNavItems.map((item) => (
                    <SidebarMenuSubItem key={item.href}>
                       <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                             <item.icon />
                             <span>{item.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter>
         <Button variant="ghost" onClick={toggleSidebar} className="w-full justify-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="group-data-[collapsible=icon]:hidden">Collapse</span>
              </>
            )}
         </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
