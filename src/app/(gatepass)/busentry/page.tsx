'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RefreshCw, Bus, MapPin, Clock } from 'lucide-react'
import axiosInstance from "@/helper/axios/axiosInstance"
import { UserInfo } from "@/service/auth.service"
import toast from "react-hot-toast"

const schema = yup.object().shape({
  BusNo: yup.string().required("Bus No is required"),
  Location: yup.string().required("Location is required"),
  InTime: yup.string().required("In Time is required"),
  OutTime: yup.string().required("Out Time is required")
    .test('is-after-in-time', 'Out Time must be after In Time', function(value) {
      const { InTime } = this.parent
      if (InTime && value) {
        const inTime = parse(InTime, 'HH:mm', new Date())
        const outTime = parse(value, 'HH:mm', new Date())
        return outTime > inTime
      }
      return true
    }),
})

export default function ExternalBusEntryPage() {
  const today = new Date()
  const [fromDate, setFromDate] = useState<Date>(today)
  const [toDate, setToDate] = useState<Date>(() => {
    const toTime = new Date(today)
    toTime.setMinutes(today.getMinutes() + 15)
    return toTime
  })

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      BusNo: "",
      Location: "",
      InTime: format(fromDate, "HH:mm"),
      OutTime: format(toDate, "HH:mm"),
    }
  })

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    const obj = {
      ...data,
      EnterOn: today,
      EnterBy: UserInfo?.()?.EmpID,
    }

    try {
      const response = await axiosInstance.post("/api/GatePass/SaveExternalBus", obj)
      if (response.status === 200) {
        toast.success("External bus entry saved successfully.")
        form.reset()
      } else {
        throw new Error("Failed to save external bus entry")
      }
    } catch (error) {
      console.error("API call failed", error)
      toast.error("Failed to save external bus entry. Please try again.")
    }
  }

  const handleRefresh = () => {
    form.reset()
    setFromDate(new Date())
    setToDate(new Date(new Date().setMinutes(new Date().getMinutes() + 15)))
    toast.success("The form has been reset to its initial state.")
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Bus Entry</CardTitle>
            <CardDescription>Enter details for external bus entry</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="BusNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus No</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input placeholder="Enter bus number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input placeholder="Enter location" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="InTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>In Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="time"
                            value={format(fromDate, 'HH:mm')}
                            onChange={(e) => {
                              const newTime = e.target.value
                              const newDate = parse(newTime, 'HH:mm', new Date())
                              setFromDate(newDate)
                              field.onChange(newTime)
                            }}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="OutTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Out Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="time"
                            value={format(toDate, 'HH:mm')}
                            onChange={(e) => {
                              const newTime = e.target.value
                              const newDate = parse(newTime, 'HH:mm', new Date())
                              setToDate(newDate)
                              field.onChange(newTime)
                            }}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">Save Entry</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
