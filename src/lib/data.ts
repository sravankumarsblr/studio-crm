
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
export const gstStatuses = ['GST', 'Non-GST'] as const;

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
  gstStatus?: typeof gstStatuses[number];
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

export const jobTitles = ['Quality manager', 'Maintenance head', 'Purchase manager', 'Owner', 'CEO'] as const;
export const contactNumberTypes = ['Personal', 'Professional'] as const;
export const seniorities = ['Executive', 'Middle manager', 'Director', 'Owner'] as const;
export const educationalBackgrounds = ['Engineering', 'Science', 'Commerce', 'Finance', 'Others'] as const;
export const ageGroups = ['Younger managers', 'Senior decision-makers'] as const;
export const genders = ['Female', 'Male'] as const;
export const languages = ['Telugu', 'Hindi', 'English'] as const;
export const digitalOpennessLevels = ['Manageable', 'Open', 'No Knowledge'] as const;

export type Contact = {
  id: string;
  name: string;
  salutation: 'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.';
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  companyId: string;
  department: string;
  status: 'active' | 'inactive';
  avatar: string;
  // New Profiling Fields
  jobTitle?: typeof jobTitles[number];
  contactNumberType?: typeof contactNumberTypes[number];
  seniority?: typeof seniorities[number];
  educationalBackground?: typeof educationalBackgrounds[number];
  ageGroup?: typeof ageGroups[number];
  gender?: typeof genders[number];
  language?: typeof languages[number];
  opennessToDigital?: typeof digitalOpennessLevels[number];
};

export const priceTypes = ['N/A', 'NABL', 'Non-NABL', 'Third Party NABL', 'Third Party Non-NABL'] as const;
export type PriceType = typeof priceTypes[number];

export type LineItem = {
  productId: string;
  quantity: number;
  priceType: PriceType;
  price: number;
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

export type InvoiceLineItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'Invoiced' | 'Paid' | 'Overdue';
  documentName?: string;
  raisedById: string;
  lineItems: InvoiceLineItem[];
};

export type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  assignedToId: string;
  amount: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  invoiceStatus: 'Not Invoiced' | 'Partially Invoiced' | 'Invoiced' | 'Paid';
  invoices: Invoice[];
  productIds: string[];
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
  status: 'active' | 'inactive';
  isNabl: boolean;
  location: 'Lab' | 'Site' | 'Site & Lab';
  resolution?: string;
  nablRange?: string;
  nonNablRange?: string;
  masterRange?: string;
  nablPrice?: number;
  nonNablPrice?: number;
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
    id: 'com1', name: 'Accurate Calibration Pvt. Ltd.', industry: 'Engineering', logo: 'https://placehold.co/40x40.png', website: 'https://acpl.co.in', numberOfEmployees: '100-200', status: 'active', gstStatus: 'GST',
    ownershipType: 'Private', businessStage: 'Mature', accreditations: ['ISO 9001', 'ISO 17025'], serviceDependency: 'Annual contract (AMC)', productServicePortfolio: 'Service provider', annualSpend: 'High',
    decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'Onsite', paymentCycle: 'Credit 45days', paymentMethod: 'Cheque', usageProfile: 'Regular calibration users',
    certificateFormat: 'High', auditSupport: 'Continuous', willingToPayPremium: 'Yes', relationshipLength: 'Long Term Client >10 years', engagementLevel: 'Continuous', loyaltyAdvocacy: ['References', 'Testimonials']
  },
  { 
    id: 'com2', name: 'Vimaan Aerospace Solutions', industry: 'Aerospace', logo: 'https://placehold.co/40x40.png', website: 'https://vimaanaero.com', numberOfEmployees: '500+', status: 'active', gstStatus: 'GST',
    ownershipType: 'Public', businessStage: 'Mature', accreditations: ['ISO 9001'], serviceDependency: 'Multi-year', productServicePortfolio: 'Manufacturing', annualSpend: 'High',
    decisionCycle: 'Quick', serviceExpectations: 'Speed', preferences: 'Onsite', paymentCycle: 'Credit 60days', paymentMethod: 'Online portal', usageProfile: 'Regular calibration users',
    certificateFormat: 'High', auditSupport: 'Continuous', willingToPayPremium: 'Yes', relationshipLength: 'Trusted Client>2 years', engagementLevel: 'Mails', loyaltyAdvocacy: ['Testimonials']
  },
  { 
    id: 'com3', name: 'Sanjeevani MedTech', industry: 'Medical Devices', logo: 'https://placehold.co/40x40.png', website: 'https://sanjeevanimed.com', numberOfEmployees: '50-100', status: 'inactive', gstStatus: 'Non-GST',
    ownershipType: 'SME', businessStage: 'Growth', accreditations: ['ISO 17025', 'GMP'], serviceDependency: 'On Demand', productServicePortfolio: 'R&D', annualSpend: 'Medium',
    decisionCycle: 'Quick', serviceExpectations: 'Price sensitivity', preferences: 'At lab', paymentCycle: 'Advance payment', paymentMethod: 'NEFT', usageProfile: 'Occasional users',
    certificateFormat: 'Medium', auditSupport: 'One time', willingToPayPremium: 'No', relationshipLength: 'New', engagementLevel: 'Calls', loyaltyAdvocacy: []
  },
  { 
    id: 'com4', name: 'Navachar Tech Labs', industry: 'R&D labs', logo: 'https://placehold.co/40x40.png', website: 'https://navacharlabs.com', numberOfEmployees: '20-50', status: 'active', gstStatus: 'GST',
    ownershipType: 'Startup', businessStage: 'Startup', serviceDependency: 'Turnkey', productServicePortfolio: 'R&D', annualSpend: 'Low value clients',
    decisionCycle: 'Quick', serviceExpectations: 'Technical depth', preferences: 'Onsite', paymentCycle: 'Immediate', paymentMethod: 'Online portal', usageProfile: 'Occasional users',
    certificateFormat: 'Low value clients', auditSupport: 'Not Needed', willingToPayPremium: 'No', relationshipLength: 'New', engagementLevel: 'Mails'
  },
  { 
    id: 'com5', name: 'Bharat Petrochem', industry: 'Power', logo: 'https://placehold.co/40x40.png', website: 'https://bharatpetro.com', numberOfEmployees: '1000+', status: 'active', gstStatus: 'GST',
    ownershipType: 'Government', businessStage: 'Mature', accreditations: ['ISO 9001'], serviceDependency: 'Annual contract (AMC)', productServicePortfolio: 'Manufacturing', annualSpend: 'High',
    decisionCycle: 'Long approval process', serviceExpectations: 'Speed', preferences: 'Onsite', paymentCycle: 'Credit 30days', paymentMethod: 'Cheque', usageProfile: 'Regular calibration users',
    certificateFormat: 'High', auditSupport: 'Continuous', willingToPayPremium: 'No', relationshipLength: 'Trusted Client>2 years', engagementLevel: 'Continuous', loyaltyAdvocacy: ['References']
  },
  { 
    id: 'com6', name: 'Jiva Bio-Sciences', industry: 'Pharma', logo: 'https://placehold.co/40x40.png', website: 'https://jivabio.com', numberOfEmployees: '200-500', status: 'inactive', gstStatus: 'Non-GST',
    ownershipType: 'Multinational', businessStage: 'Growth', accreditations: ['GMP'], serviceDependency: 'Multi-year', productServicePortfolio: 'R&D', annualSpend: 'Medium',
    decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'At lab', paymentCycle: 'Credit 60days', paymentMethod: 'NEFT', usageProfile: 'Regular calibration users',
    certificateFormat: 'Medium', auditSupport: 'One time', willingToPayPremium: 'Yes', relationshipLength: 'Long Term Client >10 years', engagementLevel: 'Mails', loyaltyAdvocacy: ['Testimonials']
  },
];

export const contacts: Contact[] = [
  { id: 'con1', name: 'Vikram Patel', salutation: 'Mr.', firstName: 'Vikram', lastName: 'Patel', email: 'vikram.p@acpl.co.in', mobile: '9820098200', companyId: 'com1', department: 'Procurement', status: 'active', avatar: 'https://placehold.co/32x32.png', jobTitle: 'Purchase manager', seniority: 'Middle manager', contactNumberType: 'Professional' },
  { id: 'con2', name: 'Sneha Reddy', salutation: 'Ms.', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.r@vimaanaero.com', mobile: '9848098480', companyId: 'com2', department: 'R&D', status: 'active', avatar: 'https://placehold.co/32x32.png', jobTitle: 'Quality manager', seniority: 'Executive', contactNumberType: 'Professional' },
  { id: 'con3', name: 'Deepak Kumar', salutation: 'Mr.', firstName: 'Deepak', lastName: 'Kumar', email: 'deepak.k@sanjeevanimed.com', mobile: '9811098110', companyId: 'com3', department: 'QA/QC', status: 'inactive', avatar: 'https://placehold.co/32x32.png', jobTitle: 'Maintenance head', seniority: 'Middle manager', contactNumberType: 'Personal' },
  { id: 'con4', name: 'Isha Singh', salutation: 'Ms.', firstName: 'Isha', lastName: 'Singh', email: 'isha.s@navacharlabs.com', mobile: '9890098900', companyId: 'com4', department: 'Operations', status: 'active', avatar: 'https://placehold.co/32x32.png', jobTitle: 'CEO', seniority: 'Director', contactNumberType: 'Professional' },
  { id: 'con5', name: 'Amit Desai', salutation: 'Mr.', firstName: 'Amit', lastName: 'Desai', email: 'amit.d@bharatpetro.com', mobile: '9821098210', companyId: 'com5', department: 'Engineering', status: 'active', avatar: 'https://placehold.co/32x32.png', jobTitle: 'Maintenance head', seniority: 'Middle manager', contactNumberType: 'Professional' },
  { id: 'con6', name: 'Neha Rao', salutation: 'Dr.', firstName: 'Neha', lastName: 'Rao', email: 'neha.r@jivabio.com', mobile: '9885098850', companyId: 'com6', department: 'R&D', status: 'inactive', avatar: 'https://placehold.co/32x32.png', jobTitle: 'Quality manager', seniority: 'Director', contactNumberType: 'Personal' },
];

export const leads: Lead[] = [
  { id: 'lead1', name: 'Sensor Calibration Service Inquiry', ownerId: 'user3', createdById: 'user2', companyName: 'Navachar Tech Labs', contactName: 'Isha Singh', value: 1500000, status: 'New', source: 'IndiaMart', createdDate: '2024-05-01', lineItems: [{ productId: 'prod1', quantity: 30, price: 49900, priceType: 'NABL' }], leadData: { industry: 'R&D', companySize: 75, pastPurchases: 0, websiteVisits: 5 } },
  { id: 'lead2', name: 'Pressure Gauge Batch Testing', ownerId: 'user4', createdById: 'user2', companyName: 'Bharat Petrochem', contactName: 'Amit Desai', value: 7500000, status: 'Qualified', source: 'Phone', createdDate: '2024-05-10', lineItems: [{ productId: 'prod1', quantity: 50, price: 49900, priceType: 'NABL' }, { productId: 'prod3', quantity: 20, price: 85000, priceType: 'Non-NABL' }], leadData: { industry: 'Oil & Gas', companySize: 2500, pastPurchases: 3, websiteVisits: 2, referredBy: 'Vimaan Aerospace' } },
  { id: 'lead3', name: 'Annual Pipette Calibration Contract', ownerId: 'user3', createdById: 'user1', companyName: 'Jiva Bio-Sciences', contactName: 'Neha Rao', value: 2500000, status: 'Contacted', source: 'Just Dial', createdDate: '2024-05-20', lineItems: [{ productId: 'prod4', quantity: 40, price: 60000, priceType: 'NABL' }], leadData: { industry: 'Biotechnology', companySize: 180, pastPurchases: 1, websiteVisits: 1 } },
  { id: 'lead4', name: 'Enquiry for Old System Upgrade', ownerId: 'user4', createdById: 'user1', companyName: 'Navachar Tech Labs', contactName: 'Isha Singh', value: 500000, status: 'Junk', source: 'Coldcall', createdDate: '2024-05-22', lineItems: [], leadData: { industry: 'R&D', companySize: 75, pastPurchases: 0, websiteVisits: 0, reason: 'Budget constraints' } },
];

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
  createdDate: string;
  closeDate: string;
  winProbability: number;
  source: typeof leadSources[number];
  lineItems: LineItem[];
  quotes: Quote[];
};

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
    lineItems: [{ productId: 'prod1', quantity: 100, price: 49900, priceType: 'NABL' }], 
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
    lineItems: [{ productId: 'prod2', quantity: 92, price: 129900, priceType: 'NABL' }], 
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
    value: 2315000, 
    createdDate: '2024-05-20',
    closeDate: '2024-06-15', 
    winProbability: 1,
    source: 'Just Dial',
    lineItems: [
        { productId: 'prod3', quantity: 26, price: 85000, priceType: 'Non-NABL' },
        { productId: 'prod21', quantity: 2, price: 10000, priceType: 'NABL' }
    ], 
    quotes: [
      { id: 'qt4', opportunityId: 'deal3', quoteNumber: 'QT-2024-004', date: '2024-06-01', expiryDate: '2024-07-01', preparedBy: 'Aryan Sharma', status: 'Accepted', poNumber: 'PO-ACPL-1138', poValue: 2230000, poDate: '2024-06-14', poDocumentName: 'PO-ACPL-1138.pdf', poStatus: 'Received', lineItems: [{ productId: 'prod3', quantity: 26, unitPrice: 85000, discount: { type: 'fixed', value: 10000 } }] }
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
    lineItems: [{ productId: 'prod5', quantity: 10, price: 250000, priceType: 'Non-NABL' }], 
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
    lineItems: [{ productId: 'prod1', quantity: 20, price: 49900, priceType: 'NABL' }], 
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
    value: 2315000,
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    effectiveDate: '2024-07-01',
    status: 'Active',
    type: 'Retainer',
    scopeOfWork: 'Annual calibration and verification for all torque wrenches, sound level meters and multimeters at the main facility. Includes two on-site visits and unlimited remote support.',
    documentName: 'Contract_Agreement_ACPL.pdf',
    lineItems: [
        { productId: 'prod3', quantity: 26, price: 85000, priceType: 'Non-NABL' },
        { productId: 'prod21', quantity: 2, price: 10000, priceType: 'NABL' },
        { productId: 'prod10', quantity: 15, price: 7500, priceType: 'NABL' },
    ],
    paymentCycle: 'Credit 45days',
    paymentMethod: 'Cheque',
    milestones: [
      { id: 'm1', name: 'Initial On-site Calibration', dueDate: '2024-07-15', status: 'Completed', invoiceStatus: 'Paid', amount: 1100000, assignedToId: 'user3', 
        invoices: [
          { 
            id: 'inv-1', invoiceNumber: 'INV-2024-001', date: '2024-07-16', amount: 1100000, status: 'Paid', raisedById: 'user2', 
            lineItems: [
              { productId: 'prod3', quantity: 13, unitPrice: 84615.38 }
            ] 
          }
        ], 
        productIds: ['prod3'] 
      },
      { id: 'm2', name: 'Mid-term Review & Report', dueDate: '2025-01-15', status: 'Pending', invoiceStatus: 'Not Invoiced', amount: 565000, assignedToId: 'user3', invoices: [], productIds: ['prod3', 'prod10'] },
      { id: 'm3', name: 'Final On-site Calibration', dueDate: '2025-06-15', status: 'Pending', invoiceStatus: 'Not Invoiced', amount: 565000, assignedToId: 'user3', invoices: [], productIds: ['prod21', 'prod10'] }
    ]
  }
];

export const products: Product[] = [
  { id: 'prod1', name: 'Pressure Sensor XL-100', category: 'Sensors', status: 'active', isNabl: true, location: 'Site & Lab', resolution: '0.01 bar', nablPrice: 49900 },
  { id: 'prod2', name: 'Precision Medical Scale MS-2', category: 'Scales', status: 'active', isNabl: true, location: 'Lab', resolution: '0.1 g', nablPrice: 129900 },
  { id: 'prod3', name: 'Digital Torque Wrench TW-30', category: 'Tools', status: 'inactive', isNabl: false, location: 'Site', resolution: '0.5 Nm', nonNablPrice: 85000 },
  { id: 'prod4', name: 'Automated Digital Pipette P-4A', category: 'Lab Equipment', status: 'active', isNabl: true, location: 'Lab', resolution: '0.01 µL', nablPrice: 60000 },
  { id: 'prod5', name: 'CalTrack Software Suite', category: 'Tools', status: 'active', isNabl: false, location: 'Site & Lab', resolution: 'N/A', nonNablPrice: 250000 },
  { id: 'prod6', name: 'On-site Industrial Scale Calibration', category: 'Weighing Machine Calibration Services', status: 'active', isNabl: true, location: 'Site', resolution: '1 kg', nablPrice: 15000, nonNablPrice: 12000 },
  { id: 'prod7', name: 'Retail Weighing Scale Certification', category: 'Weighing Machine Calibration Services', status: 'active', isNabl: false, location: 'Site', resolution: '5 g', nonNablPrice: 5000 },
  { id: 'prod8', name: 'E1 Class Weight Box Calibration', category: 'Weight Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '0.1 mg', nablPrice: 25000 },
  { id: 'prod9', name: 'F1 Class Weight Set Verification', category: 'Weight Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '1 mg', nablPrice: 18000 },
  { id: 'prod10', name: 'Multimeter & Clamp Meter Calibration', category: 'Electrical Instruments Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '0.01 V', nablPrice: 7500 },
  { id: 'prod11', name: 'High Voltage Probe Calibration', category: 'Electrical Instruments Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '1 V', nablPrice: 12000 },
  { id: 'prod12', name: 'Vernier Caliper & Micrometer Calibration', category: 'Dimensional Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '0.01 mm', nablPrice: 6000 },
  { id: 'prod13', name: 'Gauge Block Calibration (NABL)', category: 'Dimensional Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '0.001 mm', nablPrice: 20000 },
  { id: 'prod14', name: 'Digital Pressure Gauge Calibration', category: 'Pressure Gauge and Vacuum Gauges Calibration Services', status: 'active', isNabl: true, location: 'Site & Lab', resolution: '0.1 psi', nablPrice: 9000 },
  { id: 'prod15', name: 'Analog Vacuum Gauge Testing', category: 'Pressure Gauge and Vacuum Gauges Calibration Services', status: 'active', isNabl: false, location: 'Lab', resolution: '1 inHg', nonNablPrice: 7000 },
  { id: 'prod16', name: 'Medical Autoclave Temperature Mapping', category: 'Autoclave Calibration Services', status: 'active', isNabl: true, location: 'Site', resolution: '0.1 °C', nablPrice: 30000 },
  { id: 'prod17', name: 'Pharmaceutical Autoclave Validation', category: 'Autoclave Calibration Services', status: 'active', isNabl: true, location: 'Site', resolution: '0.05 °C', nablPrice: 45000 },
  { id: 'prod18', name: 'Liquid Flow Meter Calibration (On-site)', category: 'Flow Meter Calibration Services', status: 'active', isNabl: true, location: 'Site', resolution: '0.5 L/min', nablPrice: 50000 },
  { id: 'prod19', name: 'Gas Flow Meter Calibration (Lab)', category: 'Flow Meter Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '0.1 L/min', nablPrice: 65000 },
  { id: 'prod20', name: 'Digital Tachometer Calibration', category: 'Tachometer & Sound Level Meter Calibration Services', status: 'active', isNabl: true, location: 'Lab', resolution: '1 RPM', nablPrice: 8000 },
  { id: 'prod21', name: 'Sound Level Meter Accuracy Test', category: 'Tachometer & Sound Level Meter Calibration Services', status: 'active', isNabl: true, location: 'Site & Lab', resolution: '0.1 dB', nablPrice: 10000, nonNablPrice: 8000 },
  { id: 'prod22', name: 'Glass Thermometer', category: 'Electrical Instruments Calibration Services', status: 'active', nablRange: '-80 to 250 degree C', isNabl: true, location: 'Lab', resolution: '0.1 °C', nablPrice: 1500 },
  { id: 'prod23', name: 'Wet & Dry Thermometer', category: 'Electrical Instruments Calibration Services', status: 'active', nablRange: '-80 to1200 degree C', isNabl: true, location: 'Lab', resolution: '0.5 °C', nablPrice: 1500 },
  { id: 'prod24', name: 'Digital Indicator with sensor', category: 'Electrical Instruments Calibration Services', status: 'active', nablRange: '-80 to1200 degree C', isNabl: true, location: 'Site & Lab', resolution: '0.01 °C', nablPrice: 1500 },
];
