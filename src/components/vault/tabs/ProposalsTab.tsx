import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useVaultStore } from "@/store/vaultStore";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Clock, CheckCircle, FileText, Edit3, Trash2, Loader2, Plus, AlertTriangle, ThumbsUp, ShoppingCart, Rocket, Upload, Eye, Calendar as CalendarIcon, XCircle, Download, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { compressImage } from "@/lib/imageCompression";
import { usePermission } from "@/lib/permissions";
import { format } from "date-fns";

export function ProposalsTab() {
  const { selectedCity } = useVaultStore();
  const { toast } = useToast();
  const canView = usePermission('view:proposals');
  const canEdit = usePermission('edit:proposals');
  const canApprove = usePermission('approve:proposals');
  
  const [proposals, setProposals] = useState<any[]>([]);
  const [crewMembers, setCrewMembers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<any>(null);
  const [viewingQuotes, setViewingQuotes] = useState<any>(null);
  const [deletingProposal, setDeletingProposal] = useState<any>(null);
  
  const [newProposal, setNewProposal] = useState({
    title: '',
    type: 'CapEx' as const,
    urgency: 'Medium' as const,
    estimate: 0,
    vendor: '',
    supplierId: '',
    status: 'Pending' as const,
    targetDate: null as Date | null,
    owner: '',
    nextAction: '',
    quotesCount: 0,
    quotesPdfs: [] as string[],
    proposalPlanFiles: [] as string[],
    description: '',
    estimateApproved: false,
    estimateApprovedBy: null as string | null
  });

  // Load data from API
  useEffect(() => {
    loadProposals();
    loadCrewMembers();
    loadSuppliers();
  }, [selectedCity]);

  const loadProposals = async () => {
    if (!canView) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await api.proposals.getAll(selectedCity);
      setProposals(data);
    } catch (error: any) {
      console.error('Failed to load proposals:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load proposals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCrewMembers = async () => {
    try {
      const data = await api.crew.getAll(selectedCity);
      setCrewMembers(data);
    } catch (error: any) {
      console.error('Failed to load crew members:', error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await api.suppliers.getAll(selectedCity);
      setSuppliers(data);
    } catch (error: any) {
      console.error('Failed to load suppliers:', error);
    }
  };

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

  const handleApproveEstimate = async (proposalId: string) => {
    if (!canApprove) {
      toast({ title: "Error", description: "You don't have permission to approve estimates", variant: "destructive" });
      return;
    }

    try {
      await api.proposals.update(proposalId, {
        estimateApproved: true,
        estimateApprovedBy: 'admin' // Should be actual admin user ID in real implementation
      });
      
      toast({ title: "Success", description: "Estimate approved successfully" });
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to approve estimate", 
        variant: "destructive" 
      });
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M IDR`;
    }
    return `${(amount / 1000).toFixed(0)}K IDR`;
  };

  const getApprovalLevel = (amount: number) => {
    // Threshold: 25 Million IDR
    return amount > 25000000 ? "CEO Approval Required" : "Technical Director Approval";
  };

  const getApprovalVariant = (amount: number) => {
    // Green for Tech Director (≤25M), Yellow/Warning for CEO (>25M)
    return amount > 25000000 ? "secondary" : "default";
  };

  const handleCreateProposal = async () => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to create proposals", variant: "destructive" });
      return;
    }
    
    if (!newProposal.title || !newProposal.owner) {
      toast({ title: "Error", description: "Title and owner are required", variant: "destructive" });
      return;
    }
    
    try {
      const { targetDate, ...rest } = newProposal;
      const proposalData = {
        ...rest,
        targetDate: targetDate ? targetDate.toISOString() : null,
        supplierId: newProposal.supplierId || null,
        city: selectedCity,
        quotesCount: newProposal.quotesPdfs.length
      };
      
      await api.proposals.create(proposalData);
      
      setNewProposal({
        title: '', type: 'CapEx', urgency: 'Medium', estimate: 0,
        vendor: '', supplierId: '', status: 'Pending', targetDate: null, owner: '', nextAction: '', 
        quotesCount: 0, quotesPdfs: [], proposalPlanFiles: [], description: '', estimateApproved: false, estimateApprovedBy: null
      });
      setIsNewProposalOpen(false);
      
      toast({ title: "Success", description: "Proposal created successfully" });
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create proposal", 
        variant: "destructive" 
      });
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const currentProposal = isEditing ? editingProposal : newProposal;
    const currentPdfs = currentProposal.quotesPdfs || [];
    
    // Check if adding these files would exceed limit
    if (currentPdfs.length + files.length > 5) {
      toast({
        title: "Error",
        description: `Maximum 5 files allowed. You can add ${5 - currentPdfs.length} more files.`,
        variant: "destructive"
      });
      return;
    }
    
    const newPdfs: string[] = [];
    let processed = 0;
    
    for (const file of Array.from(files)) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: `File ${file.name} must be PDF or image (JPG, PNG, WEBP)`,
          variant: "destructive"
        });
        processed++;
        continue;
      }
      
      const isImage = file.type.startsWith('image/');
      
      // For images, compress if larger than 1MB
      if (isImage && file.size > 1 * 1024 * 1024) {
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        toast({
          title: "Compressing image...",
          description: `${file.name} (${originalSizeMB}MB) - Please wait`,
        });
        
        try {
          const compressedBase64 = await compressImage(file, { maxSizeMB: 1 });
          newPdfs.push(compressedBase64);
          processed++;
          
          // Estimate compressed size from Base64 length
          const compressedSizeMB = ((compressedBase64.length * 3) / 4 / (1024 * 1024)).toFixed(2);
          toast({
            title: "Image compressed",
            description: `Reduced from ${originalSizeMB}MB to ${compressedSizeMB}MB`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to compress ${file.name}`,
            variant: "destructive"
          });
          processed++;
          continue;
        }
      } else {
        // PDF files or small images: max 5MB for PDF, no limit for small images
        if (!isImage && file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `PDF ${file.name} size must be less than 5MB`,
            variant: "destructive"
          });
          processed++;
          continue;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          newPdfs.push(reader.result as string);
          processed++;
          
          if (processed === files.length) {
            const updatedPdfs = [...currentPdfs, ...newPdfs];
            if (isEditing && editingProposal) {
              setEditingProposal({ ...editingProposal, quotesPdfs: updatedPdfs });
            } else {
              setNewProposal({ ...newProposal, quotesPdfs: updatedPdfs });
            }
            
            toast({
              title: "Success",
              description: `${newPdfs.length} file(s) uploaded successfully`,
            });
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Check if all files processed (for compressed images)
      if (processed === files.length) {
        const updatedPdfs = [...currentPdfs, ...newPdfs];
        if (isEditing && editingProposal) {
          setEditingProposal({ ...editingProposal, quotesPdfs: updatedPdfs });
        } else {
          setNewProposal({ ...newProposal, quotesPdfs: updatedPdfs });
        }
        
        if (newPdfs.length > 0) {
          toast({
            title: "Success",
            description: `${newPdfs.length} file(s) uploaded successfully`,
          });
        }
      }
    }
  };

  const handleProposalPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const currentProposal = isEditing ? editingProposal : newProposal;
    const currentFiles = currentProposal.proposalPlanFiles || [];
    
    // Check if adding these files would exceed limit
    if (currentFiles.length + files.length > 5) {
      toast({
        title: "Error",
        description: `Maximum 5 files allowed. You can add ${5 - currentFiles.length} more files.`,
        variant: "destructive"
      });
      return;
    }
    
    const newFiles: string[] = [];
    let processed = 0;
    
    for (const file of Array.from(files)) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: `File ${file.name} must be PDF or image (JPG, PNG, WEBP)`,
          variant: "destructive"
        });
        processed++;
        continue;
      }
      
      const isImage = file.type.startsWith('image/');
      
      // For images, compress if larger than 1MB
      if (isImage && file.size > 1 * 1024 * 1024) {
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        toast({
          title: "Compressing image...",
          description: `${file.name} (${originalSizeMB}MB) - Please wait`,
        });
        
        try {
          const compressedBase64 = await compressImage(file, { maxSizeMB: 1 });
          newFiles.push(compressedBase64);
          processed++;
          
          // Estimate compressed size from Base64 length
          const compressedSizeMB = ((compressedBase64.length * 3) / 4 / (1024 * 1024)).toFixed(2);
          toast({
            title: "Image compressed",
            description: `Reduced from ${originalSizeMB}MB to ${compressedSizeMB}MB`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to compress ${file.name}`,
            variant: "destructive"
          });
          processed++;
          continue;
        }
      } else {
        // PDF files or small images: max 5MB for PDF, no limit for small images
        if (!isImage && file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `PDF ${file.name} size must be less than 5MB`,
            variant: "destructive"
          });
          processed++;
          continue;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          newFiles.push(reader.result as string);
          processed++;
          
          if (processed === files.length) {
            const updatedFiles = [...currentFiles, ...newFiles];
            if (isEditing && editingProposal) {
              setEditingProposal({ ...editingProposal, proposalPlanFiles: updatedFiles });
            } else {
              setNewProposal({ ...newProposal, proposalPlanFiles: updatedFiles });
            }
            
            toast({
              title: "Success",
              description: `${newFiles.length} proposal plan file(s) uploaded successfully`,
            });
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Check if all files processed (for compressed images)
      if (processed === files.length) {
        const updatedFiles = [...currentFiles, ...newFiles];
        if (isEditing && editingProposal) {
          setEditingProposal({ ...editingProposal, proposalPlanFiles: updatedFiles });
        } else {
          setNewProposal({ ...newProposal, proposalPlanFiles: updatedFiles });
        }
        
        if (newFiles.length > 0) {
          toast({
            title: "Success",
            description: `${newFiles.length} proposal plan file(s) uploaded successfully`,
          });
        }
      }
    }
  };

  const handleUpdateProposal = async (id: string, updates: any) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to update proposals", variant: "destructive" });
      return;
    }
    
    try {
      await api.proposals.update(id, updates);
      toast({ title: "Success", description: "Proposal updated" });
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update proposal", 
        variant: "destructive" 
      });
    }
  };

  const handleApproveProposal = async (proposal: any) => {
    if (!canApprove) {
      toast({ title: "Error", description: "You don't have permission to approve proposals", variant: "destructive" });
      return;
    }
    
    try {
      await api.proposals.update(proposal.id, { status: 'Approved' });
      toast({ title: "Success", description: `Proposal "${proposal.title}" approved` });
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to approve proposal", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteProposal = async (id: string, title: string) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to delete proposals", variant: "destructive" });
      return;
    }
    
    try {
      await api.proposals.delete(id);
      toast({ title: "Success", description: `Proposal "${title}" deleted` });
      setDeletingProposal(null);
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete proposal", 
        variant: "destructive" 
      });
    }
  };

  const handleEditProposal = (proposal: any) => {
    if (!canEdit) {
      toast({ title: "Error", description: "You don't have permission to edit proposals", variant: "destructive" });
      return;
    }
    setEditingProposal({ ...proposal });
  };

  const handleSaveEdit = async () => {
    if (!editingProposal || !canEdit) return;
    
    try {
      // Extract only the fields that should be updated (exclude relations like 'supplier')
      const { id, supplier, createdAt, updatedAt, ...updateFields } = editingProposal;
      
      // Convert targetDate if it exists and is a Date object
      const proposalData = {
        ...updateFields,
        targetDate: editingProposal.targetDate && typeof editingProposal.targetDate !== 'string'
          ? new Date(editingProposal.targetDate).toISOString()
          : editingProposal.targetDate,
        supplierId: editingProposal.supplierId || null
      };
      
      await api.proposals.update(editingProposal.id, proposalData);
      setEditingProposal(null);
      toast({ title: "Success", description: "Proposal updated successfully" });
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update proposal", 
        variant: "destructive" 
      });
    }
  };

  const handleStatusChange = async (proposal: any, newStatus: string) => {
    if (!canEdit && newStatus !== proposal.status) {
      toast({ 
        title: "Error", 
        description: "You don't have permission to change proposal status", 
        variant: "destructive" 
      });
      return;
    }

    try {
      await api.proposals.update(proposal.id, { status: newStatus });
      toast({ title: "Success", description: "Proposal status updated" });
      loadProposals();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update proposal status", 
        variant: "destructive" 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'Approved': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'Rejected': return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'Completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Calculate summary metrics
  const summaryMetrics = {
    totalPending: proposals
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.estimate, 0),
    approvedCount: proposals.filter(p => p.status === 'Approved').length,
    completedCount: proposals.filter(p => p.status === 'Completed').length,
    rejectedCount: proposals.filter(p => p.status === 'Rejected').length
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-muted-foreground">You don't have permission to view proposals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Proposals (CapEx/OpEx) - {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
        {canEdit && (
          <Dialog open={isNewProposalOpen} onOpenChange={setIsNewProposalOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  placeholder="Detailed description of the proposal"
                  rows={3}
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
                    {crewMembers.map((owner) => (
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
                <Label htmlFor="supplier">Supplier (Optional)</Label>
                <Select
                  value={newProposal.supplierId || undefined}
                  onValueChange={(value) => setNewProposal({...newProposal, supplierId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} {supplier.code ? `(${supplier.code})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProposal.targetDate ? format(newProposal.targetDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newProposal.targetDate || undefined}
                      onSelect={(date) => setNewProposal({...newProposal, targetDate: date || null})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              <div className="col-span-2 space-y-2">
                <Label>Upload Quotes (PDF or Image, Max 5 files)</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handlePdfUpload(e, false)}
                    className="cursor-pointer"
                  />
                  {newProposal.quotesPdfs && newProposal.quotesPdfs.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {newProposal.quotesPdfs.length}/5 files uploaded
                    </Badge>
                  )}
                </div>
                {newProposal.quotesPdfs && newProposal.quotesPdfs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {newProposal.quotesPdfs.map((pdf, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">Quote {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              const updated = newProposal.quotesPdfs.filter((_, i) => i !== index);
                              setNewProposal({...newProposal, quotesPdfs: updated});
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewProposal({...newProposal, quotesPdfs: []})}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Upload Proposal Plan (PDF or Image, Max 5 files)</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handleProposalPlanUpload(e, false)}
                    className="cursor-pointer"
                  />
                  {newProposal.proposalPlanFiles && newProposal.proposalPlanFiles.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {newProposal.proposalPlanFiles.length}/5 files uploaded
                    </Badge>
                  )}
                </div>
                {newProposal.proposalPlanFiles && newProposal.proposalPlanFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {newProposal.proposalPlanFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">Plan {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              const updated = newProposal.proposalPlanFiles.filter((_, i) => i !== index);
                              setNewProposal({...newProposal, proposalPlanFiles: updated});
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewProposal({...newProposal, proposalPlanFiles: []})}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setIsNewProposalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProposal}>Create Proposal</Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-xs text-muted-foreground">Total Pending</div>
                <div className="text-lg font-bold">{formatCurrency(summaryMetrics.totalPending)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-xs text-muted-foreground">Approved</div>
                <div className="text-lg font-bold">{summaryMetrics.approvedCount} Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-lg font-bold">{summaryMetrics.completedCount} Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-xs text-muted-foreground">Rejected</div>
                <div className="text-lg font-bold">{summaryMetrics.rejectedCount} Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : proposals.length === 0 ? (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No proposals found for {selectedCity}</p>
              {canEdit && (
                <Button variant="outline" onClick={() => setIsNewProposalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Proposal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
        {proposals.map((proposal) => (
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
                  <Select 
                    value={proposal.status} 
                    onValueChange={(value) => handleStatusChange(proposal, value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className={`w-[140px] ${getStatusColor(proposal.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">⏳ Pending</SelectItem>
                      <SelectItem value="Approved">✅ Approved</SelectItem>
                      <SelectItem value="Rejected">❌ Rejected</SelectItem>
                      <SelectItem value="Completed">🎉 Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground">Estimate:</span>
                      <span className="font-bold ml-2">{formatCurrency(proposal.estimate)}</span>
                      <Badge variant={getApprovalVariant(proposal.estimate)} className="ml-2 text-xs">
                        {getApprovalLevel(proposal.estimate)}
                      </Badge>
                    </div>
                    {canApprove && !proposal.estimateApproved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveEstimate(proposal.id)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve Estimate
                      </Button>
                    )}
                    {proposal.estimateApproved && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Estimate Approved
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Vendor:</span>
                    <span className="ml-2">{proposal.vendor}</span>
                  </div>
                  
                  <div className="text-sm">
                    <Badge variant="outline" className="text-xs">
                      {proposal.quotesCount} quotes
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Target Date:</span>
                    <span className="ml-2">
                      {proposal.targetDate ? format(new Date(proposal.targetDate), "PPP") : 'Not set'}
                    </span>
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
              
              <div className="flex gap-2 pt-4 border-t border-border/30 flex-wrap">
                {canEdit && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => handleEditProposal(proposal)}>
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {proposal.quotesPdfs && proposal.quotesPdfs.length > 0 && (
                      <Button variant="outline" size="sm" onClick={() => setViewingQuotes(proposal)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Quotes ({proposal.quotesPdfs.length})
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setDeletingProposal(proposal)}
                      disabled={proposal.status === 'Completed'}
                      title={proposal.status === 'Completed' ? 'Cannot delete completed proposals' : 'Delete proposal'}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Edit Proposal Dialog */}
      {editingProposal && (
        <Dialog open={!!editingProposal} onOpenChange={() => setEditingProposal(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProposal.description}
                  onChange={(e) => setEditingProposal({...editingProposal, description: e.target.value})}
                  placeholder="Detailed description of the proposal"
                  rows={3}
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
                <Label htmlFor="edit-supplier">Supplier (Optional)</Label>
                <Select
                  value={editingProposal.supplierId || undefined}
                  onValueChange={(value) => setEditingProposal({...editingProposal, supplierId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} {supplier.code ? `(${supplier.code})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingProposal.targetDate ? format(new Date(editingProposal.targetDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingProposal.targetDate ? new Date(editingProposal.targetDate) : undefined}
                      onSelect={(date) => setEditingProposal({...editingProposal, targetDate: date ? date.toISOString() : ''})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-nextAction">Next Action</Label>
                <Input
                  id="edit-nextAction"
                  value={editingProposal.nextAction}
                  onChange={(e) => setEditingProposal({...editingProposal, nextAction: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Upload Quotes (PDF or Image, Max 5 files)</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handlePdfUpload(e, true)}
                    className="cursor-pointer"
                  />
                  {editingProposal.quotesPdfs && editingProposal.quotesPdfs.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {editingProposal.quotesPdfs.length}/5 files uploaded
                    </Badge>
                  )}
                </div>
                {editingProposal.quotesPdfs && editingProposal.quotesPdfs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {editingProposal.quotesPdfs.map((pdf: string, index: number) => (
                        <div key={index} className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">Quote {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              const updated = editingProposal.quotesPdfs.filter((_: string, i: number) => i !== index);
                              setEditingProposal({...editingProposal, quotesPdfs: updated});
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProposal({...editingProposal, quotesPdfs: []})}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Upload Proposal Plan (PDF or Image, Max 5 files)</Label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handleProposalPlanUpload(e, true)}
                    className="cursor-pointer"
                  />
                  {editingProposal.proposalPlanFiles && editingProposal.proposalPlanFiles.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {editingProposal.proposalPlanFiles.length}/5 files uploaded
                    </Badge>
                  )}
                </div>
                {editingProposal.proposalPlanFiles && editingProposal.proposalPlanFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {editingProposal.proposalPlanFiles.map((file: string, index: number) => (
                        <div key={index} className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs">Plan {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              const updated = editingProposal.proposalPlanFiles.filter((_: string, i: number) => i !== index);
                              setEditingProposal({...editingProposal, proposalPlanFiles: updated});
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProposal({...editingProposal, proposalPlanFiles: []})}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setEditingProposal(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View Quotes Dialog */}
      {viewingQuotes && (
        <Dialog open={!!viewingQuotes} onOpenChange={() => setViewingQuotes(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quotes - {viewingQuotes.title}</DialogTitle>
            </DialogHeader>
            {viewingQuotes.quotesPdfs && viewingQuotes.quotesPdfs.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {viewingQuotes.quotesPdfs.length} PDF file(s) uploaded
                </p>
                <div className="grid gap-3 max-h-[60vh] overflow-y-auto">
                  {viewingQuotes.quotesPdfs.map((pdf: string, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-medium">Quote {index + 1}</p>
                            <p className="text-sm text-muted-foreground">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Open PDF in new window with proper viewer
                              const newWindow = window.open('', '_blank');
                              if (newWindow) {
                                newWindow.document.write(`
                                  <!DOCTYPE html>
                                  <html>
                                    <head>
                                      <title>Quote ${index + 1}</title>
                                      <style>
                                        body { margin: 0; padding: 0; overflow: hidden; }
                                        iframe { border: none; width: 100vw; height: 100vh; }
                                      </style>
                                    </head>
                                    <body>
                                      <iframe src="${pdf}" type="application/pdf"></iframe>
                                    </body>
                                  </html>
                                `);
                                newWindow.document.close();
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Create download link
                              const link = document.createElement('a');
                              link.href = pdf;
                              link.download = `quote-${index + 1}.pdf`;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <FileText className="h-12 w-12 mr-4" />
                <div>No quotes PDF uploaded for this proposal</div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setViewingQuotes(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProposal && (
        <Dialog open={!!deletingProposal} onOpenChange={() => setDeletingProposal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Proposal</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deletingProposal.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setDeletingProposal(null)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteProposal(deletingProposal.id, deletingProposal.title)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}