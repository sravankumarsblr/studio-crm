
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

export const companyIndustries = ['Pharma', 'Food Processing', 'Hotels', 'Engineering', 'Power', 'R&D labs', 'Defence', 'Aerospace', 'Hospitals', 'Manufacturing', 'Biotechnology', 'Medical Devices', 'Oil & Gas', 'Technology', 'Finance', 'Automotive', 'Retail', 'Construction'];
export const companySizes = ['Small (< ₹10 Cr)', 'Medium (₹10–100 Cr)', 'Large (> ₹100 Cr)'];
export const employeeCounts = ['<50', '50-200', '200+'];
export const ownershipTypes = ['Private', 'Public', 'Government', 'Multinational', 'SME', 'Startup'];
export const businessStages = ['Startup', 'Growth', 'Mature'];
export const serviceDependencies = ['One-time', 'Annual contract (AMC)', 'Multi-year', 'On Demand', 'Turnkey'];
export const productPortfolios = ['Manufacturing', 'Trading', 'R&D', 'Service provider'];
export const annualSpends = ['High', 'Medium', 'Low value clients'];
export const decisionCycles = ['Quick', 'Long approval process'];
export const serviceExpectations = ['Speed', 'Price sensitivity', 'Technical depth'];
export const locationPreferences = ['Onsite', 'At lab', 'Both'];
export const paymentCycles = ['Immediate', 'Advance payment', 'Credit 30days', 'Credit 45days', 'Credit 60days'];
export const paymentMethods = ['Cheque', 'NEFT', 'Online portal'];
export const complaintFrequencies = ['Regular calibration users', 'Occasional users'];
export const certificateFormats = ['High', 'Medium', 'Low value clients'];
export const auditSupportOptions = ['Continuous', 'One time', 'Not Needed'];
export const willingnessToPayOptions = ['Yes', 'No'];
export const relationshipLengths = ['New', 'Long Term Client >10 years', 'Trusted Client>2 years'];
export const engagementLevels = ['Continuous', 'Calls', 'Mails'];
export const loyaltyOptions = ['References', 'Testimonials'];

export const firmographicSchema = z.object({
  name: z.string().min(1, "Company name is required."),
  industry: z.string().min(1, "Industry is required."),
  website: z.string().url("Please enter a valid URL.").or(z.literal("")),
  address: z.string().min(1, "Address is required."),
  companySize: z.enum(companySizes).optional(),
  numberOfEmployees: z.enum(employeeCounts).optional(),
  location: z.string().min(1, "Location is required."),
  ownershipType: z.enum(ownershipTypes).optional(),
  stageOfBusiness: z.enum(businessStages).optional(),
  accreditations: z.string().optional(),
  serviceDependency: z.enum(serviceDependencies).optional(),
  productPortfolio: z.enum(productPortfolios).optional(),
  annualSpend: z.enum(annualSpends).optional(),
  decisionCycle: z.enum(decisionCycles).optional(),
  serviceExpectations: z.enum(serviceExpectations).optional(),
  preferences: z.enum(locationPreferences).optional(),
  paymentCycle: z.enum(paymentCycles).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  complaints: z.enum(complaintFrequencies).optional(),
  certificateFormat: z.enum(certificateFormats).optional(),
  auditSupport: z.enum(auditSupportOptions).optional(),
  willingnessToPay: z.enum(willingnessToPayOptions).optional(),
  lengthOfRelationship: z.enum(relationshipLengths).optional(),
  levelOfEngagement: z.enum(engagementLevels).optional(),
  loyalty: z.enum(loyaltyOptions).optional(),
});


export type Company = z.infer<typeof firmographicSchema> & {
  id:string;
  logo: string;
  status: 'active' | 'inactive';
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
  { id: 'com1', name: 'Accurate Calibration Pvt. Ltd.', industry: 'Engineering', logo: 'https://placehold.co/40x40.png', website: 'https://acpl.co.in', address: 'A-123, MIDC, Pune, Maharashtra 411026', status: 'active', companySize: 'Medium (₹10–100 Cr)', numberOfEmployees: '200+', location: 'Pune, Maharashtra', ownershipType: 'Private', stageOfBusiness: 'Mature', accreditations: 'ISO 9001, ISO 17025', serviceDependency: 'Annual contract (AMC)', productPortfolio: 'Service provider', annualSpend: 'Medium', decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'Both', paymentCycle: 'Credit 45days', paymentMethod: 'Cheque', complaints: 'Occasional users', certificateFormat: 'Medium', auditSupport: 'Continuous', willingnessToPay: 'Yes', lengthOfRelationship: 'Long Term Client >10 years', levelOfEngagement: 'Continuous', loyalty: 'References' },
  { id: 'com2', name: 'Vimaan Aerospace Solutions', industry: 'Aerospace', logo: 'https://placehold.co/40x40.png', website: 'https://vimaanaero.com', address: 'Plot 45, KIADB, Bengaluru, Karnataka 560067', status: 'active', companySize: 'Large (> ₹100 Cr)', numberOfEmployees: '200+', location: 'Bengaluru, Karnataka', ownershipType: 'Public', stageOfBusiness: 'Mature', accreditations: 'AS9100, ISO 17025', serviceDependency: 'Multi-year', productPortfolio: 'Manufacturing', annualSpend: 'High', decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'Onsite', paymentCycle: 'Credit 60days', paymentMethod: 'NEFT', complaints: 'Regular calibration users', certificateFormat: 'High', auditSupport: 'Continuous', willingnessToPay: 'Yes', lengthOfRelationship: 'Trusted Client>2 years', levelOfEngagement: 'Mails', loyalty: 'Testimonials' },
  { id: 'com3', name: 'Sanjeevani MedTech', industry: 'Medical Devices', logo: 'https://placehold.co/40x40.png', website: 'https://sanjeevanimed.com', address: '789, Health City, Hyderabad, Telangana 500081', status: 'inactive', companySize: 'Medium (₹10–100 Cr)', numberOfEmployees: '50-200', location: 'Hyderabad, Telangana', ownershipType: 'Startup', stageOfBusiness: 'Growth', accreditations: 'ISO 13485', serviceDependency: 'On Demand', productPortfolio: 'R&D', annualSpend: 'Medium', decisionCycle: 'Quick', serviceExpectations: 'Speed', preferences: 'At lab', paymentCycle: 'Credit 30days', paymentMethod: 'Online portal', complaints: 'Occasional users', certificateFormat: 'Medium', auditSupport: 'One time', willingnessToPay: 'No', lengthOfRelationship: 'New', levelOfEngagement: 'Calls', loyalty: 'References' },
  { id: 'com4', name: 'Navachar Tech Labs', industry: 'R&D labs', logo: 'https://placehold.co/40x40.png', website: 'https://navacharlabs.com', address: '101, GIDC, Ahmedabad, Gujarat 380015', status: 'active', companySize: 'Small (< ₹10 Cr)', numberOfEmployees: '50-200', location: 'Ahmedabad, Gujarat', ownershipType: 'SME', stageOfBusiness: 'Growth', accreditations: 'ISO 17025', serviceDependency: 'On Demand', productPortfolio: 'R&D', annualSpend: 'Low value clients', decisionCycle: 'Quick', serviceExpectations: 'Price sensitivity', preferences: 'At lab', paymentCycle: 'Advance payment', paymentMethod: 'NEFT', complaints: 'Regular calibration users', certificateFormat: 'Low', auditSupport: 'Not Needed', willingnessToPay: 'No', lengthOfRelationship: 'New', levelOfEngagement: 'Mails', loyalty: 'Testimonials' },
  { id: 'com5', name: 'Bharat Petrochem', industry: 'Power', logo: 'https://placehold.co/40x40.png', website: 'https://bharatpetro.com', address: '202, Energy Estate, Jamnagar, Gujarat 361001', status: 'active', companySize: 'Large (> ₹100 Cr)', numberOfEmployees: '200+', location: 'Jamnagar, Gujarat', ownershipType: 'Government', stageOfBusiness: 'Mature', accreditations: 'ISO 9001, OHSAS 18001', serviceDependency: 'Annual contract (AMC)', productPortfolio: 'Manufacturing', annualSpend: 'High', decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'Onsite', paymentCycle: 'Credit 60days', paymentMethod: 'Cheque', complaints: 'Regular calibration users', certificateFormat: 'High', auditSupport: 'Continuous', willingnessToPay: 'Yes', lengthOfRelationship: 'Long Term Client >10 years', levelOfEngagement: 'Continuous', loyalty: 'References' },
  { id: 'com6', name: 'Jiva Bio-Sciences', industry: 'Pharma', logo: 'https://placehold.co/40x40.png', website: 'https://jivabio.com', address: '303, Genome Valley, Hyderabad, Telangana 500078', status: 'inactive', companySize: 'Medium (₹10–100 Cr)', numberOfEmployees: '50-200', location: 'Hyderabad, Telangana', ownershipType: 'Private', stageOfBusiness: 'Mature', accreditations: 'GMP, ISO 17025', serviceDependency: 'Turnkey', productPortfolio: 'R&D', annualSpend: 'High', decisionCycle: 'Long approval process', serviceExpectations: 'Technical depth', preferences: 'Both', paymentCycle: 'Credit 45days', paymentMethod: 'Online portal', complaints: 'Occasional users', certificateFormat: 'Medium', auditSupport: 'One time', willingnessToPay: 'Yes', lengthOfRelationship: 'Trusted Client>2 years', levelOfEngagement: 'Mails', loyalty: 'Testimonials' },
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
