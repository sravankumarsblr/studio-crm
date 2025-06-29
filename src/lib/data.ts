
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


export const companies: Company[] = [
  { id: 'com1', name: 'Precision Instruments Inc.', industry: 'Manufacturing', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 250, website: 'https://precisioninstruments.com', address: '123 Innovation Dr, Tech Park, TX 75001', status: 'active' },
  { id: 'com2', name: 'AeroCal Labs', industry: 'Aerospace', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 500, website: 'https://aerocallabs.com', address: '456 Skyway Blvd, Flight City, CA 90210', status: 'active' },
  { id: 'com3', name: 'MediTech Solutions', industry: 'Medical Devices', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 120, website: 'https://meditechsolutions.com', address: '789 Health Ave, Bio Town, MA 02110', status: 'inactive' },
  { id: 'com4', name: 'FutureGadget Labs', industry: 'R&D', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 75, website: 'https://futuregadget.com', address: '101 Future St, Vision City, NY 10001', status: 'active' },
  { id: 'com5', name: 'Global Petro', industry: 'Oil & Gas', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 2500, website: 'https://globalpetro.com', address: '202 Drill Rd, Energy Hub, TX 77002', status: 'active' },
  { id: 'com6', name: 'BioHealth Corp', industry: 'Biotechnology', logo: 'https://placehold.co/40x40.png', numberOfEmployees: 180, website: 'https://biohealthcorp.com', address: '303 Gene St, Life Science, CA 94080', status: 'inactive' },
];

export const contacts: Contact[] = [
  { id: 'con1', name: 'John Doe', email: 'john.d@precision.com', phone: '123-456-7890', companyId: 'com1', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con2', name: 'Jane Smith', email: 'jane.s@aerocal.com', phone: '234-567-8901', companyId: 'com2', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con3', name: 'Peter Jones', email: 'peter.j@meditech.com', phone: '345-678-9012', companyId: 'com3', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con4', name: 'Alex Ray', email: 'alex.r@futuregadget.com', phone: '456-789-0123', companyId: 'com4', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con5', name: 'Maria Garcia', email: 'maria.g@globalpetro.com', phone: '567-890-1234', companyId: 'com5', avatar: 'https://placehold.co/32x32.png' },
  { id: 'con6', name: 'Sam Chen', email: 'sam.c@biohealth.com', phone: '678-901-2345', companyId: 'com6', avatar: 'https://placehold.co/32x32.png' },
];

export const leads: Lead[] = [
  { id: 'lead1', name: 'Sensor Calibration Service', companyName: 'FutureGadget Labs', contactName: 'Alex Ray', value: 15000, status: 'New', source: 'Web Form', createdDate: '2024-05-01', productIds: ['prod1'], leadData: { industry: 'R&D', companySize: 50, pastPurchases: 0, websiteVisits: 5 } },
  { id: 'lead2', name: 'Pressure Gauge Batch Test', companyName: 'Global Petro', contactName: 'Maria Garcia', value: 75000, status: 'Qualified', source: 'Referral', createdDate: '2024-05-10', productIds: ['prod1', 'prod3'], leadData: { industry: 'Oil & Gas', companySize: 1500, pastPurchases: 3, websiteVisits: 2, referredBy: 'AeroCal Labs' } },
  { id: 'lead3', name: 'Annual Pipette Calibration', companyName: 'BioHealth Corp', contactName: 'Sam Chen', value: 25000, status: 'Contacted', source: 'Trade Show', createdDate: '2024-05-20', productIds: ['prod4'], leadData: { industry: 'Biotechnology', companySize: 200, pastPurchases: 1, websiteVisits: 1 } },
  { id: 'lead4', name: 'Legacy System Upgrade Inquiry', companyName: 'FutureGadget Labs', contactName: 'Alex Ray', value: 5000, status: 'Junk', source: 'Cold Call', createdDate: '2024-05-22', productIds: [], leadData: { industry: 'R&D', companySize: 50, pastPurchases: 0, websiteVisits: 0, reason: 'Out of budget' } },
];

export const opportunities: Opportunity[] = [
  { 
    id: 'deal1', 
    name: 'Q3 Pressure Sensor Contract', 
    companyName: 'AeroCal Labs', 
    contactName: 'Jane Smith', 
    stage: 'Proposal', 
    value: 49900, 
    createdDate: '2024-06-01',
    closeDate: '2024-08-30', 
    winProbability: 0.5,
    lineItems: [{ productId: 'prod1', quantity: 100 }], 
    quotes: [
      { id: 'qt1', opportunityId: 'deal1', quoteNumber: 'QT-2024-001', date: '2024-06-10', expiryDate: '2024-07-10', preparedBy: 'Alex Green', value: 50000, status: 'Sent', documentName: 'AeroCal_Quote_v1.pdf' }
    ] 
  },
  { 
    id: 'deal2', 
    name: 'Medical Scale Fleet Calibration', 
    companyName: 'MediTech Solutions', 
    contactName: 'Peter Jones', 
    stage: 'Negotiation', 
    value: 119508, 
    createdDate: '2024-05-15',
    closeDate: '2024-07-25', 
    winProbability: 0.75,
    lineItems: [{ productId: 'prod2', quantity: 92 }], 
    quotes: [
       { id: 'qt2', opportunityId: 'deal2', quoteNumber: 'QT-2024-002', date: '2024-06-15', expiryDate: '2024-07-15', preparedBy: 'Alex Green', value: 125000, status: 'Sent' },
       { id: 'qt3', opportunityId: 'deal2', quoteNumber: 'QT-2024-003', date: '2024-06-20', expiryDate: '2024-07-20', preparedBy: 'Alex Green', value: 120000, status: 'Draft', discount: { type: 'fixed', value: 5000 } }
    ] 
  },
  { 
    id: 'deal3', 
    name: 'Torque Wrench Verification', 
    companyName: 'Precision Instruments Inc.', 
    contactName: 'John Doe', 
    stage: 'Closed Won', 
    value: 22100, 
    createdDate: '2024-05-20',
    closeDate: '2024-06-15', 
    winProbability: 1,
    lineItems: [{ productId: 'prod3', quantity: 26 }], 
    quotes: [
      { id: 'qt4', opportunityId: 'deal3', quoteNumber: 'QT-2024-004', date: '2024-06-01', expiryDate: '2024-07-01', preparedBy: 'Alex Green', value: 22000, status: 'Accepted', poNumber: 'PO-PINC-1138', poValue: 22000, poDate: '2024-06-14', poDocumentName: 'PO-PINC-1138.pdf' }
    ] 
  },
  { 
    id: 'deal4', 
    name: 'Software Suite License', 
    companyName: 'FutureGadget Labs', 
    contactName: 'Alex Ray', 
    stage: 'Qualification', 
    value: 25000, 
    createdDate: '2024-06-10', 
    closeDate: '2024-09-15', 
    winProbability: 0.2, 
    lineItems: [{ productId: 'prod5', quantity: 10 }], 
    quotes: [] 
  },
  { 
    id: 'deal5', 
    name: 'Sensor Batch Order', 
    companyName: 'Global Petro', 
    contactName: 'Maria Garcia', 
    stage: 'Closed Lost', 
    value: 9980, 
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
    contractTitle: 'Service Agreement with Precision Instruments Inc.',
    companyName: 'Precision Instruments Inc.',
    value: 22000,
    contractDate: '2024-07-01',
    expiryDate: '2025-06-30',
    status: 'Active',
    type: 'Retainer',
    scopeOfWork: 'Annual calibration and verification for all torque wrenches at the main facility. Includes two on-site visits and unlimited remote support.',
    milestones: [
      { id: 'm1', name: 'Initial On-site Calibration', dueDate: '2024-07-15', status: 'Completed', poNumber: 'PO-PINC-1138', invoiceStatus: 'Paid' },
      { id: 'm2', name: 'Mid-term Review & Report', dueDate: '2025-01-15', status: 'Pending', poNumber: 'PO-PINC-1138', invoiceStatus: 'Not Invoiced' },
      { id: 'm3', name: 'Final On-site Calibration', dueDate: '2025-06-15', status: 'Pending', poNumber: 'PO-PINC-1138', invoiceStatus: 'Not Invoiced' }
    ]
  }
];

export const products: Product[] = [
  { id: 'prod1', name: 'Pressure Sensor X1', category: 'Sensors', price: 499, status: 'active' },
  { id: 'prod2', name: 'Medical Scale M2', category: 'Scales', price: 1299, status: 'active' },
  { id: 'prod3', name: 'Torque Wrench T3', category: 'Tools', price: 850, status: 'inactive' },
  { id: 'prod4', name: 'Digital Pipette P4', category: 'Lab Equipment', price: 600, status: 'active' },
  { id: 'prod5', name: 'Calibration Software Suite', category: 'Software', price: 2500, status: 'active' },
];
