"use client";

import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { GrClear } from "react-icons/gr";
import { UserInfo } from "@/service/auth.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/helper/axios/axiosInstance";
import { Title } from "@/components/ui/title";
import toast from "react-hot-toast";

interface Approver {
  GatePassReqDetailID: number;
  ReqCode: string;
  Name: string;
  DepartmentAndSection: string;
  Status: string;
  FirstApp: string | null;
  SecApp: string | null;
  FirstGatePassApprovalID: number | null;
  SecondGatePassApprovalID: number | null;
  FirstApprovalEmpList: { AutherisedEmpID: string; Name: string }[];
  SecondApprovalEmpList: { AutherisedEmpID: string; Name: string }[];
  GatePassType: string;
}

export default function ChangeApproverPage() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "error"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getData = async () => {
    try {
      const req = await axiosInstance.post(
        "api/User/GetReqDetailsForChangeApp",
        {
          RequestBy: UserInfo()?.EmpID || 0,
        }
      );
      console.log("Details: ", req);
      if (req.data) {
        setApprovers(req.data);
      }
    } catch (error) {
      console.error("Error fetching approver data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [alertSeverity]);

  // Calculate paginated data
  const paginatedApprovers = approvers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSaveApprover = async () => {
    const FinalList = approvers
      .filter((approver) => selectedIds.includes(approver.GatePassReqDetailID))
      .map((approver) => ({
        GatePassReqDetailID: approver.GatePassReqDetailID,
        FirstApp: approver.FirstApp,
        SecApp: approver.SecApp,
        FirstGatePassApprovalID: approver.FirstGatePassApprovalID,
        SecondGatePassApprovalID: approver.SecondGatePassApprovalID,
      }));

    console.log("Selected IDs: ", selectedIds);
    console.log("Filtered Approvers: ", approvers.filter((approver) => selectedIds.includes(approver.GatePassReqDetailID)));
    console.log("Final list: ", FinalList);

    if (FinalList.length > 0) {
      try {
        const response = await axiosInstance.post(
          "api/User/UpdateReqDetailsForAuth",
          FinalList
        );
        console.log("Auth: ", response);
        toast.success("Request processed successfully.");
        setAlertSeverity("success");
        // Re-fetch approvers to update data
        await getData();
      } catch (error) {
        toast.error("Failed to process request.");
        setAlertSeverity("error");
      }
    } else {
      toast.error("No approvers selected.");
      setAlertSeverity("error");
    }
  };

  const handleClearGrid = () => {
    setSelectedIds([]);
    setApprovers((prevApprovers) =>
      prevApprovers.map((approver) => ({
        ...approver,
        FirstApp: null,
        SecApp: null,
      }))
    );
  };

  const handleCheckboxChange =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelectedIds((prev) => [...prev, id]);
      } else {
        setSelectedIds((prev) =>
          prev.filter((selectedId) => selectedId !== id)
        );
      }
    };

  const totalPages = Math.ceil(approvers.length / pageSize);

  return (
    <Card className="w-full">
      <CardHeader>
        <Title variant="primary" size="md">
          Change Gatepass Approver
        </Title>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Actions</TableHead>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Request Code</TableHead>
              <TableHead>Request For</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>First Approval</TableHead>
              <TableHead>Second Approval</TableHead>
              <TableHead>Gatepass Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApprovers.map((approver, i) => (
              <TableRow key={approver.GatePassReqDetailID}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(approver.GatePassReqDetailID)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds((prev) => [...prev, approver.GatePassReqDetailID]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== approver.GatePassReqDetailID)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{(currentPage - 1) * pageSize + i + 1}</TableCell>
                <TableCell>{approver.ReqCode}</TableCell>
                <TableCell>{approver.Name}</TableCell>
                <TableCell>{approver.DepartmentAndSection}</TableCell>
                <TableCell>
                  <Badge variant="outline">{approver.Status}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={approver.FirstApp || ""}
                    onValueChange={(value) => {
                      setApprovers(
                        approvers.map((appr) =>
                          appr.GatePassReqDetailID === approver.GatePassReqDetailID
                            ? { ...appr, FirstApp: value }
                            : appr
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select first approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {approver.FirstApprovalEmpList.map((firstApp, i) => (
                        <SelectItem key={i} value={firstApp.AutherisedEmpID}>
                          {firstApp.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={approver.SecApp || ""}
                    onValueChange={(value) => {
                      setApprovers(
                        approvers.map((appr) =>
                          appr.GatePassReqDetailID === approver.GatePassReqDetailID
                            ? { ...appr, SecApp: value }
                            : appr
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select second approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {approver.SecondApprovalEmpList.map((secondApp, i) => (
                        <SelectItem key={i} value={secondApp.AutherisedEmpID}>
                          {secondApp.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{approver.GatePassType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="default" onClick={handleSaveApprover}>
            <FaSave className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="destructive" onClick={handleClearGrid}>
            <GrClear className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
