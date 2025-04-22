
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-center">Finding the perfect movie for you...</p>
    </div>
  );
};

export default LoadingState;
