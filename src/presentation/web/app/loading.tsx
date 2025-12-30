import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}