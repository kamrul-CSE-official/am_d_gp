"use client";

import React, { useEffect, useState } from "react";
import { UserInfo } from "@/service/auth.service";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/helper/axios/axiosInstance";

interface IGatepassStatusDetails {
  GatePassReqHeaderID: number;
  ReqCode: string;
  DepartmentAndSection: string;
  ImageBase64?: string;
  GatePassType: string;
  GatePassTypeID: number;
  Status: string;
  FirstApp: string;
  GatePassStatusID: number;
  SecApp: string;
  GatePassReqDetailID: number;
  Remarks: string;
  RequestDetail: string;
}

interface ApprovalItem {
  GatePassTypeID: number;
  Type: string;
  EmpID: number;
  EmpNo: string;
  EmpName: string;
  Remarks: string;
  ItemID: number;
  Quantity: number;
  ItemCode: string;
  ItemDescription: string;
  DriverName: string;
  Destination: string;
  ApxTime: Date;
  PickupTime: Date;
  GatePassReqHeaderID: number;
  StatusID: number;
  ApproveUserID: number;
  GatePassReqDetailID: number;
  ApprovalStatus: string;
  ApproverRemarks: string;
}

interface FinalObject {
  Type: string;
  GatePassReqDetailID: number;
  GatePassReqHeaderID: number;
  GatePassTypeID: number;
  GatePassReqStatusID: number;
  ApprovedBy: number;
  ApprovalRemarks: string;
}

export default function ApprovePage() {
  const [approval, setApproval] = useState<IGatepassStatusDetails[]>([]);
  const [approvalDetails, setApprovalDetails] = useState<ApprovalItem[]>([]);
  const [gatepassTypeID, setGatepassTypeID] = useState<number>(0);
  const [gatepassStatusID, setGatepassStatusID] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [approvalRemarks, setApprovalRemarks] = useState<string>("");
  const [headId, setHeadId] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [done, setDone] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.post(
          "/api/Gatepass/GetPendingApproval",
          { EmpID: UserInfo()?.EmpID }
        );
        setApproval(response.data);
      } catch (error) {
        console.error("API call failed", error);
      }
    };
    getData();
  }, [done]);

  const fetchApprovalDetails = async (Id: number, StatusID: number) => {
    setHeadId(Id);
    try {
      const response = await axiosInstance.post(
        "/api/Gatepass/GetPendingApprovalDetail",
        {
          GatePassReqHeaderID: Id,
          StatusID,
          ApproveUserID: UserInfo()?.EmpID,
        }
      );
      setApprovalDetails(response.data);
      console.log("Approver details: ", response.data);
    } catch (error) {
      console.error("API call failed", error);
    }
  };

  const handleOpenDialogue = (index: IGatepassStatusDetails) => {
    setIsModalOpen(true);
    fetchApprovalDetails(index.GatePassReqHeaderID, index.GatePassStatusID);
    setGatepassTypeID(index.GatePassTypeID);
    setGatepassStatusID(index.GatePassStatusID);
  };

  const handleRequestReject = async () => {
    const FinalList: FinalObject[] = selectedIds.map((id) => ({
      Type: "R",
      GatePassReqDetailID: id,
      GatePassReqHeaderID: headId,
      GatePassTypeID: gatepassTypeID,
      GatePassReqStatusID: gatepassStatusID,
      ApprovedBy: Number(UserInfo()?.EmpID) as number,
      ApprovalRemarks: approvalRemarks,
    }));

    try {
      const reject = await axiosInstance.post(
        "/api/Gatepass/ApprovedGatePassRequest",
        FinalList
      );
      console.log(reject);
      toast.success("Requests rejected successfully.");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to reject requests.");
    }
    setIsModalOpen(false);
    setDone(done + 1);
  };

  const handleRequestAccept = async () => {
    if (!selectedIds.length) {
      toast.error("Please select at least one request to approve.");
      return;
    }

    const FinalList: FinalObject[] = selectedIds.map((id) => ({
      Type: "A",
      GatePassReqDetailID: id,
      GatePassReqHeaderID: headId,
      GatePassTypeID: gatepassTypeID,
      GatePassReqStatusID: gatepassStatusID,
      ApprovedBy: Number(UserInfo()?.EmpID) as number,
      ApprovalRemarks: approvalRemarks,
    }));

    try {
      const approve = await axiosInstance.post(
        "/api/Gatepass/ApprovedGatePassRequest",
        FinalList
      );
      console.log(approve);
      toast.success("Requests approved successfully.");
    } catch (error) {
      toast.error("Failed to approve requests.");
    }
    setIsModalOpen(false);
    setDone(done + 1);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Approval Gatepass</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Request Code</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Gate Pass Type</TableHead>
              <TableHead>Department / Section</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approval.reverse().map((approv, i) => (
              <TableRow key={i + done}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{approv.ReqCode}</TableCell>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`data:image/jpeg;base64,${approv.ImageBase64}`}
                      alt={`${approv.GatePassTypeID}`}
                    />
                    <AvatarFallback>{approv.GatePassType[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{approv.GatePassType}</TableCell>
                <TableCell>{approv.DepartmentAndSection}</TableCell>
                <TableCell>{approv.RequestDetail}</TableCell>
                <TableCell>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialogue(approv)}
                      >
                        Requests
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Gatepass Details</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>#</TableHead>
                            <TableHead>Emp No</TableHead>
                            <TableHead>Request User Name</TableHead>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approvalDetails.reverse().map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedIds.includes(
                                    detail.GatePassReqDetailID
                                  )}
                                  onCheckedChange={() =>
                                    handleCheckboxChange(
                                      detail.GatePassReqDetailID
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{detail.EmpNo}</TableCell>
                              <TableCell>{detail.EmpName}</TableCell>
                              <TableCell>{detail.ItemID}</TableCell>
                              <TableCell>{detail.GatePassReqDetailID}</TableCell>
                              <TableCell>{detail.Remarks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="ApproverRemarks">
                          Approver Remarks
                        </Label>
                        <Textarea
                          id="ApproverRemarks"
                          value={approvalRemarks}
                          onChange={(e) => setApprovalRemarks(e.target.value)}
                          placeholder="Enter your remarks here"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={handleRequestAccept} variant="default">
                          Accept
                        </Button>
                        <Button
                          onClick={handleRequestReject}
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
