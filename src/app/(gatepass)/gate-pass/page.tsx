"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoAdd } from "react-icons/io5";
import { Delete, SaveAll, Filter } from "lucide-react";
import { MdDelete } from "react-icons/md";
import GatePassForm from "./components/gatePassForms";
import { Title } from "@/components/ui/title";

// Type for a request (for better type safety)
type Request = {
  employeeNo: number;
  EmpBase64: string;
  fullName: string;
  section: string;
  remarks: string;
};

const GatePassPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Example data (Replace with real data fetching later)
  const allRequests: Request[] = [
    {
      employeeNo: 1,
      EmpBase64: "https://avatar.iran.liara.run/public/boy",
      fullName: "MD.Kamrul Hasan",
      section: "IT Software",
      remarks: "Illness",
    },
    {
      employeeNo: 2,
      EmpBase64: "https://avatar.iran.liara.run/public/girl",
      fullName: "Jane Doe",
      section: "HR",
      remarks: "Meeting",
    },
    {
      employeeNo: 3,
      EmpBase64: "https://avatar.iran.liara.run/public/boy",
      fullName: "John Smith",
      section: "Finance",
      remarks: "Training",
    },
    {
      employeeNo: 4,
      EmpBase64: "https://avatar.iran.liara.run/public/girl",
      fullName: "Emily Johnson",
      section: "IT Software",
      remarks: "Client Visit",
    },
    {
      employeeNo: 5,
      EmpBase64: "https://avatar.iran.liara.run/public/boy",
      fullName: "Michael Brown",
      section: "HR",
      remarks: "Personal",
    },
    {
      employeeNo: 6,
      EmpBase64: "https://avatar.iran.liara.run/public/girl",
      fullName: "Sarah Davis",
      section: "Finance",
      remarks: "Conference",
    },
  ];

  // Filter and paginate requests
  const filteredRequests = allRequests.filter(
    (request) =>
      request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSection === "all" || request.section === selectedSection)
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueSections = Array.from(new Set(allRequests.map((r) => r.section)));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Title
            title=" Gate Pass Request"
            variant="primary"
            size="md"
            children={undefined}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IoAdd className="mr-2 h-4 w-4" /> New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Gate Pass</DialogTitle>
                <DialogDescription>
                  Fill out the form to create a new gate pass. Click next to
                  proceed through each step.
                </DialogDescription>
              </DialogHeader>
              <GatePassForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium">Request Type</h3>
              <p>General</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">First Approver</h3>
              <p>Babu</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Second Approver</h3>
              <p>Vinager</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Button variant="outline">
                <SaveAll className="mr-2 h-4 w-4" color="blue" /> Save
              </Button>
              <Button variant="outline">
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
                    ({ employeeNo, EmpBase64, fullName, section, remarks }) => (
                      <TableRow key={employeeNo}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={EmpBase64} alt={fullName} />
                              <AvatarFallback>{fullName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{fullName}</div>
                              <div className="text-sm text-muted-foreground">
                                #{employeeNo}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{section}</TableCell>
                        <TableCell>{remarks}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
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
};

export default GatePassPage;

