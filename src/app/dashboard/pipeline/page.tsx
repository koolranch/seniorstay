'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  Home,
  Phone,
  Mail,
  MapPin,
  FileText,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { 
  getPipelineLeads, 
  updateLeadStatus, 
  sendLeadReferral,
  ReferralStatus 
} from '@/app/actions/leads';

// =============================================================================
// TYPES
// =============================================================================

interface Lead {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  careType?: string;
  moveInTimeline?: string;
  communityName?: string;
  sourceSlug?: string;
  urgencyScore: number;
  priority: string;
  createdAt: string;
  referral_status: ReferralStatus;
  referral_sent_at?: string;
  estimated_commission?: number;
  actual_commission?: number;
  is_high_value: boolean;
  home_value?: number;
  value_gap?: number;
  calculated_budget?: number;
  advisor_notes?: string;
  meta_data?: Record<string, unknown>;
}

interface PipelineData {
  pipeline: Record<ReferralStatus, Lead[]>;
  totalPipelineValue: number;
  totalPaidCommission: number;
  totalLeads: number;
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

const STATUS_CONFIG: Record<ReferralStatus, { 
  label: string; 
  color: string; 
  bgColor: string; 
  icon: React.ReactNode;
  description: string;
}> = {
  new: {
    label: 'New Leads',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: <Users className="h-5 w-5" />,
    description: 'Not yet reviewed',
  },
  internal_review: {
    label: 'Internal Review',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    icon: <FileText className="h-5 w-5" />,
    description: 'Draft ready to forward',
  },
  referral_sent: {
    label: 'Referral Sent',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    icon: <Send className="h-5 w-5" />,
    description: 'Awaiting community response',
  },
  tour_scheduled: {
    label: 'Tour Scheduled',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: <Calendar className="h-5 w-5" />,
    description: 'Tour pending',
  },
  admitted: {
    label: 'Admitted',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: <Home className="h-5 w-5" />,
    description: 'Awaiting commission',
  },
  paid: {
    label: 'Commission Paid',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="h-5 w-5" />,
    description: 'Complete',
  },
};

// =============================================================================
// LEAD CARD COMPONENT
// =============================================================================

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, status: ReferralStatus) => void;
  onSendReferral: (leadId: string) => void;
  onMarkAdmitted: (lead: Lead) => void;
}

function LeadCard({ lead, onStatusChange, onSendReferral, onMarkAdmitted }: LeadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const commission = lead.actual_commission || lead.estimated_commission || 0;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
        lead.is_high_value ? 'ring-2 ring-amber-400' : ''
      }`}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{lead.fullName}</h3>
              {lead.is_high_value && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  High Value
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              {lead.careType && <span>{lead.careType}</span>}
              {lead.sourceSlug && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lead.sourceSlug.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-600">
              ${commission.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">
              {lead.actual_commission ? 'Confirmed' : 'Estimated'}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className={`px-2 py-1 rounded ${
            lead.priority === 'high' ? 'bg-red-100 text-red-700' :
            lead.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            Score: {lead.urgencyScore}
          </span>
          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
          {lead.home_value && (
            <span className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              ${lead.home_value.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                {lead.phone && (
                  <a 
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                  >
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </a>
                )}
                {lead.email && (
                  <a 
                    href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </a>
                )}
              </div>
              
              {/* Financial Readiness */}
              {(lead.home_value || lead.value_gap || lead.calculated_budget) && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Financial Readiness
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {lead.home_value && (
                      <div>
                        <p className="text-slate-500 text-xs">Home Value</p>
                        <p className="font-semibold">${lead.home_value.toLocaleString()}</p>
                      </div>
                    )}
                    {lead.value_gap && (
                      <div>
                        <p className="text-slate-500 text-xs">Value Gap</p>
                        <p className={`font-semibold ${lead.value_gap > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {lead.value_gap > 0 ? '+' : ''}${lead.value_gap.toLocaleString()}/mo
                        </p>
                      </div>
                    )}
                    {lead.calculated_budget && (
                      <div>
                        <p className="text-slate-500 text-xs">Monthly Budget</p>
                        <p className="font-semibold">${lead.calculated_budget.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {lead.referral_status === 'new' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSendReferral(lead.id); }}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    Create Draft
                  </button>
                )}
                
                {lead.referral_status === 'internal_review' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'referral_sent'); }}
                    className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" />
                    Mark Forwarded
                  </button>
                )}
                
                {lead.referral_status === 'referral_sent' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'tour_scheduled'); }}
                    className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 flex items-center gap-1"
                  >
                    <Calendar className="h-4 w-4" />
                    Tour Scheduled
                  </button>
                )}
                
                {lead.referral_status === 'tour_scheduled' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onMarkAdmitted(lead); }}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Admitted
                  </button>
                )}
                
                {lead.referral_status === 'admitted' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, 'paid'); }}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <DollarSign className="h-4 w-4" />
                    Mark Paid
                  </button>
                )}
                
                <a
                  href={`/api/lead-profile/${lead.id}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  View Profile
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// ADMITTED MODAL
// =============================================================================

interface AdmittedModalProps {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (leadId: string, commission: number, moveInDate?: string) => void;
}

function AdmittedModal({ lead, onClose, onConfirm }: AdmittedModalProps) {
  const [commission, setCommission] = useState(lead?.estimated_commission?.toString() || '');
  const [moveInDate, setMoveInDate] = useState('');
  
  if (!lead) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Mark as Admitted</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-slate-600 mt-1">{lead.fullName}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Final Commission Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder={lead.estimated_commission?.toString()}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Estimated: ${lead.estimated_commission?.toLocaleString()}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Move-in Date (Optional)
            </label>
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(lead.id, parseFloat(commission) || lead.estimated_commission || 0, moveInDate || undefined)}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
          >
            Confirm Admission
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================

export default function PipelineDashboard() {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admittedLead, setAdmittedLead] = useState<Lead | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const result = await getPipelineLeads();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load pipeline data');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleStatusChange = async (leadId: string, status: ReferralStatus) => {
    const result = await updateLeadStatus(leadId, status);
    if (result.success) {
      fetchData();
    } else {
      alert(result.message);
    }
  };
  
  const handleSendReferral = async (leadId: string) => {
    const result = await sendLeadReferral(leadId);
    if (result.success) {
      fetchData();
    } else {
      alert(result.message);
    }
  };
  
  const handleMarkAdmitted = async (leadId: string, commission: number, moveInDate?: string) => {
    const result = await updateLeadStatus(leadId, 'admitted', {
      actual_commission: commission,
      move_in_date: moveInDate,
    });
    if (result.success) {
      setAdmittedLead(null);
      fetchData();
    } else {
      alert(result.message);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="h-6 w-6 animate-spin" />
          Loading pipeline...
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Commission Pipeline</h1>
              <p className="text-slate-600 text-sm">Guide for Seniors - Cleveland</p>
            </div>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Pipeline Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-emerald-100 text-sm font-medium">Total Pipeline</span>
            </div>
            <p className="text-3xl font-bold">
              ${(data?.totalPipelineValue || 0).toLocaleString()}
            </p>
            <p className="text-emerald-100 text-sm mt-1">
              Active leads value
            </p>
          </motion.div>
          
          {/* Paid Commission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-slate-500 text-sm font-medium">Paid Commission</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              ${(data?.totalPaidCommission || 0).toLocaleString()}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Completed placements
            </p>
          </motion.div>
          
          {/* Total Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-slate-500 text-sm font-medium">Total Leads</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {data?.totalLeads || 0}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              All time
            </p>
          </motion.div>
          
          {/* High Value Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-slate-500 text-sm font-medium">High Value</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {Object.values(data?.pipeline || {}).flat().filter(l => l.is_high_value).length}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              $350k+ home value
            </p>
          </motion.div>
        </div>
        
        {/* Pipeline Columns */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {(['new', 'internal_review', 'referral_sent', 'tour_scheduled', 'admitted', 'paid'] as ReferralStatus[]).map((status) => {
            const config = STATUS_CONFIG[status];
            const leads = data?.pipeline[status] || [];
            const statusValue = leads.reduce((sum, l) => sum + (parseFloat(String(l.estimated_commission)) || 0), 0);
            
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                {/* Column Header */}
                <div className={`p-4 rounded-t-xl border ${config.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={config.color}>{config.icon}</span>
                      <h2 className={`font-semibold ${config.color}`}>{config.label}</h2>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
                      {leads.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{config.description}</p>
                  {statusValue > 0 && (
                    <p className="text-sm font-semibold text-slate-700 mt-2">
                      ${statusValue.toLocaleString()}
                    </p>
                  )}
                </div>
                
                {/* Column Content */}
                <div className="flex-1 bg-slate-100/50 rounded-b-xl p-2 space-y-2 min-h-[300px]">
                  <AnimatePresence>
                    {leads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onStatusChange={handleStatusChange}
                        onSendReferral={handleSendReferral}
                        onMarkAdmitted={() => setAdmittedLead(lead)}
                      />
                    ))}
                  </AnimatePresence>
                  
                  {leads.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">No leads</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
      
      {/* Admitted Modal */}
      {admittedLead && (
        <AdmittedModal
          lead={admittedLead}
          onClose={() => setAdmittedLead(null)}
          onConfirm={handleMarkAdmitted}
        />
      )}
    </div>
  );
}

