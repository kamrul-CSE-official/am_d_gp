"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetQuery } from "@/utils/useGetQuery";
import { usePostMutation } from "@/utils/usePostQuery";
import React from "react";

function HumanEntry() {
    usePostMutation("api/Gatepass/GetAllPurpose", )
  const { data: stores } = useGetQuery(
    ["stores"],
    "api/Gatepass/GetAllPurpose"
  );

  const { data: whoms } = useGetQuery(
    ["whoms"],
    "/api/User/GetAllEmp"
  );

  console.log("Stores: ", stores);
  console.log("Whoms: ", whoms);

  return (
    <div>
      <form>
        <div>
          <Label>Name</Label>
          <Input placeholder="Name" />
        </div>
        <div>
          <Label>Remarks</Label>
          <Input placeholder="Remarks" />
        </div>
        <div>
          <Label>Stores</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              {stores && stores.map((store: any, i: number) => (
                <SelectItem value={store.PurposeTypeID} key={i}>
                  {store.PurposeType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Whom</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Whom" />
            </SelectTrigger>
            <SelectContent>
              {whoms && whoms.map((whom: any, i: number) => (
                <SelectItem value={whom.EmpID} key={i}>
                  {whom.EmpName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
}

export default HumanEntry;
