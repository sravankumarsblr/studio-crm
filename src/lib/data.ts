
export type Company = {
  id: string;
  name: string;
  industry: string;
  logo: string;
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
};

export type Deal = {
  id: string;
  name: string;
  companyName: string;
  contactName: string;
  stage: 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: number;
  closeDate: string;
};

export type Contract = {
  id:string;
  dealId: string;
  companyName: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Terminated';
  milestones: Milestone[];
}

export type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  poNumber: string;
  invoiceStatus: 'Not Invoiced' | 'Invoiced' | 'Paid';
}

export type Product = {
  id: string;
  name: string;
  category: string;
  lifecycleStage: 'Lead' | 'Deal' | 'Contract' | 'Inactive';
  associatedId: string; // leadId, dealId, or contractId
}

export const companies: Company[] = [
  { id: 'com1', name: 'Precision Instruments Inc.', industry: 'Manufacturing', logo: 'https://placehold.co/40x40.png' },
  { id: 'com2', name: 'AeroCal Labs', industry: 'Aerospace', logo: 'https://placehold.co/40x40.png' },
  { id: 'com3', name: 'MediTech Solutions', industry: 'Medical Devices', logo: 'https://placehold.co/40x40.png' },
  { id: 'com4', name: 'FutureGadget Labs', industry: 'R&D', logo: 'https://placehold.co/40x40.png' },
  { id: 'com5', name: 'Global Petro', industry: 'Oil & Gas', logo: 'https://placehold.co/40x40.png' },
  { id: 'com6', name: 'BioHealth Corp', industry: 'Biotechnology', logo: 'https://placehold.co/40x40.png' },
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
  { id: 'lead1', name: 'Sensor Calibration Service', companyName: 'FutureGadget Labs', contactName: 'Alex Ray', value: 15000, status: 'New', source: 'Web Form', createdDate: '2024-05-01', leadData: { industry: 'R&D', companySize: 50, pastPurchases: 0, websiteVisits: 5 } },
  { id: 'lead2', name: 'Pressure Gauge Batch Test', companyName: 'Global Petro', contactName: 'Maria Garcia', value: 75000, status: 'Qualified', source: 'Referral', createdDate: '2024-05-10', leadData: { industry: 'Oil & Gas', companySize: 1500, pastPurchases: 3, websiteVisits: 2, referredBy: 'AeroCal Labs' } },
  { id: 'lead3', name: 'Annual Pipette Calibration', companyName: 'BioHealth Corp', contactName: 'Sam Chen', value: 25000, status: 'Contacted', source: 'Trade Show', createdDate: '2024-05-20', leadData: { industry: 'Biotechnology', companySize: 200, pastPurchases: 1, websiteVisits: 1 } },
  { id: 'lead4', name: 'Legacy System Upgrade Inquiry', companyName: 'FutureGadget Labs', contactName: 'Alex Ray', value: 5000, status: 'Junk', source: 'Cold Call', createdDate: '2024-05-22', leadData: { industry: 'R&D', companySize: 50, pastPurchases: 0, websiteVisits: 0, reason: 'Out of budget' } },
];

export const deals: Deal[] = [
  { id: 'deal1', name: 'Q3 Pressure Sensor Contract', companyName: 'AeroCal Labs', contactName: 'Jane Smith', stage: 'Proposal', value: 50000, closeDate: '2024-08-30' },
  { id: 'deal2', name: 'Medical Scale Fleet Calibration', companyName: 'MediTech Solutions', contactName: 'Peter Jones', stage: 'Negotiation', value: 120000, closeDate: '2024-07-25' },
  { id: 'deal3', name: 'Torque Wrench Verification', companyName: 'Precision Instruments Inc.', contactName: 'John Doe', stage: 'Closed Won', value: 22000, closeDate: '2024-06-15' },
];

export const contracts: Contract[] = [
  { 
    id: 'cont1', 
    dealId: 'deal3', 
    companyName: 'Precision Instruments Inc.', 
    value: 22000, 
    startDate: '2024-07-01', 
    endDate: '2025-06-30', 
    status: 'Active',
    milestones: [
      { id: 'm1', name: 'Initial Setup', dueDate: '2024-07-15', status: 'Completed', poNumber: 'PO12345', invoiceStatus: 'Paid' },
      { id: 'm2', name: 'Mid-term Review', dueDate: '2025-01-15', status: 'Pending', poNumber: 'PO12345', invoiceStatus: 'Not Invoiced' }
    ]
  }
];

export const products: Product[] = [
  { id: 'prod1', name: 'Pressure Sensor X1', category: 'Sensors', lifecycleStage: 'Deal', associatedId: 'deal1' },
  { id: 'prod2', name: 'Medical Scale M2', category: 'Scales', lifecycleStage: 'Deal', associatedId: 'deal2' },
  { id: 'prod3', name: 'Torque Wrench T3', category: 'Tools', lifecycleStage: 'Contract', associatedId: 'cont1' },
  { id: 'prod4', name: 'Pipette P4', category: 'Lab Equipment', lifecycleStage: 'Lead', associatedId: 'lead3' },
];
