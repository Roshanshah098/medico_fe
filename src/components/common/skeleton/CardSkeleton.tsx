import { Skeleton } from "@mantine/core";
import React from "react";

const CardSkeleton = () => {
  return (
    <div>
      {" "}
      <div className="skeleton-card mx-auto p-4 max-w-md w-full rounded-lg shadow-md bg-gray-100">
        {/* Skeleton Card Content */}
        <div className="flex justify-center mb-4">
          <Skeleton height={50} width={50} circle />
        </div>
        <div className="space-y-2">
          <Skeleton height={24} width="60%" className="mx-auto" />
          <Skeleton height={28} width="80%" className="mx-auto" />
        </div>
        <div className="border-t border-gray-200 py-4 mt-4">
          <Skeleton height={20} width="40%" className="mx-auto mb-2" />
          <Skeleton height={24} width="70%" className="mx-auto" />
        </div>
        <div className="mt-6 space-y-4">
          <Skeleton height={36} width="100%" className="mx-auto" />
          <Skeleton height={36} width="100%" className="mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
