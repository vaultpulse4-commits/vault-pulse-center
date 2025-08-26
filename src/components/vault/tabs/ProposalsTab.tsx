import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Clock, CheckCircle, FileText } from "lucide-react";

export function ProposalsTab() {
  const proposals = [
    {
      id: 1,
      title: "LED Wall Upgrade - 4K Panels",
      type: "CapEx",
      urgency: "High",
      estimate: 125000000, // IDR
      roi: "30% power efficiency, 50% better color accuracy",
      vendor: "LED Solutions Indonesia",
      status: "Review",
      targetWeek: "Week 37, 2025",
      owner: "Alex Chen",
      nextAction: "CEO Approval Required",
      quotes: 3
    },
    {
      id: 2,
      title: "Backup CDJ Units",
      type: "CapEx",
      urgency: "Medium",
      estimate: 45000000,
      roi: "Eliminate 90% of DJ setup failures",
      vendor: "Pioneer DJ Indonesia",
      status: "Approved",
      targetWeek: "Week 36, 2025",
      owner: "Maya Rodriguez",
      nextAction: "Procurement",
      quotes: 2
    },
    {
      id: 3,
      title: "Preventive Maintenance Contract",
      type: "OpEx",
      urgency: "Low",
      estimate: 24000000,
      roi: "25% reduction in unexpected downtime",
      vendor: "TechMaint Services",
      status: "Draft",
      targetWeek: "Week 40, 2025",
      owner: "Jordan Kim",
      nextAction: "Cost analysis",
      quotes: 1
    },
    {
      id: 4,
      title: "Resolume Media Server Upgrade",
      type: "CapEx",
      urgency: "Medium",
      estimate: 85000000,
      roi: "Real-time 8K content support, 60% faster rendering",
      vendor: "AV Solutions Jakarta",
      status: "Ordered",
      targetWeek: "Week 35, 2025",
      owner: "Casey Thompson",
      nextAction: "Installation planning",
      quotes: 2
    }
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Proposals (CapEx/OpEx)</h3>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          New Proposal
        </Button>
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
                <Button variant="default" size="sm">
                  Review Details
                </Button>
                <Button variant="outline" size="sm">
                  Edit Proposal
                </Button>
                <Button variant="secondary" size="sm">
                  View Quotes
                </Button>
                {proposal.status === 'Review' && (
                  <Button variant="default" size="sm" className="ml-auto">
                    Approve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}