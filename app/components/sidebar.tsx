"use client"

import { Button } from "@/components/ui/button"
import { Home, Plus, BarChart3, Settings, Bell, HelpCircle, Calculator, Building2, Sparkles, Database, ArrowUpDown, Palette } from "lucide-react"
import { ViewType } from "../types/navigation"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "create-improved", label: "Crear Acuerdo Mejorado", icon: Sparkles },
    { id: "agreement-priorities", label: "Prioridades de Acuerdos", icon: ArrowUpDown },
    { id: "internal-agreements-dashboard", label: "Dashboard de Acuerdos Internos", icon: BarChart3 },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">MercadoPago</h2>
        <p className="text-sm text-gray-600">Internal Agreements</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = currentView === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                isActive 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onViewChange(item.id as "home" | "dashboard" | "create" | "create-improved" | "detail" | "mp-demo" | "andes-ui-demo" | "internal-agreements-dashboard" | "agreement-type-selection" | "agreement-detail-readonly" | "agreement-performance" | "audience-management" | "approval-status" | "add-seller-manual" | "upload-sellers-list" | "agreement-priorities")}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">N</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Usuario</p>
            <p className="text-xs text-gray-600">Configuración</p>
          </div>
        </div>
      </div>
    </div>
  )
}
