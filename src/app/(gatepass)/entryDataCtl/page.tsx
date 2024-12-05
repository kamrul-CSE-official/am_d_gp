"use client";
import React, { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/helper/axios/axiosInstance";
import { Title } from "@/components/ui/title";
import { Button } from "@/components/ui/button";
import { ResetIcon } from "@radix-ui/react-icons";
import { Filter } from "lucide-react";

type EntryData = {
  id: number;
  Name: string;
  Purpose: string;
  InTime: string;
  OutTime: string;
  isActive: boolean;
};

export default function EntryDataCtiPage() {
  const [entryData, setEntryData] = useState<EntryData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    getData();
  }, [page, fromDate, toDate]);

  const getData = async () => {
    try {
      const payload = {
        fromDate: fromDate || "2024-10-26T02:14:24.350Z", // Default to a valid date if no filter
        toDate: toDate || "2024-11-26T02:14:24.349Z", // Default to a valid date if no filter
        page: page,
        pageSize: pageSize,
      };

      const req = await axiosInstance.post("api/Gatepass/GetEntryDataForHide", payload);
      const data = req.data;

      if (Array.isArray(data)) {
        setTotalEntries(data.length);
        const startIndex = (page - 1) * pageSize;
        const paginatedData = data.slice(startIndex, startIndex + pageSize);
        setEntryData(paginatedData);
      } else {
        console.error("Unexpected response structure:", data);
        setEntryData([]);
        setTotalEntries(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEntryData([]);
      setTotalEntries(0);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const totalPages = Math.ceil(totalEntries / pageSize);

  // Calculate page range to show, i.e., 5 pages around the current page
  const pageRange = 5;
  const startPage = Math.max(1, page - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, page + Math.floor(pageRange / 2));

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 when applying filters
    getData(); // Fetch the filtered data
  };

  const handleResetFilter = () => {
    setFromDate(""); // Reset the filter to show all data
    setToDate(""); // Reset the filter to show all data
    setPage(1); // Reset to page 1
    getData(); // Fetch the data without any filters (show all data)
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Title variant="primary" size="md">
            Entry Data Show/Hide
          </Title>
        </CardHeader>
        <CardContent>
          {/* Filter Form */}
          <form className="flex items-center mb-4 space-x-4" onSubmit={handleFilterSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time:</label>
              <input
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="input input-bordered w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time:</label>
              <input
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="input input-bordered w-full rounded-md"
              />
            </div>
            <Button
              type="submit"
              className="btn btn-primary rounded-md"
            >
              Filter <Filter />
            </Button>
            <Button variant="secondary"
              type="button"
              className="btn btn-secondary rounded-md"
              onClick={handleResetFilter}
            >
              Reset <ResetIcon />
            </Button>
          </form>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Hide</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entryData.length > 0 ? (
                  entryData.map((entry, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {(page - 1) * pageSize + i + 1}
                      </TableCell>
                      <TableCell>{entry?.Name}</TableCell>
                      <TableCell>{entry?.Purpose}</TableCell>
                      <TableCell>{entry?.InTime}</TableCell>
                      <TableCell>{entry?.OutTime}</TableCell>
                      <TableCell>{entry?.isActive ? "True" : "False"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No data available
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
                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    // @ts-ignore
                    disabled={page === 1}
                  />
                </PaginationItem>

                {/* Show page numbers from the calculated range */}
                {[...Array(endPage - startPage + 1)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(startPage + i)}
                      isActive={page === startPage + i}
                    >
                      {startPage + i}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                    // @ts-ignore
                    disabled={page === totalPages}
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
