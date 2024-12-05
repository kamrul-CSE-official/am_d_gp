import React from "react";
import { IEmployee } from "./employee.types";

export interface IGatePassType {
  type: string;
  icon?: React.ReactNode;
  GatePassTypeID?: number;
}

export interface IGatePassApprover {
  ApproveUser: string;
  EmpBase64: string;
  SubCostRequisitionApprovalID: number;
}

export interface IGatePassEmployeeInfo {
  employeeNO: string;
  remark: string;
}


export interface IReturnableNonReturnable {
  storesID: number;
  storesName?: string;
  itemID: number;
  itemName?: string;
  qty: number
  remarks: string
}


export interface IVehicle {
  employeeID: string | number;
  ApxPickup: string;
  ApxReturn: string;
  remarks: string;
  Destination: string
}


export interface ICompleteGatePassRequest {
  Id?: number;
  CostCenterID?: number;
  EMPNO?: string;
  EmpBase64?: string;
  FullName: string;
  sectionName?: string;
  Grpno?: number;
  SubCostCenterID?: number;
  SubCostCenter?: string;
  ItemID?: number;
  ItemDescription?: string;
  StoreID?: number | string;
  StoreName?: string;
  EmpID?: number;
  Qty?: number;
  ApxPickup?: string;
  ApxReturn?: string;
  Destination?: string;
  remarks?: string;
}

export interface IGeneralAndMedicalRequest {
  EMPNO: string| number | undefined;
  EmpBase64: string;
  FullName: string;
  sectionName:string;
  remarks: string;
  Id: number;
  CostCenterID: string | number;
  Grpno: string | number;
  SubCostCenterID: string | number;
  SubCostCenter: string;
  EmpID: number | string;
}


