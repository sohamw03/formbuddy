# FormBuddy

FormBuddy is a modern web application that helps you manage, modify, and store various types of files like images, documents, and signatures. Built with Next.js 14 and integrated with Google Drive API, it offers a seamless experience for file management with features like image cropping, quality adjustment, and resolution variants.

## Features

- **Google Drive Integration**: Secure file storage using Google Drive's appDataFolder
- **File Organization**: Separate sections for Photos, Documents, and Signatures
- **Image Processing**:
  - Image cropping with live preview
  - Quality adjustment for images and PDFs
  - Resolution variants management
- **Modern UI/UX**:
  - Responsive design works on desktop and mobile
  - Dark mode support
  - Drag and drop file uploads
  - Interactive file previews
- **Security**:
  - Google OAuth2.0 authentication
  - Protected API routes
  - Secure file handling

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - NextUI
  - Tailwind CSS
  - Framer Motion

- **Backend**:
  - Next.js API Routes
  - Google Drive API
  - Sharp (Image processing)
  - Adobe PDF Services API

- **Authentication**:
  - NextAuth.js
  - Google OAuth2.0

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/formbuddy.git
   cd formbuddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   PDF_SERVICES_CLIENT_ID=your_adobe_client_id
   PDF_SERVICES_CLIENT_SECRET=your_adobe_client_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
formbuddy/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── drivers/         # Core functionality & context
│   └── hooks/           # Custom React hooks
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/convert_file` - File conversion
- `/api/create_file` - File creation
- `/api/crop_file` - Image cropping
- `/api/down_file` - File download
- `/api/get_file` - File metadata
- `/api/init_user` - User initialization
- `/api/list_files` - List user files
- `/api/quality_file` - Quality adjustment
- `/api/remove_file` - File deletion

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the GitHub repository.
