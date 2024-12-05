"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CameraIcon,
  CarIcon,
  Image,
  PersonStandingIcon as PersonIcon,
  RefreshCwIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/helper/axios/axiosInstance";
import { useGetQuery } from "@/utils/useGetQuery";
import Webcam from "react-webcam";

interface GatepassEntry {
  EntryID: number;
  Name: string;
  Purpose: string;
  InTime: string;
  OutTime: string;
  Image: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  purpose: yup.string().required("Purpose is required"),
  remarks: yup.string(),
  driverName: yup.string().when("entryType", {
    is: "vehicle",
    then: yup.string().required("Driver name is required for vehicle entry"),
  }),
});

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function FactoryEntryPage() {
  const [entries, setEntries] = useState<GatepassEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isOpenCapture, setIsOpenCapture] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [whoms, setWhoms] = useState([]);

  const { data: purpose } = useGetQuery(
    ["purpos"],
    "api/GatePass/GetAllPurpose"
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      entryType: "human",
      name: "",
      purpose: "",
      remarks: "",
      driverName: "",
    },
  });

  const { control, handleSubmit, watch } = form;
  const entryType = watch("entryType");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axiosInstance.get("/api/Gatepass/GetEntryData");
      setEntries(response.data);
      console.log("Entry: ", response.data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
      toast.error("Failed to fetch entries. Please try again.");
    }
  };

  const onSubmit = async (data: any) => {
    try {
      console.log("Entry: ", data);
      await axiosInstance.post("/api/Gatepass/SaveEntry", data);
      toast.success("Entry saved successfully.");
      setIsEntryDialogOpen(false);
      fetchEntries();
    } catch (error) {
      console.error("Failed to save entry:", error);
      toast.error("Failed to save entry. Please try again.");
    }
  };

  const handleOutTimeEntry = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select entries to update out time.");
      return;
    }

    try {
      console.log(selectedIds);
      await axiosInstance.post("/api/Gatepass/UpdateEntryOutTime", selectedIds);
      toast.success("Out times updated successfully.");
      fetchEntries();
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to update out times:", error);
      toast.error("Failed to update out times. Please try again.");
    }
  };

  const handleImageClick = (image: string) => {
    setCurrentImage(`https://192.168.1.253:8080/images/${image}`);
    setIsImageDialogOpen(true);
  };

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageUrl(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    async function getDate() {
      const req = await axiosInstance.post("/api/User/GetAllEmp", {
        SubCostCenterID: 0,
        GatepassTypeID: 0,
      });
      console.log('Whoms: ', req?.data);
    }
    getDate();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Factory Entry</CardTitle>
          <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CameraIcon className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {imageUrl && entryType === "vehicle" && (
                <img src={imageUrl} alt="captured image" />
              )}

              {/* Capture */}
              {isOpenCapture && (
                <Webcam
                  className="w-full mx-auto rounded-xl shadow-2xl"
                  audio={false}
                  height={720}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={1280}
                  videoConstraints={videoConstraints}
                />
              )}
              <DialogHeader>
                <DialogTitle>Create New Entry</DialogTitle>
                <DialogDescription>
                  Enter the details for the new factory entry.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                  name="entryType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="human" id="human" />
                        <Label htmlFor="human">Human</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vehicle" id="vehicle" />
                        <Label htmlFor="vehicle">Vehicle</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter name" {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purpose?.map((item: any, i: number) => (
                            <SelectItem
                              key={i}
                              value={item.PurposeTypeID.toString()}
                            >
                              {item.PurposeType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Input
                        id="remarks"
                        placeholder="Enter remarks"
                        {...field}
                      />
                    </div>
                  )}
                />
                {entryType === "vehicle" && (
                  <div>
                    <Controller
                      name="driverName"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor="driverName">Driver Name</Label>
                          <Input
                            id="driverName"
                            placeholder="Enter driver name"
                            {...field}
                          />
                        </div>
                      )}
                    />

                    {!isOpenCapture ? (
                      <Button
                        onClick={() => setIsOpenCapture(!isOpenCapture)}
                        variant="outline"
                        className="w-full mt-2 hover:border-2"
                      >
                        <Image /> Take an image
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsOpenCapture(!isOpenCapture);
                          capture();
                        }}
                        variant="default"
                        className="w-full mt-2 hover:border-2"
                      >
                        <Image /> Capture
                      </Button>
                    )}
                  </div>
                )}
                <Button type="submit">Save Entry</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name/Vehicle</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
                <TableHead>Image</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries
                .slice()
                .reverse()
                .map((entry) => (
                  <TableRow key={entry.EntryID}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(entry.EntryID)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(
                            checked
                              ? [...selectedIds, entry.EntryID]
                              : selectedIds.filter((id) => id !== entry.EntryID)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>{entry.Name}</TableCell>
                    <TableCell>{entry.Purpose}</TableCell>
                    <TableCell>
                      {format(new Date(entry.InTime), "PPpp")}
                    </TableCell>
                    <TableCell>
                      {entry.OutTime === "0001-01-01T00:00:00" ||
                      entry.OutTime == null
                        ? ""
                        : format(new Date(entry.OutTime), "PPpp")}
                    </TableCell>
                    <TableCell>
                      {entry.Image && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageClick(entry.Image)}
                        >
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={handleOutTimeEntry}>Update Out Time</Button>
            <Button variant="outline" onClick={() => setSelectedIds([])}>
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Entry Image</DialogTitle>
          </DialogHeader>
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={currentImage}
              alt="Entry"
              className="w-full h-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
