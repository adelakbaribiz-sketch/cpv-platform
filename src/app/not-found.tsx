import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="mx-auto h-16 w-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <FileQuestion className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-6 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          Back home
        </Link>
      </div>
    </div>
  );
}
