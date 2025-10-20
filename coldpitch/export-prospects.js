// Quick script to copy prospects from localhost to production
// Run this in your localhost console to export data

const exportProspects = async () => {
  const { data, error } = await window.supabase
    .from('prospects')
    .select('*');
  
  if (error) {
    console.error('Error fetching prospects:', error);
    return;
  }
  
  console.log('📋 Export this data to production:');
  console.log('Copy and paste this JSON:');
  console.log(JSON.stringify(data, null, 2));
  
  // Also create SQL INSERT statements
  const insertStatements = data.map(prospect => {
    const values = Object.keys(prospect)
      .map(key => {
        const value = prospect[key];
        if (value === null) return 'NULL';
        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
        if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        return value;
      })
      .join(', ');
    
    const columns = Object.keys(prospect).join(', ');
    return `INSERT INTO prospects (${columns}) VALUES (${values});`;
  });
  
  console.log('\n📝 SQL INSERT statements:');
  insertStatements.forEach(sql => console.log(sql));
};

exportProspects();