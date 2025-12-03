# Structural Review: CyberSoluce Repository

## 1. Entities Present

The following concrete domain entities are implemented in code:

- **Asset**: Core entity with fields including name, type, criticality, owner, location, IP address, description, compliance frameworks, risk score (0-100), tags, status, data classification, encryption status, privacy fields
- **AssetRelationship**: Links assets with relationship types (Depends On, Connects To, Hosts, Manages, Accesses, Processes, Stores, Transmits, Shares, Backs Up, Replicates, Synchronizes), strength, data flow direction
- **Vulnerability**: Associated with assets, includes CVE ID, severity, CVSS score, status, discovery/resolution dates
- **Risk**: Linked to assets (and optionally dependencies), includes likelihood (1-5), impact (1-5), calculated risk score (0-100), level, category, mitigation status
- **MitigationAction**: Linked to risks (and optionally assets/dependencies), includes assignee, due date, status, progress (0-100), priority, costs
- **BusinessFunction**: Includes owner, department, priority, MTD/RTO/RPO metrics, annual revenue, regulatory requirements, asset dependencies
- **BusinessImpact**: Links assets to business functions, includes financial/operational/regulatory impact metrics
- **ContinuityPlan**: Linked to business functions and assets, includes RTO/RPO, steps, contacts, resources, test schedule
- **NISTControl**: Control definitions with family, number, title, status, priority, baseline impact
- **NISTMapping**: Links assets to NIST functions/controls, includes security categorization (confidentiality/integrity/availability)
- **NISTAssessment**: Asset assessments with overall score (0-100), function scores, findings
- **FrameworkPhase**: Phases named 'foundation', 'development', 'maturity', 'optimization' with progress (0-100) and tasks
- **Organization**: Multi-tenant organization entity with name, slug, plan (free/pro/enterprise), settings
- **OrganizationMember**: Links users to organizations with roles (owner/admin/editor/viewer/member)
- **Invitation**: Organization invitation system with email, role, token, expiration
- **Profile**: User profile (extends Supabase auth.users)
- **Report**: Saved reports with type, filters, schedule, format
- **Dependency**: Unified interface that converts from AssetRelationship format

## 2. Relationships Implemented

Explicit relationships defined in database schema and types:

- **Asset → AssetRelationship**: Many-to-many via `asset_relationships` table (bidirectional)
- **Asset → Vulnerability**: One-to-many via `asset_vulnerabilities` table (asset_id foreign key)
- **Asset → Risk**: One-to-many via `risks` table (asset_id foreign key)
- **Risk → MitigationAction**: One-to-many via `mitigation_actions` table (risk_id foreign key)
- **Asset → BusinessImpact**: One-to-many via `business_impacts` table (asset_id foreign key)
- **BusinessFunction → BusinessImpact**: One-to-many via `business_impacts` table (business_function_id foreign key)
- **BusinessFunction → ContinuityPlan**: One-to-many via `continuity_plans` table (business_function_id foreign key)
- **Asset → NISTMapping**: One-to-many via `nist_mappings` table (asset_id foreign key)
- **Asset → NISTAssessment**: One-to-many via `nist_assessments` table (asset_id foreign key)
- **User → Asset**: One-to-many via `assets` table (user_id foreign key)
- **Organization → OrganizationMember**: One-to-many via `organization_members` table
- **Organization → Invitation**: One-to-many via `invitations` table
- **User → Report**: One-to-many via `reports` table (created_by foreign key)

**UNCLEAR**: The relationship between organizations and assets is not explicit in the database schema. Assets have `user_id` but no `organization_id`. Organization membership is tracked separately. It is unclear if assets are implicitly scoped to organizations through user membership or if assets are user-scoped only.

**UNCLEAR**: The relationship between dependencies and risks is defined (dependency_id field exists on risks table) but the dependency entity itself is not a separate table - it appears to be derived from AssetRelationship.

## 3. Data Model Evidence

Entities are defined in multiple locations:

### Database Schema
- `supabase/migrations/20250101000000_create_assets_table.sql`: Defines assets, asset_relationships, asset_vulnerabilities tables
- `supabase/migrations/20250125000000_dependency_manager_features.sql`: Defines mitigation_actions, business_functions, business_impacts, continuity_plans, nist_controls, nist_mappings, nist_assessments, framework_phases, risks tables
- `supabase/migrations/20250801112702_cold_firefly.sql`: Defines reports table
- `supabase/migrations/20250801114506_odd_flower.sql`: Defines organizations, organization_members, invitations tables

### Type Definitions
- `src/types/asset.ts`: Asset, AssetRelationship, Vulnerability interfaces
- `src/types/risk.ts`: Risk interface
- `src/types/mitigation.ts`: MitigationAction interface
- `src/types/business-impact.ts`: BusinessFunction, BusinessImpact, ContinuityPlan interfaces
- `src/types/nist.ts`: NISTControl, NISTMapping, NISTAssessment interfaces
- `src/types/framework.ts`: FrameworkPhase interface
- `src/types/organization.ts`: Organization, OrganizationMember, Invitation, Report interfaces
- `src/types/dependency.ts`: Dependency interface (converts from AssetRelationship)
- `src/types/database.ts`: Supabase-generated database types

### API Endpoints / Services
- `src/services/assetService.ts`: CRUD operations for assets
- `src/services/riskService.ts`: CRUD operations for risks
- `src/services/mitigationService.ts`: CRUD operations for mitigation actions
- `src/services/businessImpactService.ts`: CRUD operations for business functions/impacts/continuity plans
- `src/services/nistService.ts`: CRUD operations for NIST controls/mappings/assessments
- `src/services/frameworkService.ts`: CRUD operations for framework phases
- `src/services/organizationService.ts`: CRUD operations for organizations/members/invitations
- `src/services/reportingService.ts`: Report generation
- `src/services/automatedReportingService.ts`: Automated report scheduling

### Static Config
- No static configuration files defining entities found

## 4. UI Scope

What the UI currently lets a user do:

### View
- **Assets**: View asset inventory in table format with filtering, sorting, pagination (`AssetInventoryDashboard`, `AssetDataTable`)
- **Asset Details**: View detailed asset information including relationships, vulnerabilities (`AssetDetailModal`)
- **Asset Statistics**: View asset statistics overview (`AssetStatsOverview`)
- **Risks**: View risks associated with assets (via Risk components)
- **Mitigations**: View mitigation actions (via MitigationPage)
- **Business Impact**: View business functions, impacts, continuity plans (via BusinessImpactPage)
- **NIST**: View NIST controls, mappings, assessments (via NISTPage)
- **Framework**: View framework phases and progress (via FrameworkPage)
- **Dependencies**: View asset dependencies (via DependenciesPage)
- **Vulnerabilities**: View vulnerability dashboard (`VulnerabilityDashboard`)
- **Privacy Compliance**: View privacy compliance dashboard (`PrivacyComplianceDashboard`)
- **Data Protection**: View data protection dashboard (`DataProtectionDashboard`)
- **Reports**: View advanced reporting dashboard (`AdvancedReportingDashboard`)
- **Organizations**: View organization management (`OrganizationManagement`)
- **Users**: View user management (`UserManagement`)
- **Activity Log**: View activity log (`ActivityLog`)

### Create
- **Assets**: Create new assets via `AssetFormModal`
- **Asset Relationships**: Create relationships between assets via `AssetRelationshipModal`
- **Vulnerabilities**: Create vulnerabilities for assets via `VulnerabilityManagementModal`
- **Risks**: Create risks (via Risk components)
- **Mitigations**: Create mitigation actions (via MitigationPage)
- **Business Functions**: Create business functions (via BusinessImpactPage)
- **NIST Controls**: Create NIST controls/mappings/assessments (via NISTPage)
- **Framework Phases**: Create/update framework phases (via FrameworkPage)
- **Organizations**: Create organizations (via OrganizationManagement)
- **Reports**: Create reports (via reporting components)

### Edit
- **Assets**: Edit assets via `AssetFormModal` (opened with existing asset)
- **Bulk Edit**: Edit multiple assets at once via `BulkEditModal`
- **Asset Relationships**: Edit relationships via `AssetRelationshipModal`
- **Vulnerabilities**: Edit vulnerabilities via `VulnerabilityManagementModal`
- **Risks**: Edit risks (via Risk components)
- **Mitigations**: Edit mitigation actions (via MitigationPage)
- **Business Functions**: Edit business functions/impacts/continuity plans (via BusinessImpactPage)
- **NIST Controls**: Edit NIST controls/mappings/assessments (via NISTPage)
- **Framework Phases**: Edit framework phases (via FrameworkPage)
- **Organizations**: Edit organizations (via OrganizationManagement)

### Link
- **Asset Relationships**: Link assets to other assets via `AssetRelationshipModal` with relationship types
- **Asset to Business Functions**: Link assets to business functions via business impacts
- **Asset to NIST**: Link assets to NIST controls via NIST mappings
- **Risk to Mitigation**: Link risks to mitigation actions
- **Risk to Dependency**: Link risks to dependencies (dependency_id field exists)

## 5. Non-v0 Elements Detected

The following non-v0 elements are present:

### Scoring
- **Asset Risk Score**: Assets have `riskScore` field (0-100) stored in database and displayed in UI
- **Risk Score**: Risks have calculated `riskScore` (0-100) based on likelihood × impact
- **NIST Overall Score**: NIST assessments have `overallScore` (0-100) field
- **NIST Function Scores**: NIST assessments track function scores (identify, protect, detect, respond, recover)
- **Framework Metrics**: `FrameworkMetrics` interface includes `technologyResilienceScore` (0-100)
- **Average Risk Score**: Reporting service calculates and displays average risk scores

### Risk Levels
- **Asset Criticality**: Assets have `criticality` field ('Critical', 'High', 'Medium', 'Low')
- **Risk Level**: Risks have `level` field ('Critical', 'High', 'Medium', 'Low')
- **Vulnerability Severity**: Vulnerabilities have `severity` field ('Critical', 'High', 'Medium', 'Low', 'Info')
- **Business Priority**: Business functions have `priority` field ('Critical', 'High', 'Medium', 'Low')
- **Mitigation Priority**: Mitigation actions have `priority` field ('Critical', 'High', 'Medium', 'Low')

### Maturity
- **Framework Phases**: Framework includes a phase named 'maturity' (along with 'foundation', 'development', 'optimization')
- **Framework Progress**: Framework phases track `progress` (0-100) percentage

### Dashboards
- **AssetInventoryDashboard**: Main asset inventory dashboard
- **AdvancedReportingDashboard**: Advanced reporting dashboard
- **PrivacyComplianceDashboard**: Privacy compliance dashboard
- **DataProtectionDashboard**: Data protection dashboard
- **VulnerabilityDashboard**: Vulnerability management dashboard
- **InsightsDashboard**: Insights dashboard (lazy loaded)
- **MagicalDashboard**: "Magical" dashboard (lazy loaded)
- **DashboardHome**: Home dashboard view

### Automation
- **AutomatedReportingManager**: Component for automated report scheduling and management
- **AutomatedReportingService**: Service for automated reporting functionality
- **ExternalDataIntegrationManager**: Component for external data integration
- **ExternalDataIntegrationService**: Service for external data integration
- **DataEnrichmentService**: Service for data enrichment automation
- **AIClassificationEngine**: AI classification engine component
- **MagicalOrchestrationEngine**: "Magical" orchestration engine component

### "Management" Language
- **VulnerabilityManagementModal**: Modal for managing vulnerabilities
- **OrganizationManagement**: Component for organization management
- **UserManagement**: Component for user management
- **ComplianceManagement**: Component for compliance management
- **AutomatedReportingManager**: Manager for automated reporting

## 6. Authentication / Tenant Awareness

### Authentication
- **Supabase Auth**: Uses Supabase authentication (`@supabase/supabase-js`)
- **Auth Context**: `AuthContext` provides user, session, signIn, signUp, signOut, resetPassword
- **Auth Guard**: `AuthGuard` component protects routes (but `requireAuth={false}` is set, allowing demo mode)
- **Demo Mode**: Application can run without authentication if Supabase is not configured
- **User Profile**: `profiles` table extends Supabase `auth.users` with email, full_name, avatar_url, organization, role, current_organization_id

### Tenant Awareness
- **User-Scoped Assets**: Assets have `user_id` foreign key, RLS policies restrict users to their own assets
- **Organization Support**: Database schema includes `organizations`, `organization_members`, `invitations` tables
- **Organization ID Fields**: Many tables have `organization_id` text field (risks, mitigation_actions, business_functions, business_impacts, continuity_plans, nist_controls, nist_mappings, nist_assessments, framework_phases, reports)
- **RLS Policies**: Row Level Security enabled on all tables with user-based policies for assets, but organization-based policies are permissive (`USING (true) WITH CHECK (true)`) for most organization-scoped tables
- **UNCLEAR**: The relationship between user-scoped assets and organization-scoped entities is not explicit. Assets are user-scoped, but other entities reference `organization_id`. It is unclear if there is a mechanism to link user assets to organizations or if these are separate scoping models.

### Multi-Tenancy Assumptions
- Users can belong to multiple organizations via `organization_members` table
- Users have a `current_organization_id` field on their profile
- Organization members have roles: owner, admin, editor, viewer, member
- Organization invitations system exists for inviting users

## 7. Summary

CyberSoluce is a React/TypeScript web application for asset inventory management with Supabase as the backend. The core entity is **Asset**, which users can create, edit, view, and link to other assets via relationships. Assets support risk scoring (0-100), vulnerability tracking, and compliance framework tagging. The application extends beyond basic asset inventory to include **Risk** management (with mitigation actions), **Business Impact Analysis** (business functions, impacts, continuity plans), **NIST Framework** tracking (controls, mappings, assessments with scoring), and **Framework Phases** (including a "maturity" phase with progress tracking). The database schema supports both user-scoped assets (via user_id) and organization-scoped entities (via organization_id), though the relationship between these scoping models is unclear. The UI provides multiple dashboards for different views (inventory, reporting, privacy, data protection, vulnerabilities) and includes automation features (automated reporting, external data integration, AI classification). Authentication is optional (demo mode supported), and the application includes multi-tenant organization support with role-based access, though RLS policies for organization-scoped entities are permissive. The codebase contains significant non-v0 elements including scoring systems, risk levels, maturity tracking, multiple dashboards, and automation features.

