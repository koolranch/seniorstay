"use client";

import * as React from 'react';
import { FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Deficiency {
  survey_date: string;
  survey_type: string;
  deficiency_tag: string;
  scope_severity: string;
  deficiency_description: string;
  fine_amount?: number;
}

interface InspectionPDF {
  survey_date: string;
  survey_type: string;
  pdf_url: string;
}

interface CommunityInspectionHistoryProps {
  ccn?: string;
}

// Scope/Severity level descriptions
const SEVERITY_LABELS: Record<string, { label: string; color: string }> = {
  'A': { label: 'Minimal harm', color: 'bg-green-100 text-green-800' },
  'B': { label: 'Minimal harm', color: 'bg-green-100 text-green-800' },
  'C': { label: 'Minimal harm', color: 'bg-green-100 text-green-800' },
  'D': { label: 'Actual harm', color: 'bg-yellow-100 text-yellow-800' },
  'E': { label: 'Actual harm', color: 'bg-yellow-100 text-yellow-800' },
  'F': { label: 'Actual harm', color: 'bg-yellow-100 text-yellow-800' },
  'G': { label: 'Actual harm - potential serious', color: 'bg-orange-100 text-orange-800' },
  'H': { label: 'Actual harm - potential serious', color: 'bg-orange-100 text-orange-800' },
  'I': { label: 'Actual harm - potential serious', color: 'bg-orange-100 text-orange-800' },
  'J': { label: 'Immediate jeopardy', color: 'bg-red-100 text-red-800' },
  'K': { label: 'Immediate jeopardy', color: 'bg-red-100 text-red-800' },
  'L': { label: 'Immediate jeopardy', color: 'bg-red-100 text-red-800' },
};

export default function CommunityInspectionHistory({ ccn }: CommunityInspectionHistoryProps) {
  const [deficiencies, setDeficiencies] = React.useState<Deficiency[]>([]);
  const [inspectionPDFs, setInspectionPDFs] = React.useState<InspectionPDF[]>([]);
  const [loading, setLoading] = React.useState(true);

  // TODO: Fetch data from Supabase when available
  // This is a placeholder for when deficiency and inspection PDF data is imported

  if (!ccn) return null;
  if (loading) return null;
  if (deficiencies.length === 0 && inspectionPDFs.length === 0) return null;

  // Group deficiencies by severity
  const severityCounts = deficiencies.reduce((acc, def) => {
    const severity = def.scope_severity[0]; // First letter is severity
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostRecent Deficiencies = deficiencies
    .sort((a, b) => new Date(b.survey_date).getTime() - new Date(a.survey_date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Inspection History
          </h2>
        </div>

        {/* Deficiency Summary */}
        {deficiencies.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Deficiencies
            </h3>

            <div className="flex flex-wrap gap-3 mb-6">
              {Object.entries(severityCounts).map(([severity, count]) => {
                const info = SEVERITY_LABELS[severity] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
                return (
                  <Badge key={severity} className={info.color}>
                    Level {severity}: {count} {count === 1 ? 'deficiency' : 'deficiencies'}
                  </Badge>
                );
              })}
            </div>

            {/* Recent Deficiencies List */}
            <div className="space-y-4">
              {mostRecentDeficiencies.map((def, index) => {
                const severityInfo = SEVERITY_LABELS[def.scope_severity[0]] || {
                  label: 'Unknown',
                  color: 'bg-gray-100 text-gray-800'
                };

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={severityInfo.color}>
                          {def.scope_severity}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">
                          {def.deficiency_tag}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(def.survey_date).toLocaleDateString()}
                        </span>
                      </div>
                      {def.fine_amount && (
                        <Badge variant="destructive">
                          Fine: ${def.fine_amount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">
                      {def.deficiency_description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Survey type: {def.survey_type}
                    </div>
                  </div>
                );
              })}
            </div>

            {deficiencies.length > 5 && (
              <p className="text-sm text-gray-600 mt-4">
                Showing {mostRecentDeficiencies.length} of {deficiencies.length} deficiencies
              </p>
            )}
          </div>
        )}

        {/* Inspection Report PDFs */}
        {inspectionPDFs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Inspection Reports
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inspectionPDFs.map((pdf, index) => (
                <a
                  key={index}
                  href={pdf.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {pdf.survey_type} Inspection
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(pdf.survey_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Help Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Understanding Inspection Deficiencies
              </h4>
              <p className="text-sm text-gray-700">
                Deficiencies are violations of federal regulations found during inspections. 
                They're rated by <strong>scope</strong> (how many residents affected) and <strong>severity</strong> (level of harm).
                Level A-C are minor issues with minimal harm, D-F are actual harm, G-I are serious potential harm, 
                and J-L indicate immediate jeopardy to resident health and safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

