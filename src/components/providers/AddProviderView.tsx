'use client';

import React, { useState } from 'react';
import {
  Building2,
  User,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  FileCheck,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Globe,
  Percent,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { UserManagementItem } from '../../types/dashboard';

export interface ProviderFormData {
  // Step 1: Provider Details
  businessName: string;
  category: string;
  registrationNumber: string;
  operatingCity: string;
  commissionRate: number;
  website: string;
  experienceYears: string;
  description: string;

  // Step 2: Contact Information
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  alternatePhone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  supportHelpline: string;

  // Step 3: Documents
  documents: {
    incorporation: { name: string; size: string; uploaded: boolean } | null;
    gst: { name: string; size: string; uploaded: boolean } | null;
    pan: { name: string; size: string; uploaded: boolean } | null;
    safetyLicense: { name: string; size: string; uploaded: boolean } | null;
  };

  // Step 4: Preferences
  sendInviteEmail: boolean;
  require2FA: boolean;
  initialStatus: 'Active' | 'Invited';
}

const DEFAULT_FORM_DATA: ProviderFormData = {
  businessName: '',
  category: 'Water Sports & Scuba Diving',
  registrationNumber: '',
  operatingCity: 'Goa',
  commissionRate: 15,
  website: '',
  experienceYears: '3-5 Years',
  description: '',

  contactPerson: '',
  designation: 'Managing Director',
  email: '',
  phone: '',
  alternatePhone: '',
  streetAddress: '',
  city: '',
  state: 'Goa',
  postalCode: '',
  country: 'India',
  supportHelpline: '',

  documents: {
    incorporation: null,
    gst: null,
    pan: null,
    safetyLicense: null,
  },

  sendInviteEmail: true,
  require2FA: true,
  initialStatus: 'Active',
};

const SAMPLE_DEMO_DATA: ProviderFormData = {
  businessName: 'Goa Ocean Explorers & Scuba Hub',
  category: 'Water Sports & Scuba Diving',
  registrationNumber: 'U74999GA2021PTC014892',
  operatingCity: 'Goa',
  commissionRate: 15,
  website: 'https://goaoceanexplorers.com',
  experienceYears: '5+ Years',
  description:
    'Premier certified diving and coastal watersports center operating along Candolim and Grand Island. Equipped with international safety compliant boats, PADI master instructors, and deep sea gear.',

  contactPerson: 'Capt. Rajesh Kulkarni',
  designation: 'Operations Director',
  email: 'rajesh@goaoceanexplorers.com',
  phone: '+91 98234 56789',
  alternatePhone: '+91 98221 98765',
  streetAddress: 'Plot 42, Beach Road, Near Candolim Lighthouse',
  city: 'Candolim, North Goa',
  state: 'Goa',
  postalCode: '403515',
  country: 'India',
  supportHelpline: '+91 98234 56780',

  documents: {
    incorporation: {
      name: 'Certificate_of_Incorporation_GoaExplorers.pdf',
      size: '2.4 MB',
      uploaded: true,
    },
    gst: {
      name: 'GST_Registration_Certificate_27AADCG.pdf',
      size: '1.8 MB',
      uploaded: true,
    },
    pan: {
      name: 'Company_PAN_Card_Authorized.pdf',
      size: '850 KB',
      uploaded: true,
    },
    safetyLicense: {
      name: 'Goa_Tourism_Safety_License_2024.pdf',
      size: '3.1 MB',
      uploaded: true,
    },
  },

  sendInviteEmail: true,
  require2FA: true,
  initialStatus: 'Active',
};

interface AddProviderViewProps {
  onAddProvider?: (provider: Omit<UserManagementItem, 'id' | 'listingsCount'>) => void;
  onNavigateToUsers?: () => void;
  onBackToDashboard?: () => void;
}

export const AddProviderView: React.FC<AddProviderViewProps> = ({
  onAddProvider,
  onNavigateToUsers,
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<ProviderFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Quick helper to fill sample data for fast testing
  const handleFillSampleData = () => {
    setFormData(SAMPLE_DEMO_DATA);
    setErrors({});
  };

  const steps = [
    { number: 1, title: 'Provider Details', icon: Building2 },
    { number: 2, title: 'Contact Information', icon: User },
    { number: 3, title: 'Documents', icon: FileText },
    { number: 4, title: 'Review & Summary', icon: CheckCircle2 },
  ];

  // Validation per step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber = 'Registration / License number is required';
      }
      if (!formData.operatingCity.trim()) {
        newErrors.operatingCity = 'Operating city is required';
      }
      if (formData.commissionRate < 0 || formData.commissionRate > 100) {
        newErrors.commissionRate = 'Commission must be between 0% and 100%';
      }
    } else if (step === 2) {
      if (!formData.contactPerson.trim()) {
        newErrors.contactPerson = 'Primary contact person name is required';
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        newErrors.email = 'Valid official email address is required';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Primary mobile number is required';
      }
      if (!formData.streetAddress.trim()) {
        newErrors.streetAddress = 'Business address is required';
      }
    } else if (step === 3) {
      if (!formData.documents.incorporation) {
        newErrors.incorporation = 'Certificate of Incorporation is required';
      }
      if (!formData.documents.gst) {
        newErrors.gst = 'GST Certificate is required';
      }
      if (!formData.documents.pan) {
        newErrors.pan = 'PAN Card is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (
    key: keyof ProviderFormData['documents'],
    file: File | null
  ) => {
    if (!file) return;
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: {
          name: file.name,
          size: formattedSize,
          uploaded: true,
        },
      },
    }));

    // Clear specific error if fixed
    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleRemoveDoc = (key: keyof ProviderFormData['documents']) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: null,
      },
    }));
  };

  const handleSimulateDocUpload = (key: keyof ProviderFormData['documents']) => {
    const demoFiles: Record<keyof ProviderFormData['documents'], { name: string; size: string }> = {
      incorporation: { name: 'Incorporation_Certificate_Verified.pdf', size: '2.4 MB' },
      gst: { name: 'GSTIN_Registration_Official.pdf', size: '1.8 MB' },
      pan: { name: 'Company_PAN_Card.pdf', size: '890 KB' },
      safetyLicense: { name: 'Tourism_Safety_License_2024.pdf', size: '3.1 MB' },
    };

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: {
          ...demoFiles[key],
          uploaded: true,
        },
      },
    }));

    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);

      if (onAddProvider) {
        onAddProvider({
          name: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          role: 'Provider',
          status: 'Active',
        });
      }
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb matching designs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <button
              onClick={onBackToDashboard}
              className="hover:text-slate-600 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-semibold">Add Provider</span>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
            Add New Provider
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Register and onboard a new experience provider onto fabxp platform
          </p>
        </div>

        {/* Demo Auto-Fill helper button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleFillSampleData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all cursor-pointer border border-[#C7D2FE]"
            title="Pre-populate with sample Goa Ocean Explorers details"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Fill Demo Data</span>
          </button>
        </div>
      </div>

      {/* 4-Step Stepper Header matching add provider.png, contact.png, docs.png, summary.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const Icon = step.icon;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => {
                  // Allow jumping to steps already visited or validated
                  if (step.number < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step.number as 1 | 2 | 3 | 4);
                  }
                }}
                className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all text-left cursor-pointer ${
                  isCurrent
                    ? 'bg-[#F2EDFD] border border-[#DDD6FE]'
                    : isCompleted
                    ? 'bg-slate-50 hover:bg-slate-100/80'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                {/* Step Indicator Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#4F46E5] text-white shadow-xs ring-4 ring-[#4F46E5]/15'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.number}
                </div>

                <div className="min-w-0">
                  <div
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-[#4F46E5]'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    Step {step.number}
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isCurrent
                        ? 'text-slate-900'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Container */}
      {!isSubmittedSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Provider Details (add provider.png) */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Provider Basic Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the legal company information and operational category
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Step 1 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Business / Provider Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Provider / Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="e.g. Goa Ocean Explorers & Scuba Hub"
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                      errors.businessName
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                        : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                    }`}
                  />
                  {errors.businessName && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Experience Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                  >
                    <option value="Water Sports & Scuba Diving">Water Sports & Scuba Diving</option>
                    <option value="Trekking & Mountain Expeditions">Trekking & Mountain Expeditions</option>
                    <option value="Cultural & Heritage Walks">Cultural & Heritage Walks</option>
                    <option value="Wildlife & Jungle Safaris">Wildlife & Jungle Safaris</option>
                    <option value="Wellness & Yoga Retreats">Wellness & Yoga Retreats</option>
                    <option value="Culinary & Food Tours">Culinary & Food Tours</option>
                    <option value="Cruises & Sailing Charters">Cruises & Sailing Charters</option>
                  </select>
                </div>

                {/* Registration / CIN Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registration / License Number (CIN / MSME) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value })
                    }
                    placeholder="e.g. U74999GA2021PTC014892"
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                      errors.registrationNumber
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                        : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                    }`}
                  />
                  {errors.registrationNumber && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                {/* Operating City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Operating City / Primary Base <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.operatingCity}
                    onChange={(e) =>
                      setFormData({ ...formData, operatingCity: e.target.value })
                    }
                    placeholder="e.g. Goa (North & South)"
                    className={`w-full px-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                      errors.operatingCity
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                        : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                    }`}
                  />
                </div>

                {/* Commission Rate (%) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Platform Commission Rate (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commissionRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-3.5 pr-8 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                      %
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Standard experience rate is 15%
                  </span>
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Website / Portfolio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://providerwebsite.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                {/* Experience Tier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Operating History
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceYears: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                  >
                    <option value="< 1 Year">Less than 1 Year (Emerging)</option>
                    <option value="1-3 Years">1 - 3 Years</option>
                    <option value="3-5 Years">3 - 5 Years (Established)</option>
                    <option value="5+ Years">5+ Years (Veteran / Industry Lead)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Business Profile & Safety Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide a brief summary of the provider operations, certifications, safety standards, and team credentials..."
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <span>Continue to Contact Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Contact Information (contact.png) */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Primary operational contacts and registered business premises
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Step 2 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Contact Person Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPerson: e.target.value })
                      }
                      placeholder="e.g. Capt. Rajesh Kulkarni"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                        errors.contactPerson
                          ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                          : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  {errors.contactPerson && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    placeholder="e.g. Managing Director / Operations Lead"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@goaoceanexplorers.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                          : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Account access invite and notifications will be dispatched here
                  </span>
                  {errors.email && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Primary Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98234 56789"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                          : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Alternate Mobile */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alternate / Emergency Number
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, alternatePhone: e.target.value })
                    }
                    placeholder="+91 98221 98765"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* 24/7 Operations Desk Support */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Operations Desk Helpline / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.supportHelpline}
                    onChange={(e) =>
                      setFormData({ ...formData, supportHelpline: e.target.value })
                    }
                    placeholder="+91 98234 56780"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Street Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registered Business Street Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, streetAddress: e.target.value })
                      }
                      placeholder="e.g. Plot 42, Beach Road, Near Candolim Lighthouse"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                        errors.streetAddress
                          ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                          : 'border-slate-200/80 focus:border-[#4F46E5] focus:ring-indigo-100'
                      }`}
                    />
                  </div>
                  {errors.streetAddress && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.streetAddress}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Candolim"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Goa"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Postal / PIN Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    placeholder="403515"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="India"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Provider Details</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <span>Continue to Documents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Documents (docs.png) */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verification Documents</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload official verification files (PDF, PNG, JPG up to 10MB each)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSimulateDocUpload('incorporation');
                      handleSimulateDocUpload('gst');
                      handleSimulateDocUpload('pan');
                      handleSimulateDocUpload('safetyLicense');
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-[#4F46E5] hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Upload All Sample Docs</span>
                  </button>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    Step 3 of 4
                  </span>
                </div>
              </div>

              {/* 4 Document Upload Rows matching docs.png exactly */}
              <div className="space-y-4">
                {/* 1. Incorporation / Business Registration */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    formData.documents.incorporation
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : errors.incorporation
                      ? 'bg-rose-50/30 border-rose-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          formData.documents.incorporation
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <FileCheck className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            Certificate of Incorporation / Business Registration
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Official company registration certificate, MSME, or Shop & Establishment act license
                        </p>
                        {formData.documents.incorporation && (
                          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{formData.documents.incorporation.name}</span>
                            <span className="text-slate-400 font-normal">
                              ({formData.documents.incorporation.size})
                            </span>
                          </div>
                        )}
                        {errors.incorporation && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.incorporation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {formData.documents.incorporation ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('incorporation')}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) =>
                              handleFileUpload(
                                'incorporation',
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. GST Registration Certificate */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    formData.documents.gst
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : errors.gst
                      ? 'bg-rose-50/30 border-rose-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          formData.documents.gst
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <FileText className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            GST Registration Certificate (Form REG-06)
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Verified 15-digit GSTIN tax certificate indicating registered legal business name
                        </p>
                        {formData.documents.gst && (
                          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{formData.documents.gst.name}</span>
                            <span className="text-slate-400 font-normal">
                              ({formData.documents.gst.size})
                            </span>
                          </div>
                        )}
                        {errors.gst && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.gst}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {formData.documents.gst ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('gst')}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) =>
                              handleFileUpload('gst', e.target.files ? e.target.files[0] : null)
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Company / Signatory PAN Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    formData.documents.pan
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : errors.pan
                      ? 'bg-rose-50/30 border-rose-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          formData.documents.pan
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            PAN Card of Entity / Authorized Signatory
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Permanent Account Number identification of corporate entity or managing proprietor
                        </p>
                        {formData.documents.pan && (
                          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{formData.documents.pan.name}</span>
                            <span className="text-slate-400 font-normal">
                              ({formData.documents.pan.size})
                            </span>
                          </div>
                        )}
                        {errors.pan && (
                          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.pan}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {formData.documents.pan ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('pan')}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) =>
                              handleFileUpload('pan', e.target.files ? e.target.files[0] : null)
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Safety & Operational Licenses / Certifications */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    formData.documents.safetyLicense
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          formData.documents.safetyLicense
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            Safety & Operational Licenses / Certifications
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Department of Tourism clearance, PADI scuba rating, or adventure equipment certifications
                        </p>
                        {formData.documents.safetyLicense && (
                          <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{formData.documents.safetyLicense.name}</span>
                            <span className="text-slate-400 font-normal">
                              ({formData.documents.safetyLicense.size})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {formData.documents.safetyLicense ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('safetyLicense')}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>Upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) =>
                              handleFileUpload(
                                'safetyLicense',
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Contact Info</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <span>Continue to Review & Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Summary / Review & Send Invite (summary.png) */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Review & Send Invite</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Double-check all provider parameters before creating account and sending portal access
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Step 4 of 4 · Final Review
                </span>
              </div>

              {/* Section 1: Provider Details Summary */}
              <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-sm font-bold text-slate-900">Provider Information</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block font-medium">Business Name</span>
                    <span className="font-semibold text-slate-900">
                      {formData.businessName || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Category</span>
                    <span className="font-semibold text-slate-900">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Registration Number</span>
                    <span className="font-semibold text-slate-900">
                      {formData.registrationNumber || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Operating City</span>
                    <span className="font-semibold text-slate-900">
                      {formData.operatingCity || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Commission Rate</span>
                    <span className="font-semibold text-emerald-700">
                      {formData.commissionRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Website</span>
                    <span className="font-semibold text-slate-900 truncate block">
                      {formData.website || 'None'}
                    </span>
                  </div>
                </div>

                {formData.description && (
                  <div className="text-xs pt-1 border-t border-slate-200/50 mt-2">
                    <span className="text-slate-400 block font-medium">Business Profile</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {formData.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Section 2: Contact Information Summary */}
              <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-sm font-bold text-slate-900">Contact & Address</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block font-medium">Primary Contact</span>
                    <span className="font-semibold text-slate-900">
                      {formData.contactPerson} ({formData.designation})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Official Email</span>
                    <span className="font-semibold text-slate-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone Number</span>
                    <span className="font-semibold text-slate-900">{formData.phone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Registered Address</span>
                    <span className="font-semibold text-slate-900">
                      {formData.streetAddress}, {formData.city}, {formData.state} -{' '}
                      {formData.postalCode}, {formData.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Emergency Desk</span>
                    <span className="font-semibold text-slate-900">
                      {formData.supportHelpline || formData.alternatePhone || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Verified Documents Summary */}
              <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-sm font-bold text-slate-900">Attached Documents</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 block truncate">
                        Incorporation Certificate
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {formData.documents.incorporation?.name || 'Not attached'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 block truncate">
                        GST Registration
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {formData.documents.gst?.name || 'Not attached'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 block truncate">
                        Company PAN Card
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {formData.documents.pan?.name || 'Not attached'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/60">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        formData.documents.safetyLicense ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 block truncate">
                        Safety & Tourism License
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {formData.documents.safetyLicense?.name || 'Optional / Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Onboarding Preferences */}
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Onboarding & Security Setup
                </h3>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sendInviteEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, sendInviteEmail: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-[#4F46E5] focus:ring-indigo-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Send portal access invitation email
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Sends a secure activation link with temporary login passcode to{' '}
                        <strong>{formData.email || 'the primary email'}</strong>
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.require2FA}
                      onChange={(e) =>
                        setFormData({ ...formData, require2FA: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-[#4F46E5] focus:ring-indigo-400 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Enforce Two-Factor Authentication (2FA) setup
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Requires provider to configure TOTP / Google Authenticator upon initial login
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Documents</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Provider & Sending Invite...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Review & Send Invite</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      ) : (
        /* Success State Screen matching post-creation flow */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs ring-8 ring-emerald-50">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Provider Successfully Added!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>{formData.businessName}</strong> has been registered with{' '}
              <span className="text-emerald-700 font-semibold">{formData.commissionRate}%</span> commission split.
              An onboarding invitation has been dispatched to{' '}
              <span className="text-slate-900 font-semibold">{formData.email}</span>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-w-lg mx-auto text-left text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Account ID:</span>
              <span className="font-mono font-semibold text-slate-800">
                PRV-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-emerald-600">Active · Invited</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">2FA Requirement:</span>
              <span className="font-semibold text-indigo-600">
                {formData.require2FA ? 'Mandatory on first login' : 'Optional'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onNavigateToUsers) onNavigateToUsers();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] transition-all cursor-pointer shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>View in User Management</span>
            </button>

            <button
              onClick={() => {
                setFormData(DEFAULT_FORM_DATA);
                setCurrentStep(1);
                setIsSubmittedSuccess(false);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Provider</span>
            </button>

            <button
              onClick={onBackToDashboard}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
