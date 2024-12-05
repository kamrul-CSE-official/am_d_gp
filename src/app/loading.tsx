import React from "react";
import { Loader2 } from "lucide-react";

const GlobalLoading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="animate-spin h-16 w-16" />
        <span className="text-lg">Loading...</span>
      </div>
    </div>
  );
};

export default GlobalLoading;
