import Papa from 'papaparse';

export interface OTIFData {
  SalesOrder: string;
  Customer: string;
  MaterialDescription: string;
  Plant: string;
  ReqDeliveryDate: string;
  LeadTime: number; // Calculated
  RiskScore: number; // calculated from prob_miss
  OTIFStatus: 'Hit' | 'Miss';
  TopRiskSignals: string[]; // Generated
  SalesOrderCreateDate: string; // Needed for LeadTime calculation
}

export const parseCSV = (file: File): Promise<OTIFData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: OTIFData[] = results.data.map((row: any) => {
          const createDate = new Date(row['SO create date']);
          const reqDate = new Date(row['Requested Delivery Date']);
          
          // Calculate Lead Time (Days)
          const leadTime = Math.ceil((reqDate.getTime() - createDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Calculate Risk Score (percentage)
          const probMiss = parseFloat(row['prob_miss']) || 0;
          const riskScore = Math.round(probMiss * 100);

          // Generate synthetic signals if risk is high
          const signals = [];
          if (riskScore > 80) signals.push('High probability of delay');
          if (leadTime < 5) signals.push('Tight lead time');
          if (row['OTIF_HIT/MISS'] === 'Miss') signals.push('Historical Miss pattern');

          return {
            MaterialDescription: row['Material description'] || 'N/A',
            SalesOrder: row['Sales order'] || 'N/A',
            Customer: row['Customer Name'] || 'Unknown',
            Plant: row['Plant'] || 'Unknown',
            ReqDeliveryDate: row['Requested Delivery Date'] || '',
            SalesOrderCreateDate: row['SO create date'] || '',
            LeadTime: leadTime > 0 ? leadTime : 0,
            RiskScore: riskScore,
            OTIFStatus: (row['OTIF_HIT/MISS'] === 'Hit' ? 'Hit' : 'Miss'),
            TopRiskSignals: signals.length > 0 ? signals : ['No significant risk factors'],
          };
        });
        resolve(parsedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
