import type { Prospect } from '../types';

export const exportToCSV = (prospects: Prospect[], filename: string = 'prospects.csv') => {
  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'WhatsApp',
    'Company',
    'Role',
    'Website',
    'Country',
    'State',
    'Niche',
    'Has Socials',
    'LinkedIn',
    'Twitter',
    'Facebook',
    'Instagram',
    'Mode of Reachout',
    'Status',
    'Tags',
    'Source',
    'Date Added',
    'Last Activity',
    'Generated Pitch',
  ];

  // Convert prospects to CSV rows
  const rows = prospects.map((prospect) => [
    prospect.id,
    prospect.name,
    prospect.email || '',
    prospect.phone || '',
    prospect.whatsapp || '',
    prospect.company || '',
    prospect.role || '',
    prospect.website || '',
    prospect.country || '',
    prospect.state || '',
    prospect.niche || '',
    prospect.hasSocials ? 'Yes' : 'No',
    prospect.socialLinks?.linkedin || '',
    prospect.socialLinks?.twitter || '',
    prospect.socialLinks?.facebook || '',
    prospect.socialLinks?.instagram || '',
    prospect.modeOfReachout,
    prospect.status,
    prospect.tags.join('; '),
    prospect.source || '',
    prospect.dateAdded,
    prospect.lastActivity || '',
    prospect.generatedPitch || '',
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
  
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
};

export const mapCSVToProspect = (csvRow: any): Partial<Prospect> => {
  return {
    name: csvRow['Name'] || csvRow['name'],
    email: csvRow['Email'] || csvRow['email'],
    phone: csvRow['Phone'] || csvRow['phone'],
    whatsapp: csvRow['WhatsApp'] || csvRow['whatsapp'],
    company: csvRow['Company'] || csvRow['company'],
    role: csvRow['Role'] || csvRow['role'],
    website: csvRow['Website'] || csvRow['website'],
    country: csvRow['Country'] || csvRow['country'] || 'Nigeria',
    state: csvRow['State'] || csvRow['state'],
    niche: csvRow['Niche'] || csvRow['niche'],
    hasSocials: csvRow['Has Socials'] === 'Yes' || csvRow['has_socials'] === 'Yes',
    socialLinks: {
      linkedin: csvRow['LinkedIn'] || csvRow['linkedin'],
      twitter: csvRow['Twitter'] || csvRow['twitter'],
      facebook: csvRow['Facebook'] || csvRow['facebook'],
      instagram: csvRow['Instagram'] || csvRow['instagram'],
    },
    modeOfReachout: (csvRow['Mode of Reachout'] || csvRow['mode_of_reachout'] || 'Email') as any,
    status: (csvRow['Status'] || csvRow['status'] || 'New') as any,
    tags: csvRow['Tags'] ? csvRow['Tags'].split(';').map((t: string) => t.trim()) : [],
    source: csvRow['Source'] || csvRow['source'] || 'CSV Import',
    dateAdded: csvRow['Date Added'] || csvRow['date_added'] || new Date().toISOString().split('T')[0],
  };
};
