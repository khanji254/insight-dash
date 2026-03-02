import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Search, ArrowUpDown, Building2, User } from "lucide-react";
import { entities, formatKES } from "@/lib/mock-data";

type SortKey = "riskScore" | "totalDonations" | "totalContracts" | "matchCount";

function getRiskBg(score: number) {
  if (score >= 70) return "bg-destructive/10 text-destructive border-destructive/20";
  if (score >= 40) return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  return "bg-green-500/10 text-green-700 border-green-500/20";
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");

  const filtered = useMemo(() => {
    let list = [...entities];
    if (search) list = list.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "all") list = list.filter((e) => e.type === typeFilter);
    list.sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
    return list;
  }, [search, typeFilter, sortKey]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-destructive" />
          Risk Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Entities ranked by corruption risk score
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="cursor-pointer" onClick={() => setSortKey("riskScore")}>
                  <span className="flex items-center gap-1">Risk Score <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => setSortKey("totalDonations")}>
                  <span className="flex items-center gap-1">Donations <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => setSortKey("totalContracts")}>
                  <span className="flex items-center gap-1">Contracts Won <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => setSortKey("matchCount")}>
                  <span className="flex items-center gap-1">Matches <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entity, i) => (
                <TableRow
                  key={entity.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/entity/${entity.id}`)}
                >
                  <TableCell className="font-mono text-muted-foreground text-sm">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-semibold">{entity.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      {entity.type === "Company" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {entity.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-mono ${getRiskBg(entity.riskScore)}`}>
                      {entity.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatKES(entity.totalDonations)}</TableCell>
                  <TableCell>{formatKES(entity.totalContracts)}</TableCell>
                  <TableCell className="font-mono">{entity.matchCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
