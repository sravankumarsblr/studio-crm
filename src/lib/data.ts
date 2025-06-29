
export type Role = {
  id: string;
  name: 'Admin' | 'Sales Manager' | 'Sales Rep';
  description: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role['name'];
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string;
  numberOfEmployees: number;
  website: string;
  address: string;
  status: 'active' | 'inactive';
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  avatar: string;
};

export type Lead = {
  id: string;
  name: string;
  ownerId: string;
  companyName: string;
  contactName: string;
  value: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Junk';
  source: string;
  createdDate: string;
  leadData: Record<string, any>;
  productIds: string[];
};

export type Quote = {
  id: string;
  quoteNumber: string;
  opportunityId: string;
  date: string;
  expiryDate: string;
  preparedBy: string;
  value: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  documentName?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  poNumber?: string;
  poValue?: number;
  poDate?: string;
  poDocumentName?: string;
};

export type LineItem = {
  productId: string;
  quantity: number;
};

export type Opportunity = {
  id: string;
  name: string;
  ownerId: string;
  companyName: string;
  contactName: string;
  stage: 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: number;
  closeDate: string;
  createdDate: string;
  winProbability: number;
  quotes: Quote[];
  lineItems: LineItem[];
};

export type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  poNumber: string;
  invoiceStatus: 'Not Invoiced' | 'Invoiced' | 'Paid';
}

export type Contract = {
  id: string;
  opportunityId: string;
  contractTitle: string;
  companyName: string;
  value: number;
  contractDate: string;
  expiryDate: string;
  status: 'Draft' | 'Active' | 'Expired' | 'Terminated' | 'Renewed';
  type: 'One-time' | 'Subscription' | 'Retainer' | 'SLA';
  scopeOfWork: string;
  milestones: Milestone[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
};

export const roles: Role[] = [
  { id: 'role1', name: 'Admin', description: 'Has access to all features, including the admin section.' },
  { id: 'role2', name: 'Sales Manager', description: 'Can view and manage all leads, opportunities, and contracts.' },
  { id: 'role3', name: 'Sales Rep', description: 'Can only access and manage their own assigned records.' },
];

export const users: User[] = [
  { id: 'user1', name: 'Aryan Sharma', email: 'aryan.sharma@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Admin' },
  { id: 'user2', name: 'Priya Singh', email: 'priya.singh@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Sales Manager' },
  { id: 'user3', name: 'Rohan Gupta', email: 'rohan.gupta@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Sales Rep' },
  { id: 'user4', name: 'Anjali Mehta', email: 'anjali.mehta@caltrack.com', avatar: 'https://placehold.co/32x32.png', role: 'Sales Rep' },
];

export const companies: Company[] = [
  { id: 'com1', name: 'Accurate Calibration Pvt. Ltd.', industry: 'Manufacturing', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 250, website: 'https://acpl.co.in', address: 'A-123, MIDC, Pune, Maharashtra 411026', status: 'active' },
  { id: 'com2', name: 'Vimaan Aerospace Solutions', industry: 'Aerospace', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 500, website: 'https://vimaanaero.com', address: 'Plot 45, KIADB, Bengaluru, Karnataka 560067', status: 'active' },
  { id: 'com3', name: 'Sanjeevani MedTech', industry: 'Medical Devices', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 120, website: 'https://sanjeevanimed.com', address: '789, Health City, Hyderabad, Telangana 500081', status: 'inactive' },
  { id: 'com4', name: 'Navachar Tech Labs', industry: 'R&D', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 75, website: 'https://navacharlabs.com', address: '101, GIDC, Ahmedabad, Gujarat 380015', status: 'active' },
  { id: 'com5', name: 'Bharat Petrochem', industry: 'Oil & Gas', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 2500, website: 'https://bharatpetro.com', address: '202, Energy Estate, Jamnagar, Gujarat 361001', status: 'active' },
  { id: 'com6', name: 'Jiva Bio-Sciences', industry: 'Biotechnology', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 180, website: 'https://jivabio.com', address: '303, Genome Valley, Hyderabad, Telangana 500078', status: 'inactive' },
];

export const contacts: Contact[] = [
  { id: 'con1', name: 'Vikram Patel', email: 'vikram.p@acpl.co.in', phone: '9820098200', companyId: 'com1', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con2', name: 'Sneha Reddy', email: 'sneha.r@vimaanaero.com', phone: '9848098480', companyId: 'com2', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con3', name: 'Deepak Kumar', email: 'deepak.k@sanjeevanimed.com', phone: '9811098110', companyId: 'com3', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con4', name: 'Isha Singh', email: 'isha.s@navacharlabs.com', phone: '9890098900', companyId: 'com4', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con5', name: 'Amit Desai', email: 'amit.d@bharatpetro.com', phone: '9821098210', companyId: 'com5', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con6', name: 'Neha Rao', email: 'neha.r@jivabio.com', phone: '9885098850', companyId: 'com6', avatar: 'https://placehold.co/32x32.png' },
];

export const leads: Lead[] = [
  { id: 'lead1', name: 'Sensor Calibration Service Inquiry', ownerId: 'user3', companyName: 'Navachar Tech Labs', contactName: 'Isha Singh', value: 1500000, status: 'New', source: 'Web Form', createdDate: '2024-05-01', productIds: ['prod1'], leadData: { industry: 'R&D', companySize: 75, pastPurchases: 0, websiteVisits: 5 } },
  { id: 'lead2', name: 'Pressure Gauge Batch Testing', ownerId: 'user4', companyName: 'Bharat Petrochem', contactName: 'Amit Desai', value: 7500000, status: 'Qualified', source: 'Referral', createdDate: '2024-05-10', productIds: ['prod1', 'prod3'], leadData: { industry: 'Oil & Gas', companySize: 2500, pastPurchases: 3, websiteVisits: 2, referredBy: 'Vimaan Aerospace' } },
  { id: 'lead3', name: 'Annual Pipette Calibration Contract', ownerId: 'user3', companyName: 'Jiva Bio-Sciences', contactName: 'Neha Rao', value: 2500000, status: 'Contacted', source: 'Trade Show', createdDate: '2024-05-20', productIds: ['prod4'], leadData: { industry: 'Biotechnology', companySize: 180, pastPurchases: 1, websiteVisits: 1 } },
  { id: 'lead4', name: 'Enquiry for Old System Upgrade', ownerId: 'user4', companyName: 'Navachar Tech Labs', contactName: 'Isha Singh', value: 500000, status: 'Junk', source: 'Cold Call', createdDate: '2024-05-22', productIds: [], leadData: { industry: 'R&D', companySize: 75, pastPurchases: 0, websiteVisits: 0, reason: 'Budget constraints' } },
];

export const opportunities: Opportunity[] = [
  { 
    id: 'deal1', 
    name: 'Q3 Pressure Sensor Contract', 
    ownerId: 'user3',
    companyName: 'Vimaan Aerospace Solutions', 
    contactName: 'Sneha Reddy', 
    stage: 'Proposal', 
    value: 4990000, 
    createdDate: '2024-06-01',
    closeDate: '2024-08-30', 
    winProbability: 0.5,
    lineItems: [{ productId: 'prod1', quantity: 100 }], 
    quotes: [
      { id: 'qt1', opportunityId: 'deal1', quoteNumber: 'QT-2024-001', date: '2024-06-10', expiryDate: '2024-07-10', preparedBy: 'Aryan Sharma', value: 5000000, status: 'Sent', documentName: 'Vimaan_Quote_v1.pdf' }
    ] 
  },
  { 
    id: 'deal2', 
    name: 'Medical Scale Fleet Calibration', 
    ownerId: 'user4',
    companyName: 'Sanjeevani MedTech', 
    contactName: 'Deepak Kumar', 
    stage: 'Negotiation', 
    value: 11950800, 
    createdDate: '2024-05-15',
    closeDate: '2024-07-25', 
    winProbability: 0.75,
    lineItems: [{ productId: 'prod2', quantity: 92 }], 
    quotes: [
       { id: 'qt2', opportunityId: 'deal2', quoteNumber: 'QT-2024-002', date: '2024-06-15', expiryDate: '2024-07-15', preparedBy: 'Aryan Sharma', value: 12500000, status: 'Sent' },
       { id: 'qt3', opportunityId: 'deal2', quoteNumber: 'QT-2024-003', date: '2024-06-20', expiryDate: '2024-07-20', preparedBy: 'Aryan Sharma', value: 12000000, status: 'Draft', discount: { type: 'fixed', value: 500000 } }
    ] 
  },
  { 
    id: 'deal3', 
    name: 'Torque Wrench Verification AMC', 
    ownerId: 'user3',
    companyName: 'Accurate Calibration Pvt. Ltd.', 
    contactName: 'Vikram Patel', 
    stage: 'Closed Won', 
    value: 2210000, 
    createdDate: '2024-05-20',
    closeDate: '2024-06-15', 
    winProbability: 1,
    lineItems: [{ productId: 'prod3', quantity: 26 }], 
    quotes: [
      { id: 'qt4', opportunityId: 'deal3', quoteNumber: 'QT-2024-004', date: '2024-06-01', expiryDate: '2024-07-01', preparedBy: 'Aryan Sharma', value: 2200000, status: 'Accepted', poNumber: 'PO-ACPL-1138', poValue: 2200000, poDate: '2024-06-14', poDocumentName: 'PO-ACPL-1138.pdf' }
    ] 
  },
  { 
    id: 'deal4', 
    name: 'Calibration Software Suite License', 
    ownerId: 'user3',
    companyName: 'Navachar Tech Labs', 
    contactName: 'Isha Singh', 
    stage: 'Qualification', 
    value: 2500000, 
    createdDate: '2024-06-10', 
    closeDate: '2024-09-15', 
    winProbability: 0.2, 
    lineItems: [{ productId: 'prod5', quantity: 10 }], 
    quotes: [] 
  },
  { 
    id: 'deal5', 
    name: 'Bulk Sensor Batch Order', 
    ownerId: 'user4',
    companyName: 'Bharat Petrochem', 
    contactName: 'Amit Desai', 
    stage: 'Closed Lost', 
    value: 998000, 
    createdDate: '2024-05-01', 
    closeDate: '2024-06-20', 
    winProbability: 0, 
    lineItems: [{ productId: 'prod1', quantity: 20 }], 
    quotes: [] 
  },
];

export const contracts: Contract[] = [
  {
    id: 'CT-2024-001',
    opportunityId: 'deal3',
    contractTitle: 'Service Agreement with Accurate Calibration Pvt. Ltd.',
    companyName: 'Accurate Calibration Pvt. Ltd.',
    value: 2200000,
    contractDate: '2024-07-01',
    expiryDate: '2025-06-30',
    status: 'Active',
    type: 'Retainer',
    scopeOfWork: 'Annual calibration and verification for all torque wrenches at the main facility. Includes two on-site visits and unlimited remote support.',
    milestones: [
      { id: 'm1', name: 'Initial On-site Calibration', dueDate: '2024-07-15', status: 'Completed', poNumber: 'PO-ACPL-1138', invoiceStatus: 'Paid' },
      { id: 'm2', name: 'Mid-term Review & Report', dueDate: '2025-01-15', status: 'Pending', poNumber: 'PO-ACPL-1138', invoiceStatus: 'Not Invoiced' },
      { id: 'm3', name: 'Final On-site Calibration', dueDate: '2025-06-15', status: 'Pending', poNumber: 'PO-ACPL-1138', invoiceStatus: 'Not Invoiced' }
    ]
  }
];

export const products: Product[] = [
  { id: 'prod1', name: 'Pressure Sensor XL-100', category: 'Sensors', price: 49900, status: 'active' },
  { id: 'prod2', name: 'Precision Medical Scale MS-2', category: 'Scales', price: 129900, status: 'active' },
  { id: 'prod3', name: 'Digital Torque Wrench TW-30', category: 'Tools', price: 85000, status: 'inactive' },
  { id: 'prod4', name: 'Automated Digital Pipette P-4A', category: 'Lab Equipment', price: 60000, status: 'active' },
  { id: 'prod5', name: 'CalTrack Software Suite', category: 'Software', price: 250000, status: 'active' },
];

    