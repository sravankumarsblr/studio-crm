
import { z } from "zod";

export type Role = {
  id: string;
  name: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role['name'];
  department: string;
};

export const ownershipTypes = ['Private', 'Public', 'Government', 'Multinational', 'SME', 'Startup'] as const;
export const businessStages = ['Startup', 'Growth', 'Mature'] as const;
export const accreditationsStandards = ['ISO 9001', 'ISO 17025', 'GMP'] as const;
export const serviceDependencies = ['One-time', 'Annual contract (AMC)', 'Multi-year', 'On Demand', 'Turnkey'] as const;
export const productServicePortfolios = ['Manufacturing', 'Trading', 'R&D', 'Service provider'] as const;
export const annualSpends = ['High', 'Medium', 'Low value clients'] as const;

// New Profiling Enums
export const decisionCycles = ['Quick', 'Long approval process'] as const;
export const serviceExpectations = ['Speed', 'Price sensitivity', 'Technical depth'] as const;
export const preferences = ['Onsite', 'At lab'] as const;
export const paymentCycles = ['Immediate', 'Advance payment', 'Credit 30days', 'Credit 45days', 'Credit 60days'] as const;
export const paymentMethods = ['Cheque', 'NEFT', 'Online portal'] as const;
export const usageProfiles = ['Regular calibration users', 'Occasional users'] as const;
export const certificateFormats = ['High', 'Medium', 'Low value clients'] as const;
export const auditSupportOptions = ['Continuous', 'One time', 'Not Needed'] as const;
export const premiumServiceOptions = ['Yes', 'No'] as const;
export const relationshipLengths = ['New', 'Long Term Client >10 years', 'Trusted Client>2 years'] as const;
export const engagementLevels = ['Continuous', 'Calls', 'Mails'] as const;
export const loyaltyAdvocacyOptions = ['References', 'Testimonials'] as const;


export type Company = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  numberOfEmployees: string;
  status: 'active' | 'inactive';
  // Profiling Fields
  ownershipType?: typeof ownershipTypes[number];
  businessStage?: typeof businessStages[number];
  accreditations?: (typeof accreditationsStandards[number])[];
  serviceDependency?: typeof serviceDependencies[number];
  productServicePortfolio?: typeof productServicePortfolios[number];
  annualSpend?: typeof annualSpends[number];
  decisionCycle?: typeof decisionCycles[number];
  serviceExpectations?: typeof serviceExpectations[number];
  preferences?: typeof preferences[number];
  paymentCycle?: typeof paymentCycles[number];
  paymentMethod?: typeof paymentMethods[number];
  usageProfile?: typeof usageProfiles[number];
  certificateFormat?: typeof certificateFormats[number];
  auditSupport?: typeof auditSupportOptions[number];
  willingToPayPremium?: typeof premiumServiceOptions[number];
  relationshipLength?: typeof relationshipLengths[number];
  engagementLevel?: typeof engagementLevels[number];
  loyaltyAdvocacy?: (typeof loyaltyAdvocacyOptions[number])[];
};

export type Contact = {
  id: string;
  salutation: 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.';
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  companyId: string;
  designation: string;
  department: string;
  status: 'active' | 'inactive';
  avatar: string;
};

export type LineItem = {
  productId: string;
  quantity: number;
};

export const leadSources = ["Phone", "Email", "Just Dial", "IndiaMart", "Coldcall"] as const;

export type Lead = {
  id: string;
  name: string;
  ownerId: string;
  createdById: string;
  companyName: string;
  contactName: string;
  value: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Junk';
  source: typeof leadSources[number];
  createdDate: string;
  leadData: Record<string, any>;
  lineItems: LineItem[];
};

export type QuoteLineItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
};

export type Quote = {
  id: string;
  quoteNumber: string;
  opportunityId: string;
  date: string;
  expiryDate: string;
  preparedBy: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  documentName?: string;
  lineItems: QuoteLineItem[];
  poNumber?: string;
  poValue?: number;
  poDate?: string;
  poDocumentName?: string;
  poStatus?: 'Received' | 'Acceptance Mail' | 'On Phone';
};

export type Opportunity = {
  id: string;
  name: string;
  ownerId: string;
  createdById: string;
  companyName: string;
  contactName: string;
  stage: 'Qualification' | 'Proposal' | 'Negotiation';
  status: 'New' | 'In Progress' | 'Won' | 'Lost';
  value: number;
  closeDate: string;
  createdDate: string;
  winProbability: number;
  source: typeof leadSources[number];
  quotes: Quote[];
  lineItems: LineItem[];
};

export type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  assignedToId: string;
  amount: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  invoiceStatus: 'Not Invoiced' | 'Invoiced' | 'Paid';
  invoiceNumber?: string;
  invoiceRaisedById?: string;
};

export type Contract = {
  id: string;
  opportunityId: string;
  ownerId: string;
  createdById: string;
  poNumber: string;
  contractTitle: string;
  companyName: string;
  value: number;
  startDate: string;
  endDate: string;
  effectiveDate: string;
  status: 'Draft' | 'Active' | 'Expired' | 'Terminated' | 'Renewed';
  type: 'One-time' | 'Subscription' | 'Retainer' | 'SLA';
  scopeOfWork: string;
  milestones: Milestone[];
  lineItems: LineItem[];
  documentName?: string;
  paymentCycle?: typeof paymentCycles[number];
  paymentMethod?: typeof paymentMethods[number];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
  range?: string;
  resolution?: string;
  isNabl: boolean;
  location: 'Lab' | 'Site' | 'Both';
};

export const departments = [
    'Sales',
    'Marketing',
    'Technical Support',
    'Management',
    'Operations',
    'Procurement',
    'R&D',
    'QA/QC',
    'Engineering'
];

export const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];

export const roles: Role[] = [
  { id: 'role1', name: 'Admin', description: 'Has access to all features, including the admin section.' },
  { id: 'role2', name: 'Sales Manager', description: 'Can view and manage all leads, opportunities, and contracts.' },
  { id: 'role3', name: 'Sales Rep', description: 'Can only access and manage their own assigned records.' },
  { id: 'role4', name: 'BackOfficeTeam', description: 'Responsible to create Leads and Opportunities' },
];

export const users: User[] = [
  { id: 'user1', name: 'Aryan Sharma', email: 'aryan.sharma@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Admin', department: 'Management' },
  { id: 'user2', name: 'Priya Singh', email: 'priya.singh@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Sales Manager', department: 'Sales' },
  { id: 'user3', name: 'Rohan Gupta', email: 'rohan.gupta@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Sales Rep', department: 'Sales' },
  { id: 'user4', name: 'Anjali Mehta', email: 'anjali.mehta@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Sales Rep', department: 'Sales' },
];

export const companies: Company[] = [
  { 
    id: 'com1', name: 'Accurate Calibration Pvt. Ltd.', industry: 'Engineering', logo: 'https://placehold.co/40x40.png', website: 'https://acpl.co.in', numberOfEmployees: '100-200', status: 'active', 
    ownershipType: 'Private', businessStage: 'Mature', accreditations: ['ISO 9001', 'ISO 17025'], serviceDependency: 'Annual contract (AMC)', productServicePortfolio: 'Service provider', annualSpend: 'High',
    decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'Onsite', paymentCycle: 'Credit 45days', paymentMethod: 'Cheque', usageProfile: 'Regular calibration users',
    certificateFormat: 'High', auditSupport: 'Continuous', willingToPayPremium: 'Yes', relationshipLength: 'Long Term Client >10 years', engagementLevel: 'Continuous', loyaltyAdvocacy: ['References', 'Testimonials']
  },
  { 
    id: 'com2', name: 'Vimaan Aerospace Solutions', industry: 'Aerospace', logo: 'https://placehold.co/40x40.png', website: 'https://vimaanaero.com', numberOfEmployees: '500+', status: 'active', 
    ownershipType: 'Public', businessStage: 'Mature', accreditations: ['ISO 9001'], serviceDependency: 'Multi-year', productServicePortfolio: 'Manufacturing', annualSpend: 'High',
    decisionCycle: 'Quick', serviceExpectations: 'Speed', preferences: 'Onsite', paymentCycle: 'Credit 60days', paymentMethod: 'Online portal', usageProfile: 'Regular calibration users',
    certificateFormat: 'High', auditSupport: 'Continuous', willingToPayPremium: 'Yes', relationshipLength: 'Trusted Client>2 years', engagementLevel: 'Mails', loyaltyAdvocacy: ['Testimonials']
  },
  { 
    id: 'com3', name: 'Sanjeevani MedTech', industry: 'Medical Devices', logo: 'https://placehold.co/40x40.png', website: 'https://sanjeevanimed.com', numberOfEmployees: '50-100', status: 'inactive', 
    ownershipType: 'SME', businessStage: 'Growth', accreditations: ['ISO 17025', 'GMP'], serviceDependency: 'On Demand', productServicePortfolio: 'R&D', annualSpend: 'Medium',
    decisionCycle: 'Quick', serviceExpectations: 'Price sensitivity', preferences: 'At lab', paymentCycle: 'Advance payment', paymentMethod: 'NEFT', usageProfile: 'Occasional users',
    certificateFormat: 'Medium', auditSupport: 'One time', willingToPayPremium: 'No', relationshipLength: 'New', engagementLevel: 'Calls', loyaltyAdvocacy: []
  },
  { 
    id: 'com4', name: 'Navachar Tech Labs', industry: 'R&D labs', logo: 'https://placehold.co/40x40.png', website: 'https://navacharlabs.com', numberOfEmployees: '20-50', status: 'active', 
    ownershipType: 'Startup', businessStage: 'Startup', serviceDependency: 'Turnkey', productServicePortfolio: 'R&D', annualSpend: 'Low value clients',
    decisionCycle: 'Quick', serviceExpectations: 'Technical depth', preferences: 'Onsite', paymentCycle: 'Immediate', paymentMethod: 'Online portal', usageProfile: 'Occasional users',
    certificateFormat: 'Low value clients', auditSupport: 'Not Needed', willingToPayPremium: 'No', relationshipLength: 'New', engagementLevel: 'Mails'
  },
  { 
    id: 'com5', name: 'Bharat Petrochem', industry: 'Power', logo: 'https://placehold.co/40x40.png', website: 'https://bharatpetro.com', numberOfEmployees: '1000+', status: 'active', 
    ownershipType: 'Government', businessStage: 'Mature', accreditations: ['ISO 9001'], serviceDependency: 'Annual contract (AMC)', productServicePortfolio: 'Manufacturing', annualSpend: 'High',
    decisionCycle: 'Long approval process', serviceExpectations: 'Speed', preferences: 'Onsite', paymentCycle: 'Credit 30days', paymentMethod: 'Cheque', usageProfile: 'Regular calibration users',
    certificateFormat: 'High', auditSupport: 'Continuous', willingToPayPremium: 'No', relationshipLength: 'Trusted Client>2 years', engagementLevel: 'Continuous', loyaltyAdvocacy: ['References']
  },
  { 
    id: 'com6', name: 'Jiva Bio-Sciences', industry: 'Pharma', logo: 'https://placehold.co/40x40.png', website: 'https://jivabio.com', numberOfEmployees: '200-500', status: 'inactive', 
    ownershipType: 'Multinational', businessStage: 'Growth', accreditations: ['GMP'], serviceDependency: 'Multi-year', productServicePortfolio: 'R&D', annualSpend: 'Medium',
    decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'At lab', paymentCycle: 'Credit 60days', paymentMethod: 'NEFT', usageProfile: 'Regular calibration users',
    certificateFormat: 'Medium', auditSupport: 'One time', willingToPayPremium: 'Yes', relationshipLength: 'Long Term Client >10 years', engagementLevel: 'Mails', loyaltyAdvocacy: ['Testimonials']
  },
];

export const contacts: Contact[] = [
  { id: 'con1', salutation: 'Mr.', firstName: 'Vikram', lastName: 'Patel', email: 'vikram.p@acpl.co.in', mobile: '9820098200', companyId: 'com1', designation: 'Purchase Manager', department: 'Procurement', status: 'active', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con2', salutation: 'Ms.', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.r@vimaanaero.com', mobile: '9848098480', companyId: 'com2', designation: 'Senior Engineer', department: 'R&D', status: 'active', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con3', salutation: 'Mr.', firstName: 'Deepak', lastName: 'Kumar', email: 'deepak.k@sanjeevanimed.com', mobile: '9811098110', companyId: 'com3', designation: 'Quality Head', department: 'QA/QC', status: 'inactive', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con4', salutation: 'Ms.', firstName: 'Isha', lastName: 'Singh', email: 'isha.s@navacharlabs.com', mobile: '9890098900', companyId: 'com4', designation: 'Lab Director', department: 'Operations', status: 'active', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con5', salutation: 'Mr.', firstName: 'Amit', lastName: 'Desai', email: 'amit.d@bharatpetro.com', mobile: '9821098210', companyId: 'com5', designation: 'Instrumentation Lead', department: 'Engineering', status: 'active', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con6', salutation: 'Dr.', firstName: 'Neha', lastName: 'Rao', email: 'neha.r@jivabio.com', mobile: '9885098850', companyId: 'com6', designation: 'Principal Scientist', department: 'R&D', status: 'inactive', avatar: 'https://placehold.co/32x32.png' },
];

export const leads: Lead[] = [
  { id: 'lead1', name: 'Sensor Calibration Service Inquiry', ownerId: 'user3', createdById: 'user2', companyName: 'Navachar Tech Labs', contactName: 'Isha Singh', value: 1500000, status: 'New', source: 'IndiaMart', createdDate: '2024-05-01', lineItems: [{ productId: 'prod1', quantity: 30 }], leadData: { industry: 'R&D', companySize: 75, pastPurchases: 0, websiteVisits: 5 } },
  { id: 'lead2', name: 'Pressure Gauge Batch Testing', ownerId: 'user4', createdById: 'user2', companyName: 'Bharat Petrochem', contactName: 'Amit Desai', value: 7500000, status: 'Qualified', source: 'Phone', createdDate: '2024-05-10', lineItems: [{ productId: 'prod1', quantity: 50 }, { productId: 'prod3', quantity: 20 }], leadData: { industry: 'Oil & Gas', companySize: 2500, pastPurchases: 3, websiteVisits: 2, referredBy: 'Vimaan Aerospace' } },
  { id: 'lead3', name: 'Annual Pipette Calibration Contract', ownerId: 'user3', createdById: 'user1', companyName: 'Jiva Bio-Sciences', contactName: 'Neha Rao', value: 2500000, status: 'Contacted', source: 'Just Dial', createdDate: '2024-05-20', lineItems: [{ productId: 'prod4', quantity: 40 }], leadData: { industry: 'Biotechnology', companySize: 180, pastPurchases: 1, websiteVisits: 1 } },
  { id: 'lead4', name: 'Enquiry for Old System Upgrade', ownerId: 'user4', createdById: 'user1', companyName: 'Navachar Tech Labs', contactName: 'Isha Singh', value: 500000, status: 'Junk', source: 'Coldcall', createdDate: '2024-05-22', lineItems: [], leadData: { industry: 'R&D', companySize: 75, pastPurchases: 0, websiteVisits: 0, reason: 'Budget constraints' } },
];

export const opportunities: Opportunity[] = [
  { 
    id: 'deal1', 
    name: 'Q3 Pressure Sensor Contract', 
    ownerId: 'user3',
    createdById: 'user2',
    companyName: 'Vimaan Aerospace Solutions', 
    contactName: 'Sneha Reddy', 
    stage: 'Proposal', 
    status: 'In Progress',
    value: 4990000, 
    createdDate: '2024-06-01',
    closeDate: '2024-08-30', 
    winProbability: 0.5,
    source: 'Email',
    lineItems: [{ productId: 'prod1', quantity: 100 }], 
    quotes: [
      { id: 'qt1', opportunityId: 'deal1', quoteNumber: 'QT-2024-001', date: '2024-06-10', expiryDate: '2024-07-10', preparedBy: 'Aryan Sharma', status: 'Sent', documentName: 'Vimaan_Quote_v1.pdf', lineItems: [{ productId: 'prod1', quantity: 100, unitPrice: 49900 }] }
    ] 
  },
  { 
    id: 'deal2', 
    name: 'Medical Scale Fleet Calibration', 
    ownerId: 'user4',
    createdById: 'user2',
    companyName: 'Sanjeevani MedTech', 
    contactName: 'Deepak Kumar', 
    stage: 'Negotiation',
    status: 'In Progress',
    value: 11950800, 
    createdDate: '2024-05-15',
    closeDate: '2024-07-25', 
    winProbability: 0.75,
    source: 'Phone',
    lineItems: [{ productId: 'prod2', quantity: 92 }], 
    quotes: [
       { id: 'qt2', opportunityId: 'deal2', quoteNumber: 'QT-2024-002', date: '2024-06-15', expiryDate: '2024-07-15', preparedBy: 'Aryan Sharma', status: 'Sent', lineItems: [{ productId: 'prod2', quantity: 92, unitPrice: 129900 }] },
       { id: 'qt3', opportunityId: 'deal2', quoteNumber: 'QT-2024-003', date: '2024-06-20', expiryDate: '2024-07-20', preparedBy: 'Aryan Sharma', status: 'Draft', lineItems: [{ productId: 'prod2', quantity: 92, unitPrice: 129900, discount: { type: 'fixed', value: 500000 } }] }
    ] 
  },
  { 
    id: 'deal3', 
    name: 'Torque Wrench Verification AMC', 
    ownerId: 'user3',
    createdById: 'user1',
    companyName: 'Accurate Calibration Pvt. Ltd.', 
    contactName: 'Vikram Patel', 
    stage: 'Negotiation', 
    status: 'Won',
    value: 2200000, 
    createdDate: '2024-05-20',
    closeDate: '2024-06-15', 
    winProbability: 1,
    source: 'Just Dial',
    lineItems: [{ productId: 'prod3', quantity: 26 }], 
    quotes: [
      { id: 'qt4', opportunityId: 'deal3', quoteNumber: 'QT-2024-004', date: '2024-06-01', expiryDate: '2024-07-01', preparedBy: 'Aryan Sharma', status: 'Accepted', poNumber: 'PO-ACPL-1138', poValue: 2200000, poDate: '2024-06-14', poDocumentName: 'PO-ACPL-1138.pdf', poStatus: 'Received', lineItems: [{ productId: 'prod3', quantity: 26, unitPrice: 85000, discount: { type: 'fixed', value: 10000 } }] }
    ] 
  },
  { 
    id: 'deal4', 
    name: 'Calibration Software Suite License', 
    ownerId: 'user3',
    createdById: 'user2',
    companyName: 'Navachar Tech Labs', 
    contactName: 'Isha Singh', 
    stage: 'Qualification',
    status: 'New',
    value: 2500000, 
    createdDate: '2024-06-10', 
    closeDate: '2024-09-15', 
    winProbability: 0.2, 
    source: 'IndiaMart',
    lineItems: [{ productId: 'prod5', quantity: 10 }], 
    quotes: [] 
  },
  { 
    id: 'deal5', 
    name: 'Bulk Sensor Batch Order', 
    ownerId: 'user4',
    createdById: 'user1',
    companyName: 'Bharat Petrochem', 
    contactName: 'Amit Desai', 
    stage: 'Proposal', 
    status: 'Lost',
    value: 998000, 
    createdDate: '2024-05-01', 
    closeDate: '2024-06-20', 
    winProbability: 0, 
    source: 'Coldcall',
    lineItems: [{ productId: 'prod1', quantity: 20 }], 
    quotes: [] 
  },
];

export const contracts: Contract[] = [
  {
    id: 'CT-2024-001',
    opportunityId: 'deal3',
    ownerId: 'user3',
    createdById: 'user1',
    poNumber: 'PO-ACPL-1138',
    contractTitle: 'Service Agreement for Accurate Calibration',
    companyName: 'Accurate Calibration Pvt. Ltd.',
    value: 2200000,
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    effectiveDate: '2024-07-01',
    status: 'Active',
    type: 'Retainer',
    scopeOfWork: 'Annual calibration and verification for all torque wrenches at the main facility. Includes two on-site visits and unlimited remote support.',
    documentName: 'Contract_Agreement_ACPL.pdf',
    lineItems: [{ productId: 'prod3', quantity: 26 }],
    paymentCycle: 'Credit 45days',
    paymentMethod: 'Cheque',
    milestones: [
      { id: 'm1', name: 'Initial On-site Calibration', dueDate: '2024-07-15', status: 'Completed', invoiceStatus: 'Paid', amount: 1100000, assignedToId: 'user3', invoiceNumber: 'INV-001', invoiceRaisedById: 'user2' },
      { id: 'm2', name: 'Mid-term Review & Report', dueDate: '2025-01-15', status: 'Pending', invoiceStatus: 'Not Invoiced', amount: 550000, assignedToId: 'user3' },
      { id: 'm3', name: 'Final On-site Calibration', dueDate: '2025-06-15', status: 'Pending', invoiceStatus: 'Not Invoiced', amount: 550000, assignedToId: 'user3' }
    ]
  }
];

export const products: Product[] = [
  { id: 'prod1', name: 'Pressure Sensor XL-100', category: 'Sensors', price: 49900, status: 'active', isNabl: true, location: 'Both' },
  { id: 'prod2', name: 'Precision Medical Scale MS-2', category: 'Scales', price: 129900, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod3', name: 'Digital Torque Wrench TW-30', category: 'Tools', price: 85000, status: 'inactive', isNabl: false, location: 'Site' },
  { id: 'prod4', name: 'Automated Digital Pipette P-4A', category: 'Lab Equipment', price: 60000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod5', name: 'CalTrack Software Suite', category: 'Tools', price: 250000, status: 'active', isNabl: false, location: 'Site' },
  { id: 'prod6', name: 'On-site Industrial Scale Calibration', category: 'Weighing Machine Calibration Services', price: 15000, status: 'active', isNabl: true, location: 'Site' },
  { id: 'prod7', name: 'Retail Weighing Scale Certification', category: 'Weighing Machine Calibration Services', price: 5000, status: 'active', isNabl: false, location: 'Site' },
  { id: 'prod8', name: 'E1 Class Weight Box Calibration', category: 'Weight Calibration Services', price: 25000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod9', name: 'F1 Class Weight Set Verification', category: 'Weight Calibration Services', price: 18000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod10', name: 'Multimeter & Clamp Meter Calibration', category: 'Electrical Instruments Calibration Services', price: 7500, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod11', name: 'High Voltage Probe Calibration', category: 'Electrical Instruments Calibration Services', price: 12000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod12', name: 'Vernier Caliper & Micrometer Calibration', category: 'Dimensional Calibration Services', price: 6000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod13', name: 'Gauge Block Calibration (NABL)', category: 'Dimensional Calibration Services', price: 20000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod14', name: 'Digital Pressure Gauge Calibration', category: 'Pressure Gauge and Vacuum Gauges Calibration Services', price: 9000, status: 'active', isNabl: true, location: 'Both' },
  { id: 'prod15', name: 'Analog Vacuum Gauge Testing', category: 'Pressure Gauge and Vacuum Gauges Calibration Services', price: 7000, status: 'active', isNabl: false, location: 'Lab' },
  { id: 'prod16', name: 'Medical Autoclave Temperature Mapping', category: 'Autoclave Calibration Services', price: 30000, status: 'active', isNabl: true, location: 'Site' },
  { id: 'prod17', name: 'Pharmaceutical Autoclave Validation', category: 'Autoclave Calibration Services', price: 45000, status: 'active', isNabl: true, location: 'Site' },
  { id: 'prod18', name: 'Liquid Flow Meter Calibration (On-site)', category: 'Flow Meter Calibration Services', price: 50000, status: 'active', isNabl: true, location: 'Site' },
  { id: 'prod19', name: 'Gas Flow Meter Calibration (Lab)', category: 'Flow Meter Calibration Services', price: 65000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod20', name: 'Digital Tachometer Calibration', category: 'Tachometer & Sound Level Meter Calibration Services', price: 8000, status: 'active', isNabl: true, location: 'Lab' },
  { id: 'prod21', name: 'Sound Level Meter Accuracy Test', category: 'Tachometer & Sound Level Meter Calibration Services', price: 10000, status: 'active', isNabl: true, location: 'Both' },
  { id: 'prod22', name: 'Glass Thermometer', category: 'Electrical Instruments Calibration Services', price: 1500, status: 'active', range: '-80 to 250 degree C', resolution: '0.1 C', isNabl: true, location: 'Lab' },
  { id: 'prod23', name: 'Wet & Dry Thermometer', category: 'Electrical Instruments Calibration Services', price: 1500, status: 'active', range: '-80 to1200 degree C', resolution: '1 C', isNabl: true, location: 'Lab' },
  { id: 'prod24', name: 'Digital Indicator with sensor', category: 'Electrical Instruments Calibration Services', price: 1500, status: 'active', range: '-80 to1200 degree C', resolution: '0.1 C', isNabl: true, location: 'Site' },
];
