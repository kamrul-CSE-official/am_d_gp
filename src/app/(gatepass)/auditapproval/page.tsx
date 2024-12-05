"use client";

import React, { useEffect, useState } from "react";
import { MdApproval, MdBlindsClosed } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { GrClear } from "react-icons/gr";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/helper/axios/axiosInstance";
import { Title } from "@/components/ui/title";
import toast from "react-hot-toast";

interface IAudit {
  ReqCode: string;
  Section: string;
  ReqQuantity: number;
  ReceivedQuantity: number;
  Intime: string;
  ItemDescription: string;
  Remarks: string;
}

export default function AuditApprovalPage() {
  const [approvalState, setApprovalState] = useState<number>(12);
  const [audits, setAudits] = useState<IAudit[]>([]);

  useEffect(() => {
    const payload = {
      ApprovalState: approvalState,
    };
    const getData = async () => {
      try {
        const req = await axiosInstance.post(
          "/api/Gatepass/GetReturnableDetailsForAudit",
          payload
        );
        console.log(req.data);
        setAudits(req?.data);
      } catch (error) {
        console.error("Error fetching audits:", error);
      }
    };
    getData();
  }, [approvalState]);

  const formatIntime = (intime: string) => {
    if (intime === "0001-01-01T00:00:00") {
      return "N/A";
    }
    try {
      const date = parseISO(intime);
      const now = new Date();
      const differenceInDays =
        (now.getTime() - date.getTime()) / (1000 * 3600 * 24);

      if (differenceInDays > 2) {
        return format(date, "dd MMM yyyy");
      } else {
        return formatDistanceToNow(date, { addSuffix: true });
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      return intime;
    }
  };

  const handleSave = () => {
    toast.success("Save done.");
  };

  const handleClear = () => {
    toast.success("Clear done.");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <Title variant="primary" size="md">
          Audit Approval
        </Title>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="out" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="out" onClick={() => setApprovalState(12)}>
              <MdApproval className="mr-2" />
              Out Approval
            </TabsTrigger>
            <TabsTrigger value="in" onClick={() => setApprovalState(4)}>
              <MdBlindsClosed className="mr-2" />
              In Approval
            </TabsTrigger>
          </TabsList>
          <TabsContent value="out">
            <AuditTable audits={audits} formatIntime={formatIntime} />
          </TabsContent>
          <TabsContent value="in">
            <AuditTable audits={audits} formatIntime={formatIntime} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-4">
          <Button onClick={() => handleSave()} variant="default">
            <FaSave className="mr-2" />
            Save
          </Button>
          <Button onClick={() => handleClear()} variant="destructive">
            <GrClear className="mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditTable({
  audits,
  formatIntime,
}: {
  audits: IAudit[];
  formatIntime: (intime: string) => string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Request No</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Request Q</TableHead>
          <TableHead>Receive Q</TableHead>
          <TableHead>In Time</TableHead>
          <TableHead>Item Description</TableHead>
          <TableHead>Remarks</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audits.map((audit, i) => (
          <TableRow key={i}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{audit.ReqCode}</TableCell>
            <TableCell>{audit.Section}</TableCell>
            <TableCell>{audit.ReqQuantity}</TableCell>
            <TableCell>{audit.ReceivedQuantity}</TableCell>
            <TableCell>{formatIntime(audit.Intime)}</TableCell>
            <TableCell>{audit.ItemDescription}</TableCell>
            <TableCell>
              <Badge variant="outline">{audit.Remarks}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
