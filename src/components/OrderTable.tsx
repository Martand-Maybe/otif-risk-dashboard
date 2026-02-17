import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from 'lucide-react';
import type { OTIFData } from '../utils/csvParser';

interface OrderTableProps {
  data: OTIFData[];
}

type SortField = 'SalesOrder' | 'ReqDeliveryDate' | 'LeadTime' | 'RiskScore' | 'Customer' | 'MaterialDescription';
type SortDirection = 'asc' | 'desc';

// --- Helper Components ---

const SortIcon = ({ field, currentSortField, currentSortDirection }: { field: SortField, currentSortField: SortField, currentSortDirection: SortDirection }) => {
  if (currentSortField !== field) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
  return currentSortDirection === 'asc' 
    ? <ArrowUp size={14} className="text-primary" /> 
    : <ArrowDown size={14} className="text-primary" />;
};

interface FilterDropdownProps {
  column: keyof OTIFData;
  title: string;
  isOpen: boolean;
  uniqueValues: string[];
  selectedValues: Set<string>;
  onOpen: (column: string) => void;
  onClose: () => void;
  onToggle: (column: string, value: string) => void;
  onClear: (column: string) => void;
  onSort: (column: SortField) => void;
  sortIcon: React.ReactNode;
}

const FilterDropdown = memo(({ 
  column, 
  title, 
  isOpen, 
  uniqueValues, 
  selectedValues, 
  onOpen, 
  onClose,
  onToggle, 
  onClear,
  onSort,
  sortIcon
}: FilterDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = selectedValues.size > 0;

  // Filter values based on local search
  const filteredValues = useMemo(() => {
     if (!searchTerm) return uniqueValues;
     const lowerSearch = searchTerm.toLowerCase();
     return uniqueValues.filter(v => v.toLowerCase().includes(lowerSearch));
  }, [uniqueValues, searchTerm]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen) {
        setSearchTerm(''); // Reset search when closed
        return;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="th-wrapper">
      <div className="th-content">
        <span 
          className="sortable" 
          onClick={() => onSort(column as SortField)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}
        >
          {title} {sortIcon}
        </span>
        <button 
          className={`filter-btn ${isActive || isOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isOpen) onClose();
            else onOpen(column);
          }}
        >
          <Filter size={14} strokeWidth={isActive ? 3 : 2} />
        </button>
      </div>

      {isOpen && (
        <div className="filter-dropdown" ref={dropdownRef} onClick={e => e.stopPropagation()}>
          <div className="filter-header">
            <input 
              type="text" 
              placeholder={`Search ${title}...`} 
              className="filter-search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="filter-list">
            {filteredValues.map(value => (
              <label key={value} className="filter-item">
                <input 
                  type="checkbox" 
                  checked={selectedValues.has(value)}
                  onChange={() => onToggle(column, value)}
                />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
              </label>
            ))}
            {filteredValues.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No matches found
              </div>
            )}
          </div>
          <div className="filter-actions">
            <button 
              className="btn btn-outline btn-xs"
              onClick={() => onClear(column)}
              disabled={!isActive}
            >
              Clear
            </button>
            <button 
              className="btn btn-primary btn-xs"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Date Range Filter Component
interface DateRangeFilterProps {
  title: string;
  isOpen: boolean;
  dateRange: { min: string; max: string };
  onOpen: () => void;
  onClose: () => void;
  onChange: (range: { min: string; max: string }) => void;
  onClear: () => void;
  onSort: (field: SortField) => void;
  sortIcon: React.ReactNode;
}

const DateRangeFilter = memo(({ 
  title, 
  isOpen, 
  dateRange, 
  onOpen, 
  onClose, 
  onChange, 
  onClear,
  onSort,
  sortIcon
}: DateRangeFilterProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = dateRange.min !== '' || dateRange.max !== '';

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="th-wrapper">
      <div className="th-content">
        <span 
          className="sortable" 
          onClick={() => onSort('ReqDeliveryDate')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}
        >
          {title} {sortIcon}
        </span>
        <button 
          className={`filter-btn ${isActive || isOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isOpen) onClose();
            else onOpen();
          }}
        >
          <Filter size={14} strokeWidth={isActive ? 3 : 2} />
        </button>
      </div>

      {isOpen && (
        <div className="filter-dropdown" ref={dropdownRef} onClick={e => e.stopPropagation()}>
          <div className="filter-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>From</label>
            <input 
              type="date" 
              className="filter-search"
              value={dateRange.min}
              onChange={e => onChange({ ...dateRange, min: e.target.value })}
              style={{ marginBottom: '0.75rem' }}
            />
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>To</label>
            <input 
              type="date" 
              className="filter-search"
              value={dateRange.max}
              onChange={e => onChange({ ...dateRange, max: e.target.value })}
            />
          </div>
          <div className="filter-actions">
            <button 
              className="btn btn-outline btn-xs"
              onClick={onClear}
              disabled={!isActive}
            >
              Clear
            </button>
            <button 
              className="btn btn-primary btn-xs"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// Numeric Range Filter Component
interface NumericRangeFilterProps {
  title: string;
  field: SortField;
  isOpen: boolean;
  range: { min: number; max: number };
  absoluteRange: { min: number; max: number };
  onOpen: () => void;
  onClose: () => void;
  onChange: (range: { min: number; max: number }) => void;
  onClear: () => void;
  onSort: (field: SortField) => void;
  sortIcon: React.ReactNode;
  suffix?: string;
}

const NumericRangeFilter = memo(({ 
  title, 
  field,
  isOpen, 
  range, 
  absoluteRange,
  onOpen, 
  onClose, 
  onChange, 
  onClear,
  onSort,
  sortIcon,
  suffix = ''
}: NumericRangeFilterProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = range.min !== absoluteRange.min || range.max !== absoluteRange.max;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="th-wrapper">
      <div className="th-content">
        <span 
          className="sortable" 
          onClick={() => onSort(field)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}
        >
          {title} {sortIcon}
        </span>
        <button 
          className={`filter-btn ${isActive || isOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isOpen) onClose();
            else onOpen();
          }}
        >
          <Filter size={14} strokeWidth={isActive ? 3 : 2} />
        </button>
      </div>

      {isOpen && (
        <div className="filter-dropdown" ref={dropdownRef} onClick={e => e.stopPropagation()}>
          <div className="filter-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Min: {range.min}{suffix}
            </label>
            <input 
              type="range" 
              min={absoluteRange.min}
              max={absoluteRange.max}
              value={range.min}
              onChange={e => onChange({ ...range, min: Number(e.target.value) })}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Max: {range.max}{suffix}
            </label>
            <input 
              type="range" 
              min={absoluteRange.min}
              max={absoluteRange.max}
              value={range.max}
              onChange={e => onChange({ ...range, max: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
          <div className="filter-actions">
            <button 
              className="btn btn-outline btn-xs"
              onClick={onClear}
              disabled={!isActive}
            >
              Clear
            </button>
            <button 
              className="btn btn-primary btn-xs"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// --- Main Component ---

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('RiskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter State
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  
  // Range Filter State
  const [dateRange, setDateRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [leadTimeRange, setLeadTimeRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [riskScoreRange, setRiskScoreRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });

  // Pre-calculate unique values for filterable columns only when data changes
  const uniqueValuesMap = useMemo(() => {
      const columns = ['SalesOrder', 'Customer', 'MaterialDescription', 'Plant', 'OTIFStatus'];
      const map: Record<string, string[]> = {};
      columns.forEach(col => {
          // Optimization: Use a Set to get unique values, then sort
          // Limit to first 1000 unique values if extremely large to prevent browser hang
          const distinct = Array.from(new Set(data.map(d => String(d[col as keyof OTIFData]))));
          map[col] = distinct.sort();
      });
      return map;
  }, [data]);

  // Calculate min/max for range filters
  const rangeValues = useMemo(() => {
    if (data.length === 0) return { leadTime: { min: 0, max: 100 }, riskScore: { min: 0, max: 100 } };
    
    const leadTimes = data.map(d => d.LeadTime);
    const riskScores = data.map(d => d.RiskScore);
    
    return {
      leadTime: { min: Math.min(...leadTimes), max: Math.max(...leadTimes) },
      riskScore: { min: Math.min(...riskScores), max: Math.max(...riskScores) }
    };
  }, [data]);

  // Initialize range filters when data changes
  useEffect(() => {
    if (data.length > 0) {
      setLeadTimeRange({ min: rangeValues.leadTime.min, max: rangeValues.leadTime.max });
      setRiskScoreRange({ min: rangeValues.riskScore.min, max: rangeValues.riskScore.max });
    }
  }, [data, rangeValues]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleFilter = (column: string, value: string) => {
    const newFilters = { ...filters };
    if (!newFilters[column]) newFilters[column] = new Set();
    
    if (newFilters[column].has(value)) {
      newFilters[column].delete(value);
      if (newFilters[column].size === 0) delete newFilters[column];
    } else {
      newFilters[column].add(value);
    }
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearColumnFilter = (column: string) => {
    const newFilters = { ...filters };
    delete newFilters[column];
    setFilters(newFilters);
  };

  const clearDateRange = () => {
    setDateRange({ min: '', max: '' });
  };

  const clearLeadTimeRange = () => {
    setLeadTimeRange({ min: rangeValues.leadTime.min, max: rangeValues.leadTime.max });
  };

  const clearRiskScoreRange = () => {
    setRiskScoreRange({ min: rangeValues.riskScore.min, max: rangeValues.riskScore.max });
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Global Search
      const matchesSearch = 
        item.SalesOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.MaterialDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Plant.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Column Filters
      for (const [column, selectedValues] of Object.entries(filters)) {
        if (selectedValues.size > 0) {
           const itemValue = String(item[column as keyof OTIFData]);
           if (!selectedValues.has(itemValue)) return false;
        }
      }

      // Date Range Filter
      if (dateRange.min || dateRange.max) {
        const itemDate = item.ReqDeliveryDate;
        if (dateRange.min && itemDate < dateRange.min) return false;
        if (dateRange.max && itemDate > dateRange.max) return false;
      }

      // Lead Time Range Filter
      if (leadTimeRange.min !== rangeValues.leadTime.min || leadTimeRange.max !== rangeValues.leadTime.max) {
        if (item.LeadTime < leadTimeRange.min || item.LeadTime > leadTimeRange.max) return false;
      }

      // Risk Score Range Filter
      if (riskScoreRange.min !== rangeValues.riskScore.min || riskScoreRange.max !== rangeValues.riskScore.max) {
        if (item.RiskScore < riskScoreRange.min || item.RiskScore > riskScoreRange.max) return false;
      }

      return true;
    });
  }, [data, searchTerm, filters, dateRange, leadTimeRange, riskScoreRange, rangeValues]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const headers = ['Sales Order', 'Customer', 'Material Description', 'Plant', 'Req. Delivery', 'Lead Time', 'Risk Score', 'OTIF Status', 'Top Risk Signals'];
    const csvContent = [
        headers.join(','),
        ...sortedData.map(row => [
            row.SalesOrder,
            `"${row.Customer}"`,
            `"${row.MaterialDescription}"`,
            row.Plant,
            row.ReqDeliveryDate,
            row.LeadTime,
            row.RiskScore,
            row.OTIFStatus,
            `"${row.TopRiskSignals.join('; ')}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'order_risk_analysis.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">Order-Level OTIF Assessment</h3>
        <div className="table-controls">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
             <button 
                onClick={exportCSV}
                className="btn btn-outline"
             >
                <Download size={16} />
                Export CSV
             </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing {currentData.length} of {sortedData.length} orders
            </p>
            {(Object.keys(filters).length > 0 || dateRange.min || dateRange.max || 
              leadTimeRange.min !== rangeValues.leadTime.min || leadTimeRange.max !== rangeValues.leadTime.max ||
              riskScoreRange.min !== rangeValues.riskScore.min || riskScoreRange.max !== rangeValues.riskScore.max) && (
                <button 
                    className="btn btn-outline btn-xs" 
                    onClick={() => {
                      setFilters({});
                      clearDateRange();
                      clearLeadTimeRange();
                      clearRiskScoreRange();
                    }}
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                >
                    <X size={12} /> Clear all filters
                </button>
            )}
        </div>
      </div>

      <div className="table-wrapper" style={{ minHeight: '400px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ minWidth: '160px' }}>
                <FilterDropdown 
                    column="SalesOrder" 
                    title="Sales Order"
                    isOpen={activeFilterColumn === "SalesOrder"}
                    uniqueValues={uniqueValuesMap["SalesOrder"] || []}
                    selectedValues={filters["SalesOrder"] || new Set()}
                    onOpen={setActiveFilterColumn}
                    onClose={() => setActiveFilterColumn(null)}
                    onToggle={toggleFilter}
                    onClear={clearColumnFilter}
                    onSort={handleSort}
                    sortIcon={<SortIcon field="SalesOrder" currentSortField={sortField} currentSortDirection={sortDirection} />}
                />
              </th>
              <th style={{ minWidth: '200px' }}>
                <FilterDropdown 
                    column="Customer" 
                    title="Customer"
                    isOpen={activeFilterColumn === "Customer"}
                    uniqueValues={uniqueValuesMap["Customer"] || []}
                    selectedValues={filters["Customer"] || new Set()}
                    onOpen={setActiveFilterColumn}
                    onClose={() => setActiveFilterColumn(null)}
                    onToggle={toggleFilter}
                    onClear={clearColumnFilter}
                    onSort={handleSort}
                    sortIcon={<SortIcon field="Customer" currentSortField={sortField} currentSortDirection={sortDirection} />}
                />
              </th>
              <th style={{ minWidth: '200px' }}>
                <FilterDropdown 
                    column="MaterialDescription" 
                    title="Material Description"
                    isOpen={activeFilterColumn === "MaterialDescription"}
                    uniqueValues={uniqueValuesMap["MaterialDescription"] || []}
                    selectedValues={filters["MaterialDescription"] || new Set()}
                    onOpen={setActiveFilterColumn}
                    onClose={() => setActiveFilterColumn(null)}
                    onToggle={toggleFilter}
                    onClear={clearColumnFilter}
                    onSort={handleSort}
                    sortIcon={<SortIcon field="MaterialDescription" currentSortField={sortField} currentSortDirection={sortDirection} />}
                />
              </th>
              <th style={{ minWidth: '120px' }}>
                 <FilterDropdown 
                    column="Plant" 
                    title="Plant"
                    isOpen={activeFilterColumn === "Plant"}
                    uniqueValues={uniqueValuesMap["Plant"] || []}
                    selectedValues={filters["Plant"] || new Set()}
                    onOpen={setActiveFilterColumn}
                    onClose={() => setActiveFilterColumn(null)}
                    onToggle={toggleFilter}
                    onClear={clearColumnFilter}
                    onSort={handleSort}
                    sortIcon={null}
                />
              </th>
              <th style={{ minWidth: '160px' }}>
                <DateRangeFilter 
                    title="Req. Delivery"
                    isOpen={activeFilterColumn === "ReqDeliveryDate"}
                    dateRange={dateRange}
                    onOpen={() => setActiveFilterColumn("ReqDeliveryDate")}
                    onClose={() => setActiveFilterColumn(null)}
                    onChange={setDateRange}
                    onClear={clearDateRange}
                    onSort={handleSort}
                    sortIcon={<SortIcon field="ReqDeliveryDate" currentSortField={sortField} currentSortDirection={sortDirection} />}
                />
              </th>
              <th style={{ minWidth: '140px' }}>
                <NumericRangeFilter 
                    title="Lead Time"
                    field="LeadTime"
                    isOpen={activeFilterColumn === "LeadTime"}
                    range={leadTimeRange}
                    absoluteRange={rangeValues.leadTime}
                    onOpen={() => setActiveFilterColumn("LeadTime")}
                    onClose={() => setActiveFilterColumn(null)}
                    onChange={setLeadTimeRange}
                    onClear={clearLeadTimeRange}
                    onSort={handleSort}
                    sortIcon={<SortIcon field="LeadTime" currentSortField={sortField} currentSortDirection={sortDirection} />}
                    suffix=" days"
                />
              </th>
              <th style={{ minWidth: '140px' }}>
                <NumericRangeFilter 
                    title="Risk Score"
                    field="RiskScore"
                    isOpen={activeFilterColumn === "RiskScore"}
                    range={riskScoreRange}
                    absoluteRange={rangeValues.riskScore}
                    onOpen={() => setActiveFilterColumn("RiskScore")}
                    onClose={() => setActiveFilterColumn(null)}
                    onChange={setRiskScoreRange}
                    onClear={clearRiskScoreRange}
                    onSort={handleSort}
                    sortIcon={<SortIcon field="RiskScore" currentSortField={sortField} currentSortDirection={sortDirection} />}
                    suffix="%"
                />
              </th>
              <th style={{ minWidth: '140px' }}>
                 <FilterDropdown 
                    column="OTIFStatus" 
                    title="OTIF Status"
                    isOpen={activeFilterColumn === "OTIFStatus"}
                    uniqueValues={uniqueValuesMap["OTIFStatus"] || []}
                    selectedValues={filters["OTIFStatus"] || new Set()}
                    onOpen={setActiveFilterColumn}
                    onClose={() => setActiveFilterColumn(null)}
                    onToggle={toggleFilter}
                    onClear={clearColumnFilter}
                    onSort={handleSort}
                    sortIcon={null}
                />
              </th>
              <th>Top Risk Signals</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => (
              <tr key={`${row.SalesOrder}-${idx}`}>
                <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{row.SalesOrder}</td>
                <td>{row.Customer}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.MaterialDescription}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.Plant}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.ReqDeliveryDate}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.LeadTime} days</td>
                <td style={{ fontWeight: 600 }}>{row.RiskScore}%</td>
                <td>
                  <span className={`status-badge ${row.OTIFStatus === 'Miss' ? 'miss' : 'hit'}`}>
                    {row.OTIFStatus === 'Miss' ? 'OTIF Miss' : 'OTIF Hit'}
                  </span>
                </td>
                <td 
                  style={{ color: 'var(--text-secondary)', maxWidth: '300px' }} 
                  title={row.TopRiskSignals.join('; ')}
                >
                  {row.TopRiskSignals.join('; ')}
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
                <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No orders found matching your search or filters.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="btn btn-outline"
        >
          Previous
        </button>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  );
};
