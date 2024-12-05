import React, { useState } from "react";
import { MdSecurity } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IReturnable {
  Name: string;
  DepartmentAndSection: string;
  GatePassType: string;
  InTime: string | null;
  OutTime: string | null;
  ReceivedQuantity: number;
  ReqCode: string;
}

export default function ReturnableTableAndNonRet({
  handleUpdateStatus,
  tableData,
}: {
  handleUpdateStatus: any;
  tableData: IReturnable[];
}) {
  const [quantity, setQuantity] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;  


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < Math.ceil(tableData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  // Determine the range of pages to display in pagination
  const pageNumbers: number[] = [];
  const range = 2; // Number of pages to show before and after the current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pageNumbers.push(i);
    }
  }

  // Add ellipsis for more pages before or after the current range
  if (pageNumbers[0] > 1) pageNumbers.unshift(-1); // -1 represents "..."
  if (pageNumbers[pageNumbers.length - 1] < totalPages)
    pageNumbers.push(-2); // -2 represents "..."

  return (
    <div className="w-full mt-8">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Request Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department/Section</TableHead>
            <TableHead>Gate Pass Type</TableHead>
            <TableHead>Out Time</TableHead>
            <TableHead>In Time</TableHead>
            <TableHead>Received Quantity</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length > 0 ? (
            currentItems.reverse().map((data: IReturnable, i: number) => (
              <TableRow key={i} className="border-b border-gray-200">
                <TableCell>{indexOfFirstItem + i + 1}</TableCell>
                <TableCell>{data.ReqCode}</TableCell>
                <TableCell>{data.Name}</TableCell>
                <TableCell>{data.DepartmentAndSection}</TableCell>
                <TableCell>{data.GatePassType}</TableCell>
                <TableCell>{data.OutTime}</TableCell>
                <TableCell>{data.InTime}</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Quantity"
                    disabled={!data.OutTime}
                    value={quantity || data.ReceivedQuantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full max-w-xs"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handleUpdateStatus({
                        ...data,
                        ReceivedQuantity: quantity,
                      })
                    }
                    variant="outline"
                    color="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                   {data.OutTime ? "IN": "OUT"} <MdSecurity />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          variant="outline"
          color="primary"
        >
          Prev
        </Button>

        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === -1 && (
                <span className="text-gray-500">...</span>
              )}
              {page === -2 && (
                <span className="text-gray-500">...</span>
              )}
              {page > 0 && (
                <Button
                  onClick={() => handlePageClick(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={currentPage === page ? "bg-primary text-white" : ""}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          color="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
