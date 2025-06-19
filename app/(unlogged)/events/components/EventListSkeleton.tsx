// app\(unlogged)\events\components\EventListSkeleton.tsx
'use client';

import React from 'react';
import { BentoGrid } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";

interface EventListSkeletonProps {
  itemCount?: number;
}

export const EventListSkeleton: React.FC<EventListSkeletonProps> = ({ itemCount = 3 }) => {
  return (
    <BentoGrid className="mx-auto md:auto-rows-[22rem]"> 
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="row-span-1 rounded-xl group/bento transition duration-200 dark:bg-neutral-900 dark:border-neutral-800 bg-card border flex flex-col overflow-hidden"
        >
          {/* Map Placeholder */}
          <Skeleton className="h-40 sm:h-48 w-full" />
          
          {/* Content Placeholder */}
          <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-1.5 mb-1.5">
                <Skeleton className="w-4 h-4 rounded-full" /> {/* Icon placeholder */}
                <Skeleton className="h-3 w-2/3" /> {/* Location placeholder */}
              </div>
              <Skeleton className="h-5 w-4/5 mb-1" /> {/* Event Name placeholder */}
              <div className="flex items-center space-x-1.5">
                <Skeleton className="w-4 h-4 rounded-full" /> {/* Icon placeholder */}
                <Skeleton className="h-3 w-1/2" /> {/* Date placeholder */}
              </div>
            </div>
            <Skeleton className="h-7 w-full rounded-md mt-3" /> {/* Button placeholder */}
          </div>
        </div>
      ))}
    </BentoGrid>
  );
};