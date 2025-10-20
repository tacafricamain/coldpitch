import { supabase } from '../lib/supabase';
import type { Prospect } from '../types';
import { staffService } from './staffService';

// DiceBear avatar generator
export const generateAvatarUrl = (seed: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

// Generate a unique seed for new prospects
export const generateAvatarSeed = (name: string) => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
};

// Convert database row to Prospect type
const mapDbToProspect = (row: any): Prospect => {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    company: row.company,
    role: row.role,
    website: row.website,
    country: row.country,
    state: row.state,
    niche: row.niche,
    hasSocials: row.has_socials || false,
    socialLinks: row.social_links || {},
    modeOfReachout: row.mode_of_reachout || 'Email',
    status: row.status || 'New',
    tags: row.tags || [],
    source: row.source,
    generatedPitch: row.generated_pitch,
    websiteAnalysis: row.website_analysis,
    avatarUrl: row.avatar_seed ? generateAvatarUrl(row.avatar_seed) : undefined,
    dateAdded: row.date_added,
    lastActivity: row.last_activity,
  };
};

// Convert Prospect type to database row
const mapProspectToDb = (prospect: Partial<Prospect>) => {
  return {
    name: prospect.name,
    email: prospect.email,
    phone: prospect.phone,
    whatsapp: prospect.whatsapp,
    company: prospect.company,
    role: prospect.role,
    website: prospect.website,
    country: prospect.country,
    state: prospect.state,
    niche: prospect.niche,
    has_socials: prospect.hasSocials || false,
    social_links: prospect.socialLinks || {},
    mode_of_reachout: prospect.modeOfReachout || 'Email',
    status: prospect.status || 'New',
    tags: prospect.tags || [],
    source: prospect.source,
    generated_pitch: prospect.generatedPitch,
    website_analysis: prospect.websiteAnalysis,
    avatar_seed: prospect.avatarUrl ? undefined : generateAvatarSeed(prospect.name || 'user'),
    date_added: prospect.dateAdded,
    last_activity: prospect.lastActivity,
  };
};

export const prospectService = {
  // Get all prospects
  async getAllProspects(): Promise<Prospect[]> {
    console.log('🔍 Fetching all prospects...');
    console.log('   - Environment:', import.meta.env.MODE);
    console.log('   - Supabase URL:', import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...');
    console.log('   - Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
    
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 Prospects query result:');
    console.log('   - Error:', error);
    console.log('   - Data count:', data?.length || 0);
    console.log('   - First few records:', data?.slice(0, 3));

    if (error) {
      console.error('❌ Error fetching prospects:', error);
      console.error('   - Code:', error.code);
      console.error('   - Message:', error.message);
      console.error('   - Details:', error.details);
      console.error('   - Hint:', error.hint);
      
      // Additional debugging for production
      if (import.meta.env.PROD) {
        console.error('🚨 PRODUCTION ERROR - Additional context:');
        console.error('   - URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
        console.error('   - Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
        console.error('   - Supabase client:', supabase);
      }
      
      throw error;
    }

    const mappedProspects = (data || []).map(mapDbToProspect);
    console.log('✅ Mapped prospects count:', mappedProspects.length);
    
    return mappedProspects;
  },

  // Get prospect by ID
  async getProspectById(id: string): Promise<Prospect | null> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching prospect:', error);
      throw error;
    }

    return data ? mapDbToProspect(data) : null;
  },

  // Create new prospect
  async createProspect(prospect: Partial<Prospect>, userId?: string, userName?: string): Promise<Prospect> {
    const dbData = {
      ...mapProspectToDb(prospect),
      user_id: userId,
      added_by: userName,
    };
    
    const { data, error } = await supabase
      .from('prospects')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating prospect:', error);
      throw error;
    }

    // Log the activity (don't fail the whole operation if logging fails)
    if (userId && userName) {
      try {
        await staffService.createActivityLog({
          user_id: userId,
          user_name: userName,
          action: 'added prospect',
          entity_type: 'prospect',
          entity_id: data.id,
          details: {
            name: prospect.name,
            company: prospect.company,
            status: prospect.status || 'New',
          },
        });
      } catch (logError) {
        // Log to console but don't throw - activity logging shouldn't break the main operation
        console.warn('Failed to log activity (non-fatal):', logError);
      }
    }

    return mapDbToProspect(data);
  },

  // Update prospect
  async updateProspect(id: string, updates: Partial<Prospect>, userId?: string, userName?: string): Promise<Prospect> {
    const dbData = mapProspectToDb(updates);
    
    const { data, error } = await supabase
      .from('prospects')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prospect:', error);
      throw error;
    }

    // Log activity if user info provided (don't fail the whole operation if logging fails)
    if (userId && userName) {
      try {
        const updatedProspect = mapDbToProspect(data);
        await staffService.createActivityLog({
          user_id: userId,
          user_name: userName,
          action: 'updated prospect',
          entity_type: 'prospect',
          entity_id: id,
          details: {
            name: updatedProspect.name,
            company: updatedProspect.company,
            status: updatedProspect.status,
            changes: Object.keys(updates)
          }
        });
      } catch (logError) {
        // Log to console but don't throw - activity logging shouldn't break the main operation
        console.warn('Failed to log activity (non-fatal):', logError);
      }
    }

    return mapDbToProspect(data);
  },

  // Delete prospect
  async deleteProspect(id: string): Promise<void> {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting prospect:', error);
      throw error;
    }
  },

  // Bulk delete prospects
  async bulkDeleteProspects(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error bulk deleting prospects:', error);
      throw error;
    }
  },

  // Bulk create prospects (for import)
  async bulkCreateProspects(prospects: Partial<Prospect>[]): Promise<Prospect[]> {
    const dbData = prospects.map(mapProspectToDb);
    
    const { data, error } = await supabase
      .from('prospects')
      .insert(dbData)
      .select();

    if (error) {
      console.error('Error bulk creating prospects:', error);
      throw error;
    }

    return (data || []).map(mapDbToProspect);
  },

  // Search prospects
  async searchProspects(query: string): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching prospects:', error);
      throw error;
    }

    return (data || []).map(mapDbToProspect);
  },

  // Filter by status
  async getProspectsByStatus(status: string): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prospects by status:', error);
      throw error;
    }

    return (data || []).map(mapDbToProspect);
  },

  // Get prospect stats
  async getStats() {
    const { data, error } = await supabase
      .from('prospects')
      .select('status');

    if (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      new: data?.filter((p) => p.status === 'New').length || 0,
      contacted: data?.filter((p) => p.status === 'Contacted').length || 0,
      qualified: data?.filter((p) => p.status === 'Qualified').length || 0,
      converted: data?.filter((p) => p.status === 'Converted').length || 0,
    };

    return stats;
  },
};
