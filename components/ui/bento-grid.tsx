import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 ",
        className
      )}

    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-card dark:border-white/[0.2]  border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="flex items-center group-hover/bento:translate-x-2 transition duration-200 text-primary">
        {icon}
        <div className="font-sans font-bold text-foreground mb-2 mt-2 ml-2">
          {title}
        </div>
      </div>
      <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
        {description}
      </div>
    </div>
  );
};
