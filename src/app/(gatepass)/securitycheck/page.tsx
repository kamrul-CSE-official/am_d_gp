"use client";

import React, { useState, useEffect } from "react";
import { Title } from "@/components/ui/title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/helper/axios/axiosInstance";
import GeneralAndMedicalTable from "./components/generalAndMedicalTable";
import { FaSpinner } from "react-icons/fa";
import ReturnableTableAndNonRet from "./components/returnable";
import VehicleTable from "./components/vehicle"; // Assuming you have a VehicleTable component

interface GatePass {
  ReqCode: string;
  GatePassReqHeaderID: number;
  DepartmentAndSection: string;
  GatePassReqDetailID: number;
  InTime: string;
  OutTime: string;
  OutM: number;
  InM: number;
  GatePassType: string;
  GatePassTypeID: number;
  Name: string;
  TransportNo: string;
  HelperID: number;
  Image: Uint8Array;
  ImageBase64: string;
  DriverID: number;
  Remarks: string;
  EnteredBy: number;
  Quantity: number;
  ReceivedQuantity: number;
}

const securityCheckTypes = [
  { name: "General", value: "1" },
  { name: "Medical", value: "2" },
  { name: "Returnable", value: "3" },
  { name: "Non-Returnable", value: "4" },
  { name: "Vehicle", value: "5" },
];

export default function Securitycheck() {
  const [selectedValue, setSelectedValue] = useState<string>("1");  // Use string as Select stores value as string
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const fetchGatePasses = async (gatePassType: number) => {
    setLoading(true);
    setError(null);  // Reset any previous error
    try {
      const response = await axiosInstance.post(
        "/api/GatePass/GetGatePassStatusForSecurityNew",
        {
          GatePassTypeID: gatePassType,
        }
      );
      setGatePasses(response.data);
    } catch (error) {
      setError("Failed to load data. Please try again.");
      console.error("API call failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (updateData: Partial<GatePass>) => {
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(
        ([key, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    try {
      await axiosInstance.post("/api/GatePass/UpdateStatus", [filteredData]);
      fetchGatePasses(Number(selectedValue));  // Refresh data after update
    } catch (error) {
      setError("Failed to update status. Please try again.");
      console.error("Update failed", error);
    }
  };

  useEffect(() => {
    fetchGatePasses(Number(selectedValue));  // Fetch data on initial render
  }, [selectedValue]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <Title variant="primary">
          Security Indexing - "{securityCheckTypes.find(type => type.value === selectedValue)?.name}"
        </Title>
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <Select value={selectedValue} onValueChange={handleChange}>
            <SelectTrigger className="w-[180px] border border-gray-300 rounded-md">
              <SelectValue placeholder="Select Gate Pass Type" />
            </SelectTrigger>
            <SelectContent>
              {securityCheckTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display error message if there's an error */}
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-100 border-l-4 border-red-500 rounded">
          {error}
        </div>
      )}


      {/* Show loading spinner or the table based on the loading state */}
      <div>
        {loading ? (
          <FaSpinner className="animate-spin text-3xl text-primary" />
        ) : (
          <div>
            {selectedValue === "1" || selectedValue === "2" ? (
              <GeneralAndMedicalTable
                handleUpdateStatus={handleUpdateStatus}
                tableData={gatePasses}
              />
            ) : selectedValue === "3" || selectedValue === "4" ? (
              <ReturnableTableAndNonRet
                handleUpdateStatus={handleUpdateStatus}
                tableData={gatePasses}
              />
            ) : selectedValue === "5" ? (
              <VehicleTable
                handleUpdateStatus={handleUpdateStatus}
                tableData={gatePasses}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
