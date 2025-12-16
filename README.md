# Women's Education and Guidance Council (WEGC)

A modern, responsive certificate verification and management system for Women's Education and Guidance Council.

## 🌟 Features

- **Certificate Verification**: Public-facing certificate verification system
- **Admin Dashboard**: Secure admin panel for certificate management (URL-based access)
- **Modern UI**: Premium design with elegant purple and pink color scheme
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Database**: Powered by Supabase for fast and secure data management
- **Smooth Animations**: Engaging user experience with tasteful transitions
- **Keep-Alive Cron Job**: Automatic database pinging every 3 days to keep Supabase free tier active

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Libraries**: 
  - Supabase JS Client
  - Font Awesome Icons
  - Google Fonts (Inter & Playfair Display)

## 📋 Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create the database schema
5. Get your Supabase URL and Anon Key from Project Settings > API

### 2. Configure the Application

1. Open `app.js`
2. Replace the following values:
   ```javascript
   const SUPABASE_URL = 'your-project-url.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   const ADMIN_PASSWORD = 'your-secure-password'; // Change this!
   ```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

## 🔐 Security Notes

1. **Change the Admin Password**: Update `ADMIN_PASSWORD` in `app.js` to a strong password
2. **Environment Variables**: For production, consider moving sensitive data to environment variables
3. **RLS Policies**: The Supabase schema includes Row Level Security policies for data protection
4. **HTTPS**: Always use HTTPS in production (Vercel provides this automatically)

## 📱 Usage

### Public Access
- Visit the homepage to view information about WEGC
- Use the "Verify Certificate" section to verify any certificate by its number

### Admin Access
1. Add `#admin` to your URL (e.g., `https://yoursite.com/#admin`)
2. Enter the admin password
3. Access the dashboard to:
   - Add new certificates
   - Edit existing certificates
   - Delete certificates
   - Search and filter certificates
   - View statistics

**Note**: Admin access is intentionally hidden from navigation for security. You can also use `#adminLogin` to go directly to the login page.

## 📊 Database Schema

The application uses a single `certificates` table with the following structure:

- `id`: UUID (Primary Key)
- `certificate_number`: Unique certificate identifier
- `student_name`: Name of the student
- `course_name`: Name of the course
- `duration`: Course duration
- `institution_name`: Issuing institution
- `issue_date`: Date of issuance
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --color-primary: #8B458B;
    --color-secondary: #DA70D6;
    /* ... more variables */
}
```

### Fonts
Edit the Google Fonts import in `index.html` to use different fonts.

### Logo
Replace the brand icon in the navbar or add your own logo image.

## 🐛 Troubleshooting

### Certificates Not Loading
- Check your Supabase URL and Anon Key in `app.js`
- Verify the SQL schema was executed successfully
- Check browser console for error messages

### Admin Login Not Working
- Verify you're using the correct password set in `app.js`
- Check browser console for JavaScript errors

### Verification Not Working
- Ensure the certificate number matches exactly (case-insensitive)
- Verify the certificate exists in the database

## 📄 License

© 2025 Women's Education and Guidance Council. All rights reserved.

## 🤝 Support

For support and inquiries, please contact the WEGC administration.

---

**Built with ❤️ for empowering women through education**
