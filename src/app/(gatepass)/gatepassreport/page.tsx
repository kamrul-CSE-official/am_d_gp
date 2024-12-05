'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '@/helper/axios/axiosInstance'
import Select from 'react-select'

interface GatePassType {
  GatePassTypeID: number
  TypeName: string
}

interface CostCenter {
  SubCostCenterID: number
  SubCostCenter: string
}

interface Employee {
  EmpID: number | null
  EmpName: string | null
}

export default function GatepassReportPage() {
  const [gatepassTypeID, setGatepassTypeID] = useState<string | null>(null)
  const [inTime, setInTime] = useState<string>('')
  const [outTime, setOutTime] = useState<string>('')
  const [section, setSection] = useState<string | null>(null)
  const [empID, setEmpID] = useState<string | null>(null)
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [sections, setSections] = useState<CostCenter[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchGatePassTypes()
    fetchCostCenter()
    fetchEmpDetails()
  }, [])

  const fetchGatePassTypes = async () => {
    try {
      const response = await axiosInstance.get<GatePassType[]>('/api/User/GetGatePassTypeGatepass')
      setGatePassTypes(response.data)
    } catch (error) {
      toast.error("Failed to fetch gate pass types.")
    }
  }

  const fetchEmpDetails = async () => {
    try {
      const response = await axiosInstance.post<Employee[]>('/api/User/GetAllEmp', {
        SubCostCenterID: 0,
        GatepassTypeID: 0,
      })
      setEmployees(response.data)
    } catch (error) {
      toast.error("Failed to fetch employee details.")
    }
  }

  const fetchCostCenter = async () => {
    try {
      const response = await axiosInstance.get<CostCenter[]>('/api/Budget/GetSubCostCenter')
      setSections(response.data)
    } catch (error) {
      toast.error("Failed to fetch cost centers.")
    }
  }

  const handleViewReport = () => {
    setIsLoading(true)
    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx'
    const reportPath = '%2fGatepass'

    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&GatepassTypeID=${encodeURIComponent(gatepassTypeID || '')}` +
      `&InTime=${encodeURIComponent(inTime)}` +
      `&OutTime=${encodeURIComponent(outTime)}` +
      `&Section=${encodeURIComponent(section || '')}` +
      `&EmpID=${encodeURIComponent(empID || '')}`

    window.open(reportUrl, '_blank')
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">View Gatepass Report</CardTitle>
          <Button onClick={handleViewReport} disabled={!gatepassTypeID} >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Loading...' : 'Show/Hide'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="gatepassType" className="text-sm font-medium">Gatepass Type</label>
              <Select
                id="gatepassType"
                options={gatePassTypes.map(type => ({ value: type.GatePassTypeID, label: type.TypeName }))}
                onChange={(option) => setGatepassTypeID(option?.value || null)}
                isClearable
                placeholder="Select Gatepass Type"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="inTime" className="text-sm font-medium">In Time</label>
              <input
                type="date"
                id="inTime"
                value={inTime}
                onChange={(e) => setInTime(e.target.value)}
                className="border rounded-md p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="outTime" className="text-sm font-medium">Out Time</label>
              <input
                type="date"
                id="outTime"
                value={outTime}
                onChange={(e) => setOutTime(e.target.value)}
                className="border rounded-md p-2 w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="section" className="text-sm font-medium">Section</label>
              <Select
                id="section"
                options={sections.map(sec => ({ value: sec.SubCostCenterID, label: sec.SubCostCenter }))}
                onChange={(option) => setSection(option?.value || null)}
                isClearable
                placeholder="Select Section"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="employee" className="text-sm font-medium">Employee</label>
              <Select
                id="employee"
                options={employees.map(emp => ({ value: emp.EmpID, label: emp.EmpName }))}
                onChange={(option) => setEmpID(option?.value || null)}
                isClearable
                placeholder="Select Employee"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
