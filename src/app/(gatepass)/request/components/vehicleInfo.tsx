import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePostMutation } from "@/utils/usePostQuery";
import useStore from "@/zustand/store";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { MdBookmarkAdded } from "react-icons/md";

interface IGeneralAndMedical {
  employeeID: string;
  remarks: string;
  apxPickUp: string;
  apxReturn: string;
  destination: string;
}

export default function GeneralAndMedicalUserInfo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IGeneralAndMedical>();

  const { setGatePassVehicles, getPassvehicles } = useStore();

  const onSubmit: SubmitHandler<IGeneralAndMedical> = async (data) => {
    

    const exist = getPassvehicles?.find(
      (vehicle) => vehicle.employeeID == data.employeeID
    );
    if (exist) {
      toast.error("This user is also exist!");
      return;
    }

    // @ts-ignore
    setGatePassVehicles({
      employeeID: data.employeeID,
      ApxPickup: data.apxReturn,
      ApxReturn: data.apxPickUp,
      remarks: data.remarks,
      Destination: data.destination,
    });
    reset();


    
  };

  return (
    <div>
      <form
        className="flex flex-col items-center justify-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-start w-full gap-3">
          <Label htmlFor="employeeID">Employee ID</Label>
          <Input
            id="employeeID"
            {...register("employeeID", { required: "Employee ID is required" })}
            type="text"
            placeholder="Employee"
          />
          {errors.employeeID && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors.employeeID.message}
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col items-start w-full gap-3">
          <Label htmlFor="apxPickUp">Apx. Pickup Time</Label>
          <Input
            id="apxPickUp"
            {...register("apxPickUp", {
              required: "Apx. pickup time is required",
            })}
            type="datetime-local"
          />
          {errors.apxPickUp && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors.apxPickUp.message}
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col items-start w-full gap-3">
          <Label htmlFor="apxReturn">Apx. Return Time</Label>
          <Input
            id="apxReturn"
            {...register("apxReturn", {
              required: "Apx. return time is required",
            })}
            type="datetime-local"
          />
          {errors.apxReturn && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors.apxReturn.message}
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col items-start w-full gap-3">
          <Label htmlFor="remarks">Destination</Label>
          <Input
            id="destination"
            {...register("destination", {
              required: "Destination are required",
            })}
            placeholder="Destination"
          />
          {errors.destination && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors.destination.message}
              </span>
            </label>
          )}
        </div>

        <div className="flex flex-col items-start w-full gap-3">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            {...register("remarks", { required: "Remarks are required" })}
            placeholder="Remarks"
          />
          {errors.remarks && (
            <label className="label">
              <span className="label-text-alt text-red-600">
                {errors.remarks.message}
              </span>
            </label>
          )}
        </div>

        <Button type="submit">
          Submit <MdBookmarkAdded />
        </Button>
      </form>
    </div>
  );
}
