"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { FileText, Loader2 } from 'lucide-react';
import axiosInstance from '@/helper/axios/axiosInstance';

interface GatePassType {
  GatePassTypeID: number;
  TypeName: string;
}

interface CostCenter {
  SubCostCenterID: number;
  SubCostCenter: string;
}

interface Purpose {
  VehicleID: number;
  VehicleNo: string;
}

const RptDriverAssign: React.FC = () => {
  const [gatepassTypeID, setGatepassTypeID] = useState<string>('');
  const [AssignDate, setAssignDate] = useState<string>('');
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [purpose, setPurpose] = useState<Purpose[]>([]);
  const [sections, setSections] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDriver = async () => {
    try {
      const response = await axiosInstance.post<Purpose[]>(
        '/api/GatePass/GetAllVehicleDetailsWithoutTrip'
      );
      setPurpose(response.data);
    } catch (errorS) {
      setError('Failed to fetch gate pass types.');
      toast.error('Failed to fetch gate pass types.');
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  const handleViewReport = () => {
    setIsLoading(true);
    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx';
    const reportPath = '%2fVehicleAssignReport';

    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&TransportNo=${encodeURIComponent(gatepassTypeID.split('/')[0])}` +
      `&AssignDate=${encodeURIComponent(AssignDate)}`;

    window.open(reportUrl, '_blank');
    setIsLoading(false);
  };

  const mapToSelectOptions = (data: any[], labelKey: string, valueKey: string) => {
    return data.map(item => ({ label: item[labelKey], value: item[valueKey].toString() }));
  };

  return (
    <>
     
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Driver Assign Report</CardTitle>
            <Button disabled={!gatepassTypeID} onClick={handleViewReport}>
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Show
                </span>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="gatepassType" className="text-sm font-medium">
                  Driver
                </label>
                <Select
                  id="gatepassType"
                  options={mapToSelectOptions(purpose, 'VehicleNo', 'VehicleNo')}
                  value={mapToSelectOptions(purpose, 'VehicleNo', 'VehicleNo').find(
                    option => option.value === gatepassTypeID
                  )}
                  onChange={option => setGatepassTypeID(option?.value || '')}
                  placeholder="Select Driver"
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="AssignDate" className="text-sm font-medium">
                  Assign Date
                </label>
                <input
                  type="date"
                  id="AssignDate"
                  value={AssignDate}
                  onChange={e => setAssignDate(e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RptDriverAssign;
