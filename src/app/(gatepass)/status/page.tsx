"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/helper/axios/axiosInstance";
import { UserInfo } from "@/service/auth.service";
import { Button } from "@/components/ui/button";
import { Filter, SaveAll, Delete } from "lucide-react";
import Base64Image from "@/components/shared/base64Image";
import { Title } from "@/components/ui/title";

type GatePass = {
  GatePassType: string;
  ReqCode: string;
  RequestedFor: string;
  Status: string;
  FirstApp: string;
  SecApp: string;
  ImageBase64: string;
  RequestDetail: string;
};

type Inputs = {
  search: string;
};

export default function StatusPage() {
  const [statusData, setStatusData] = useState<GatePass[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    gatePassType: "",
    status: "",
    requestedFor: "",
    search: "",
  });
  const itemsPerPage = 6;
  const userinfo: UserInfo | null = UserInfo();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.post(
          "/api/Gatepass/GetGatePassStatus",
          {
            EmpID: userinfo?.EmpID,
          }
        );
        setStatusData(response.data);
      } catch (error) {
        console.error("Error fetching gate pass data:", error);
      }
    };

    getData();
  }, []);

  // Apply filters to the data
  const filteredData = statusData.filter((item) => {
    return (
      (filter.gatePassType === "" ||
        item.GatePassType === filter.gatePassType) &&
      (filter.status === "" || item.Status === filter.status) &&
      (filter.requestedFor === "" ||
        item.RequestedFor === filter.requestedFor) &&
      (filter.search === "" ||
        item.GatePassType?.toLowerCase().includes(
          filter.search.toLowerCase()
        ) ||
        item.ReqCode?.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.RequestedFor?.toLowerCase().includes(
          filter.search.toLowerCase()
        ) ||
        item.Status?.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.FirstApp?.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.SecApp?.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.RequestDetail?.toLowerCase().includes(filter.search.toLowerCase()))
    );
  });

  // Calculate the indices for slicing the data array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Title variant="primary" size="md">
            Gate Pass Status
          </Title>
        </CardHeader>
        <CardContent>
          {/* Filter Form */}
          <form className="flex items-center mb-4">
            <Input
              placeholder="Search anything..."
              className="max-w-xs mr-4"
              onChange={(e) =>
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  search: e.target.value,
                }))
              }
            />
           
          </form>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Gate Pass Type</TableHead>
                  <TableHead>Request Code</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Request For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    1<sup>st</sup> Approver
                  </TableHead>
                  <TableHead>
                    2<sup>nd</sup> Approver
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((_gatePass, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      <TableCell>{_gatePass.GatePassType}</TableCell>
                      <TableCell>{_gatePass.ReqCode}</TableCell>
                      <TableCell>
                        {_gatePass.ImageBase64 ? (
                          <Base64Image
                            className="ring-primary w-10 h-10 rounded-full ring ring-offset-2"
                            base64String={_gatePass.ImageBase64!}
                            altText={_gatePass.RequestedFor}
                          />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>{_gatePass.RequestedFor}</TableCell>
                      <TableCell>{_gatePass.RequestDetail}</TableCell>
                      <TableCell>{_gatePass.Status}</TableCell>
                      <TableCell>{_gatePass.FirstApp}</TableCell>
                      <TableCell>{_gatePass.SecApp}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex items-center justify-end space-x-2 py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(currentPage - 1, 1))
                    }
                    // @ts-ignore
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
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
