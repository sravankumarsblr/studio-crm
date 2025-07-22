-- =============================================
-- ========== Lookup Tables ==================
-- =============================================

-- These tables store the values for dropdowns throughout the application.

CREATE TABLE lookup_departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_salutations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_lead_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_lead_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_opportunity_stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_opportunity_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_quote_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_po_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_contract_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_contract_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_milestone_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_invoice_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_product_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE lookup_price_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Profiling Lookup Tables
CREATE TABLE lookup_ownership_types ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_business_stages ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_accreditations ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_service_dependencies ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_product_service_portfolios ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_annual_spends ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_gst_statuses ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_decision_cycles ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_service_expectations ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_preferences ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_payment_cycles ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_payment_methods ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_usage_profiles ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_certificate_formats ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_audit_support_options ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_premium_service_options ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_relationship_lengths ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_engagement_levels ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_loyalty_advocacy_options ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_job_titles ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_contact_number_types ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_seniorities ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_educational_backgrounds ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_age_groups ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_genders ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_languages ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );
CREATE TABLE lookup_digital_openness_levels ( id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL );

-- =============================================
-- =========== Core Tables =====================
-- =============================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    role_id INT NOT NULL REFERENCES roles(id),
    department_id INT NOT NULL REFERENCES lookup_departments(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    industry VARCHAR(255),
    website TEXT,
    number_of_employees VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    gst_status_id INT REFERENCES lookup_gst_statuses(id),
    -- Firmographic
    ownership_type_id INT REFERENCES lookup_ownership_types(id),
    business_stage_id INT REFERENCES lookup_business_stages(id),
    service_dependency_id INT REFERENCES lookup_service_dependencies(id),
    product_service_portfolio_id INT REFERENCES lookup_product_service_portfolios(id),
    annual_spend_id INT REFERENCES lookup_annual_spends(id),
    -- Behavioral & Relational
    decision_cycle_id INT REFERENCES lookup_decision_cycles(id),
    service_expectations_id INT REFERENCES lookup_service_expectations(id),
    preferences_id INT REFERENCES lookup_preferences(id),
    payment_cycle_id INT REFERENCES lookup_payment_cycles(id),
    payment_method_id INT REFERENCES lookup_payment_methods(id),
    usage_profile_id INT REFERENCES lookup_usage_profiles(id),
    certificate_format_id INT REFERENCES lookup_certificate_formats(id),
    audit_support_id INT REFERENCES lookup_audit_support_options(id),
    willing_to_pay_premium_id INT REFERENCES lookup_premium_service_options(id),
    relationship_length_id INT REFERENCES lookup_relationship_lengths(id),
    engagement_level_id INT REFERENCES lookup_engagement_levels(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_accreditations (
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    accreditation_id INT NOT NULL REFERENCES lookup_accreditations(id) ON DELETE CASCADE,
    PRIMARY KEY (customer_id, accreditation_id)
);

CREATE TABLE customer_loyalty_advocacy (
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    loyalty_advocacy_id INT NOT NULL REFERENCES lookup_loyalty_advocacy_options(id) ON DELETE CASCADE,
    PRIMARY KEY (customer_id, loyalty_advocacy_id)
);


CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id),
    salutation_id INT REFERENCES lookup_salutations(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(50),
    department_id INT REFERENCES lookup_departments(id),
    status VARCHAR(50) DEFAULT 'active',
    avatar TEXT,
    -- Profiling
    job_title_id INT REFERENCES lookup_job_titles(id),
    contact_number_type_id INT REFERENCES lookup_contact_number_types(id),
    seniority_id INT REFERENCES lookup_seniorities(id),
    educational_background_id INT REFERENCES lookup_educational_backgrounds(id),
    age_group_id INT REFERENCES lookup_age_groups(id),
    gender_id INT REFERENCES lookup_genders(id),
    language_id INT REFERENCES lookup_languages(id),
    openness_to_digital_id INT REFERENCES lookup_digital_openness_levels(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL REFERENCES lookup_product_categories(id),
    status VARCHAR(50) DEFAULT 'active',
    is_nabl BOOLEAN DEFAULT FALSE,
    location_id INT REFERENCES lookup_product_locations(id),
    resolution VARCHAR(255),
    master_range VARCHAR(255),
    nabl_range VARCHAR(255),
    nabl_price DECIMAL(12, 2),
    non_nabl_range VARCHAR(255),
    non_nabl_price DECIMAL(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL REFERENCES users(id),
    created_by_id INT NOT NULL REFERENCES users(id),
    customer_id INT NOT NULL REFERENCES customers(id),
    primary_contact_id INT NOT NULL REFERENCES contacts(id),
    value DECIMAL(12, 2),
    status_id INT NOT NULL REFERENCES lookup_lead_statuses(id),
    source_id INT NOT NULL REFERENCES lookup_lead_sources(id),
    created_date DATE NOT NULL,
    lead_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lead_contacts (
    lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    PRIMARY KEY (lead_id, contact_id)
);

CREATE TABLE lead_line_items (
    id SERIAL PRIMARY KEY,
    lead_id INT NOT NULL REFERENCES leads(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price_type_id INT NOT NULL REFERENCES lookup_price_types(id),
    price DECIMAL(12, 2) NOT NULL
);

CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL REFERENCES users(id),
    created_by_id INT NOT NULL REFERENCES users(id),
    customer_id INT NOT NULL REFERENCES customers(id),
    primary_contact_id INT NOT NULL REFERENCES contacts(id),
    stage_id INT NOT NULL REFERENCES lookup_opportunity_stages(id),
    status_id INT NOT NULL REFERENCES lookup_opportunity_statuses(id),
    value DECIMAL(12, 2),
    created_date DATE NOT NULL,
    close_date DATE NOT NULL,
    win_probability DECIMAL(5, 2),
    source_id INT NOT NULL REFERENCES lookup_lead_sources(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunity_contacts (
    opportunity_id INT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    PRIMARY KEY (opportunity_id, contact_id)
);

CREATE TABLE opportunity_line_items (
    id SERIAL PRIMARY KEY,
    opportunity_id INT NOT NULL REFERENCES opportunities(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price_type_id INT NOT NULL REFERENCES lookup_price_types(id),
    price DECIMAL(12, 2) NOT NULL
);

CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    quote_number VARCHAR(255) UNIQUE NOT NULL,
    opportunity_id INT NOT NULL REFERENCES opportunities(id),
    date DATE NOT NULL,
    expiry_date DATE,
    prepared_by_id INT NOT NULL REFERENCES users(id),
    status_id INT NOT NULL REFERENCES lookup_quote_statuses(id),
    document_name TEXT,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    total_before_gst DECIMAL(12, 2) NOT NULL,
    gst_rate DECIMAL(5, 2) DEFAULT 18.00,
    show_gst BOOLEAN DEFAULT TRUE,
    po_number VARCHAR(255),
    po_value DECIMAL(12, 2),
    po_date DATE,
    po_document_name TEXT,
    po_status_id INT REFERENCES lookup_po_statuses(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quote_line_items (
    id SERIAL PRIMARY KEY,
    quote_id INT NOT NULL REFERENCES quotes(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    final_unit_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(255) UNIQUE NOT NULL,
    opportunity_id INT NOT NULL REFERENCES opportunities(id),
    owner_id INT NOT NULL REFERENCES users(id),
    created_by_id INT NOT NULL REFERENCES users(id),
    po_number VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    customer_id INT NOT NULL REFERENCES customers(id),
    value DECIMAL(12, 2) NOT NULL,
    start_date DATE,
    end_date DATE,
    effective_date DATE,
    status_id INT NOT NULL REFERENCES lookup_contract_statuses(id),
    type_id INT NOT NULL REFERENCES lookup_contract_types(id),
    scope_of_work TEXT,
    document_name TEXT,
    payment_cycle_id INT REFERENCES lookup_payment_cycles(id),
    payment_method_id INT REFERENCES lookup_payment_methods(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contract_line_items (
    id SERIAL PRIMARY KEY,
    contract_id INT NOT NULL REFERENCES contracts(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    price_type_id INT NOT NULL REFERENCES lookup_price_types(id),
    price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    contract_id INT NOT NULL REFERENCES contracts(id),
    name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    assigned_to_id INT NOT NULL REFERENCES users(id),
    amount DECIMAL(12, 2) NOT NULL,
    status_id INT NOT NULL REFERENCES lookup_milestone_statuses(id),
    invoice_status_id INT NOT NULL REFERENCES lookup_invoice_statuses(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE milestone_products (
    milestone_id INT NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (milestone_id, product_id)
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    milestone_id INT NOT NULL REFERENCES milestones(id),
    invoice_number VARCHAR(255) UNIQUE NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status_id INT NOT NULL REFERENCES lookup_invoice_statuses(id),
    document_name TEXT,
    raised_by_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_line_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL REFERENCES invoices(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    customer_id INT REFERENCES customers(id),
    lead_id INT REFERENCES leads(id),
    opportunity_id INT REFERENCES opportunities(id),
    contract_id INT REFERENCES contracts(id),
    activity_type VARCHAR(50) NOT NULL, -- e.g., 'call', 'email', 'note', 'status_change'
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- =========== Insert Data into Lookup Tables ==
-- =============================================

INSERT INTO lookup_departments (name) VALUES
('Sales'), ('Marketing'), ('Technical Support'), ('Management'), ('Operations'), ('Procurement'), ('R&D'), ('QA/QC'), ('Engineering');

INSERT INTO lookup_salutations (name) VALUES
('Mr.'), ('Ms.'), ('Mrs.'), ('Dr.');

INSERT INTO lookup_lead_sources (name) VALUES
('Phone'), ('Email'), ('Just Dial'), ('IndiaMart'), ('Coldcall');

INSERT INTO lookup_lead_statuses (name) VALUES
('New'), ('Contacted'), ('Qualified'), ('Lost'), ('Junk');

INSERT INTO lookup_opportunity_stages (name) VALUES
('Qualification'), ('Proposal'), ('Negotiation');

INSERT INTO lookup_opportunity_statuses (name) VALUES
('New'), ('In Progress'), ('Won'), ('Lost');

INSERT INTO lookup_quote_statuses (name) VALUES
('Draft'), ('Sent'), ('Accepted'), ('Rejected');

INSERT INTO lookup_po_statuses (name) VALUES
('Received'), ('Acceptance Mail'), ('On Phone');

INSERT INTO lookup_contract_types (name) VALUES
('One-time'), ('Subscription'), ('Retainer'), ('SLA');

INSERT INTO lookup_contract_statuses (name) VALUES
('Draft'), ('Active'), ('Expired'), ('Terminated'), ('Renewed');

INSERT INTO lookup_milestone_statuses (name) VALUES
('Pending'), ('In Progress'), ('Completed');

INSERT INTO lookup_invoice_statuses (name) VALUES
('Not Invoiced'), ('Partially Invoiced'), ('Invoiced'), ('Paid'), ('Overdue');

INSERT INTO lookup_product_categories (name) VALUES
('Sensors'), ('Scales'), ('Tools'), ('Lab Equipment'), ('Weighing Machine Calibration Services'), ('Weight Calibration Services'), ('Electrical Instruments Calibration Services'), ('Dimensional Calibration Services'), ('Pressure Gauge and Vacuum Gauges Calibration Services'), ('Autoclave Calibration Services'), ('Flow Meter Calibration Services'), ('Tachometer & Sound Level Meter Calibration Services');

INSERT INTO lookup_product_locations (name) VALUES
('Lab'), ('Site'), ('Site & Lab');

INSERT INTO lookup_price_types (name) VALUES
('N/A'), ('NABL'), ('Non-NABL'), ('Third Party NABL'), ('Third Party Non-NABL');

-- Profiling Lookups
INSERT INTO lookup_ownership_types (name) VALUES ('Private'), ('Public'), ('Government'), ('Multinational'), ('SME'), ('Startup');
INSERT INTO lookup_business_stages (name) VALUES ('Startup'), ('Growth'), ('Mature');
INSERT INTO lookup_accreditations (name) VALUES ('ISO 9001'), ('ISO 17025'), ('GMP');
INSERT INTO lookup_service_dependencies (name) VALUES ('One-time'), ('Annual contract (AMC)'), ('Multi-year'), ('On Demand'), ('Turnkey');
INSERT INTO lookup_product_service_portfolios (name) VALUES ('Manufacturing'), ('Trading'), ('R&D'), ('Service provider');
INSERT INTO lookup_annual_spends (name) VALUES ('High'), ('Medium'), ('Low value clients');
INSERT INTO lookup_gst_statuses (name) VALUES ('GST'), ('Non-GST');
INSERT INTO lookup_decision_cycles (name) VALUES ('Quick'), ('Long approval process');
INSERT INTO lookup_service_expectations (name) VALUES ('Speed'), ('Price sensitivity'), ('Technical depth');
INSERT INTO lookup_preferences (name) VALUES ('Onsite'), ('At lab');
INSERT INTO lookup_payment_cycles (name) VALUES ('Immediate'), ('Advance payment'), ('Credit 30days'), ('Credit 45days'), ('Credit 60days'), ('Cash');
INSERT INTO lookup_payment_methods (name) VALUES ('Cheque'), ('NEFT'), ('Online portal');
INSERT INTO lookup_usage_profiles (name) VALUES ('Regular calibration users'), ('Occasional users');
INSERT INTO lookup_certificate_formats (name) VALUES ('High'), ('Medium'), ('Low value clients');
INSERT INTO lookup_audit_support_options (name) VALUES ('Continuous'), ('One time'), ('Not Needed');
INSERT INTO lookup_premium_service_options (name) VALUES ('Yes'), ('No');
INSERT INTO lookup_relationship_lengths (name) VALUES ('New'), ('Long Term Client >10 years'), ('Trusted Client>2 years');
INSERT INTO lookup_engagement_levels (name) VALUES ('Continuous'), ('Calls'), ('Mails');
INSERT INTO lookup_loyalty_advocacy_options (name) VALUES ('References'), ('Testimonials');
INSERT INTO lookup_job_titles (name) VALUES ('Quality manager'), ('Maintenance head'), ('Purchase manager'), ('Owner'), ('CEO');
INSERT INTO lookup_contact_number_types (name) VALUES ('Personal'), ('Professional');
INSERT INTO lookup_seniorities (name) VALUES ('Executive'), ('Middle manager'), ('Director'), ('Owner');
INSERT INTO lookup_educational_backgrounds (name) VALUES ('Engineering'), ('Science'), ('Commerce'), ('Finance'), ('Others');
INSERT INTO lookup_age_groups (name) VALUES ('Younger managers'), ('Senior decision-makers');
INSERT INTO lookup_genders (name) VALUES ('Female'), ('Male');
INSERT INTO lookup_languages (name) VALUES ('Telugu'), ('Hindi'), ('English');
INSERT INTO lookup_digital_openness_levels (name) VALUES ('Manageable'), ('Open'), ('No Knowledge');
