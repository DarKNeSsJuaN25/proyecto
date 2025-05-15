"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { Book } from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Definir un tipo de icono genérico que funcione con ambos tipos de iconos
type IconComponent = React.ComponentType<any>;

// Modificar la interfaz de documentos para usar el tipo genérico
interface DocumentItem {
  name: string;
  url: string;
  icon: IconComponent;
}

// Modificar NavDocuments.tsx para aceptar el nuevo tipo
// Necesitarás actualizar el componente NavDocuments para usar IconComponent en lugar de Icon

const data = {
  user: {
   
  },
  navMain: [
    
  ],
  navClouds: [
    
   
        
  ],
  navSecondary: [
    
  ],
  documents: [
    {
      name: "Pacientes",
      url: "/dashboard/pacientes",
      icon: IconUsers,
    },
    {
      name: "Examenes Medicos",
      url: "/dashboard/examenes",
      icon: IconFolder,
    },
    {
      name: "Medicos",
      url: "/dashboard/medicos",
      icon: IconUsers,
    },
    {
      name: "Historial Medico",
      url: "/dashboard/historial",
      icon: Book,
    },
    
  ] as DocumentItem[],  // Usar type assertion para asegurar compatibilidad
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <IconInnerShadowTop className="!size-5 text-primary" />
                <span className="text-base font-semibold text-primary">Salud Care</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* @ts-ignore - Ignorar TypeScript temporalmente mientras actualizamos NavDocuments */}
        <NavDocuments items={data.documents} />
      </SidebarContent>
    
    </Sidebar>
  )
}