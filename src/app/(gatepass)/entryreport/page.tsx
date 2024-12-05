"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Select from "react-select";
import toast from "react-hot-toast";
import axiosInstance from "@/helper/axios/axiosInstance";
import { FileText, Loader2 } from "lucide-react";

interface GatePassType {
  GatePassTypeID: number;
  TypeName: string;
}

interface CostCenter {
  SubCostCenterID: number;
  SubCostCenter: string;
}

interface Purpose {
  PurposeTypeID: number;
  PurposeType: string;
}

const RptEntryReport: React.FC = () => {
  const [gatepassTypeID, setGatepassTypeID] = useState<string>("");
  const [inTime, setInTime] = useState<string>("");
  const [outTime, setOutTime] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [purpose, setPurpose] = useState<Purpose[]>([]);
  const [sections, setSections] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurpose = async () => {
    try {
      const response = await axiosInstance.get<Purpose[]>(
        "/api/GatePass/GetAllPurpose"
      );
      setPurpose(response.data);
      console.log("Entry purpose: ",purpose)
    } catch (errorS) {
      setError("Failed to fetch gate pass types.");
    }
  };


  const fetchGatePassTypes = async () => {
    try {
      const response = await axiosInstance.get<GatePassType[]>('/api/User/GetGatePassTypeGatepass')
      setGatePassTypes(response.data)
    } catch (error) {
      toast.error("Failed to fetch gate pass types.")
    }
  }

  useEffect(() => {
    fetchPurpose();
    fetchGatePassTypes();
  }, []);

  const handleViewReport = () => {
    setIsLoading(true);
    const reportServerUrl =
      "http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx";
    const reportPath = "%2fGatepassEntry";

    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&PurposeTypeID=${encodeURIComponent(gatepassTypeID)}` +
      `&FromDate=${encodeURIComponent(inTime)}` +
      `&ToDate=${encodeURIComponent(outTime)}`;

    window.open(reportUrl, "_blank");
    setIsLoading(false);
  };

  const mapToSelectOptions = (
    data: any[],
    labelKey: string,
    valueKey: string
  ) => {
    return data.map((item) => ({
      label: item[labelKey],
      value: item[valueKey].toString(),
    }));
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              View Entry Report
            </CardTitle>
            <Button disabled={!gatepassTypeID} onClick={handleViewReport} >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Show/Hide
                </span>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="gatepassType" className="text-sm font-medium">
                  Gatepass Type
                </label>
                <Select
                  id="gatepassType"
                  options={mapToSelectOptions(
                    gatePassTypes,
                    "TypeName",
                    "GatePassTypeID"
                  )}
                  value={mapToSelectOptions(
                    gatePassTypes,
                    "TypeName",
                    "GatePassTypeID"
                  ).find((option) => option.value === gatepassTypeID)}
                  onChange={(option) => setGatepassTypeID(option?.value || "")}
                  placeholder="Select Gatepass Type"
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="inTime" className="text-sm font-medium">
                  In Time
                </label>
                <input
                  type="date"
                  id="inTime"
                  value={inTime}
                  onChange={(e) => setInTime(e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="outTime" className="text-sm font-medium">
                  Out Time
                </label>
                <input
                  type="date"
                  id="outTime"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
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

export default RptEntryReport;
