import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://tscrxukrkwnurkzqfjty.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzY3J4dWtya3dudXJrenFmanR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDc5NTcsImV4cCI6MjA1NjE4Mzk1N30.e3aXYge4yU5RXLbYpNt4DdQhFC6nmaAtxV60WNthjVk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to fetch all data using pagination
const fetchAllData = async (queryBuilder, pageSize = 1000) => {
  let allData = [];
  let from = 0;
  let hasMore = true;

  console.log(`🔄 Starting paginated fetch with page size: ${pageSize}`);

  while (hasMore) {
    try {
      const { data, error } = await queryBuilder
        .range(from, from + pageSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        console.log(`📄 Fetched page ${Math.floor(from / pageSize) + 1}: ${data.length} rows (Total: ${allData.length})`);
        from += pageSize;
        hasMore = data.length === pageSize;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`❌ Error fetching page starting at ${from}:`, error);
      throw error;
    }
  }

  console.log(`✅ Completed paginated fetch. Total rows: ${allData.length}`);
  return allData;
};

// Data fetching functions
export const fetchConcremData = async () => {
  try {
    console.log('🔍 Fetching ALL data from Concrem_Value table using pagination...');
    
    // First, get the total count
    const { count: totalCount, error: countError } = await supabase
      .from('Concrem_Value')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;
    
    console.log(`📊 Total rows in database: ${totalCount}`);
    
    // Build the base query
    const baseQuery = supabase
      .from('Concrem_Value')
      .select('*')
      .order('LINE_AMOUNT', { ascending: false });

    // Fetch all data using pagination
    const data = await fetchAllData(baseQuery);
    
    console.log(`📊 Final results:`);
    console.log(`   - Total rows in database: ${totalCount}`);
    console.log(`   - Rows returned: ${data?.length || 0}`);
    console.log(`   - First row sample:`, data?.[0]);
    console.log(`   - Last row sample:`, data?.[data?.length - 1]);
    
    if (data && data.length > 0) {
      console.log(`   - Sample quantities:`, data.slice(0, 5).map(row => ({
        QUANTIDADE: row.QUANTIDADE,
        VRLUNIT: row.VRLUNIT,
        LINE_AMOUNT: row.LINE_AMOUNT
      })));
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    throw error;
  }
};

export const fetchDataByAcabamento = async () => {
  try {
    console.log('🔍 Fetching ALL acabamento data from Concrem_Value table using pagination...');
    
    // First, get the total count for acabamento data
    const { count: totalCount, error: countError } = await supabase
      .from('Concrem_Value')
      .select('*', { count: 'exact', head: true })
      .not('ACABAMENTO', 'is', null);

    if (countError) throw countError;
    
    console.log(`📊 Total rows with acabamento in database: ${totalCount}`);
    
    // Build the base query for acabamento data
    const baseQuery = supabase
      .from('Concrem_Value')
      .select('*')
      .not('ACABAMENTO', 'is', null)
      .order('LINE_AMOUNT', { ascending: false });

    // Fetch all data using pagination
    const data = await fetchAllData(baseQuery);
    
    console.log(`📊 Acabamento final results:`);
    console.log(`   - Total rows with acabamento: ${totalCount}`);
    console.log(`   - Rows returned: ${data?.length || 0}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching acabamento data:', error);
    throw error;
  }
};

// Function to get total row count
export const getTotalRowCount = async () => {
  try {
    const { count, error } = await supabase
      .from('Concrem_Value')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log(`📈 Total rows in Concrem_Value table: ${count}`);
    return count;
  } catch (error) {
    console.error('❌ Error getting row count:', error);
    throw error;
  }
};
