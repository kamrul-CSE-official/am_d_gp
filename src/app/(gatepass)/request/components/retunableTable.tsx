import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function ReturnableTable() {
  const {
    getPassReturnableNonReturnable,
    delteteAItem,
    clearAll,
    gatePassFirstApprover,
    gatePassSecondApprover,
    gatePassRequestType,
  } = useStore();

  const route = useRouter();

  const handleDelete = (index: number) => {
    // @ts-ignore
    delteteAItem(index);
    toast.success("Item deleted.");
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
      lstReqDetail: getPassReturnableNonReturnable,
    };

    const req = await axiosInstance.post(
      "/api/Gatepass/SaveGatePassRequest",
      payload
    );
    console.log("Request: ", req);
    toast.success("Gatepass request send successfully");
    clearAll?.();
    route.push("/dashboard/status");
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
              <TableHead>Store ID</TableHead>
              <TableHead>Store Name</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getPassReturnableNonReturnable &&
            getPassReturnableNonReturnable.length > 0 ? (
              getPassReturnableNonReturnable.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.storesID}</TableCell>
                  <TableCell>{item.storesName}</TableCell>
                  <TableCell>{item.itemID}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.remarks}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.storesID)}
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
