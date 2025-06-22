import { Card, CardContent, CardFooter, CardHeader, Skeleton } from "@/components/ui";

export const NationalJuryFormSkeleton: React.FC = () => {
    return (
        <>
            <Skeleton className="h-10 w-2/3 mb-4 sm:w-1/2" /> {/* Title */}
                <Skeleton className="h-24 w-full mb-6" /> {/* Alert (can be taller) */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {/* Mobile Skeleton for rows */}
                        <div className="sm:hidden space-y-4 p-4">
                            {[1, 2].map(i => (
                                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                                    <Skeleton className="h-5 w-1/4" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-5 w-1/4 mt-2" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-1/3 ml-auto mt-2" />
                                </div>
                            ))}
                        </div>
                        {/* Desktop Skeleton for table */}
                        <div className="hidden sm:block">
                            <Skeleton className="h-10 w-full mb-2" /> {/* Header */}
                            <Skeleton className="h-16 w-full mb-2" /> {/* Row 1 */}
                            <Skeleton className="h-16 w-full" />      {/* Row 2 */}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-28 ml-auto" /> {/* Submit button */}
                    </CardFooter>
                </Card>
        </>
    );
}