# OTIF Risk Dashboard - User Documentation

## 1. Overview
The **OTIF (On-Time In-Full) Risk Dashboard** is a specialized tool designed to visualize supply chain delivery risks. It processes predictive data to help logistics and supply chain managers identify orders at risk of missing their delivery targets.

The application transforms raw CSV data into an interactive intelligence dashboard, highlighting high-risk orders, delay probabilities, and lead time constraints.

## 2. Key Features

### 📊 Interactive Dashboard
-   **Executive Summary**: Immediate view of key metrics (Total Orders, Miss Count, Hit Count, Miss Rate).
-   **Risk Distribution**: Visual breakdown of predicted hits vs. misses.
-   **Last Updated Timestamp**: Tracks when the data was loaded.

### 📁 Data Processing
-   **Drag-and-Drop Upload**: Simple interface to ingest CSV data files.
-   **Automated Parsing**: Instantly reads and processes standard OTIF prediction files.
-   **Auto-Calculations**: Automatically computes Lead Times and Risk Scores from raw data.
-   **Risk Signal Generation**: Identifies specific risk factors like "Tight lead time" or "High probability of delay".

### 🔎 Advanced Data Grid (Order Table)
-   **Global Search**: Instantly search across Sales Order ID, Customer Name, and Plant.
-   **Multi-Column Sorting**: Sort by any field, including calculated Risk Scores.
-   **Smart Filtering**:
    -   **Categorical Filters**: Filter by Customer, Plant, or Status (Hit/Miss).
    -   **Date Range**: Filter *Requested Delivery Date* using a "From-To" date picker.
    -   **Numeric Ranges**: Filter *Lead Time* (days) and *Risk Score* (%) using interactive sliders.
-   **Clear All**: One-click reset for all active filters.
-   **Pagination**: Efficiently browse large datasets (default 10 items per page).
-   **CSV Export**: Download the currently filtered view for external analysis.

### 🎨 User Experience
-   **Collapsible Sidebar**: Maximize screen real estate for data viewing.
-   **Dark/Light Mode Ready**: Built with CSS variables for future theming (currently optimized for a clean, light professional theme).
-   **Responsive Design**: Adapts to different screen sizes.

---

## 3. Calculations & Logic

The dashboard performs several calculations on the client side immediately after data upload.

### 1. Lead Time
Calculates the number of days between the order creation and the requested delivery.
*   **Formula**: `(Requested Delivery Date - Sales Order Create Date) in Days`
*   **Logic**: 
    1. Parse `Requested Delivery Date` and `SO create date`.
    2.  Calculate difference in milliseconds.
    3.  Convert to days and round up (`Math.ceil`).
    4.  If calculated value < 0, it defaults to 0.

### 2. Risk Score
Converts the raw probability of a "miss" into a user-friendly percentage 0-100.
*   **Formula**: `Rounded(prob_miss * 100)`
*   **Source**: Derived from the `prob_miss` column in the CSV.

### 3. OTIF Status
Classifies the order as a predicted 'Hit' (On-Time) or 'Miss'.
*   **Source**: Directly mapped from the `OTIF_HIT/MISS` column in the CSV.

### 4. Miss Rate (Metric)
The percentage of total orders predicted to miss delivery.
*   **Formula**: `(Count of 'Miss' Status / Total Orders) * 100`

### 5. Top Risk Signals
The system automatically tags orders with risk indicators based on logic:
-   **"High probability of delay"**: If `Risk Score > 80%`.
-   **"Tight lead time"**: If `Lead Time < 5 days`.
-   **"Historical Miss pattern"**: If status is explicitly 'Miss'.

---

## 4. How to Use

### Step 1: Launch
1.  Double-click `run_dashboard.bat` (Windows) or run `npm run dev` in the terminal.
2.  The dashboard opens in your default browser (usually `http://localhost:4173` or `5173`).

### Step 2: Upload Data
1.  On the welcome screen, click or drag your CSV file (e.g., `OTIF_Predictions_2025-12.csv`) into the upload zone.
2.  The dashboard will automatically parse and load the data.

### Step 3: Analyze
-   **Check Summary**: Look at the top cards for the overall "Miss Rate".
-   **Filter High Risks**: 
    -   Go to the **Risk Score** column.
    -   Use the slider to filter for scores > 80%.
-   **Check Specific Customers**:
    -   Click the filter icon on **Customer**.
    -   Select specific key accounts to see their performance.

### Step 4: Export
1.  Apply any filters you need (e.g., "High Risk" + "Customer X").
2.  Click the **Export CSV** button above the table.
3.  The file downloads with your specifically filtered dataset.

---

## 5. Technical Requirements
-   **Input File**: CSV format.
-   **Required Columns**:
    -   `Sales order`
    -   `Customer Name`
    -   `Plant`
    -   `Requested Delivery Date`
    -   `SO create date`
    -   `prob_miss`
    -   `OTIF_HIT/MISS`
