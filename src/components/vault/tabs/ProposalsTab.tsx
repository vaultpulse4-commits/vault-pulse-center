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
import { DollarSign, TrendingUp, Clock, CheckCircle, FileText, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

export function ProposalsTab() {
  const { selectedCity, proposals, addProposal, updateProposal, deleteProposal, crewMembers } = useVaultStore();
  const { toast } = useToast();
  
  const cityProposals = proposals.filter(proposal => proposal.city === selectedCity);
  const cityOwners = crewMembers.filter(member => member.city === selectedCity);
  
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<any>(null);
  
  const [newProposal, setNewProposal] = useState({
    title: '',
    type: 'CapEx' as const,
    urgency: 'Medium' as const,
    estimate: 0,
    roi: '',
    vendor: '',
    status: 'Draft' as const,
    targetWeek: '',
    owner: '',
    nextAction: '',
    quotes: 0
  });

  const getUrgencyVariant = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Review': return 'secondary';
      case 'Ordered': return 'default';
      case 'Live': return 'default';
      case 'Draft': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Live':
        return <CheckCircle className="h-3 w-3" />;
      case 'Review':
        return <Clock className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M IDR`;
    }
    return `${(amount / 1000).toFixed(0)}K IDR`;
  };

  const getApprovalLevel = (amount: number) => {
    return amount > 100000000 ? "CEO Approval" : "Tech Director";
  };

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.owner) {
      toast({ title: "Error", description: "Title and owner are required", variant: "destructive" });
      return;
    }
    
    addProposal({ ...newProposal, city: selectedCity });
    setNewProposal({
      title: '', type: 'CapEx', urgency: 'Medium', estimate: 0, roi: '',
      vendor: '', status: 'Draft', targetWeek: '', owner: '', nextAction: '', quotes: 0
    });
    setIsNewProposalOpen(false);
    toast({ title: "Success", description: "Proposal created successfully" });
  };

  const handleUpdateProposal = (id: string, updates: any) => {
    updateProposal(id, updates);
    toast({ title: "Success", description: "Proposal updated" });
  };

  const handleDeleteProposal = (id: string, title: string) => {
    deleteProposal(id);
    toast({ title: "Success", description: `Proposal "${title}" deleted` });
  };

  const handleEditProposal = (proposal: any) => {
    setEditingProposal({ ...proposal });
  };

  const handleSaveEdit = () => {
    if (!editingProposal) return;
    
    updateProposal(editingProposal.id, editingProposal);
    setEditingProposal(null);
    toast({ title: "Success", description: "Proposal updated successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Proposals (CapEx/OpEx)</h3>
        <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                  placeholder="Proposal title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newProposal.type} onValueChange={(value: any) => setNewProposal({...newProposal, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CapEx">CapEx</SelectItem>
                    <SelectItem value="OpEx">OpEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={newProposal.urgency} onValueChange={(value: any) => setNewProposal({...newProposal, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimate">Estimate (IDR)</Label>
                <Input
                  id="estimate"
                  type="number"
                  value={newProposal.estimate}
                  onChange={(e) => setNewProposal({...newProposal, estimate: parseInt(e.target.value) || 0})}
                  placeholder="Cost estimate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner *</Label>
                <Select value={newProposal.owner} onValueChange={(value) => setNewProposal({...newProposal, owner: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.name}>{owner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={newProposal.vendor}
                  onChange={(e) => setNewProposal({...newProposal, vendor: e.target.value})}
                  placeholder="Vendor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetWeek">Target Week</Label>
                <Input
                  id="targetWeek"
                  value={newProposal.targetWeek}
                  onChange={(e) => setNewProposal({...newProposal, targetWeek: e.target.value})}
                  placeholder="e.g., Week 37, 2025"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="roi">ROI Description</Label>
                <Textarea
                  id="roi"
                  value={newProposal.roi}
                  onChange={(e) => setNewProposal({...newProposal, roi: e.target.value})}
                  placeholder="Return on investment benefits"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nextAction">Next Action</Label>
                <Input
                  id="nextAction"
                  value={newProposal.nextAction}
                  onChange={(e) => setNewProposal({...newProposal, nextAction: e.target.value})}
                  placeholder="Next required action"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setIsNewProposalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProposal}>Create Proposal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Total Pending</div>
                <div className="text-lg font-bold">279M IDR</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Approved</div>
                <div className="text-lg font-bold">2 Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">In Review</div>
                <div className="text-lg font-bold">1 Item</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Draft</div>
                <div className="text-lg font-bold">1 Item</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {cityProposals.map((proposal) => (
          <Card key={proposal.id} className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  {proposal.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{proposal.type}</Badge>
                  <Badge variant={getUrgencyVariant(proposal.urgency)}>
                    {proposal.urgency}
                  </Badge>
                  <Badge variant={getStatusVariant(proposal.status)}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Estimate:</span>
                    <span className="font-bold ml-2">{formatCurrency(proposal.estimate)}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {getApprovalLevel(proposal.estimate)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">ROI:</span>
                    <span className="ml-2">{proposal.roi}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Vendor:</span>
                    <span className="ml-2">{proposal.vendor}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {proposal.quotes} quotes
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Target Week:</span>
                    <span className="ml-2">{proposal.targetWeek}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="ml-2">{proposal.owner}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Next Action:</span>
                    <span className="ml-2 font-medium">{proposal.nextAction}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-border/30">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextStatus = proposal.status === 'Draft' ? 'Review' : 
                                     proposal.status === 'Review' ? 'Approved' : 
                                     proposal.status === 'Approved' ? 'Ordered' : 'Live';
                    handleUpdateProposal(proposal.id, { status: nextStatus });
                  }}
                >
                  {proposal.status === 'Draft' && 'Submit for Review'}
                  {proposal.status === 'Review' && 'Approve'}
                  {proposal.status === 'Approved' && 'Mark Ordered'}
                  {proposal.status === 'Ordered' && 'Mark Live'}
                  {proposal.status === 'Live' && 'Completed'}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleEditProposal(proposal)}>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View Quotes
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteProposal(proposal.id, proposal.title)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Proposal Dialog */}
      {editingProposal && (
        <Dialog open={!!editingProposal} onOpenChange={() => setEditingProposal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Proposal - {editingProposal.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingProposal.title}
                  onChange={(e) => setEditingProposal({...editingProposal, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editingProposal.type} onValueChange={(value: any) => setEditingProposal({...editingProposal, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CapEx">CapEx</SelectItem>
                    <SelectItem value="OpEx">OpEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-urgency">Urgency</Label>
                <Select value={editingProposal.urgency} onValueChange={(value: any) => setEditingProposal({...editingProposal, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimate">Estimate (IDR)</Label>
                <Input
                  id="edit-estimate"
                  type="number"
                  value={editingProposal.estimate}
                  onChange={(e) => setEditingProposal({...editingProposal, estimate: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vendor">Vendor</Label>
                <Input
                  id="edit-vendor"
                  value={editingProposal.vendor}
                  onChange={(e) => setEditingProposal({...editingProposal, vendor: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-targetWeek">Target Week</Label>
                <Input
                  id="edit-targetWeek"
                  value={editingProposal.targetWeek}
                  onChange={(e) => setEditingProposal({...editingProposal, targetWeek: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-quotes">Quotes</Label>
                <Input
                  id="edit-quotes"
                  type="number"
                  value={editingProposal.quotes}
                  onChange={(e) => setEditingProposal({...editingProposal, quotes: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-roi">ROI Description</Label>
                <Textarea
                  id="edit-roi"
                  value={editingProposal.roi}
                  onChange={(e) => setEditingProposal({...editingProposal, roi: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-nextAction">Next Action</Label>
                <Input
                  id="edit-nextAction"
                  value={editingProposal.nextAction}
                  onChange={(e) => setEditingProposal({...editingProposal, nextAction: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setEditingProposal(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}