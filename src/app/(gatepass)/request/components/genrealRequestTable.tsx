"use client"
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStore from "@/zustand/store";
import { Delete, Filter, SaveAll } from "lucide-react";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { UserInfo } from "@/service/auth.service";
import axiosInstance from "@/helper/axios/axiosInstance";
import { useRouter } from "next/navigation";

type Request = {
  EmpID: number;
  EmpBase64: string;
  FullName: string;
  sectionName: string;
  remarks: string;
};

export default function GeneralTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allRequests, setAllRequests] = useState<Request[]>([]);

  const route = useRouter();

  const {
    generalAndMedicalRequest,
    setGeneralAndMedicalRequestClean,
    gatePassFirstApprover,
    gatePassSecondApprover,
    gatePassRequestType,
    clearAll,
    deleateAPersonFromGeneralAndMedicaleRequest,
  } = useStore();

  useEffect(() => {
    if (generalAndMedicalRequest && Array.isArray(generalAndMedicalRequest)) {
      // @ts-ignore
      setAllRequests(generalAndMedicalRequest);
    } else {
      setAllRequests([]);
    }
  }, [generalAndMedicalRequest]);

  const itemsPerPage = 5;

  // Filter and paginate requests
  const filteredRequests = allRequests.filter(
    (request) =>
      request.FullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSection === "all" || request.sectionName === selectedSection)
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueSections = Array.from(
    new Set(allRequests.map((r) => r.sectionName))
  );

  const handleSaveGatePassRequest = async () => {
    try {
      if (generalAndMedicalRequest) {
        const userinfo: UserInfo | null = UserInfo();
        const data = {
          objReq: {
            CompanyID: userinfo?.CompanyID,
            ServiceDepartmentID: userinfo?.ServiceDepartmentID,
            CostCenterID: userinfo?.CostCenterID,
            SubCostCenterID: userinfo?.SubCostCenterID,
            LocationID: 0,
            FirstAppUserID: gatePassFirstApprover?.SubCostRequisitionApprovalID,
            SecAppUserID: gatePassSecondApprover?.SubCostRequisitionApprovalID,
            GatePassTypeID: gatePassRequestType?.GatePassTypeID,
            GatePassStatusID: 1,
            EnteredBy: userinfo?.EmpID,
          },
          lstReqDetail: generalAndMedicalRequest,
        };
        await axiosInstance.post("/api/Gatepass/SaveGatePassRequest", data);
        toast.success("Gate pass request saved successfully!");
        clearAll?.();
        route.push("/dashboard/status")
      }
    } catch (error) {
      toast.error("Failed to save gate pass request.");
      console.error(error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Gate Pass Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {uniqueSections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleSaveGatePassRequest()}
                variant="outline"
              >
                <SaveAll className="mr-2 h-4 w-4" color="blue" /> Save
              </Button>
              <Button
                onClick={() => {
                  clearAll?.();
                }}
                variant="outline"
              >
                <Delete className="mr-2 h-4 w-4" color="red" /> Clear
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map(
                    ({ EmpID, EmpBase64, FullName, sectionName, remarks }) => (
                      <TableRow key={EmpID}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={`data:image/png;base64,${EmpBase64}`}
                                alt={FullName}
                              />
                              <AvatarFallback>{FullName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{FullName}</div>
                              <div className="text-sm text-muted-foreground">
                                #{EmpID}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{sectionName}</TableCell>
                        <TableCell>{remarks}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => {
                              toast.error(`Remove ${FullName}`);
                              // @ts-ignore
                              deleateAPersonFromGeneralAndMedicaleRequest(
                                EmpID
                              );
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <MdDelete className="mr-2 h-4 w-4" color="red" />
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No requests available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-end space-x-2 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    // @ts-ignore
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    // @ts-ignore
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
