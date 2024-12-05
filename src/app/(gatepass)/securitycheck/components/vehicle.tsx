import Base64Image from "@/components/shared/base64Image";
import React, { useState } from "react";
import { MdSecurity } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface IVehicle {
  ImageBase64: string;
  Name: string;
  DepartmentAndSection: string;
  ReqCode: string;
  InM: number;
  OutM: number;
  GatePassType: string;
}

export default function VehicleTable({
  handleUpdateStatus,
  tableData,
}: {
  handleUpdateStatus: any;
  tableData: IVehicle[];
}) {
  const [mitterIn, setMitterin] = useState<number>();

  return (
    <div className="mt-8">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department/Section</TableHead>
            <TableHead>Gate Pass Type</TableHead>
            <TableHead>Request Code</TableHead>
            <TableHead>Meter In</TableHead>
            <TableHead>Meter Out</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((data: IVehicle, i: number) => (
              <TableRow key={i} className="border-b border-gray-200">
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                    <Base64Image
                      base64String={data?.ImageBase64}
                      altText={data?.Name}
                    />
                  </div>
                </TableCell>
                <TableCell>{data.Name}</TableCell>
                <TableCell>{data.DepartmentAndSection}</TableCell>
                <TableCell>{data.GatePassType}</TableCell>
                <TableCell>{data.ReqCode}</TableCell>
                <TableCell>
                  <input
                    onChange={(e) => {
                      setMitterin(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="Meter In"
                    className="input input-bordered input-sm w-full max-w-xs rounded-md"
                    defaultValue={data.InM}
                  />
                </TableCell>
                <TableCell>{data.OutM}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleUpdateStatus(data)}
                    variant="outline"
                    color="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    In/Out <MdSecurity />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Empty!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
