import { Button } from "@/components/ui/button";
import useStore from "@/zustand/store";
import React from "react";

export default function GatePassType() {
  const {
    setGatePassRequestType,
    gatePassRequestType,
    increaseGatePassRequestSteps,
    decreaseGatePassRequestSteps,
    gatePassRequestCurrentSteps,
  } = useStore();
  return (
    <div>
      
      <div className="flex flex-wrap items-center justify-center gap-5 m-3">
        {[
          { id: 1, title: "General" },
          { id: 2, title: "Medical" },
          { id: 3, title: "Returnable" },
          { id: 4, title: "Non-Returnable" },
          { id: 5, title: "Vehicle" },
        ].map((item: { id: number; title: string }) => (
          <Button
            onClick={() => {
              setGatePassRequestType({
                type: item.title,
                GatePassTypeID: item.id,
              });
              increaseGatePassRequestSteps();
            }}
            key={item.id}
            variant="outline"
            className="h-12 flex flex-col items-center justify-center text-sm font-extralight"
          >
            {item.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
