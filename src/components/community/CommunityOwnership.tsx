"use client";

import * as React from 'react';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OwnershipData {
  operator_name?: string;
  owner_name?: string;
  chain_name?: string;
  ownership_type?: string;
  effective_date?: string;
}

interface CommunityOwnershipProps {
  ccn?: string;
}

export default function CommunityOwnership({ ccn }: CommunityOwnershipProps) {
  const [ownership, setOwnership] = React.useState<OwnershipData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOwnership() {
      if (!ccn) {
        setLoading(false);
        return;
      }

      try {
        // Fetch ownership from Supabase (placeholder - will work when data is imported)
        // const { data } = await supabase
        //   .from('CommunityOwnership')
        //   .select('*')
        //   .eq('ccn', ccn)
        //   .order('effective_date', { ascending: false })
        //   .limit(1);
        
        // setOwnership(data?.[0] || null);
      } catch (error) {
        console.error('Error fetching ownership:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOwnership();
  }, [ccn]);

  if (!ccn) return null;
  if (loading) return null;
  if (!ownership) return null;

  const ownershipTypeColors: Record<string, string> = {
    'for-profit': 'bg-blue-100 text-blue-800',
    'non-profit': 'bg-green-100 text-green-800',
    'government': 'bg-purple-100 text-purple-800',
  };

  const ownershipTypeLabels: Record<string, string> = {
    'for-profit': 'For-Profit',
    'non-profit': 'Non-Profit',
    'government': 'Government',
  };

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Ownership & Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operator */}
          {ownership.operator_name && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Operator
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {ownership.operator_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Responsible for day-to-day operations
              </p>
            </div>
          )}

          {/* Owner */}
          {ownership.owner_name && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Owner
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {ownership.owner_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Legal owner of the facility
              </p>
            </div>
          )}

          {/* Chain/Organization */}
          {ownership.chain_name && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Chain/Organization
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {ownership.chain_name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Part of a larger organization
              </p>
            </div>
          )}

          {/* Ownership Type */}
          {ownership.ownership_type && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Ownership Type
              </h3>
              <Badge className={ownershipTypeColors[ownership.ownership_type] || 'bg-gray-100 text-gray-800'}>
                {ownershipTypeLabels[ownership.ownership_type] || ownership.ownership_type}
              </Badge>
              <p className="text-sm text-gray-600 mt-3">
                {ownership.ownership_type === 'for-profit' && 'Privately owned business'}
                {ownership.ownership_type === 'non-profit' && 'Charitable or religious organization'}
                {ownership.ownership_type === 'government' && 'Publicly operated facility'}
              </p>
            </div>
          )}
        </div>

        {ownership.effective_date && (
          <div className="text-xs text-gray-500 mt-6">
            Ownership information effective as of:{' '}
            {new Date(ownership.effective_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Why ownership matters:</strong> Research shows that ownership structure can affect 
            quality of care, staffing levels, and financial stability. Non-profit facilities often reinvest 
            revenue into operations, while for-profit facilities may prioritize returns to investors. 
            Government facilities are publicly accountable. Chain affiliation can indicate standardized 
            practices and shared resources.
          </p>
        </div>
      </div>
    </div>
  );
}

