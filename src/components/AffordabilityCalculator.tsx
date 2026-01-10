'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Home, 
  Building2, 
  DollarSign, 
  Thermometer, 
  UtensilsCrossed,
  Wrench,
  MapPin,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  X,
  Loader2,
  FileText
} from 'lucide-react';
import { useLeadSubmit, getUtmParams, getSourceInfo } from '@/hooks/useLeadSubmit';
import { LeadInput } from '@/app/actions/leads';

// =============================================================================
// 2026 CLEVELAND MARKET DATA CONSTANTS
// =============================================================================

const CLEVELAND_2026_DATA = {
  // Senior Living Base Costs (Monthly)
  assistedLiving: {
    cleveland_avg: 5520,
    beachwood: 6800,
    westlake: 5800,
    shaker_heights: 6200,
    parma: 4900,
    strongsville: 5400,
    lakewood: 5600,
    mentor: 5200,
  },
  
  // At-Home Care Costs
  homeCareCuyahoga: 2406, // 130 hours/month at $18.51/hr
  
  // Homeownership Costs (Cleveland/Cuyahoga Defaults)
  propertyTaxRate: 0.0218, // 2.18% - one of Ohio's highest
  utilitiesAvg: 472,       // Gas + Electric + Water + Snow removal
  groceriesAvg: 450,       // Moderate senior budget
  maintenanceAvg: 150,     // Base home maintenance
  
  // What Senior Living Includes
  included: [
    'All meals & snacks',
    'Utilities (heat, electric, water)',
    '24/7 staff & security',
    'Housekeeping & laundry',
    'Activities & transportation',
    'Medication management',
    'Emergency response',
    'Property maintenance',
  ],
} as const;

// Premium Tier Locations with descriptions
const LOCATION_TIERS = [
  { value: 'cleveland_avg', label: 'Cleveland Metro Average', price: 5520, tier: 'value' },
  { value: 'parma', label: 'Parma', price: 4900, tier: 'value' },
  { value: 'mentor', label: 'Mentor', price: 5200, tier: 'value' },
  { value: 'strongsville', label: 'Strongsville', price: 5400, tier: 'standard' },
  { value: 'lakewood', label: 'Lakewood', price: 5600, tier: 'standard' },
  { value: 'westlake', label: 'Westlake', price: 5800, tier: 'premium' },
  { value: 'shaker_heights', label: 'Shaker Heights', price: 6200, tier: 'premium' },
  { value: 'beachwood', label: 'Beachwood', price: 6800, tier: 'premium' },
] as const;

// =============================================================================
// TYPES
// =============================================================================

interface CalculatorInputs {
  homeValue: number;
  mortgage: number;
  groceries: number;
  utilities: number;
  maintenance: number;
  homeCareHours: number;
  selectedLocation: string;
}

interface CalculationResults {
  propertyTax: number;
  totalHomeCost: number;
  seniorLivingCost: number;
  valueGap: number;
  valueGapPercent: number;
  isHighValue: boolean;
  monthlySavings: number;
  annualSavings: number;
}

// =============================================================================
// SLIDER COMPONENT
// =============================================================================

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  tooltip?: string;
}

function SliderInput({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  prefix = '$', 
  suffix = '',
  icon,
  tooltip 
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {icon}
          {label}
          {tooltip && (
            <span className="text-slate-400 text-xs" title={tooltip}>ⓘ</span>
          )}
        </label>
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold text-slate-900">
            {prefix}{value.toLocaleString()}{suffix}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-teal-600
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:shadow-teal-500/30
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-teal-600
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-slate-400">
        <span>{prefix}{min.toLocaleString()}</span>
        <span>{prefix}{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

// =============================================================================
// VALUE GAP PROGRESS BAR
// =============================================================================

interface ValueGapBarProps {
  valueGap: number;
  valueGapPercent: number;
  isHighValue: boolean;
  seniorLivingCost: number;
  totalHomeCost: number;
}

function ValueGapBar({ valueGap, valueGapPercent, isHighValue, seniorLivingCost, totalHomeCost }: ValueGapBarProps) {
  const maxCost = Math.max(seniorLivingCost, totalHomeCost);
  const homePercent = (totalHomeCost / maxCost) * 100;
  const seniorPercent = (seniorLivingCost / maxCost) * 100;
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Home Cost Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 flex items-center gap-1">
              <Home className="h-4 w-4" />
              True Cost at Home
            </span>
            <span className="font-semibold text-slate-900">${totalHomeCost.toLocaleString()}/mo</span>
          </div>
          <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${homePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-lg"
            />
          </div>
        </div>
        
        {/* Senior Living Cost Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              All-Inclusive Senior Living
            </span>
            <span className="font-semibold text-slate-900">${seniorLivingCost.toLocaleString()}/mo</span>
          </div>
          <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${seniorPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className={`h-full rounded-lg ${
                isHighValue 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Value Gap Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`p-4 rounded-xl border-2 ${
          isHighValue 
            ? 'bg-emerald-50 border-emerald-200' 
            : valueGap < 0 
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isHighValue ? (
              <div className="p-2 bg-emerald-100 rounded-full">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
            ) : valueGap < 0 ? (
              <div className="p-2 bg-rose-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-rose-600" />
              </div>
            ) : (
              <div className="p-2 bg-amber-100 rounded-full">
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
            )}
            <div>
              <p className={`font-semibold ${
                isHighValue ? 'text-emerald-800' : valueGap < 0 ? 'text-rose-800' : 'text-amber-800'
              }`}>
                {isHighValue 
                  ? 'High Value Opportunity!' 
                  : valueGap < 0 
                    ? 'Senior Living Costs More' 
                    : 'Comparable Costs'}
              </p>
              <p className="text-sm text-slate-600">
                {isHighValue 
                  ? 'Senior living may cost less than staying home'
                  : valueGap < 0
                    ? `Home is $${Math.abs(valueGap).toLocaleString()}/mo cheaper`
                    : 'Within 10% of home costs'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <motion.p 
              key={valueGap}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-2xl font-bold ${
                isHighValue ? 'text-emerald-600' : valueGap < 0 ? 'text-rose-600' : 'text-amber-600'
              }`}
            >
              {valueGap >= 0 ? '+' : ''}{valueGap < 0 ? '-' : ''}${Math.abs(valueGap).toLocaleString()}
            </motion.p>
            <p className="text-xs text-slate-500">monthly difference</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// LEAD CAPTURE MODAL
// =============================================================================

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CalculationResults;
  inputs: CalculatorInputs;
}

function LeadCaptureModal({ isOpen, onClose, results, inputs }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    careType: 'Assisted Living' as const,
    moveInTimeline: '' as LeadInput['moveInTimeline'],
  });
  
  const { submit, isPending, isSuccess, result } = useLeadSubmit({
    onSuccess: () => {
      // Keep modal open to show success state
    },
  });
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const utmParams = getUtmParams();
    const sourceInfo = getSourceInfo();
    
    // Build structured meta_data for analytics
    const calculatorMetaData: CalculatorMetaData = {
      homeValue: inputs.homeValue,
      mortgage: inputs.mortgage,
      groceries: inputs.groceries,
      utilities: inputs.utilities,
      maintenance: inputs.maintenance,
      homeCareHours: inputs.homeCareHours,
      homeCareCost: Math.round(inputs.homeCareHours * 18.51),
      propertyTax: results.propertyTax,
      totalHomeCost: results.totalHomeCost,
      selectedLocation: inputs.selectedLocation,
      seniorLivingCost: results.seniorLivingCost,
      valueGap: results.valueGap,
      valueGapPercent: results.valueGapPercent,
      isHighValue: results.isHighValue,
      monthlySavings: results.monthlySavings,
      annualSavings: results.annualSavings,
    };
    
    // Build detailed notes with calculator data (for human readability)
    const calculatorNotes = `
[CALCULATOR] Value Gap: ${results.valueGap >= 0 ? '+' : ''}$${results.valueGap.toLocaleString()}/mo | Home Value: $${inputs.homeValue.toLocaleString()} | Location: ${LOCATION_TIERS.find(l => l.value === inputs.selectedLocation)?.label}
---META_DATA_JSON---
${JSON.stringify(calculatorMetaData)}
    `.trim();
    
    const leadData: LeadInput = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      careType: formData.careType,
      moveInTimeline: formData.moveInTimeline || undefined,
      notes: calculatorNotes,
      pageType: 'pricing_guide',
      sourceSlug: 'value-calculator',
      ...utmParams,
      ...sourceInfo,
    };
    
    await submit(leadData);
  }, [formData, results, inputs, submit]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-teal-600 to-teal-700 p-6 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Get Your Full Cleveland Cost Report
                </h3>
                <p className="text-teal-100 text-sm mt-1">
                  Personalized analysis with community recommendations
                </p>
              </div>
            </div>
            
            {/* Value Summary */}
            <div className="mt-4 p-3 bg-white/10 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-teal-100 text-sm">Your Calculated Value Gap:</span>
                <span className={`text-lg font-bold ${results.isHighValue ? 'text-emerald-300' : 'text-white'}`}>
                  {results.valueGap >= 0 ? '+' : ''}${results.valueGap.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">
                  Report Requested!
                </h4>
                <p className="text-slate-600 mb-6">
                  A Cleveland senior living advisor will email your personalized cost report within 24 hours.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="(216) 555-0123"
                  />
                </div>
                
                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Move-in Timeline
                  </label>
                  <select
                    value={formData.moveInTimeline ?? ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      moveInTimeline: e.target.value as LeadInput['moveInTimeline']
                    }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                  >
                    <option value="">Select timeline...</option>
                    <option value="Immediate">Immediate</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                    <option value="Just researching">Just researching</option>
                  </select>
                </div>
                
                {/* Error Message */}
                {result?.success === false && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                    {result.message}
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl
                           hover:from-teal-700 hover:to-teal-800 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get My Free Report
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-slate-500">
                  By submitting, you agree to receive your personalized cost report via email.
                  Your information is secure and will never be sold.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// CALCULATOR METADATA (for structured data)
// =============================================================================

export interface CalculatorMetaData {
  homeValue: number;
  mortgage: number;
  groceries: number;
  utilities: number;
  maintenance: number;
  homeCareHours: number;
  homeCareCost: number;
  propertyTax: number;
  totalHomeCost: number;
  selectedLocation: string;
  seniorLivingCost: number;
  valueGap: number;
  valueGapPercent: number;
  isHighValue: boolean;
  monthlySavings: number;
  annualSavings: number;
}

// =============================================================================
// MAIN CALCULATOR COMPONENT
// =============================================================================

interface AffordabilityCalculatorProps {
  defaultCity?: string; // e.g., "beachwood", "westlake"
  showStickyButton?: boolean;
}

export default function AffordabilityCalculator({ defaultCity, showStickyButton = false }: AffordabilityCalculatorProps) {
  // Determine default location based on city prop
  const getDefaultLocation = (city?: string): string => {
    if (!city) return 'cleveland_avg';
    const normalized = city.toLowerCase().replace(/\s+/g, '_');
    const found = LOCATION_TIERS.find(l => l.value === normalized || l.label.toLowerCase().replace(/\s+/g, '_') === normalized);
    return found?.value || 'cleveland_avg';
  };

  // Calculator Inputs State
  const [inputs, setInputs] = useState<CalculatorInputs>({
    homeValue: 250000,
    mortgage: 0,
    groceries: CLEVELAND_2026_DATA.groceriesAvg,
    utilities: CLEVELAND_2026_DATA.utilitiesAvg,
    maintenance: CLEVELAND_2026_DATA.maintenanceAvg,
    homeCareHours: 0,
    selectedLocation: getDefaultLocation(defaultCity),
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Memoized Calculations
  const results = useMemo<CalculationResults>(() => {
    // Property Tax (annual / 12)
    const propertyTax = Math.round((inputs.homeValue * CLEVELAND_2026_DATA.propertyTaxRate) / 12);
    
    // Home Care Cost (if any)
    const homeCareCost = Math.round(inputs.homeCareHours * 18.51); // $18.51/hr Cuyahoga avg
    
    // Total Home Cost
    const totalHomeCost = 
      propertyTax + 
      inputs.mortgage + 
      inputs.groceries + 
      inputs.utilities + 
      inputs.maintenance +
      homeCareCost;
    
    // Senior Living Cost
    const locationData = LOCATION_TIERS.find(l => l.value === inputs.selectedLocation);
    const seniorLivingCost = locationData?.price || CLEVELAND_2026_DATA.assistedLiving.cleveland_avg;
    
    // Value Gap (positive = home costs more)
    const valueGap = totalHomeCost - seniorLivingCost;
    const valueGapPercent = Math.round((valueGap / seniorLivingCost) * 100);
    
    // Is High Value if Senior Living is cheaper OR within 10% of home costs
    const isHighValue = valueGap >= 0 || valueGapPercent >= -10;
    
    // Savings calculations
    const monthlySavings = Math.max(0, valueGap);
    const annualSavings = monthlySavings * 12;
    
    return {
      propertyTax,
      totalHomeCost,
      seniorLivingCost,
      valueGap,
      valueGapPercent,
      isHighValue,
      monthlySavings,
      annualSavings,
    };
  }, [inputs]);
  
  const updateInput = useCallback(<K extends keyof CalculatorInputs>(
    key: K, 
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-sm font-medium mb-4"
          >
            <Calculator className="h-4 w-4" />
            2026 Cleveland Market Data
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Cleveland Senior Living <span className="text-teal-600">Value Calculator</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Compare the true cost of staying at home vs. all-inclusive senior living.
            Many families are surprised to find senior living more affordable than they thought.
          </motion.p>
        </div>
        
        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Panel - Inputs */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Home className="h-5 w-5 text-slate-600" />
                Your Current Monthly Costs
              </h3>
              
              <div className="space-y-6">
                {/* Home Value */}
                <SliderInput
                  label="Home Value"
                  value={inputs.homeValue}
                  onChange={(v) => updateInput('homeValue', v)}
                  min={100000}
                  max={800000}
                  step={10000}
                  icon={<Home className="h-4 w-4 text-slate-500" />}
                  tooltip="Cuyahoga County property taxes are 2.18% of home value"
                />
                
                {/* Property Tax Display */}
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-sm text-amber-800 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Calculated Property Tax (2.18%)
                  </span>
                  <span className="font-semibold text-amber-900">
                    ${results.propertyTax.toLocaleString()}/mo
                  </span>
                </div>
                
                {/* Mortgage/Rent */}
                <SliderInput
                  label="Mortgage or Rent"
                  value={inputs.mortgage}
                  onChange={(v) => updateInput('mortgage', v)}
                  min={0}
                  max={3000}
                  step={50}
                  icon={<Building2 className="h-4 w-4 text-slate-500" />}
                  tooltip="Monthly mortgage payment or rent"
                />
                
                {/* Utilities */}
                <SliderInput
                  label="Utilities (Gas, Electric, Water)"
                  value={inputs.utilities}
                  onChange={(v) => updateInput('utilities', v)}
                  min={200}
                  max={800}
                  step={25}
                  icon={<Thermometer className="h-4 w-4 text-slate-500" />}
                  tooltip="Including snow removal during winter"
                />
                
                {/* Groceries */}
                <SliderInput
                  label="Monthly Groceries"
                  value={inputs.groceries}
                  onChange={(v) => updateInput('groceries', v)}
                  min={200}
                  max={800}
                  step={25}
                  icon={<UtensilsCrossed className="h-4 w-4 text-slate-500" />}
                />
                
                {/* Maintenance */}
                <SliderInput
                  label="Home Maintenance"
                  value={inputs.maintenance}
                  onChange={(v) => updateInput('maintenance', v)}
                  min={0}
                  max={500}
                  step={25}
                  icon={<Wrench className="h-4 w-4 text-slate-500" />}
                  tooltip="Lawn care, snow removal, repairs"
                />
                
                {/* Home Care Hours */}
                <SliderInput
                  label="In-Home Care Hours/Month"
                  value={inputs.homeCareHours}
                  onChange={(v) => updateInput('homeCareHours', v)}
                  min={0}
                  max={200}
                  step={5}
                  prefix=""
                  suffix=" hrs"
                  icon={<span className="text-slate-500">👤</span>}
                  tooltip="At $18.51/hr (Cuyahoga County average)"
                />
                
                {inputs.homeCareHours > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <span className="text-sm text-blue-800">
                      Home Care Cost ({inputs.homeCareHours} hrs × $18.51)
                    </span>
                    <span className="font-semibold text-blue-900">
                      ${Math.round(inputs.homeCareHours * 18.51).toLocaleString()}/mo
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Right Panel - Results */}
            <div className="p-6 md:p-8 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                Senior Living Comparison
              </h3>
              
              {/* Location Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Select Cleveland Area Location
                </label>
                <select
                  value={inputs.selectedLocation}
                  onChange={(e) => updateInput('selectedLocation', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white
                           focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  {LOCATION_TIERS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label} — ${loc.price.toLocaleString()}/mo
                      {loc.tier === 'premium' ? ' ★' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Value Gap Visualization */}
              <ValueGapBar
                valueGap={results.valueGap}
                valueGapPercent={results.valueGapPercent}
                isHighValue={results.isHighValue}
                seniorLivingCost={results.seniorLivingCost}
                totalHomeCost={results.totalHomeCost}
              />
              
              {/* What's Included */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  Included in Senior Living
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {CLEVELAND_2026_DATA.included.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl
                         hover:from-teal-700 hover:to-teal-800 transition-all duration-200
                         flex items-center justify-center gap-3 shadow-lg shadow-teal-500/25"
              >
                <FileText className="h-5 w-5" />
                Get My Full Cleveland Cost Report
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <p className="text-center text-xs text-slate-500 mt-3">
                Free personalized analysis • No obligation • Cleveland experts
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto mt-8 text-center"
        >
          <p className="text-sm text-slate-500">
            Data sources: 2026 Genworth Cost of Care Survey, Cuyahoga County Auditor, 
            Ohio Department of Aging. Calculator provides estimates only.
          </p>
        </motion.div>
      </div>
      
      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
        inputs={inputs}
      />
    </section>
  );
}

