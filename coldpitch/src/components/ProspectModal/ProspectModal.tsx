import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, Loader2, Sparkles, Globe, Check } from 'lucide-react';
import type { Prospect } from '../../types';

interface ProspectModalProps {
  isOpen: boolean;
  prospect?: Prospect | null;
  onClose: () => void;
  onSave: (prospect: Partial<Prospect>) => void;
}

const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'USA', 'UK', 'Canada', 'Other'];
const nigerianStates = [
  'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 
  'Enugu', 'Abeokuta', 'Owerri', 'Calabar', 'Jos', 'Ilorin', 'Other'
];

export default function ProspectModal({ isOpen, prospect, onClose, onSave }: ProspectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [isAnalyzingWebsite, setIsAnalyzingWebsite] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Prospect>>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    role: '',
    website: '',
    country: 'Nigeria',
    state: '',
    niche: '',
    hasSocials: false,
    socialLinks: {},
    modeOfReachout: 'Email',
    status: 'New',
    tags: [],
    source: 'Manual Entry',
  });

  useEffect(() => {
    if (prospect) {
      setFormData(prospect);
    } else {
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        company: '',
        role: '',
        website: '',
        country: 'Nigeria',
        state: '',
        niche: '',
        hasSocials: false,
        socialLinks: {},
        modeOfReachout: 'Email',
        status: 'New',
        tags: [],
        source: 'Manual Entry',
      });
    }
  }, [prospect, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const generatePitch = async () => {
    setIsGeneratingPitch(true);
    
    // Simulate AI pitch generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const pitch = `Hi ${formData.name?.split(' ')[0] || 'there'},

I noticed ${formData.company || 'your company'} is doing great work in ${formData.niche || 'your industry'}${formData.state ? ` in ${formData.state}` : ''}.

${formData.websiteAnalysis?.insights || 'I\'ve reviewed your online presence and see tremendous potential for growth.'}

I specialize in helping ${formData.niche || 'businesses'} ${formData.websiteAnalysis?.recommendations || 'scale their digital presence and generate more qualified leads'}.

Would you be open to a quick 15-minute call this week to explore how we can help ${formData.company || 'your business'} achieve similar results?

Looking forward to connecting!

Best regards`;

    setFormData((prev) => ({ ...prev, generatedPitch: pitch }));
    setIsGeneratingPitch(false);
  };

  const analyzeWebsite = async () => {
    if (!formData.website) return;
    
    setIsAnalyzingWebsite(true);
    
    // Simulate website analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    const analysis = {
      analyzed: true,
      analyzedAt: new Date().toISOString(),
      insights: `${formData.company || 'The company'} has an established online presence but could benefit from improved conversion optimization and lead generation strategies.`,
      recommendations: 'Implement modern lead capture forms, improve mobile responsiveness, and enhance call-to-action placement.',
      keyFindings: [
        'Website loads in 2.3 seconds (Room for improvement)',
        'Mobile traffic represents 65% of visitors',
        'No active lead magnet or email capture',
        'Strong content but limited conversion paths',
        'Good social proof but could be more prominent',
      ],
    };

    setFormData((prev) => ({
      ...prev,
      websiteAnalysis: analysis,
    }));
    
    setIsAnalyzingWebsite(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const prospectData: Partial<Prospect> = {
        ...formData,
        id: prospect?.id || `#${Date.now().toString(36).toUpperCase()}`,
        dateAdded: prospect?.dateAdded || new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(prospectData);
      onClose();
    } catch (error) {
      console.error('Error saving prospect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8 max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-900">
              {prospect ? 'Edit Prospect' : 'Add New Prospect'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role/Position
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="CEO, Marketing Manager, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niche/Industry
                    </label>
                    <input
                      type="text"
                      value={formData.niche}
                      onChange={(e) => handleChange('niche', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="E-commerce, SaaS, Real Estate, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="https://example.com"
                      />
                      <button
                        type="button"
                        onClick={analyzeWebsite}
                        disabled={!formData.website || isAnalyzingWebsite}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isAnalyzingWebsite ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Analysis Results */}
              {formData.websiteAnalysis?.analyzed && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Website Analysis Complete</h4>
                      <p className="text-sm text-blue-700 mt-1">{formData.websiteAnalysis.insights}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-blue-900 mb-2">Key Findings:</p>
                    <ul className="space-y-1">
                      {formData.websiteAnalysis.keyFindings?.map((finding, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.country === 'Nigeria' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="hasSocials"
                    checked={formData.hasSocials}
                    onChange={(e) => handleChange('hasSocials', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="hasSocials" className="text-lg font-medium text-gray-900">
                    Has Social Media Presence
                  </label>
                </div>

                {formData.hasSocials && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks?.twitter || ''}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks?.facebook || ''}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Outreach Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Outreach Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode of Reachout <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.modeOfReachout}
                      onChange={(e) => handleChange('modeOfReachout', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    >
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone Call</option>
                      <option value="LinkedIn">LinkedIn Message</option>
                      <option value="Twitter">Twitter DM</option>
                      <option value="Multiple">Multiple Channels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Replied">Replied</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Converted">Converted</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Pitch Generation */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI-Generated Pitch
                  </h3>
                  <button
                    type="button"
                    onClick={generatePitch}
                    disabled={isGeneratingPitch || !formData.name}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {isGeneratingPitch ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Pitch
                      </>
                    )}
                  </button>
                </div>

                {formData.generatedPitch ? (
                  <textarea
                    value={formData.generatedPitch}
                    onChange={(e) => handleChange('generatedPitch', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                    placeholder="Your AI-generated pitch will appear here..."
                  />
                ) : (
                  <p className="text-sm text-gray-600 italic">
                    Fill in the prospect details and click "Generate Pitch" to create a personalized outreach message.
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                prospect ? 'Update Prospect' : 'Add Prospect'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
