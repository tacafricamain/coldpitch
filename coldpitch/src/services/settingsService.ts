import { supabase } from '../lib/supabase';
import type { Settings } from '../types';

export const settingsService = {
  // Get user settings
  async getSettings(userId: string): Promise<Settings | null> {
    console.log('🔍 Fetching settings for userId:', userId, 'Type:', typeof userId);
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('❌ Error fetching settings:', error);
      throw error;
    }

    if (error && error.code === 'PGRST116') {
      console.log('ℹ️ No settings found for user:', userId);
      return null;
    }

    console.log('✅ Settings fetched successfully:', data);
    return data;
  },

  // Create or update settings
  async upsertSettings(userId: string, settings: Partial<Settings>): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Update profile settings
  async updateProfile(userId: string, profile: Settings['profile']): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .update({
        profile,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Update notification settings
  async updateNotifications(userId: string, notifications: Settings['notifications']): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .update({
        notifications,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Update API keys
  async updateApiKeys(userId: string, apiKeys: Settings['api_keys']): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .update({
        api_keys: apiKeys,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Update team settings
  async updateTeamSettings(userId: string, teamSettings: Settings['team_settings']): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .update({
        team_settings: teamSettings,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
