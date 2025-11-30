import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useVaultStore } from "@/store/vaultStore";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Music, Clock, Users, FileText, AlertTriangle, Trash2, Edit3, Loader2, Plus, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { usePermission } from "@/lib/permissions";
import { formatDate, formatDateWithDay } from "@/lib/dateUtils";

export function EventBriefsTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:events');
  const canEdit = usePermission('edit:events');
  
  const [eventBriefs, setEventBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingBrief, setEditingBrief] = useState<any>(null);
  const [isNewBriefOpen, setIsNewBriefOpen] = useState(false);
  const [newBrief, setNewBrief] = useState({
    artist: '',
    genre: '',
    setTimes: '',
    audioOrder: '',
    specialLightingOrder: '',
    visualOrder: '',
    timecodeRouting: '',
    brandMoment: '',
    liveSetRecording: '',
    sfxNotes: '',
    briefStatus: 'Draft' as const,
    riskLevel: 'Low' as const,
    date: new Date()
  });

  // Load event briefs from API
  useEffect(() => {
    loadEventBriefs();
  }, [selectedCity]);

  const loadEventBriefs = async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await api.eventBriefs.getAll(selectedCity);
      setEventBriefs(data);
    } catch (error: any) {
      console.error('Failed to load event briefs:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load event briefs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateBrief = async () => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to create event briefs", variant: "destructive" });
      return;
    }
    
    if (!newBrief.artist || !newBrief.date) {
      toast({ title: "Error", description: "Artist and date are required", variant: "destructive" });
      return;
    }
    
    if (submitting) return; // Prevent double submit
    
    try {
      setSubmitting(true);
      const { date, ...restBrief } = newBrief;
      await api.eventBriefs.create({ 
        ...restBrief,
        date: date.toISOString(),
        city: selectedCity 
      });
      
      setNewBrief({
        artist: '', genre: '', setTimes: '',
        audioOrder: '', specialLightingOrder: '', visualOrder: '', timecodeRouting: '',
        brandMoment: '', liveSetRecording: '', sfxNotes: '', briefStatus: 'Draft', riskLevel: 'Low', date: new Date()
      });
      setIsNewBriefOpen(false);
      
      toast({ title: "Success", description: "Event brief created successfully" });
      loadEventBriefs();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create event brief", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBrief = async (id: string, artist: string) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to delete event briefs", variant: "destructive" });
      return;
    }
    
    try {
      await api.eventBriefs.delete(id);
      toast({ title: "Success", description: `Event brief for ${artist} deleted` });
      loadEventBriefs();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete event brief", 
        variant: "destructive" 
      });
    }
  };

  const handleEditBrief = (brief: any) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to edit event briefs", variant: "destructive" });
      return;
    }
    setEditingBrief({ ...brief });
  };

  const handleSaveEdit = async () => {
    if (!editingBrief || !canEdit) return;
    
    try {
      await api.eventBriefs.update(editingBrief.id, editingBrief);
      setEditingBrief(null);
      toast({ title: "Success", description: "Event brief updated successfully" });
      loadEventBriefs();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update event brief", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleBriefStatus = async (brief: any) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to change brief status", variant: "destructive" });
      return;
    }
    
    try {
      const newStatus = brief.briefStatus === 'Final' ? 'Draft' : 'Final';
      await api.eventBriefs.update(brief.id, { briefStatus: newStatus });
      toast({ 
        title: "Success", 
        description: `Brief ${newStatus === 'Final' ? 'locked' : 'unlocked'}` 
      });
      loadEventBriefs();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update brief status", 
        variant: "destructive" 
      });
    }
  };

  const handleExportPDF = async (brief: any) => {
    try {
      await api.eventBriefs.exportPDF(brief.id, brief.artist);
      toast({ 
        title: "Success", 
        description: `PDF exported for ${brief.artist}` 
      });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to export PDF", 
        variant: "destructive" 
      });
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-muted-foreground">You don't have permission to view event briefs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Event Briefs - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isNewBriefOpen} onOpenChange={setIsNewBriefOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                New Brief
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-background">
            <DialogHeader>
              <DialogTitle>Create New Event Brief</DialogTitle>
              <DialogDescription>
                Create a detailed event brief for an upcoming performance in {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {format(newBrief.date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newBrief.date}
                        onSelect={(date) => date && setNewBrief({...newBrief, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Label htmlFor="audioOrder">Audio Order</Label>
                  <Textarea
                    id="audioOrder"
                    value={newBrief.audioOrder}
                    onChange={(e) => setNewBrief({...newBrief, audioOrder: e.target.value})}
                    placeholder="Audio requirements and monitor setup"
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="specialLightingOrder">Special Lighting Order</Label>
                  <Textarea
                    id="specialLightingOrder"
                    value={newBrief.specialLightingOrder}
                    onChange={(e) => setNewBrief({...newBrief, specialLightingOrder: e.target.value})}
                    placeholder="Special lighting requirements and cue instructions"
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="visualOrder">Visual Order</Label>
                  <Textarea
                    id="visualOrder"
                    value={newBrief.visualOrder}
                    onChange={(e) => setNewBrief({...newBrief, visualOrder: e.target.value})}
                    placeholder="Visual content and VJ requirements"
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="timecodeRouting">Timecode</Label>
                  <Textarea
                    id="timecodeRouting"
                    value={newBrief.timecodeRouting}
                    onChange={(e) => setNewBrief({...newBrief, timecodeRouting: e.target.value})}
                    placeholder="Timecode routing and synchronization details"
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="brandMoment">Brand Moment</Label>
                  <Textarea
                    id="brandMoment"
                    value={newBrief.brandMoment}
                    onChange={(e) => setNewBrief({...newBrief, brandMoment: e.target.value})}
                    placeholder="Brand activation moments and special requirements"
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="liveSetRecording">Live Set Recording</Label>
                  <Textarea
                    id="liveSetRecording"
                    value={newBrief.liveSetRecording}
                    onChange={(e) => setNewBrief({...newBrief, liveSetRecording: e.target.value})}
                    placeholder="Recording requirements and delivery specifications"
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="sfxNotes">SFX Notes</Label>
                  <Textarea
                    id="sfxNotes"
                    value={newBrief.sfxNotes}
                    onChange={(e) => setNewBrief({...newBrief, sfxNotes: e.target.value})}
                    placeholder="CO₂/confetti/fog/cold spark instructions"
                    className="h-20"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t bg-background">
              <Button variant="outline" onClick={() => setIsNewBriefOpen(false)} disabled={submitting}>Cancel</Button>
              <Button onClick={handleCreateBrief} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Brief"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : eventBriefs.length === 0 ? (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No event briefs found for {selectedCity}</p>
              {canEdit && (
                <Button variant="outline" onClick={() => setIsNewBriefOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Brief
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
        {eventBriefs.map((brief) => (
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
                  {formatDateWithDay(brief.date)}
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
                    <div><strong>Audio Order:</strong> {brief.audioOrder || brief.monitorNeeds}</div>
                    <div><strong>Special Lighting Order:</strong> {brief.specialLightingOrder || brief.ljCueNotes}</div>
                    <div><strong>Visual Order:</strong> {brief.visualOrder || brief.vjContentChecklist}</div>
                    <div><strong>Timecode:</strong> {brief.timecodeRouting}</div>
                    <div><strong>Brand Moment:</strong> {brief.brandMoment}</div>
                    <div><strong>Live Set Recording:</strong> {brief.liveSetRecording}</div>
                    <div><strong>SFX:</strong> {brief.sfxNotes}</div>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border/30">
                {canEdit && (
                  <>
                    <Button 
                      variant={brief.briefStatus === 'Final' ? 'outline' : 'default'} 
                      size="sm"
                      onClick={() => handleToggleBriefStatus(brief)}
                    >
                      {brief.briefStatus === 'Final' ? (
                        <>
                          <Unlock className="h-3 w-3 mr-1" />
                          Unlock Brief
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          Lock Brief
                        </>
                      )}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEditBrief(brief)}>
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => handleExportPDF(brief)}>
                  <FileText className="h-3 w-3 mr-1" />
                  Export PDF
                </Button>
                {canEdit && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteBrief(brief.id, brief.artist)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Edit Brief Dialog */}
      {editingBrief && (
        <Dialog open={!!editingBrief} onOpenChange={() => setEditingBrief(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-background">
            <DialogHeader>
              <DialogTitle>Edit Event Brief - {editingBrief.artist}</DialogTitle>
              <DialogDescription>
                Update the event brief details for this performance
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 pr-2 space-y-4">
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="edit-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {editingBrief.date && format(new Date(editingBrief.date), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={new Date(editingBrief.date)}
                        onSelect={(date) => date && setEditingBrief({...editingBrief, date: date.toISOString()})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Label htmlFor="edit-audioOrder">Audio Order</Label>
                  <Textarea
                    id="edit-audioOrder"
                    value={editingBrief.audioOrder || editingBrief.monitorNeeds || ''}
                    onChange={(e) => setEditingBrief({...editingBrief, audioOrder: e.target.value})}
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-specialLightingOrder">Special Lighting Order</Label>
                  <Textarea
                    id="edit-specialLightingOrder"
                    value={editingBrief.specialLightingOrder || editingBrief.ljCueNotes || ''}
                    onChange={(e) => setEditingBrief({...editingBrief, specialLightingOrder: e.target.value})}
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-visualOrder">Visual Order</Label>
                  <Textarea
                    id="edit-visualOrder"
                    value={editingBrief.visualOrder || editingBrief.vjContentChecklist || ''}
                    onChange={(e) => setEditingBrief({...editingBrief, visualOrder: e.target.value})}
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-timecodeRouting">Timecode</Label>
                  <Textarea
                    id="edit-timecodeRouting"
                    value={editingBrief.timecodeRouting || ''}
                    onChange={(e) => setEditingBrief({...editingBrief, timecodeRouting: e.target.value})}
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-brandMoment">Brand Moment</Label>
                  <Textarea
                    id="edit-brandMoment"
                    value={editingBrief.brandMoment || ''}
                    onChange={(e) => setEditingBrief({...editingBrief, brandMoment: e.target.value})}
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-liveSetRecording">Live Set Recording</Label>
                  <Textarea
                    id="edit-liveSetRecording"
                    value={editingBrief.liveSetRecording || ''}
                    onChange={(e) => setEditingBrief({...editingBrief, liveSetRecording: e.target.value})}
                    className="h-20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-sfxNotes">SFX Notes</Label>
                  <Textarea
                    id="edit-sfxNotes"
                    value={editingBrief.sfxNotes}
                    onChange={(e) => setEditingBrief({...editingBrief, sfxNotes: e.target.value})}
                    className="h-20"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t bg-background">
              <Button variant="outline" onClick={() => setEditingBrief(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}