"use client"

import { useState } from "react"
import { ViewType } from "./types/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Filter,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Edit,
  Copy,
  Pause,
  Eye,
} from "lucide-react"
import { Sidebar } from "./components/sidebar"
import { CreateAgreementFlow } from "./components/create-agreement-flow"
import { CreateAgreementFlowImproved } from "./components/create-agreement-flow-improved"
import { AgreementDetail } from "./components/agreement-detail"

import { MPDemo } from "./components/mp-demo"
import { AndesUIDemo } from "./components/andes-ui-demo"
import InternalAgreementsDashboard from "./components/internal-agreements-dashboard"
import { AgreementTypeSelection } from "./components/agreement-type-selection"
import AgreementDetailReadonly from "./components/agreement-detail-readonly"
import AgreementPerformance from "./components/agreement-performance"
import AudienceManagement from "./components/audience-management"
import ApprovalStatus from "./components/approval-status"
import AddSellerManual from "./components/add-seller-manual"
import UploadSellersList from "./components/upload-sellers-list"
import HomeCommercial from "./components/home-commercial"
import { AgreementPriorities } from "./components/agreement-priorities"
import SellersConsultation from "./components/sellers-consultation"
import SellerDetail from "./components/seller-detail"
import BaseAgreementDetail from "./components/base-agreement-detail"
import SellerAgreementsSelection from "./components/seller-agreements-selection"
import SMBWorkflow from "./components/smb-workflow"
import PromotionsDashboard from "./components/promotions-dashboard"
import TransactionalQuery from "./components/transactional-query"
import PromotionTypeSelection from "./components/promotion-type-selection"
import PromotionFlow from "./components/promotion-flow"
import SellerMVPConsultation from "./components/seller-mvp-consultation"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("home")
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null)
  const [selectedAgreementType, setSelectedAgreementType] = useState<string>("")
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [selectedPromotionType, setSelectedPromotionType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Mock data
  const kpis = [
    {
      title: "TPV con Pricing Especial",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Reglas Activas",
      value: "47",
      change: "+3",
      trend: "up",
    },
    {
      title: "Próximas a Vencer",
      value: "8",
      change: "En 7 días",
      trend: "warning",
    },
    {
      title: "Rentabilidad Promedio",
      value: "18.2%",
      change: "+2.1%",
      trend: "up",
    },
  ]

  const agreements = [
    {
      id: 1,
      name: "Campaña Bienvenida Q4",
      type: "ISCA",
      status: "active",
      audience: "Nuevos usuarios",
      commission: "2.5%",
      expires: "2024-12-31",
      performance: "+15.2%",
    },
    {
      id: 2,
      name: "Pricing por Escala - Retail",
      type: "PxE",
      status: "active",
      audience: "Retail > $10K",
      commission: "1.8-2.2%",
      expires: "2024-11-15",
      performance: "+8.7%",
    },
    {
      id: 3,
      name: "Audiencia Premium",
      type: "Audiencia específica",
      status: "paused",
      audience: "Top 100 merchants",
      commission: "1.5%",
      expires: "2024-10-30",
      performance: "+22.1%",
    },
  ]

  const handleViewAgreement = (agreement: any) => {
    setSelectedAgreement(agreement)
    setCurrentView("detail")
  }

  const handleHomeNavigation = (section: string) => {
    switch (section) {
      case 'internal-agreements':
        setCurrentView("agreement-type-selection")
        break
      case 'internal-agreements-dashboard':
        setCurrentView("internal-agreements-dashboard")
        break
      case 'sellers-consultation':
        setCurrentView("sellers-consultation")
        break
      case 'seller-mvp-consultation':
        setCurrentView("seller-mvp-consultation")
        break
      case 'sellers':
        setCurrentView("seller-agreements-selection")
        break
      case 'promotions-dashboard':
        setCurrentView("promotions-dashboard")
        break
      case 'new-promotion':
        setCurrentView("promotion-type-selection")
        break
      default:
        setCurrentView("dashboard")
    }
  }

  const handleAgreementTypeSelection = (type: string) => {
    setSelectedAgreementType(type)
    setCurrentView("create-improved")
  }

  const handlePromotionTypeSelection = (type: string) => {
    setSelectedPromotionType(type)
    setCurrentView("promotion-flow")
  }

  if (currentView === "home") {
    return <HomeCommercial onNavigate={handleHomeNavigation} />
  }

  if (currentView === "seller-agreements-selection") {
    return (
      <SellerAgreementsSelection 
        onBack={() => setCurrentView("home")}
        onSelectOption={(option) => {
          if (option === 'cartera-asesorada') {
            // Por ahora, redirigir al dashboard existente
            setCurrentView("dashboard")
          } else if (option === 'smbs') {
            // Iniciar el flujo de trabajo SMB
            setCurrentView("smb-workflow")
          }
        }}
      />
    )
  }

  if (currentView === "smb-workflow") {
    return (
      <SMBWorkflow 
        onBack={() => setCurrentView("seller-agreements-selection")}
        onNext={(data) => {
          // Aquí se puede manejar el siguiente paso del flujo SMB
          console.log('Datos del seller SMB:', data);
        }}
      />
    )
  }

    if (currentView === "promotions-dashboard") {
    return (
      <PromotionsDashboard
        onBack={() => setCurrentView("home")}
        onNewPromotion={() => setCurrentView("promotion-type-selection")}
      />
    )
  }

  if (currentView === "promotion-type-selection") {
    return (
      <PromotionTypeSelection
        onBack={() => setCurrentView("home")}
        onSelectType={handlePromotionTypeSelection}
      />
    )
  }

  if (currentView === "promotion-flow") {
    return (
      <PromotionFlow
        onBack={() => setCurrentView("promotion-type-selection")}
        promotionType={selectedPromotionType}
        onComplete={(data) => {
          console.log('Nueva promoción creada:', data, 'Tipo:', selectedPromotionType);
          setCurrentView("promotions-dashboard");
        }}
      />
    )
  }

  if (currentView === "internal-agreements-dashboard") {
    return (
      <InternalAgreementsDashboard 
        onViewDetail={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("agreement-detail-readonly");
        }}
        onEditAgreement={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("create-improved");
        }}
        onViewPerformance={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("agreement-performance");
        }}
        onManageAudience={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("audience-management");
        }}
        onViewApprovalStatus={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("approval-status");
        }}
        onCreateAgreement={() => {
          setCurrentView("create-improved");
        }}
        onBack={() => setCurrentView("home")}
      />
    )
  }

  if (currentView === "create") {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 overflow-auto">
          <CreateAgreementFlow onBack={() => setCurrentView("dashboard")} />
        </div>
      </div>
    )
  }

  if (currentView === "create-improved") {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto">
          <CreateAgreementFlowImproved 
            onBack={() => setCurrentView("home")} 
            onNavigateToInternalAgreements={() => setCurrentView("internal-agreements-dashboard")}
            preselectedType={selectedAgreementType}
          />
        </div>
      </div>
    )
  }



  if (currentView === "mp-demo") {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 overflow-auto">
          <MPDemo />
        </div>
      </div>
    )
  }

  if (currentView === "andes-ui-demo") {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 overflow-auto">
          <AndesUIDemo onBack={() => setCurrentView("home")} />
        </div>
      </div>
    )
  }

  if (currentView === "agreement-priorities") {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 overflow-auto">
          <AgreementPriorities onBack={() => setCurrentView("home")} />
        </div>
      </div>
    )
  }

  if (currentView === "sellers-consultation") {
    return (
      <SellersConsultation 
        onBack={() => setCurrentView("home")} 
        onViewSellerDetail={(seller) => {
          setSelectedSeller(seller);
          setCurrentView("seller-detail");
        }}
      />
    )
  }

  if (currentView === "seller-mvp-consultation") {
    return (
      <SellerMVPConsultation 
        onBack={() => setCurrentView("home")} 
      />
    )
  }

  if (currentView === "seller-detail" && selectedSeller) {
    return (
      <SellerDetail 
        seller={selectedSeller}
        onBack={() => setCurrentView("sellers-consultation")}
        onViewAgreementDetail={() => setCurrentView("base-agreement-detail")}
        onViewTransactionalQuery={() => setCurrentView("transactional-query")}
      />
    )
  }

  if (currentView === "base-agreement-detail" && selectedSeller) {
    return (
      <BaseAgreementDetail 
        seller={selectedSeller}
        onBack={() => setCurrentView("seller-detail")} 
      />
    )
  }

  if (currentView === "transactional-query" && selectedSeller) {
    return (
      <TransactionalQuery 
        seller={selectedSeller}
        onBack={() => setCurrentView("seller-detail")} 
      />
    )
  }

  if (currentView === "detail" && selectedAgreement) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 overflow-auto">
          <AgreementDetail
            agreement={selectedAgreement}
            onBack={() => setCurrentView("dashboard")}
            onEdit={() => {
              /* TODO: Implement edit flow */
            }}
          />
        </div>
      </div>
    )
  }

  if (currentView === "agreement-type-selection") {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <div className="flex-1 overflow-auto">
          <AgreementTypeSelection 
            onBack={() => setCurrentView("home")}
            onSelectType={handleAgreementTypeSelection} 
          />
        </div>
      </div>
    )
  }

  if (currentView === "agreement-detail-readonly" && selectedAgreement) {
    return (
      <AgreementDetailReadonly
        agreement={selectedAgreement}
        onBack={() => setCurrentView("internal-agreements-dashboard")}
      />
    )
  }

  if (currentView === "agreement-performance" && selectedAgreement) {
    return (
      <AgreementPerformance
        agreement={selectedAgreement}
        onBack={() => setCurrentView("internal-agreements-dashboard")}
      />
    )
  }

  if (currentView === "audience-management" && selectedAgreement) {
    return (
      <AudienceManagement
        agreement={selectedAgreement}
        onBack={() => setCurrentView("internal-agreements-dashboard")}
        onAddSellerManual={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("add-seller-manual");
        }}
        onUploadSellersList={(agreement) => {
          setSelectedAgreement(agreement);
          setCurrentView("upload-sellers-list");
        }}
      />
    )
  }

  if (currentView === "approval-status" && selectedAgreement) {
    return (
      <ApprovalStatus
        agreement={selectedAgreement}
        onBack={() => setCurrentView("internal-agreements-dashboard")}
      />
    )
  }

  if (currentView === "add-seller-manual" && selectedAgreement) {
    return (
      <AddSellerManual
        agreement={selectedAgreement}
        onBack={() => setCurrentView("audience-management")}
      />
    )
  }

  if (currentView === "upload-sellers-list" && selectedAgreement) {
    return (
      <UploadSellersList
        agreement={selectedAgreement}
        onBack={() => setCurrentView("audience-management")}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Internal Agreements</h1>
              <p className="text-gray-600">Gestiona precios y campañas de forma centralizada</p>
            </div>
            <Button onClick={() => setCurrentView("create")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Acuerdo
            </Button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                  {kpi.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {kpi.trend === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <p
                    className={`text-xs ${
                      kpi.trend === "up"
                        ? "text-green-600"
                        : kpi.trend === "warning"
                          ? "text-yellow-600"
                          : "text-gray-600"
                    }`}
                  >
                    {kpi.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar acuerdos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo de acuerdo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="ISCA">ISCA</SelectItem>
                <SelectItem value="PxE">Pricing por Escala</SelectItem>
                <SelectItem value="audience">Audiencia específica</SelectItem>
                <SelectItem value="always-on">Always-On</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agreements Table */}
          <Card>
            <CardHeader>
              <CardTitle>Acuerdos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agreements.map((agreement) => (
                  <div
                    key={agreement.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{agreement.name}</h3>
                        <Badge variant={agreement.type === "ISCA" ? "default" : "secondary"}>{agreement.type}</Badge>
                        <Badge variant={agreement.status === "active" ? "default" : "secondary"}>
                          {agreement.status === "active" ? "Activo" : "Pausado"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {agreement.audience}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {agreement.commission}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {agreement.expires}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          {agreement.performance}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewAgreement(agreement)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
