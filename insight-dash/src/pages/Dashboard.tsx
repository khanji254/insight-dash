import {
  DollarSign,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  redFlags,
  entities,
  aiInsights,
  donors,
  tenders,
  formatKES,
} from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

function getRiskColor(score: number) {
  if (score >= 70) return "text-risk-high";
  if (score >= 40) return "text-risk-medium";
  return "text-risk-low";
}

function getRiskBg(score: number) {
  if (score >= 70) return "bg-destructive/10 text-destructive border-destructive/20";
  if (score >= 40) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  return "bg-green-500/10 text-green-700 border-green-500/20";
}

const totalDonations = donors.reduce((s, d) => s + d.amount, 0);
const totalContractsToFlag = redFlags.reduce((s, f) => s + f.tenderAmount, 0);
const avgROI = redFlags.length > 0
  ? Math.round(redFlags.reduce((s, f) => s + f.tenderAmount / f.donationAmount, 0) / redFlags.length * 100) / 100
  : 0;
const highRiskCount = entities.filter((e) => e.riskScore >= 70).length;

const kpis = [
  {
    title: "Total Disclosed Donations",
    value: formatKES(totalDonations),
    icon: DollarSign,
    trend: "+12.5%",
    trendUp: true,
    description: "From 15 tracked donors",
  },
  {
    title: "Contracts to Donors",
    value: formatKES(totalContractsToFlag),
    icon: FileCheck,
    trend: "+23.1%",
    trendUp: true,
    description: "Awarded to flagged entities",
  },
  {
    title: "Average Donor ROI",
    value: `${avgROI}x`,
    icon: TrendingUp,
    trend: "+8.3%",
    trendUp: true,
    description: "Return on political investment",
  },
  {
    title: "High-Risk Entities",
    value: highRiskCount.toString(),
    icon: AlertTriangle,
    trend: "+2",
    trendUp: true,
    description: "Risk score ≥ 70",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitoring political financing and procurement correlations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-risk-high" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-risk-low" />
                )}
                <span className={`text-xs ${kpi.trendUp ? "text-risk-high" : "text-risk-low"}`}>
                  {kpi.trend}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  {kpi.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Red Flag Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Red Flag Feed
              </CardTitle>
              <CardDescription>
                Recent donor↔tender matches ranked by risk
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <div className="divide-y divide-border">
                  {redFlags.slice(0, 12).map((flag) => (
                    <button
                      key={flag.id}
                      onClick={() =>
                        navigate(
                          `/entity/${flag.entityA.replace(/\s/g, "-").toLowerCase()}`
                        )
                      }
                      className="w-full text-left px-6 py-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm truncate">
                              {flag.entityA}
                            </span>
                            <span className="text-muted-foreground text-xs">↔</span>
                            <span className="text-sm text-muted-foreground truncate">
                              {flag.entityB}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>Donated {formatKES(flag.donationAmount)}</span>
                            <span>•</span>
                            <span>Won {formatKES(flag.tenderAmount)}</span>
                            <span>•</span>
                            <span>{flag.ministry}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            className={`text-xs font-mono ${getRiskBg(flag.riskScore)}`}
                            variant="outline"
                          >
                            {flag.riskScore}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {Math.round(flag.matchConfidence * 100)}% match
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Auto-generated pattern analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[480px]">
                <div className="space-y-4 p-6 pt-0">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`rounded-lg border p-4 ${
                        insight.severity === "high"
                          ? "border-destructive/30 bg-destructive/5"
                          : "border-yellow-500/30 bg-yellow-500/5"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle
                          className={`h-4 w-4 mt-0.5 ${
                            insight.severity === "high"
                              ? "text-destructive"
                              : "text-yellow-600"
                          }`}
                        />
                        <span className="text-sm font-semibold">
                          {insight.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {insight.text}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
