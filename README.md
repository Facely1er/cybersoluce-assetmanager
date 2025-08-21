# ERMITS CyberSoluce® - Enterprise Asset Inventory Management Platform

A production-ready asset inventory management platform designed for cybersecurity professionals to track, manage, and secure digital assets with advanced filtering, compliance mapping, risk assessment features, and real-time collaboration capabilities.

## Features

- **Comprehensive Asset Management**: Track and categorize all digital assets in one centralized platform
- **Risk Assessment & Analytics**: Automated risk scoring, vulnerability tracking, and compliance monitoring
- **Security & Compliance**: Built-in compliance frameworks, security best practices, and audit trails
- **User Authentication & Authorization**: Secure user management with email/password authentication
- **Real-time Data Persistence**: PostgreSQL database with real-time updates via Supabase
- **Enterprise Integration**: API integration, bulk import/export, and workflow automation
- **Multi-user Support**: User isolation, role-based access, and team collaboration
- **Advanced Filtering**: Powerful search and filtering capabilities
- **Inventory Generation**: Generate realistic asset inventories for different scenarios
- **Team Management**: Multi-organization support with role-based access control
- **Email Notifications**: Automated alerts for asset changes and compliance issues
- **Advanced Reporting**: Comprehensive PDF, Excel, and CSV reports with charts
- **Audit Logging**: Complete audit trail of all system activities
- **Real-time Notifications**: In-app notification system with real-time updates
- **Integration Support**: Webhook and API integration capabilities
- **Compliance Reporting**: Specialized reports for various compliance frameworks
- **CSV Import/Export**: Import existing asset data and export reports

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key from the API settings
   - Run the database migration in the Supabase SQL editor (copy content from `supabase/migrations/001_initial_schema.sql`)

4. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Database Setup

The application uses Supabase (PostgreSQL) for data persistence. The database schema includes:

- **Core Tables**: profiles, assets, asset_relationships, asset_vulnerabilities
- **Team Management**: organizations, organization_members, invitations
- **System Features**: audit_logs, notifications, reports, integrations

### Migrations

Run the following migrations in order:
1. `supabase/migrations/001_initial_schema.sql` - Core schema
2. `supabase/migrations/002_team_management.sql` - Team and enterprise features

### Row Level Security (RLS)

All tables implement Row Level Security to ensure:
- Users can only access their own data
- Data isolation between different users/organizations
- Secure multi-tenant architecture

### Real-time Updates

The application supports real-time collaboration through Supabase's real-time capabilities, allowing multiple users to see updates instantly.

## Usage

### Authentication

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Access your secure asset inventory
3. **Profile Management**: Update your profile information and organization details

### Asset Management

1. **Add Assets**: Use the "Add Asset" button to manually create new assets
2. **Import Assets**: Upload CSV files to bulk import asset data
3. **Generate Inventory**: Use the inventory generator to create sample data for different scenarios
4. **Filter & Search**: Use the advanced filtering panel to find specific assets
5. **Export Data**: Export filtered asset lists to CSV format

### Team Management

1. **Create Organization**: Set up your company/team structure
2. **Invite Members**: Send email invitations to team members
3. **Assign Roles**: Configure role-based permissions (Owner, Admin, Editor, Viewer)
4. **Manage Access**: Control who can see and edit different assets

### Reporting & Analytics

1. **Dashboard Analytics**: View comprehensive charts and metrics
2. **Generate Reports**: Create PDF, Excel, or CSV reports
3. **Compliance Reports**: Generate framework-specific compliance reports
4. **Risk Assessment**: Detailed risk analysis and scoring
5. **Scheduled Reports**: Set up automated report generation

### Notifications

1. **Real-time Alerts**: Get notified of asset changes and security issues
2. **Email Notifications**: Receive important updates via email
3. **Notification Center**: Manage all notifications in one place

### Supported Asset Types

- Server
- Database
- Application
- Network
- Endpoint
- Cloud Service

### Compliance Frameworks

- SOC 2
- PCI DSS
- ISO 27001
- GDPR
- HIPAA
- NIST
- CIS Controls
- COBIT

## CSV Import Format

The application supports CSV import with the following required fields:

- **Name**: Asset name (required)
- **Type**: Asset type (required)
- **Criticality**: Critical, High, Medium, Low (required)
- **Owner**: Asset owner (required)
- **Location**: Asset location (required)

Optional fields include IP Address, Description, Risk Score, Status, Compliance Frameworks, and Tags.

Download the CSV template from the import modal for the correct format.

## Inventory Scenarios

The application includes pre-built inventory scenarios:

- Small Business (25 assets)
- Enterprise Corporation (150 assets)
- Healthcare Organization (80 assets)
- Financial Institution (120 assets)
- Tech Startup (35 assets)
- Government Agency (200 assets)
- Manufacturing Plant (90 assets)
- Educational Institution (110 assets)

## API Integration

The application provides a clean service layer (`src/services/assetService.ts`) for all database operations:

- **assetService.getAssets()**: Fetch all user assets
- **assetService.createAsset()**: Create new assets with relationships and vulnerabilities
- **assetService.updateAsset()**: Update existing assets
- **assetService.deleteAssets()**: Bulk delete assets
- **assetService.searchAssets()**: Full-text search across asset fields

All operations include proper error handling and user authentication checks.

## Team Management Features

### Role-Based Access Control

- **Owner**: Full access including billing and organization management
- **Admin**: Can manage team members and organization settings
- **Editor**: Can create, edit, and delete assets
- **Viewer**: Read-only access to assets and reports
- **Member**: Standard access with customizable permissions

### Organization Management

- Multi-organization support for large enterprises
- Organization-specific asset isolation
- Custom organization settings and branding
- Audit trails for all organization activities

## Advanced Features

### Reporting Engine
- Interactive dashboards with real-time charts
- Export capabilities (PDF, Excel, CSV)
- Compliance framework reports
- Risk assessment analytics
- Scheduled report generation

## Security Features

- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure headers
- Content Security Policy
- User authentication and authorization
- Row Level Security (RLS) in database
- Secure API endpoints
- Multi-factor authentication support
- Role-based access control (RBAC)
- Organization-level data isolation
- Comprehensive audit logging
- Password requirements and validation
- Session management
- Real-time data encryption

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Production Deployment

### Environment Setup

For production deployment, ensure:

1. **Database**: Supabase project in production mode
2. **Environment Variables**: Set production values for all `VITE_*` variables
3. **Security**: Enable all Supabase security features (RLS, API keys, etc.)
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Backup**: Configure automated database backups

### Recommended Hosting

- **Frontend**: Netlify, Vercel, or AWS Amplify
- **Database**: Supabase (managed PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (for future file uploads)
- **Email Service**: Configure SMTP settings in Supabase
- **Monitoring**: Set up application monitoring and error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Architecture

The application follows a clean architecture pattern with:
- **Presentation Layer**: React components with TypeScript
- **Business Logic**: Custom hooks and utilities
- **Data Layer**: Supabase services with proper abstraction
- **Security Layer**: Authentication context and RLS policies

## Support

For support and questions, please contact the development team or create an issue in the repository.
