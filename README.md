# OTIF Risk Dashboard

A modern, interactive web application for visualizing On-Time In-Full (OTIF) risk intelligence from CSV data.

## Features

- 📊 **Executive Summary Cards** - Key metrics at a glance (Total Orders, OTIF Miss/Hit, Miss Rate)
- 📈 **Distribution Chart** - Visual comparison of OTIF Hit vs Miss
- 🔍 **Excel-like Filters** - Multi-select column filters with search
- 📋 **Interactive Table** - Sortable, searchable, paginated order data
- 💾 **CSV Export** - Export filtered results
- 🎨 **Premium Design** - Modern UI with Vanilla CSS

## Quick Start (Windows)

### For Non-Technical Users

1. **Install Node.js** (one-time setup)
   - Download from [nodejs.org](https://nodejs.org/)
   - Install with default settings

2. **Run the Dashboard**
   - Double-click `run_dashboard.bat`
   - Wait for browser to open automatically
   - Upload your CSV file

3. **Stop the Dashboard**
   - Close the command window

### For Developers

```bash
cd otif-dashboard
npm install
npm run dev
```

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **Styling**: Vanilla CSS
- **Charts**: Chart.js + react-chartjs-2
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React

## Project Structure

```
otif-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main container
│   │   ├── FileUpload.tsx      # CSV upload
│   │   ├── SummaryCards.tsx    # Metrics cards
│   │   ├── DistributionChart.tsx # Bar chart
│   │   ├── OrderTable.tsx      # Data table with filters
│   │   └── Sidebar.tsx         # Navigation
│   ├── utils/
│   │   └── csvParser.ts        # CSV processing
│   ├── App.tsx
│   └── index.css               # All styles
├── run_dashboard.bat           # Windows launcher
└── package.json
```

## CSV Format

Expected columns:
- `Sales order number`
- `Customer name`
- `Plant`
- `Sales order create date`
- `Requested Delivery Date`
- `prob_miss` (probability score)
- `predicted_label` (Hit/Miss)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
