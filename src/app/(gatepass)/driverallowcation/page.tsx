'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '@/helper/axios/axiosInstance'

interface VehicleDetails {
  VehicleNo: string
  VehicleID: number
}

interface Driver {
  DriverName: string
  DriverID: number
}

interface Helper {
  HelperWithID: string
  HelperID: number
}

interface GatePassReqDetail {
  GatePassReqDetailID: number
  ReqCode: string
  DepartmentAndSection: string
  GatePassType: string
  GatePassReqHeaderID: number
  TransportNo: string | number
  DriverID: number
  HelperID: number
  Name: string
}

export default function DriverAllocationPage() {
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails[]>([])
  const [driverNames, setDriverNames] = useState<Driver[]>([])
  const [helperDetails, setHelperDetails] = useState<Helper[]>([])
  const [vehicleRecord, setVehicleRecord] = useState<GatePassReqDetail[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [remarks, setRemarks] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchDataSequentially()
  }, [])

  const fetchDataSequentially = async () => {
    setIsLoading(true)
    try {
      await fetchGatepassDetails()
      await fetchDriverDetails()
      await fetchHelperDetails()
      await fetchTransportDetails()
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error("Failed to fetch data. Please try again.")
    }
    setIsLoading(false)
  }

  const fetchGatepassDetails = async () => {
    const response = await axiosInstance.post('/api/Gatepass/GetGatePassForTransportNo')
    setVehicleRecord(response.data)
  }

  const fetchDriverDetails = async () => {
    const response = await axiosInstance.post('/api/Gatepass/GetDriverNames')
    setDriverNames(response.data)
  }

  const fetchHelperDetails = async () => {
    const response = await axiosInstance.post('/api/Gatepass/GetVehicleHelperDetails')
    setHelperDetails(response.data)
  }

  const fetchTransportDetails = async () => {
    const response = await axiosInstance.post('/api/Gatepass/GetAllVehicleDetails')
    setVehicleDetails(response.data)
  }

  const handleSaveDriver = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one row.")
      return
    }

    const finalList = selectedIds
      .map(id => {
        const row = vehicleRecord.find(r => r.GatePassReqDetailID === id)
        if (row && row.DriverID !== 0 && row.TransportNo != null) {
          return {
            GatePassReqDetailID: row.GatePassReqDetailID,
            TransportNo: row.TransportNo,
            Remarks: remarks,
            EnteredBy: 1, // Replace with actual user ID
            DriverID: row.DriverID,
            HelperID: row.HelperID,
          }
        }
        return null
      })
      .filter(Boolean)

    if (finalList.length === 0) {
      toast.error("No valid rows selected. Ensure Transport No and Driver are selected for each row.")
      return
    }

    try {
      await axiosInstance.post('/api/Gatepass/UpdateTransportNo', finalList)
      toast.success( "Driver allocation saved successfully.")
      fetchDataSequentially()
    } catch (error) {
      console.error('Failed to save driver allocation:', error)
      toast.error("Failed to save driver allocation. Please try again.")
    }
  }

  const handleRequestReject = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one row to reject.")
      return
    }

    const finalList = selectedIds.map(id => ({
      GatePassReqDetailID: id,
      Remarks: remarks,
      EnteredBy: 1, // Replace with actual user ID
    }))

    try {
      await axiosInstance.post('/api/Gatepass/RejectTransportAllocation', finalList)
      toast.success("Requests rejected successfully.")
      fetchDataSequentially()
    } catch (error) {
      console.error('Failed to reject requests:', error)
      toast.error("Failed to reject requests. Please try again.")
    }
  }

  const handleChangeTransport = (value: string, id: number) => {
    setVehicleRecord(prev => prev.map(item => 
      item.GatePassReqDetailID === id ? { ...item, TransportNo: value, DriverID: 0 } : item
    ))
  }

  const handleChangeDriver = (value: string, id: number) => {
    setVehicleRecord(prev => prev.map(item => 
      item.GatePassReqDetailID === id ? { ...item, DriverID: parseInt(value) } : item
    ))
  }

  const handleChangeHelper = (value: string, id: number) => {
    setVehicleRecord(prev => prev.map(item => 
      item.GatePassReqDetailID === id ? { ...item, HelperID: parseInt(value) } : item
    ))
  }

  return (
    <div className="container mx-auto py-10">
   

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Driver Allocation</CardTitle>
          <Button onClick={fetchDataSequentially} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Request Code</TableHead>
                  <TableHead>Department & Section</TableHead>
                  <TableHead>Transport No</TableHead>
                  <TableHead>Change Driver</TableHead>
                  <TableHead>Helper</TableHead>
                  <TableHead>Request By-Destination-Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleRecord.map((row) => (
                  <TableRow key={row.GatePassReqDetailID} className={row.DriverID && row.TransportNo ? 'bg-yellow-50' : 'bg-green-50'}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(row.GatePassReqDetailID)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(prev => 
                            checked
                              ? [...prev, row.GatePassReqDetailID]
                              : prev.filter(id => id !== row.GatePassReqDetailID)
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.ReqCode}</TableCell>
                    <TableCell>{row.DepartmentAndSection}</TableCell>
                    <TableCell>
                      <Select
                        value={row.TransportNo?.toString() || ''}
                        onValueChange={(value) => handleChangeTransport(value, row.GatePassReqDetailID)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleDetails.map((vehicle) => (
                            <SelectItem key={vehicle.VehicleID} value={vehicle.VehicleNo}>
                              {vehicle.VehicleNo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.DriverID?.toString() || ''}
                        onValueChange={(value) => handleChangeDriver(value, row.GatePassReqDetailID)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {driverNames.map((driver) => (
                            <SelectItem key={driver.DriverID} value={driver.DriverID.toString()}>
                              {driver.DriverName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.HelperID?.toString() || ''}
                        onValueChange={(value) => handleChangeHelper(value, row.GatePassReqDetailID)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select helper" />
                        </SelectTrigger>
                        <SelectContent>
                          {helperDetails.map((helper) => (
                            <SelectItem key={helper.HelperID} value={helper.HelperID.toString()}>
                              {helper.HelperWithID}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{row.Name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 space-y-4">
            <Input
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleSaveDriver}>Save</Button>
              <Button onClick={handleRequestReject} variant="secondary">Reject</Button>
              <Button onClick={fetchDataSequentially} variant="outline">Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}