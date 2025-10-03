# Project Specification: QuickBill Flow

**Version:** 1.0
**Date:** 2024-10-27
**Author:** Jules, AI Software Architect

---

## 1. Introduction & Vision

### 1.1. Project Overview
QuickBill Flow is a global SaaS application designed to streamline and automate the entire client billing workflow for freelancers, consultants, and small businesses. It bridges the gap between overly complex accounting suites and simplistic invoice generators by providing an efficient, workflow-centric platform that enhances professionalism and reduces administrative overhead.

### 1.2. Vision Statement
To become the definitive tool for service-based professionals globally, empowering them to manage their billing with speed, confidence, and brand consistency. We envision a future where the friction of client billing is eliminated, allowing our users to focus on their craft and grow their business.

## 2. Target Audience & Market Opportunity

### 2.1. Primary User Personas
*   **The Freelance Creative:** (e.g., Graphic Designer, Writer) - Juggles multiple projects for various clients. Needs a fast way to bill for project-based work and maintain a professional image. Values brand customization.
*   **The Small Business Owner:** (e.g., Boutique Marketing Agency, Small Contractor) - Manages a small team and a growing client list. Requires an efficient system for bulk billing and a central hub to track client history.
*   **The Independent Consultant:** (e.g., IT Consultant, Business Coach) - Bills for time and expertise, often with recurring retainers or projects for the same clients. Needs a quick way to duplicate and send invoices with minimal changes.

### 2.2. Problem Statement
The manual creation, tracking, and management of client briefs and invoices is a universal pain point. Existing solutions are often misaligned with the needs of our target audience:
*   **Full Accounting Suites (e.g., QuickBooks, Xero):** Too complex, expensive, and feature-heavy for users who primarily need billing, not full-scale accounting.
*   **Basic Invoice Generators (e.g., Invoice-Generator.com):** Too simplistic, lacking workflow automation, client management, and professional customization. They often fail to store client history effectively.

### 2.3. Market Opportunity
QuickBill Flow targets a significant and underserved segment of the market that desires a "just right" solution. By focusing on a highly efficient workflow—from job creation to client approval to final invoicing—we can capture users who feel overwhelmed by complexity or limited by simplicity. The emphasis on professional presentation (templates) and security (access control) will be key differentiators.

## 3. System Architecture & Technology Stack (Proposed)

### 3.1. Architecture Overview
A modern, decoupled web application architecture will be employed, consisting of a single-page application (SPA) frontend and a robust backend API. This ensures scalability, maintainability, and a responsive user experience.

![Architecture Diagram](https://i.imgur.com/8Q5YvYm.png)

### 3.2. Technology Stack
*   **Frontend:**
    *   **Framework:** React or Vue.js (Next.js or Nuxt.js for SSR/SSG benefits).
    *   **Styling:** Tailwind CSS for rapid, utility-first UI development.
    *   **State Management:** Redux Toolkit or Pinia.
*   **Backend:**
    *   **Framework:** Node.js with Express.js or NestJS (for a more structured, scalable API). Alternatively, a Go-based API for high performance.
    *   **Language:** TypeScript.
*   **Database:**
    *   **Primary:** PostgreSQL - A robust, relational database ideal for structured financial data.
    *   **Caching:** Redis for session management and caching frequently accessed data (e.g., user profiles, templates).
*   **Authentication:**
    *   JWT (JSON Web Tokens) for stateless API authentication.
*   **Key Third-Party Services & Integrations:**
    *   **Email Service:** SendGrid or Amazon SES for transactional emails (brief approvals, password delivery, invoice sending).
    *   **PDF Generation:** A reliable library like `Puppeteer` (headless Chrome) on the backend to convert HTML/CSS templates into high-fidelity PDFs.
    *   **Cloud Storage:** Amazon S3 or Google Cloud Storage for storing user-uploaded assets (logos) and generated invoice PDFs.
    *   **Hosting:** Vercel (for Frontend), AWS (ECS/EKS) or Heroku (for Backend).

## 4. Core Features & Functional Requirements (V1.0)

### 4.1. User & Profile Management
*   **User Story:** As a new user, I want to sign up and create a profile with my company details, logo, and default financial settings so that my invoices are professional and accurate.
*   **Acceptance Criteria:**
    *   User can sign up via email and password.
    *   User can log in and log out securely.
    *   Profile setup includes: Company Name, Address, Contact Info, Logo Upload.
    *   Global settings include: Home Currency (dropdown of all world currencies), Default Tax (e.g., "VAT", "GST") and a percentage value.

### 4.2. Client Hub & Management (CRM-Lite)
*   **User Story:** As a user, I want a central place to view and manage all my clients, so I can easily track their history and initiate new work.
*   **Acceptance Criteria:**
    *   A "Clients" section in the main navigation.
    *   A list view of all clients, searchable by name.
    *   Ability to add, edit, and delete clients (Client Name, Contact Email, Address).
    *   Clicking a client opens a detail page.
    *   The client detail page shows their information and a chronological, searchable list of all associated briefs and invoices.

### 4.3. Core Workflow: Billing Cycle
#### 4.3.1. Start a Billing Cycle
*   **User Story:** As a user, I want to start a new billing cycle from my dashboard by either uploading a CSV or duplicating a past job, so I can choose the most efficient method for my task.
*   **Acceptance Criteria:**
    *   Dashboard displays two primary actions: "Bill from CSV" and "Go to Client Hub".
    *   "Go to Client Hub" allows the user to navigate to a client and use the duplication feature.

#### 4.3.2. CSV Processing Engine
*   **User Story:** As a user with bulk work, I want to upload a CSV file with job details, so the system can automatically create multiple draft briefs.
*   **Acceptance Criteria:**
    *   The system provides a downloadable CSV template with required headers (e.g., `client_name`, `item_description`, `quantity`, `unit_price`).
    *   Smart parsing handles common delimiters (comma, semicolon).
    *   Clear, user-friendly error messages are displayed for missing columns, invalid data types, or unmatched client names.
    *   Successful upload generates one or more `Draft` briefs in the system.

#### 4.3.3. Brief & Invoice Duplication
*   **User Story:** As a user working with a returning client, I want to duplicate a previous brief or invoice, so I can quickly create a new one with minimal data entry.
*   **Acceptance Criteria:**
    *   On the client detail page, each past brief/invoice has a "Duplicate" button.
    *   Clicking "Duplicate" creates a new `Draft` brief with all details copied from the original, which the user can then edit.

#### 4.3.4. Brief Review & Access Control
*   **User Story:** As a user, I want to review each draft brief and set a security level before sending it to my client, so I can control who has access to the information.
*   **Acceptance Criteria:**
    *   Each `Draft` brief has an editable view.
    *   A "Security Toggle" is present with two options: "Public (Magic Link)" and "Protected (Link + Password)".
    *   Default is "Public".
    *   If "Protected" is selected, the system will generate a secure, random password upon sending.

#### 4.3.5. Send for Approval & Client Action
*   **User Story:** As a user, I want to send the brief to my client for approval, and as a client, I want a simple way to view and respond to it.
*   **Acceptance Criteria:**
    *   User clicks "Send for Approval".
    *   The system emails the client a secure, unique link to a public-facing view of the brief.
    *   If protected, the email also contains the system-generated password.
    *   The public brief view page displays the brief details and two buttons: "Approve" and "Request Changes".
    *   Client action updates the brief's status in the user's dashboard (e.g., to `Approved` or `Changes Requested`).

#### 4.3.6. Generate & Send Invoice
*   **User Story:** Once a brief is approved, I want to generate a professional PDF invoice from a template and send it to my client.
*   **Acceptance Criteria:**
    *   An `Approved` brief has a "Generate Invoice" button.
    *   Clicking it prompts the user to select an invoice template from their gallery.
    *   The system generates a final, non-editable PDF invoice.
    *   User can preview the PDF.
    *   User clicks "Send Invoice", which emails the PDF as an attachment to the client.
    *   The transaction is marked as `Invoiced` and archived in the Client Hub.

### 4.4. Advanced Invoice Template Engine
*   **User Story:** As a user, I want to choose from a gallery of professional invoice templates and customize them to match my brand.
*   **Acceptance Criteria:**
    *   A "Templates" section in the application.
    *   A gallery of at least 3-5 pre-defined, professional templates.
    *   A template editor allows customization of: Logo placement, Primary color (color picker), Font selection (from a curated list of web-safe fonts).
    *   Users can save their customized templates for future use.

### 4.5. Dashboard
*   **User Story:** As a user, I want a central dashboard to see the status of all my billing documents at a glance.
*   **Acceptance Criteria:**
    *   The dashboard is the default view after login.
    *   It contains filterable lists or columns for documents in different states: `Draft`, `Awaiting Approval`, `Approved`, `Changes Requested`, `Invoiced`.
    *   Each item in the list is a link to the corresponding brief/invoice.

## 5. Data Model & Schema (Preliminary)

*   **Users:** `user_id`, `email`, `password_hash`, `company_name`, `logo_url`, `default_currency`, `default_tax_name`, `default_tax_rate`, `created_at`.
*   **Clients:** `client_id`, `user_id` (FK), `client_name`, `contact_email`, `address`, `created_at`.
*   **Briefs:** `brief_id`, `client_id` (FK), `user_id` (FK), `status` (Enum: draft, awaiting_approval, approved, changes_requested, invoiced), `access_level` (Enum: public, protected), `magic_link_token`, `password_hash` (nullable), `created_at`, `updated_at`.
*   **LineItems:** `line_item_id`, `brief_id` (FK), `description`, `quantity`, `unit_price`, `total_price`.
*   **Invoices:** `invoice_id`, `brief_id` (FK), `user_id` (FK), `template_id` (FK), `pdf_storage_url`, `invoice_number`, `issued_at`.
*   **Templates:** `template_id`, `user_id` (FK, nullable for base templates), `template_name`, `base_template_id` (nullable), `customization_options` (JSONB: color, font, etc.).

## 6. User Experience (UX) & Interface (UI) Guidelines

*   **Clarity & Simplicity:** The UI must be intuitive, with a minimal learning curve. The core workflow should be the most prominent feature.
*   **Professionalism:** The design aesthetic should be clean, modern, and professional to instill confidence in our users and their clients.
*   **Efficiency:** Prioritize reducing the number of clicks required to complete the core workflow. Features like duplication and CSV upload are central to this principle.
*   **Brand-Aligned:** The template engine is key. It must provide enough flexibility for users to feel the final output truly represents their brand.

## 7. Non-Functional Requirements

*   **Security:**
    *   All data in transit must be encrypted using TLS.
    *   Passwords must be securely hashed (e.g., using bcrypt).
    *   Secure "magic links" must use cryptographically secure, single-use tokens.
    *   Regular security audits and dependency scanning.
*   **Scalability:**
    *   The backend must be stateless to allow for horizontal scaling.
    *   Database queries must be optimized for performance.
    *   Use of a CDN for serving frontend assets and user-uploaded content.
*   **Performance:**
    *   API response times should be <200ms for typical requests.
    *   The frontend application should achieve a Lighthouse performance score of >90.
    *   PDF generation should be handled asynchronously to avoid blocking the main application thread.
*   **Internationalization (I18n):**
    *   The platform must support all global currencies.
    *   All user-facing text should be managed through translation keys for future language support.
    *   Date and number formatting should respect user locale where possible.

## 8. Milestones & V1.0 Release Plan

*   **Milestone 1: Core Infrastructure & User Setup (Weeks 1-3)**
    *   Setup tech stack, CI/CD pipeline, and hosting environments.
    *   Implement user registration, login, and profile management.
*   **Milestone 2: Client Management & Brief Creation (Weeks 4-6)**
    *   Implement the Client Hub (CRUD).
    *   Implement manual brief creation and the `Draft` state.
*   **Milestone 3: The Approval Workflow (Weeks 7-9)**
    *   Develop the public-facing brief view page.
    *   Implement the email sending logic (magic links, passwords).
    *   Implement the security toggle and client action logic (`Approve`/`Request Changes`).
*   **Milestone 4: Invoicing & Templating (Weeks 10-12)**
    *   Build the PDF generation service.
    *   Develop the template gallery and customization editor.
    *   Integrate template selection into the "Generate Invoice" flow.
*   **Milestone 5: Advanced Features & Polish (Weeks 13-15)**
    *   Implement the CSV processing engine.
    *   Build the main Dashboard.
    *   Implement the Duplication feature.
*   **Milestone 6: Beta Testing & Release (Week 16)**
    *   Internal QA and bug fixing.
    *   Limited Beta release to a select group of users.
    *   Incorporate feedback and prepare for V1.0 public launch.

## 9. Future Enhancements (Post-V1.0)

*   **Payment Gateway Integration:** Stripe and PayPal integration to allow clients to pay invoices directly online.
*   **Recurring Invoices:** Automate billing for retainer clients.
*   **Time Tracking:** A simple time tracker that can automatically populate line items on a brief.
*   **Advanced Reporting:** Financial reports on revenue, outstanding invoices, and client value.
*   **Mobile Application:** Native or PWA mobile apps for on-the-go invoice management.
*   **Multi-language Support:** Full localization of the platform UI.
*   **API for Developers:** Allow third-party integrations with QuickBill Flow.