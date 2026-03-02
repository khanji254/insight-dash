import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Vote, FileCheck, BookOpen, RefreshCw } from "lucide-react";

const sources = [
  {
    name: "IEBC Donations Register",
    icon: Vote,
    description:
      "Independent Electoral and Boundaries Commission — tracks all disclosed campaign donations to registered political parties and candidates.",
    records: "2,340 records",
    lastSync: "2024-12-15",
    status: "active" as const,
  },
  {
    name: "PPIP Tender Awards",
    icon: FileCheck,
    description:
      "Public Procurement Information Portal — comprehensive database of all government procurement awards including contract amounts, winning companies, and awarding ministries.",
    records: "15,890 records",
    lastSync: "2025-01-02",
    status: "active" as const,
  },
  {
    name: "Kenya Gazette Appointments",
    icon: BookOpen,
    description:
      "Official Kenya Gazette notices for public sector appointments — tracks new appointments to government positions, board memberships, and regulatory bodies.",
    records: "4,567 records",
    lastSync: "2024-11-30",
    status: "active" as const,
  },
];

export default function DataSources() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          Data Sources
        </h1>
        <p className="text-sm text-muted-foreground">
          Open data sources powering the corruption risk analysis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {sources.map((source) => (
          <Card key={source.name} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <source.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="bg-success/10 text-green-700 border-green-500/20">
                  Active
                </Badge>
              </div>
              <CardTitle className="text-lg mt-3">{source.name}</CardTitle>
              <CardDescription className="leading-relaxed">
                {source.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{source.records}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  Last sync: {source.lastSync}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
