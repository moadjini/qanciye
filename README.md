# Qanciye Admission Management System

A complete, production-ready web application for managing student admission records for Qanciye Admission.

## Features

- **Authentication**: Secure login/logout system
- **Dashboard**: Overview with statistics (total admissions, today's admissions, this month)
- **Admission Management**: Create, view, edit, duplicate, and delete admission records
- **Student Information**: Full name, mother's name, date of birth, customer number, gender, place of birth, national ID, address
- **Photo Upload**: Secure student photo upload with validation (JPG, JPEG, PNG, WEBP)
- **More Details**: Additional text field for extra student information
- **Search & Filter**: Search by name, customer number, national ID, or place of birth; filter by gender
- **Document Generation**: 
  - Official Qanciye Admission document preview
  - PDF export with proper template
  - Microsoft Word (.docx) export
  - Print functionality
- **Static QR Code**: All documents include a static QR code encoding +252 68 6913144

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: jsPDF, html2canvas
- **Word Generation**: docx
- **QR Code**: qrcode
- **Notifications**: react-hot-toast
- **Icons**: lucide-react

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Open supabase-schema.sql and copy its contents
# Paste into Supabase SQL Editor and execute
```

The schema creates:
- `admissions` table with all required fields
- `student-photos` storage bucket
- Row Level Security (RLS) policies
- Indexes for efficient searching

### 2. Environment Variables

The `.env.local` file is already configured with your Supabase credentials.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Admin User

In Supabase, go to Authentication > Users and create an admin user, or use the Supabase dashboard to sign up a new user through the login page.

## Usage

### Creating an Admission

1. Navigate to Dashboard → New Admission
2. Fill in all required fields (marked with *)
3. Upload student photo (optional but recommended)
4. Add more details if needed
5. Click "Save Admission"

### Viewing & Exporting

1. Go to Admissions page
2. Click "View" on any admission
3. Use the action buttons to:
   - Edit the admission
   - Download PDF
   - Download Word document
   - Print the document
   - Duplicate the admission
   - Delete the admission

### Searching

- Use the search bar to find admissions by name, customer number, national ID, or place of birth
- Use the gender filter to narrow results

## Document Template

The admission document follows the official Qanciye template:
- Header with Qanciye logo and flags
- Student information with icons
- Student photo frame
- Verification box
- Contact information
- Prepared by section with signature area
- Static QR code (+252 68 6913144)
- Bottom service bar
- Footer

## Security

- Row Level Security (RLS) enabled on database
- Server-side validation
- Secure file uploads with type and size validation
- Protected routes requiring authentication
- Environment variables for sensitive data

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the application:

```bash
npm run build
npm start
```

## Support

For issues or questions, contact:
- Phone: +252 68 6913144
- Email: info@qanciye.com
- Website: www.qanciye.com
