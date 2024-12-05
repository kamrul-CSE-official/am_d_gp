"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SelectWithSearch from "@/components/customUi/SelectWithSearch";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MdWidthNormal } from "react-icons/md";
import { Bus, Hospital } from "lucide-react";
import { IoRestaurantOutline, IoReturnDownBack } from "react-icons/io5";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  purpose: z.string().min(5, {
    message: "Purpose must be at least 5 characters.",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Step1 = () => (
  <div className="space-y-4 flex flex-wrap items-center justify-between gap-3">
    <Card className="cursor-pointer">
      <CardTitle>General</CardTitle>
      <CardContent>
        <MdWidthNormal />
      </CardContent>
    </Card>
    <Card className="cursor-pointer">
      <CardTitle>Medical</CardTitle>
      <CardContent>
        <Hospital />
      </CardContent>
    </Card>
    <Card className="cursor-pointer">
      <CardTitle>Returnable</CardTitle>
      <CardContent>
        <IoReturnDownBack />
      </CardContent>
    </Card>
    <Card className="cursor-pointer">
      <CardTitle>Non Returnable</CardTitle>
      <CardContent>
        <IoRestaurantOutline />
      </CardContent>
    </Card>
    <Card className="cursor-pointer">
      <CardTitle>Vehicle</CardTitle>
      <CardContent>
        <Bus />
      </CardContent>
    </Card>
  </div>
);

const Step2 = () => (
  <div className="space-y-4">
    <FormField
      name="purpose"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Purpose of Visit</FormLabel>
          <FormControl>
            <Input placeholder="Enter the purpose of your visit" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date of Visit</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const Step3 = ({ formData }: { formData: any }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Please confirm your details:</h3>
    <div className="grid grid-cols-2 gap-2">
      <span className="font-medium">Name:</span>
      <span>{formData.name}</span>
      <span className="font-medium">Email:</span>
      <span>{formData.email}</span>
      <span className="font-medium">Department:</span>
      <span>{formData.department}</span>
      <span className="font-medium">Purpose:</span>
      <span>{formData.purpose}</span>
      <span className="font-medium">Date:</span>
      <span>{formData.date}</span>
    </div>
  </div>
);

const GatePassForm = ({ onClose }: { onClose: any }) => {
  const [step, setStep] = useState(1);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      purpose: "",
      date: "",
    },
  });

  const options = [
    { label: "IT", value: "it" },
    { label: "HR", value: "hr" },
    { label: "Finance", value: "finance" },
    { label: "Operations", value: "operations" },
  ];

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ["name", "email", "department"];
    } else if (step === 2) {
      fieldsToValidate = ["purpose", "date"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Submitted Data: ", data);
    onClose();
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 formData={form.getValues()} />}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default GatePassForm;
