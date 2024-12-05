"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoAdd } from "react-icons/io5";
import { Title } from "@/components/ui/title";
import useStore from "@/zustand/store";
import { GrPrevious } from "react-icons/gr";
import FirstApprover from "./components/firstApprover";
import GatePassType from "./components/gatePassType";
import SecondApprover from "./components/secondApprover";
import ReturnableAndNonRetunable from "./components/returnableAndNonreturnable";
import GeneralAndMedicalUserInfo from "./components/generalAndMedical";
import VehicleInfo from "./components/vehicleInfo";
import { Badge } from "@/components/ui/badge";
import GeneralTable from "./components/genrealRequestTable";
import MedicaleTable from "./components/medicalTable";
import RetunableTable from "./components/retunableTable";
import NonReturnableTable from "./components/nonReturnableTable";
import VehicleTable from "./components/vehicleTable";

// Type for a request (for better type safety)
type Request = {
  employeeNo: number;
  EmpBase64: string;
  fullName: string;
  section: string;
  remarks: string;
};

const GatePassPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    getPassReturnableNonReturnable,
    gatePassRequestType,
    gatePassFirstApprover,
    gatePassSecondApprover,
    decreaseGatePassRequestSteps,
    gatePassRequestCurrentSteps,
  } = useStore();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Title
            title=" Gate Pass Request"
            variant="primary"
            size="md"
            children={undefined}
          />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IoAdd className="mr-2 h-4 w-4" /> New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Gate Pass</DialogTitle>
              </DialogHeader>
              {/* type */}
              {gatePassRequestCurrentSteps == 0 && (
                <div>
                  <DialogDescription>Select gate pass type</DialogDescription>
                  <GatePassType />
                </div>
              )}
              {/* first app */}
              {gatePassRequestCurrentSteps == 1 && (
                <div>
                  <DialogDescription>Select first approver</DialogDescription>
                  <FirstApprover />
                </div>
              )}

              {/* second app */}
              {gatePassRequestCurrentSteps == 2 && (
                <div>
                  <DialogDescription>Select second approver</DialogDescription>
                  <SecondApprover />
                </div>
              )}

              {gatePassRequestCurrentSteps == 3 && (
                <div>
                  {gatePassRequestType?.GatePassTypeID === 1 ||
                  gatePassRequestType?.GatePassTypeID === 2 ? (
                    <GeneralAndMedicalUserInfo />
                  ) : gatePassRequestType?.GatePassTypeID == 3 ||
                    gatePassRequestType?.GatePassTypeID == 4 ? (
                    <ReturnableAndNonRetunable />
                  ) : (
                    <VehicleInfo />
                  )}
                </div>
              )}

              {gatePassRequestCurrentSteps > 0 && (
                <div className="flex items-center justify-start gap-3">
                  <Button
                    onClick={() => {
                      gatePassRequestCurrentSteps > 0 &&
                        decreaseGatePassRequestSteps();
                    }}
                    variant="ghost"
                  >
                    <GrPrevious />
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium">Request Type</h3>
              <Badge variant="default">{gatePassRequestType?.type}</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">First Approver</h3>
              <Badge variant="default">
                {gatePassFirstApprover?.ApproveUser}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Second Approver</h3>
              <Badge variant="default">
                {gatePassSecondApprover?.ApproveUser}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {gatePassRequestType?.GatePassTypeID == 1 && <GeneralTable />}

      {gatePassRequestType?.GatePassTypeID == 2 && <MedicaleTable />}

      {gatePassRequestType?.GatePassTypeID == 3 && <RetunableTable />}

      {gatePassRequestType?.GatePassTypeID == 4 && <NonReturnableTable />}

      {gatePassRequestType?.GatePassTypeID == 5 && <VehicleTable />}
    </div>
  );
};

export default GatePassPage;
