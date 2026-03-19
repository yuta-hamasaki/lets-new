import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewJobForm } from "@/app/jobs/new/new-job-form";

export default function NewJobPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">求人を掲載</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">求人情報</CardTitle>
        </CardHeader>
        <CardContent>
          <NewJobForm />
        </CardContent>
      </Card>
    </div>
  );
}

