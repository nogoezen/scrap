# 🌐 Web Scraper Pro

A modern, feature-rich web scraping application built with Next.js, offering comprehensive data extraction and analysis capabilities.

![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔍 Data Extraction
- Page metadata and content
- Social media tags (OpenGraph, Twitter)
- SEO information
- Media files (images, videos, audio)
- Links and page structure
- Technology stack detection

### 💫 Modern UI/UX
- Responsive design
- Dark/Light mode
- Smooth animations
- Interactive components
- Real-time feedback
- Progress indicators

### 💾 Data Management
- Automatic server-side saving
- Client-side JSON export
- Organized file structure
- Timestamp-based naming
- Data persistence

### 🛠️ Technical Features
- Framework detection
- Analytics tracking
- Resource analysis
- Performance metrics
- Content statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nogoezen/scrap.git
cd scrap
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. Enter a URL in the input field
2. Click "Scrape" to start the extraction process
3. View the extracted data in different categories:
   - Basic Information
   - Media Content
   - Social Media Data
   - SEO Information
   - Technologies Used
   - Page Statistics

4. Download the data:
   - Click "Save Data" to download as JSON
   - Find saved files in the `/data/` directory

## 📊 Data Categories

### Basic Information
- Page title
- Meta description
- Main content
- Favicon

### Media Content
- Images with metadata
- Videos (including embeds)
- Audio files
- Dimensions and attributes

### Social Media
- OpenGraph tags
- Twitter card data
- Social media images
- Share metadata

### SEO Information
- Meta tags
- Robots directives
- Keywords
- Canonical URLs
- Language settings

### Technology Stack
- Frameworks used
- Analytics tools
- Script analysis
- Stylesheet information

### Statistics
- Word count
- Paragraph count
- Media count
- Link count
- Heading structure

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Add any required API keys or configuration
```

### Customization
- Modify `tailwind.config.ts` for styling
- Adjust scraping rules in `app/api/scrape/route.ts`
- Customize UI components in `app/page.tsx`

## 📁 Project Structure

```
scrap/
├── app/
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts    # Scraping logic
│   └── page.tsx            # Main UI component
├── data/                   # Saved scraping results
├── public/                 # Static assets
├── styles/                 # Global styles
├── package.json           
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Cheerio](https://cheerio.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/nogoezen/scrap](https://github.com/nogoezen/scrap)

---

Made with ❤️ using Next.js and TypeScript
