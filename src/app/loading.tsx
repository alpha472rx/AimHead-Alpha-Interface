import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-[0_0_30px_rgba(0,255,153,0.1)]">
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-md">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>

          <div className="space-y-3 rounded-md p-3">
             <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <Skeleton className="h-[1px] w-full" />
             <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-5 w-1/6" />
              </div>
              <Skeleton className="h-[1px] w-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-1/5" />
              </div>
          </div>
          
          <Skeleton className="h-10 w-full mt-4" />

          <Skeleton className="my-4 h-[1px] w-full" />

          <div className="space-y-4">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
