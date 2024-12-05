import { create } from "zustand";
import { StoreState } from "@/types/store.types";
import { IReturnableNonReturnable } from "@/types/gatepass.types";

const useStore = create<StoreState>((set) => ({
  // Gate pass request steps
  gatePassRequestCurrentSteps: 0,
  increaseGatePassRequestSteps: () =>
    set((state) => ({
      gatePassRequestCurrentSteps: state.gatePassRequestCurrentSteps + 1,
    })),
  decreaseGatePassRequestSteps: () =>
    set((state) => ({
      gatePassRequestCurrentSteps: state.gatePassRequestCurrentSteps - 1,
    })),

  // Gate pass type selection (step-1)
  gatePassRequestType: { type: "" },
  setGatePassRequestType: (type) =>
    set(() => ({
      gatePassRequestType: type,
    })),

  // Gate pass first approver (step-2)
  gatePassFirstApprover: undefined,
  setGatePassFirstApprover: (approver) =>
    set(() => ({
      gatePassFirstApprover: approver,
    })),

  // Gate pass second approver (step-3)
  gatePassSecondApprover: undefined,
  setGatePassSecondApprover: (approver) =>
    set(() => ({
      gatePassSecondApprover: approver,
    })),

  // Gate pass employee info (step-4)
  gatePassEmployeeInfo: undefined,
  setGatePassEmployeeInfo: (info) =>
    set(() => ({
      gatePassEmployeeInfo: info,
    })),

  // Gate pass retunable/nonretunable
  setGatePassReturnableNonReturnable: (userData) =>
    set((state) => ({
      getPassReturnableNonReturnable: state.getPassReturnableNonReturnable
        ? [...state.getPassReturnableNonReturnable, userData]
        : [userData],
    })),
  getPassReturnableNonReturnable: undefined,
  delteteAItem: (storesID) => {
    set((state) => ({
      getPassReturnableNonReturnable: state.getPassReturnableNonReturnable?.filter(
        (user) => user.storesID !== storesID
      ),
    }));
  },



   // Gate pass vehicle
   getPassvehicles: undefined,
   setGatePassVehicles: (userData) =>
    set((state) => ({
      getPassvehicles: state.getPassvehicles
        ? [...state.getPassvehicles, userData]
        : [userData],
    })),
  delteteAvehicle: (employeeID) => {
    set((state) => ({
      getPassvehicles: state.getPassvehicles?.filter(
        (user) => user.employeeID !== employeeID
      ),
    }));
  },

  // Complete a gate pass
  completeGatePassRequest: undefined,
  setCompleteGatePassRequest: (gatePass) =>
    set((state) => ({
      completeGatePassRequest: state.completeGatePassRequest
        ? [...state.completeGatePassRequest, gatePass]
        : [gatePass],
    })),
  setCompleteGatePassRequestClean: () =>
    set(() => ({
      completeGatePassRequest: undefined,
    })),

  //General and medical
  generalAndMedicalRequest: undefined,
  setGeneralAndMedicalRequest: (userData) =>
    set((state) => ({
      generalAndMedicalRequest: state.generalAndMedicalRequest
        ? [...state.generalAndMedicalRequest, userData]
        : [userData],
    })),
  setGeneralAndMedicalRequestClean: () =>
    set(() => ({
      generalAndMedicalRequest: undefined,
    })),
  deleateAPersonFromGeneralAndMedicaleRequest: (userID) => {
    set((state) => ({
      generalAndMedicalRequest: state.generalAndMedicalRequest?.filter(
        (user) => user.EmpID !== userID
      ),
    }));
  },

  // Clear all state
  clearAll: () =>
    set(() => ({
      gatePassRequestCurrentSteps: 0,
      gatePassRequestType: { type: "" },
      gatePassFirstApprover: undefined,
      gatePassSecondApprover: undefined,
      gatePassEmployeeInfo: undefined,
      getPassReturnableNonReturnable: undefined,
      completeGatePassRequest: undefined,
      generalAndMedicalRequest: undefined,
    })),
}));

export default useStore;
