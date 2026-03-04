import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  User,
  Brain,
  AlertCircle,
  Calendar,
  Vote,
  FileCheck,
  Landmark,
  DollarSign,
  Network,
} from "lucide-react";
import {
  entities,
  redFlags,
  donors,
  tenders,
  appointments,
  aiInsights,
  formatKES,
} from "@/lib/mock-data";

function getRiskBg(score: number) {
  if (score >= 70) return "bg-destructive/10 text-destructive border-destructive/20";
  if (score >= 40) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  return "bg-green-500/10 text-green-700 border-green-500/20";
}

export default function EntityProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const entity = entities.find((e) => e.id === id);
  if (!entity) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Entity not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go back
        </Button>
      </div>
    );
  }

  const entityFlags = redFlags.filter((f) => f.entityA === entity.name);
  const entityDonor = donors.find((d) => d.name === entity.name);
  const entityTenders = entityFlags.map((f) =>
    tenders.find((t) => t.companyName === f.entityB)
  ).filter(Boolean);
  const entityAppointment = appointments.find(
    (a) => a.name === entity.name || a.ministry === entity.ministry
  );
  const entityInsight = aiInsights.find(
    (i) => entity.name.includes(i.entity) || i.entity.includes(entity.name.split(" ")[0])
  );

  // Timeline events
  const timeline: { date: string; label: string; icon: typeof Calendar; color: string }[] = [];
  if (entityDonor) {
    timeline.push({ date: entityDonor.date, label: `Donated ${formatKES(entityDonor.amount)} to ${entityDonor.party}`, icon: DollarSign, color: "text-primary" });
  }
  timeline.push({ date: "2022-08-09", label: "General Election", icon: Vote, color: "text-muted-foreground" });
  if (entityAppointment) {
    timeline.push({ date: entityAppointment.date, label: `Appointed: ${entityAppointment.role}`, icon: Landmark, color: "text-yellow-600" });
  }
  entityTenders.forEach((t) => {
    if (t) timeline.push({ date: t.awardDate, label: `Won tender ${formatKES(t.amount)} — ${t.ministry}`, icon: FileCheck, color: "text-destructive" });
  });
  timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {entity.type === "Company" ? (
              <Building2 className="h-6 w-6 text-primary" />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{entity.name}</h1>
            <p className="text-sm text-muted-foreground">
              {entity.type} • {entity.party}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={`text-lg px-4 py-1 font-mono ${getRiskBg(entity.riskScore)}`}>
          Risk: {entity.riskScore}
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Donations</div>
            <div className="text-2xl font-bold">{formatKES(entity.totalDonations)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Contracts Won</div>
            <div className="text-2xl font-bold">{formatKES(entity.totalContracts)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Flagged Matches</div>
            <div className="text-2xl font-bold">{entity.matchCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Timeline
          </CardTitle>
          <CardDescription>Chronological sequence of events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-4 pl-0">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border">
                    <event.icon className={`h-4 w-4 ${event.color}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-xs text-muted-foreground font-mono">{event.date}</div>
                    <div className="text-sm font-medium">{event.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connection Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="h-5 w-5" />
              Connection Map
            </CardTitle>
            <CardDescription>Network visualization (future Cytoscape/D3 integration)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-3">
              <Network className="h-12 w-12 text-muted-foreground/30" />
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Donor → {entity.party} → {entity.ministry || "Ministry"} → Contract
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Interactive graph coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insight */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entityInsight ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <span className="text-sm font-semibold">{entityInsight.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entityInsight.text}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  No specific AI insights generated for this entity yet. The system continuously analyzes patterns and will flag anomalies when detected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
