import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Scale, Eye, Lock } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          About This Platform
        </h1>
        <p className="text-sm text-muted-foreground">
          TI-Kenya compliant anti-corruption intelligence tool
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5" />
            Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-3">
          <p>
            "Follow the Money" uses a multi-stage analysis pipeline to identify correlations between political campaign financing and government procurement outcomes:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-foreground">Data Ingestion</strong> — Campaign donation records (IEBC), tender awards (PPIP), and public appointments (Kenya Gazette) are collected and normalized.
            </li>
            <li>
              <strong className="text-foreground">Fuzzy Entity Matching</strong> — A string similarity algorithm identifies potential links between donor names and tender-winning companies, accounting for common variations (e.g., "Ltd" vs "Limited").
            </li>
            <li>
              <strong className="text-foreground">Risk Scoring</strong> — Each match is scored (0–100) based on: donation-to-award timing proximity, contract-to-donation amount ratio, and entity match confidence.
            </li>
            <li>
              <strong className="text-foreground">Pattern Analysis</strong> — AI-assisted narrative generation highlights suspicious patterns including rapid appointment-to-award sequences and sector concentration anomalies.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5" />
            Transparency International Kenya Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            This tool is designed in alignment with Transparency International Kenya's Anti-Corruption guidelines and the United Nations Convention against Corruption (UNCAC).
          </p>
          <p>
            All data presented is sourced from publicly available government records. No private or classified information is used. Risk scores are algorithmic indicators and do not constitute evidence of wrongdoing.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5" />
            Data Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            All data used in this platform is publicly available through official government portals. Entity matching and risk scoring are performed algorithmically. This tool is intended for research and accountability purposes only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
