# Senior Living Finder

A modern web application to help users find and compare senior living communities. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 Search and filter senior living communities
- ⭐ Save favorite communities
- 🔄 Sync favorites across devices
- 📱 Responsive design
- 🗺️ Interactive maps
- 👥 User authentication
- 📊 Compare multiple communities

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/senior-living-finder.git
   cd senior-living-finder
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. Run the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

### Environment Variables

Required environment variables:
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `DATABASE_URL`: Your database connection string
- `GOOGLE_MAPS_API_KEY`: Google Maps API key

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── context/         # React context providers
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
