"use client";

import React from "react";

const Loading = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-16">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-700"></div>
      <div className="text-center mt-2">Loading...</div>
    </div>
  );
};

export default Loading;
