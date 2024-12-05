"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import SelectWithSearch from "@/components/customUi/SelectWithSearch";
import axiosInstance from "@/helper/axios/axiosInstance";
import useStore from "@/zustand/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IReturnableNonReturnable } from "@/types/gatepass.types";

type IInputs = {
  employeeNO: string;
  remark: string;
  store?: string;
  item?: string;
  qty?: number;
  apxPickup?: string;
  apxReturn?: string;
  destination?: string;
  remarks?: string;
};

interface IStores {
  id: number | string;
  StoresID: number;
  Stores: string;
  Prefix: string;
  ComPrefix: string | null;
}

interface IItems {
  value: string;
  label: string;
}

const ReturnableAndNonReturnable: React.FC = () => {
  const [stores, setStores] = useState<IStores[]>([]);
  const [items, setItems] = useState<IItems[]>([]);
  const [selectedItem, setSelectedItem] = useState<IItems | null>(null);
  const { setGatePassReturnableNonReturnable } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm<IInputs>({
    defaultValues: {
      item: "", // Ensure the 'item' field is part of the default values
    },
  });

  const storeId = watch("store"); // To monitor store selection

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosInstance.get("/api/Gatepass/GetStores");
        setStores(response.data);
      } catch (error) {
        toast.error("Failed to fetch stores.");
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, []);

  const fetchItems = useCallback(
    debounce(async (storeId: string) => {
      if (!storeId) return;
      try {
        const response = await axiosInstance.post(
          "/api/User/GetItemDescriptionGatepass",
          { StoresID: storeId }
        );
        const newItems = response.data.map(
          (item: { ItemDescription: string; ItemID: string }) => ({
            label: item.ItemDescription,
            value: item.ItemID,
          })
        );
        setItems(newItems);
      } catch (error) {
        toast.error("Failed to fetch items.");
        console.error("Error fetching items:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (storeId) {
      fetchItems(storeId);
    } else {
      setItems([]);
    }
  }, [storeId, fetchItems]);

  const handleSelectItem = (option: { label: string; value: string }) => {
    setSelectedItem(option);
    setValue("item", option.value);
    console.log(option);
  };

  const onSubmit = async (data: IInputs) => {
    console.log("Selected Store:", storeId);
    console.log("Form Data:", data);

    const storeName = stores.filter(
      (store) => Number(store.StoresID) == Number(storeId)
    )[0].Stores;

    const payload: IReturnableNonReturnable = {
      storesID: Number(data.store) || 1,
      storesName: storeName || "",
      itemID: Number(data.item) || 1,
      itemName: selectedItem?.label,
      qty: Number(data.qty) || 1,
      remarks: data.remarks || ("" as string),
    };

    if (setGatePassReturnableNonReturnable) {
      setGatePassReturnableNonReturnable(payload);
      toast.success("Successfully added.");
      reset();
    } else {
      toast.error("Error: setGatePassReturnableNonReturnable is undefined.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label
            htmlFor="store"
            className="block text-sm font-medium text-gray-700"
          >
            Stores
          </Label>
          <Controller
            control={control}
            name="store"
            rules={{ required: "Store is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem
                      key={store.StoresID}
                      value={store.StoresID.toString()}
                    >
                      {store.Stores}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.store && (
            <p className="mt-1 text-sm text-red-500">{errors.store.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="item"
            className="block text-sm font-medium text-gray-700"
          >
            Items
          </Label>
          {items.length > 0 ? (
            <Controller
              control={control}
              name="item"
              rules={{ required: "Item is required" }}
              render={({ field }) => (
                <SelectWithSearch
                  {...field}
                  onSelect={handleSelectItem}
                  options={items}
                />
              )}
            />
          ) : (
            <p className="mt-2 text-gray-500">
              No items available for the selected store.
            </p>
          )}
          {errors.item && (
            <p className="mt-1 text-sm text-red-500">{errors.item.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="qty"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </Label>
          <Input
            {...register("qty", { required: "Quantity is required" })}
            type="number"
            placeholder="Quantity"
            className={`w-full mt-2 ${errors.qty ? "border-red-500" : ""}`}
          />
          {errors.qty && (
            <p className="mt-1 text-sm text-red-500">{errors.qty.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="remarks"
            className="block text-sm font-medium text-gray-700"
          >
            Remarks
          </Label>
          <Textarea
            {...register("remarks")}
            placeholder="Enter remarks"
            className={`w-full mt-2 ${errors.remarks ? "border-red-500" : ""}`}
          />
          {errors.remarks && (
            <p className="mt-1 text-sm text-red-500">
              {errors.remarks.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full mt-6 bg-blue-500 text-white">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ReturnableAndNonReturnable;
