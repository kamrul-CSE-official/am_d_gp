"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/helper/axios/axiosInstance";
import { IEmployee } from "@/types/employee.types";
import useStore from "@/zustand/store";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdBookmarkAdded } from "react-icons/md";

// Define the IGeneralAndMedical interface
interface IGeneralAndMedical {
  employeeID: string;
  remarks: string;
}

export default function GeneralAndMedicalUserInfo() {
  const [employeeData, setEmployeeData] = useState<IEmployee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ensure generalAndMedicalRequest is an array, even if it's undefined initially
  const { setGeneralAndMedicalRequest, generalAndMedicalRequest = [] } =
    useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IGeneralAndMedical>();
  const employeeNo = watch("employeeID");

  // Fetch employee data when the employee ID is entered and is valid
  useEffect(() => {
    if (!employeeNo || employeeNo.length < 5) {
      setEmployeeData(null);
      return;
    }

    const fetchEmployeeData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.post(
          "/api/User/GetRequesterDetails",
          { empno: employeeNo }
        );
        if (data?.[0]) {
          setEmployeeData(data[0]);
        } else {
          throw new Error("No employee data found");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setEmployeeData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeNo]);

  const onSubmit = async (data: IGeneralAndMedical) => {
    if (!employeeData) {
      toast.error("Invalid Employee Id");
      return;
    }

    const newEmployee = {
      EMPNO: employeeData.EMPNO || "",
      EmpBase64: employeeData.ImageBase64!,
      FullName: employeeData.FullName!,
      sectionName: employeeData.SectionName!,
      remarks: data.remarks,
      Id: 0,
      CostCenterID: employeeData.CostCenterID!,
      Grpno: employeeData.GRP_EMP_NO!,
      SubCostCenterID: employeeData.SubCostCenterID!,
      SubCostCenter: "",
      EmpID: Number(employeeData.GRP_EMP_NO)!,
    };

    // Check for duplicate request
    const isDuplicate = generalAndMedicalRequest.some(
      (request) => request.EMPNO === newEmployee.EMPNO
    );

    if (isDuplicate) {
      toast.error("This employee has already been added.");
      reset();
      return;
    } else {
      setGeneralAndMedicalRequest(newEmployee);
      toast.success("Successfully added");
      reset();
    }
  };

  return (
    <div>
      <form
        className="flex flex-col items-center justify-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Employee ID input */}
        <div className="flex flex-col items-start w-full gap-3">
          <Label>Employee ID </Label>
          <Input
            {...register("employeeID", { required: "Employee ID is required" })}
            type="text"
            placeholder="Enter Employee ID"
          />
          {errors.employeeID && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors?.employeeID?.message}
              </span>
            </label>
          )}
        </div>
        {/* Employee details display */}
        {employeeData && (
          <Card className="flex items-center gap-5 p-5 my-5 w-full">
            <Avatar>
              <AvatarImage
                src={`data:image/png;base64,${employeeData.ImageBase64}`}
                alt={employeeData.FullName}
              />
              <AvatarFallback>
                {employeeData.FullName!.substring(0, 3)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>{employeeData.FullName}</p>
              <small className="text-sm">{employeeData.SectionName}</small>
            </div>
          </Card>
        )}

        {/* Remarks input */}
        <div className="flex flex-col items-start w-full gap-3">
          <Label>Remarks</Label>
          <Textarea
            {...register("remarks", { required: "Remarks are required" })}
            placeholder="Enter remarks"
          />
          {errors?.remarks && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors?.remarks?.message}
              </span>
            </label>
          )}
        </div>

        <Button type="submit" className="flex items-center">
          Submit <MdBookmarkAdded className="ml-2" />
        </Button>
      </form>
    </div>
  );
}
