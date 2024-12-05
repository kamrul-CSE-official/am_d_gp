'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Select from 'react-select' // Import react-select
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface GatePassType {
  GatepassNo: string
}

interface CostCenter {
  SubCostCenterID: number
  SubCostCenter: string
}

interface Employee {
  EmpID: number
  EmpName: string
}

export default function RptAODGenerate() {
  const [gatepassTypeID, setGatepassTypeID] = useState<string>('')
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date())
  const [toDate, setToDate] = useState<Date | undefined>(new Date())
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchGatePassTypes = async () => {
    if (!fromDate || !toDate) return

    setIsLoading(true)
    try {
      const response = await axios.post<GatePassType[]>(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetGoodsDeliveryGatepass',
        {
          FromDate: format(fromDate, 'yyyy-MM-dd'),
          ToDate: format(toDate, 'yyyy-MM-dd')
        }
      )
      setGatePassTypes(response.data)
    } catch (error) {
      toast.error("Failed to fetch gate pass types.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (fromDate && toDate) {
      fetchGatePassTypes()
    }
  }, [fromDate, toDate])

  const handleViewReport = () => {
    if (!gatepassTypeID) {
      toast.error("Please select a Gatepass No.")
      return
    }

    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx'
    const reportPath = '%2fAODReport'
    const reportUrl = `${reportServerUrl}?${reportPath}&rs:Command=Render&GatepassNo=${encodeURIComponent(gatepassTypeID)}`
    window.open(reportUrl, '_blank')
  }

  // Map gate pass types to react-select options format
  const gatePassOptions = gatePassTypes.map((type) => ({
    value: type.GatepassNo,
    label: type.GatepassNo
  }))

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Goods Delivery AOD</CardTitle>
          <Button onClick={handleViewReport} disabled={!gatepassTypeID}>
            <FileText className="mr-2 h-4 w-4" /> AOD Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="fromDate" className="text-sm font-medium">From Date</label>
              <input
                id="fromDate"
                type="date"
                value={fromDate ? format(fromDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setFromDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="toDate" className="text-sm font-medium">To Date</label>
              <input
                id="toDate"
                type="date"
                value={toDate ? format(toDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setToDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gatepassNo" className="text-sm font-medium">Gatepass No</label>
              <Select
                id="gatepassNo"
                options={gatePassOptions} // Use options from gatePassTypes
                value={gatePassOptions.find(option => option.value === gatepassTypeID)} // Find the selected value
                onChange={(selectedOption) => setGatepassTypeID(selectedOption?.value || '')} // Set the selected value
                placeholder="Select Gatepass No"
                isLoading={isLoading} // Show loading indicator while fetching
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
