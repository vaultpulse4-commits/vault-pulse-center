import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/vaultStore";
import { Calendar, Music, Clock, Users, FileText, AlertTriangle } from "lucide-react";

export function EventBriefsTab() {
  const { selectedCity, eventBriefs, updateEventBrief } = useVaultStore();
  const cityBriefs = eventBriefs.filter(brief => brief.city === selectedCity);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-success';
      case 'Med': return 'text-warning';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusVariant = (status: string) => {
    return status === 'Final' ? 'default' : 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Event Briefs - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          New Brief
        </Button>
      </div>

      <div className="grid gap-6">
        {cityBriefs.map((brief) => (
          <Card key={brief.id} className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {brief.artist}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(brief.briefStatus)}>
                    {brief.briefStatus}
                  </Badge>
                  <Badge variant="outline" className={getRiskColor(brief.riskLevel)}>
                    {brief.riskLevel} Risk
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {brief.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {brief.setTimes}
                </div>
                <Badge variant="secondary">{brief.genre}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Technical Requirements */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Technical Requirements</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Monitor Needs:</strong> {brief.monitorNeeds}</div>
                    <div><strong>LJ Cue Notes:</strong> {brief.ljCueNotes}</div>
                    <div><strong>VJ Checklist:</strong> {brief.vjContentChecklist}</div>
                    <div><strong>Timecode:</strong> {brief.timecodeRouting}</div>
                    <div><strong>SFX:</strong> {brief.sfxNotes}</div>
                  </div>
                </div>

                {/* Links & Documents */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Documents & Links</h4>
                  <div className="space-y-2">
                    {brief.stagePlotLink && (
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        Stage Plot
                      </Button>
                    )}
                    {brief.inputListLink && (
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        Input List
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border/30">
                <Button 
                  variant={brief.briefStatus === 'Final' ? 'outline' : 'default'} 
                  size="sm"
                  onClick={() => updateEventBrief(brief.id, { 
                    briefStatus: brief.briefStatus === 'Final' ? 'Draft' : 'Final' 
                  })}
                >
                  {brief.briefStatus === 'Final' ? 'Unlock Brief' : 'Lock Brief'}
                </Button>
                <Button variant="secondary" size="sm">
                  Edit Brief
                </Button>
                <Button variant="outline" size="sm">
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}