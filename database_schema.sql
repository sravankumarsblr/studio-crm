-- CalTrack CRM Database Schema
-- This script defines the tables and relationships for the entire CRM application.

-- Use an appropriate database engine, e.g., PostgreSQL or MySQL.
-- This script uses general SQL syntax that should be compatible with most systems,
-- but minor adjustments might be needed (e.g., for auto-incrementing primary keys).

-- ----------------------------
-- Admin & User Management
-- ----------------------------

CREATE TABLE roles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar TEXT,
    role_id VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ----------------------------
-- Core CRM Entities
-- ----------------------------

CREATE TABLE companies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    industry VARCHAR(255),
    website VARCHAR(255),
    number_of_employees VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active' or 'inactive'
    gst_status VARCHAR(50), -- 'GST', 'Non-GST'
    
    -- Firmographic Profiling
    ownership_type VARCHAR(100),
    business_stage VARCHAR(100),
    service_dependency VARCHAR(100),
    product_service_portfolio VARCHAR(100),
    annual_spend VARCHAR(100),
    
    -- Behavioral & Relational Profiling
    decision_cycle VARCHAR(100),
    service_expectations VARCHAR(100),
    preferences VARCHAR(100),
    payment_cycle VARCHAR(100),
    payment_method VARCHAR(100),
    usage_profile VARCHAR(100),
    certificate_format VARCHAR(100),
    audit_support VARCHAR(100),
    willing_to_pay_premium VARCHAR(50),
    relationship_length VARCHAR(100),
    engagement_level VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_accreditations (
    company_id VARCHAR(255) NOT NULL,
    accreditation VARCHAR(255) NOT NULL,
    PRIMARY KEY (company_id, accreditation),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE company_loyalty (
    company_id VARCHAR(255) NOT NULL,
    loyalty_indicator VARCHAR(255) NOT NULL,
    PRIMARY KEY (company_id, loyalty_indicator),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE contacts (
    id VARCHAR(255) PRIMARY KEY,
    company_id VARCHAR(255) NOT NULL,
    salutation VARCHAR(10),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(50),
    department VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- 'active' or 'inactive'
    avatar TEXT,
    
    -- Contact Profiling
    job_title VARCHAR(100),
    contact_number_type VARCHAR(50),
    seniority VARCHAR(100),
    educational_background VARCHAR(100),
    age_group VARCHAR(100),
    gender VARCHAR(50),
    language VARCHAR(100),
    openness_to_digital VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- ----------------------------
-- Products & Services
-- ----------------------------

CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    is_nabl BOOLEAN DEFAULT FALSE,
    location VARCHAR(100),
    resolution VARCHAR(255),
    nabl_range VARCHAR(255),
    non_nabl_range VARCHAR(255),
    master_range VARCHAR(255),
    nabl_price DECIMAL(15, 2),
    non_nabl_price DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Sales Pipeline
-- ----------------------------

CREATE TABLE leads (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    created_by_id VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    primary_contact_id VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2),
    status VARCHAR(50), -- 'New', 'Contacted', 'Qualified', 'Lost', 'Junk'
    source VARCHAR(100),
    created_date DATE NOT NULL,
    lead_data JSON, -- For storing miscellaneous AI scoring data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (primary_contact_id) REFERENCES contacts(id)
);

CREATE TABLE lead_line_items (
    lead_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price_type VARCHAR(50),
    price DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (lead_id, product_id),
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE opportunities (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    created_by_id VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    primary_contact_id VARCHAR(255) NOT NULL,
    stage VARCHAR(50), -- 'Qualification', 'Proposal', 'Negotiation'
    status VARCHAR(50), -- 'New', 'In Progress', 'Won', 'Lost'
    value DECIMAL(15, 2) NOT NULL,
    created_date DATE NOT NULL,
    close_date DATE NOT NULL,
    win_probability DECIMAL(5, 2),
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (primary_contact_id) REFERENCES contacts(id)
);

CREATE TABLE opportunity_line_items (
    opportunity_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price_type VARCHAR(50),
    price DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (opportunity_id, product_id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ----------------------------
-- Quotes, Contracts & Invoices
-- ----------------------------

CREATE TABLE quotes (
    id VARCHAR(255) PRIMARY KEY,
    quote_number VARCHAR(255) NOT NULL UNIQUE,
    opportunity_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    expiry_date DATE,
    prepared_by_id VARCHAR(255) NOT NULL,
    status VARCHAR(50), -- 'Draft', 'Sent', 'Accepted', 'Rejected'
    document_name TEXT,
    subtotal DECIMAL(15, 2) NOT NULL,
    discount DECIMAL(15, 2) DEFAULT 0,
    gst_rate DECIMAL(5, 2) DEFAULT 18.00,
    show_gst BOOLEAN DEFAULT TRUE,
    po_number VARCHAR(255),
    po_value DECIMAL(15, 2),
    po_date DATE,
    po_document_name TEXT,
    po_status VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
    FOREIGN KEY (prepared_by_id) REFERENCES users(id)
);

CREATE TABLE quote_line_items (
    quote_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    final_unit_price DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (quote_id, product_id),
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE contracts (
    id VARCHAR(255) PRIMARY KEY,
    opportunity_id VARCHAR(255) NOT NULL,
    owner_id VARCHAR(255) NOT NULL,
    created_by_id VARCHAR(255) NOT NULL,
    po_number VARCHAR(255),
    contract_title VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    status VARCHAR(50), -- 'Draft', 'Active', 'Expired', 'Terminated', 'Renewed'
    type VARCHAR(50), -- 'One-time', 'Subscription', 'Retainer', 'SLA'
    scope_of_work TEXT,
    document_name TEXT,
    payment_cycle VARCHAR(100),
    payment_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE contract_line_items (
    contract_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price_type VARCHAR(50),
    price DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (contract_id, product_id),
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE milestones (
    id VARCHAR(255) PRIMARY KEY,
    contract_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    assigned_to_id VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50), -- 'Pending', 'In Progress', 'Completed'
    invoice_status VARCHAR(50), -- 'Not Invoiced', 'Partially Invoiced', 'Invoiced', 'Paid'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_id) REFERENCES users(id)
);

CREATE TABLE milestone_products (
    milestone_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (milestone_id, product_id),
    FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE invoices (
    id VARCHAR(255) PRIMARY KEY,
    milestone_id VARCHAR(255) NOT NULL,
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50), -- 'Invoiced', 'Paid', 'Overdue'
    document_name TEXT,
    raised_by_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES milestones(id),
    FOREIGN KEY (raised_by_id) REFERENCES users(id)
);

CREATE TABLE invoice_line_items (
    invoice_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (invoice_id, product_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
