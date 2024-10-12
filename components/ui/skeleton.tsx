import { cn } from "@/lib/utils";

function Skeleton({
  className,
  height = 'h-10',  
  width = 'w-full',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { height?: string; width?: string }) {
  return (
    <div
      className={cn(`animate-pulse rounded-md bg-muted ${height} ${width}`, className)} // Aplica height y width como clases
      {...props}
    />
  );
}

export { Skeleton };
