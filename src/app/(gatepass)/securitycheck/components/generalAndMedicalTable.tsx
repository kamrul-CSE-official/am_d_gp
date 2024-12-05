import Base64Image from "@/components/shared/base64Image";
import { Button } from "@/components/ui/button";
import React from "react";
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

interface ITableData {
  ImageBase64: string;
  Name: string;
  OutTime: string | null;
  InTime: string | null;
  GatePassType: string;
}

export default function GeneralAndMedicalTable({
  handleUpdateStatus,
  tableData,
}: {
  handleUpdateStatus: any;
  tableData: ITableData[];
}) {
  return (
    <div className="w-full"> {/* Ensure parent div is full width */}
      <Table className="w-full"> {/* Table takes full width */}
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Out Time</TableHead>
            <TableHead>In Time</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData && tableData.length > 0 ? (
            tableData.map((data: ITableData, i: number) => (
              <TableRow key={i} className="border-b border-gray-200">
                <TableCell className="p-4">{i + 1}</TableCell>
                <TableCell className="p-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                    <Base64Image
                      base64String={data?.ImageBase64}
                      altText={data?.Name}
                    />
                  </div>
                </TableCell>
                <TableCell className="p-4">{data?.Name}</TableCell>
                <TableCell className="p-4">{data?.GatePassType}</TableCell>
                <TableCell className="p-4">{data?.OutTime}</TableCell>
                <TableCell className="p-4">{data?.InTime}</TableCell>
                <TableCell className="p-4">
                  <Button
                    onClick={() => handleUpdateStatus(data)}
                    variant="default"
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
              <TableCell colSpan={7} className="text-center py-4">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
