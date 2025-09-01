import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useVaultStore } from "@/store/vaultStore";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Music, Clock, Users, FileText, AlertTriangle, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";

export function EventBriefsTab() {
  const { selectedCity, eventBriefs, updateEventBrief, addEventBrief, deleteEventBrief } = useVaultStore();
  const { toast } = useToast();
  const cityBriefs = eventBriefs.filter(brief => brief.city === selectedCity);
  
  const [editingBrief, setEditingBrief] = useState<any>(null);
  const [isNewBriefOpen, setIsNewBriefOpen] = useState(false);
  const [newBrief, setNewBrief] = useState({
    artist: '',
    genre: '',
    setTimes: '',
    stagePlotLink: '',
    inputListLink: '',
    monitorNeeds: '',
    ljCueNotes: '',
    vjContentChecklist: '',
    timecodeRouting: '',
    sfxNotes: '',
    briefStatus: 'Draft' as const,
    riskLevel: 'Low' as const,
    date: ''
  });

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

  const handleCreateBrief = () => {
    if (!newBrief.artist || !newBrief.date) {
      toast({ title: "Error", description: "Artist and date are required", variant: "destructive" });
      return;
    }
    
    addEventBrief({ ...newBrief, city: selectedCity });
    setNewBrief({
      artist: '', genre: '', setTimes: '', stagePlotLink: '', inputListLink: '',
      monitorNeeds: '', ljCueNotes: '', vjContentChecklist: '', timecodeRouting: '',
      sfxNotes: '', briefStatus: 'Draft', riskLevel: 'Low', date: ''
    });
    setIsNewBriefOpen(false);
    toast({ title: "Success", description: "Event brief created successfully" });
  };

  const handleDeleteBrief = (id: string, artist: string) => {
    deleteEventBrief(id);
    toast({ title: "Success", description: `Event brief for ${artist} deleted` });
  };

  const handleEditBrief = (brief: any) => {
    setEditingBrief({ ...brief });
  };

  const handleSaveEdit = () => {
    if (!editingBrief) return;
    
    updateEventBrief(editingBrief.id, editingBrief);
    setEditingBrief(null);
    toast({ title: "Success", description: "Event brief updated successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Event Briefs - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        <Dialog open={isNewBriefOpen} onOpenChange={setIsNewBriefOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              New Brief
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event Brief</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="artist">Artist *</Label>
                <Input
                  id="artist"
                  value={newBrief.artist}
                  onChange={(e) => setNewBrief({...newBrief, artist: e.target.value})}
                  placeholder="Artist name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={newBrief.genre}
                  onChange={(e) => setNewBrief({...newBrief, genre: e.target.value})}
                  placeholder="Music genre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newBrief.date}
                  onChange={(e) => setNewBrief({...newBrief, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setTimes">Set Times</Label>
                <Input
                  id="setTimes"
                  value={newBrief.setTimes}
                  onChange={(e) => setNewBrief({...newBrief, setTimes: e.target.value})}
                  placeholder="e.g., 22:00 - 02:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={newBrief.riskLevel} onValueChange={(value: any) => setNewBrief({...newBrief, riskLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Med">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="briefStatus">Status</Label>
                <Select value={newBrief.briefStatus} onValueChange={(value: any) => setNewBrief({...newBrief, briefStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="monitorNeeds">Monitor Needs</Label>
                <Textarea
                  id="monitorNeeds"
                  value={newBrief.monitorNeeds}
                  onChange={(e) => setNewBrief({...newBrief, monitorNeeds: e.target.value})}
                  placeholder="Monitor requirements"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="ljCueNotes">LJ Cue Notes</Label>
                <Textarea
                  id="ljCueNotes"
                  value={newBrief.ljCueNotes}
                  onChange={(e) => setNewBrief({...newBrief, ljCueNotes: e.target.value})}
                  placeholder="Lighting cue instructions"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="vjContentChecklist">VJ Content Checklist</Label>
                <Textarea
                  id="vjContentChecklist"
                  value={newBrief.vjContentChecklist}
                  onChange={(e) => setNewBrief({...newBrief, vjContentChecklist: e.target.value})}
                  placeholder="Visual content requirements"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="sfxNotes">SFX Notes</Label>
                <Textarea
                  id="sfxNotes"
                  value={newBrief.sfxNotes}
                  onChange={(e) => setNewBrief({...newBrief, sfxNotes: e.target.value})}
                  placeholder="CO₂/confetti/fog/cold spark instructions"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setIsNewBriefOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateBrief}>Create Brief</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  onClick={() => {
                    updateEventBrief(brief.id, { 
                      briefStatus: brief.briefStatus === 'Final' ? 'Draft' : 'Final' 
                    });
                    toast({ 
                      title: "Success", 
                      description: `Brief ${brief.briefStatus === 'Final' ? 'unlocked' : 'locked'}` 
                    });
                  }}
                >
                  {brief.briefStatus === 'Final' ? 'Unlock Brief' : 'Lock Brief'}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleEditBrief(brief)}>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit Brief
                </Button>
                <Button variant="outline" size="sm">
                  Export PDF
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteBrief(brief.id, brief.artist)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Brief Dialog */}
      {editingBrief && (
        <Dialog open={!!editingBrief} onOpenChange={() => setEditingBrief(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event Brief - {editingBrief.artist}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-artist">Artist</Label>
                <Input
                  id="edit-artist"
                  value={editingBrief.artist}
                  onChange={(e) => setEditingBrief({...editingBrief, artist: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-genre">Genre</Label>
                <Input
                  id="edit-genre"
                  value={editingBrief.genre}
                  onChange={(e) => setEditingBrief({...editingBrief, genre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingBrief.date}
                  onChange={(e) => setEditingBrief({...editingBrief, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-setTimes">Set Times</Label>
                <Input
                  id="edit-setTimes"
                  value={editingBrief.setTimes}
                  onChange={(e) => setEditingBrief({...editingBrief, setTimes: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-riskLevel">Risk Level</Label>
                <Select value={editingBrief.riskLevel} onValueChange={(value: any) => setEditingBrief({...editingBrief, riskLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Med">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-briefStatus">Status</Label>
                <Select value={editingBrief.briefStatus} onValueChange={(value: any) => setEditingBrief({...editingBrief, briefStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-monitorNeeds">Monitor Needs</Label>
                <Textarea
                  id="edit-monitorNeeds"
                  value={editingBrief.monitorNeeds}
                  onChange={(e) => setEditingBrief({...editingBrief, monitorNeeds: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-ljCueNotes">LJ Cue Notes</Label>
                <Textarea
                  id="edit-ljCueNotes"
                  value={editingBrief.ljCueNotes}
                  onChange={(e) => setEditingBrief({...editingBrief, ljCueNotes: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-vjContentChecklist">VJ Content Checklist</Label>
                <Textarea
                  id="edit-vjContentChecklist"
                  value={editingBrief.vjContentChecklist}
                  onChange={(e) => setEditingBrief({...editingBrief, vjContentChecklist: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-sfxNotes">SFX Notes</Label>
                <Textarea
                  id="edit-sfxNotes"
                  value={editingBrief.sfxNotes}
                  onChange={(e) => setEditingBrief({...editingBrief, sfxNotes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setEditingBrief(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}