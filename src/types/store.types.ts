import {
  IGatePassType,
  IGatePassApprover,
  IGatePassEmployeeInfo,
  ICompleteGatePassRequest,
  IReturnableNonReturnable,
  IGeneralAndMedicalRequest,
  IVehicle,
} from "@/types/gatepass.types";

export interface StoreState {

  // Gate pass request steps
  gatePassRequestCurrentSteps: number;
  increaseGatePassRequestSteps: () => void;
  decreaseGatePassRequestSteps: () => void;

  // Step-1: Gate pass type selection
  gatePassRequestType?: IGatePassType;
  setGatePassRequestType: (type: IGatePassType) => void;

  // Step-2: Gate pass first approver
  gatePassFirstApprover?: IGatePassApprover;
  setGatePassFirstApprover: (approver: IGatePassApprover) => void;

  // Step-3: Gate pass second approver
  gatePassSecondApprover?: IGatePassApprover;
  setGatePassSecondApprover: (approver: IGatePassApprover) => void;

  // Step-4: Gate pass employee info
  gatePassEmployeeInfo?: IGatePassEmployeeInfo;
  setGatePassEmployeeInfo: (info: IGatePassEmployeeInfo) => void;

  // Step-4: Returnable/Non-returnable
  getPassReturnableNonReturnable?: IReturnableNonReturnable[] | undefined;
  setGatePassReturnableNonReturnable?: (data: IReturnableNonReturnable) => void;
  delteteAItem?: (itemsId: string | number) => void


  // Step-4: vehicles
  getPassvehicles?: IVehicle[] | undefined;
  setGatePassVehicles?: (data: IVehicle) => void;
  delteteAvehicle?: (employeeID: string | number) => void

  // Complete a gate pass
  completeGatePassRequest?: ICompleteGatePassRequest[] | undefined;
  setCompleteGatePassRequest: (gatePass: ICompleteGatePassRequest) => void;
  setCompleteGatePassRequestClean: (
    gatePass: ICompleteGatePassRequest | undefined,
  ) => void;


  // General and medical purpose
  generalAndMedicalRequest?: IGeneralAndMedicalRequest[] | undefined;
  setGeneralAndMedicalRequest: (userData: IGeneralAndMedicalRequest) => void;
  setGeneralAndMedicalRequestClean: (userData: IGeneralAndMedicalRequest | undefined) => void;
  deleateAPersonFromGeneralAndMedicaleRequest?: (userID: string | number) => void;



  // Clear all
  clearAll?: () => void;

}
