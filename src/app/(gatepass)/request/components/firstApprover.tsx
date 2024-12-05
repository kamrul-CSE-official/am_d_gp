import React, { useEffect, useState } from "react";
import useStore from "@/zustand/store";
import Base64Image from "@/components/shared/base64Image";
import axiosInstance from "@/helper/axios/axiosInstance";
import { Card } from "@/components/ui/card";

export default function FirstApprover() {
  const [firstApprovers, setFirstApprovers] = useState<any[]>([]);
  const { 
    gatePassRequestType,
    setGatePassFirstApprover, 
  } = useStore();

  const { increaseGatePassRequestSteps } = useStore();

  const handleApproverSelect = (approver: {
    SubCostRequisitionApprovalID: number;
    ApproveUser: string;
    EmpBase64: string;
  }) => {
    setGatePassFirstApprover(approver);
    increaseGatePassRequestSteps();
  };

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const requestData = {
          ApprovalStatusID: 1,
          SubCostCenterID: 1064,
          GatepassType: gatePassRequestType?.GatePassTypeID,
        };
        const response = await axiosInstance.post(
          "/api/User/GetApprovalUserGatepass",
          requestData,
        );
        if (response?.data) {
          setFirstApprovers(response.data);
        }
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchApprovers();
  }, []);

  return (
    <div>
      {!firstApprovers ? (
          <div>Loading...</div>
        ) : (
          firstApprovers?.map((approver, index) => (
            <Card
              key={index}
              className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer m-2"
              onClick={() => handleApproverSelect(approver)}
            >
              <Base64Image
                base64String={approver.EmpBase64}
                altText={approver.ApproveUser}
                className="w-14 h-14 rounded-full mx-auto mb-2"
              />
              <p className="text-center text-lg font-medium">
                {approver.ApproveUser}
              </p>
            </Card>
          ))
        )}
    </div>
  );
}
