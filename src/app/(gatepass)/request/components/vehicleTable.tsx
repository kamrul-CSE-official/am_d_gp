import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/helper/axios/axiosInstance";
import { UserInfo } from "@/service/auth.service";
import useStore from "@/zustand/store";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { GrClear } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

export default function VehicleTable() {
  const {
    getPassvehicles,
    delteteAvehicle,
    gatePassFirstApprover,
    gatePassSecondApprover,
    gatePassRequestType,
    clearAll,
  } = useStore();

  const route = useRouter();

  const handleDelete = (employeeId: string) => {
    // @ts-ignore
    delteteAvehicle(employeeId);
    toast.success("Vehicle request added.");
  };

  const handleSave = async () => {
    const payload = {
      objReq: {
        CompanyID: UserInfo?.()?.CompanyID,
        ServiceDepartmentID: 0,
        CostCenterID: UserInfo?.()?.CostCenterID,
        SubCostCenterID: UserInfo?.()?.SubCostCenterID,
        LocationID: 0,
        FirstAppUserID: gatePassFirstApprover?.SubCostRequisitionApprovalID,
        SecAppUserID: gatePassSecondApprover?.SubCostRequisitionApprovalID,
        GatePassTypeID: gatePassRequestType?.GatePassTypeID,
        GatePassStatusID: 1,
        EnteredBy: UserInfo?.()?.EmpID,
      },
      lstReqDetail: getPassvehicles,
    };

    const req = await axiosInstance.post(
      "/api/Gatepass/SaveGatePassRequest",
      payload
    );
    toast.success("Gatepass request send successfully");
    clearAll?.();
    route.push("/dashboard/status")
  };

  const handleClear = () => {
    clearAll?.();
  };

  return (
    <div>
      <div className="w-full flex items-center justify-end gap-3 p-5">
        <Button onClick={() => handleSave()}>
          Save <Save />
        </Button>
        <Button onClick={() => handleClear()} variant="destructive">
          Clear <GrClear />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Pickup Time</TableHead>
              <TableHead>Return Time</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getPassvehicles && getPassvehicles.length > 0 ? (
              getPassvehicles.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{item.employeeID}</TableCell>
                  <TableCell>{item.ApxPickup}</TableCell>
                  <TableCell>{item.ApxReturn}</TableCell>
                  <TableCell>{item.Destination}</TableCell>
                  <TableCell>{item.remarks}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.employeeID as string)}
                    >
                      <MdDelete className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No requests available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
