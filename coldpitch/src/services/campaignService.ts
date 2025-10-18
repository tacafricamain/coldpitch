import { supabase } from '../lib/supabase';
import type { Campaign } from '../types';

export const campaignService = {
  // Get all campaigns
  async getCampaigns(): Promise<Campaign[]> {
    console.log('🔍 Fetching campaigns...');
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('❌ Error fetching campaigns:', error);
      throw error;
    }

    console.log('✅ Campaigns fetched successfully:', data?.length || 0);
    
    // Map database fields to Campaign type
    return (data || []).map(campaign => ({
      ...campaign,
      prospect_ids: campaign.prospect_ids || [],
      totalProspects: campaign.prospect_ids?.length || 0,
      sent: campaign.sent || 0,
      opened: campaign.opened || 0,
      replied: campaign.replied || 0,
      converted: campaign.converted || 0,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    }));
  },

  // Get single campaign by ID
  async getCampaignById(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching campaign:', error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      prospect_ids: data.prospect_ids || [],
      totalProspects: data.prospect_ids?.length || 0,
      sent: data.sent || 0,
      opened: data.opened || 0,
      replied: data.replied || 0,
      converted: data.converted || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Create a new campaign
  async createCampaign(
    campaign: Omit<Campaign, 'id' | 'sent' | 'opened' | 'replied' | 'converted' | 'createdAt' | 'updatedAt' | 'totalProspects'>
  ): Promise<Campaign> {
    console.log('📝 Creating campaign:', campaign.name);

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name: campaign.name,
        status: campaign.status,
        type: campaign.type,
        subject: campaign.subject,
        body: campaign.body,
        prospect_ids: campaign.prospect_ids,
        created_by: campaign.created_by,
        created_by_name: campaign.created_by_name,
        scheduled_date: campaign.scheduled_date,
        sent: 0,
        opened: 0,
        replied: 0,
        converted: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating campaign:', error);
      throw error;
    }

    console.log('✅ Campaign created successfully:', data.id);

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: campaign.created_by,
        user_name: campaign.created_by_name,
        action: 'created campaign',
        entity_type: 'campaign',
        entity_id: data.id,
        details: { campaign_name: campaign.name },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }

    return {
      ...data,
      prospect_ids: data.prospect_ids || [],
      totalProspects: data.prospect_ids?.length || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Update an existing campaign
  async updateCampaign(
    id: string,
    updates: Partial<Campaign>,
    userId: string,
    userName: string
  ): Promise<Campaign> {
    console.log('📝 Updating campaign:', id);

    const { data, error } = await supabase
      .from('campaigns')
      .update({
        name: updates.name,
        status: updates.status,
        type: updates.type,
        subject: updates.subject,
        body: updates.body,
        prospect_ids: updates.prospect_ids,
        scheduled_date: updates.scheduled_date,
        sent_at: updates.sent_at,
        sent: updates.sent,
        opened: updates.opened,
        replied: updates.replied,
        converted: updates.converted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating campaign:', error);
      throw error;
    }

    console.log('✅ Campaign updated successfully');

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_name: userName,
        action: 'updated campaign',
        entity_type: 'campaign',
        entity_id: id,
        details: { campaign_name: data.name },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }

    return {
      ...data,
      prospect_ids: data.prospect_ids || [],
      totalProspects: data.prospect_ids?.length || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Delete a campaign
  async deleteCampaign(id: string, userId: string, userName: string): Promise<void> {
    console.log('🗑️ Deleting campaign:', id);

    // Get campaign name for activity log
    const campaign = await this.getCampaignById(id);

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting campaign:', error);
      throw error;
    }

    console.log('✅ Campaign deleted successfully');

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_name: userName,
        action: 'deleted campaign',
        entity_type: 'campaign',
        entity_id: id,
        details: { campaign_name: campaign?.name || 'Unknown' },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }
  },

  // Send bulk emails for a campaign
  async sendBulkEmails(
    campaignId: string,
    userId: string,
    userName: string
  ): Promise<{ sent: number; failed: number }> {
    console.log('📧 Sending bulk emails for campaign:', campaignId);

    // Get campaign details
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'Active' && campaign.status !== 'Draft') {
      throw new Error('Campaign must be Active or Draft to send emails');
    }

    // Get prospects
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .select('id, name, email')
      .in('id', campaign.prospect_ids);

    if (prospectsError) {
      console.error('❌ Error fetching prospects:', prospectsError);
      throw prospectsError;
    }

    if (!prospects || prospects.length === 0) {
      throw new Error('No prospects found for this campaign');
    }

    let sent = 0;
    let failed = 0;

    // Send emails to each prospect
    for (const prospect of prospects) {
      if (!prospect.email) {
        console.warn(`⚠️ Prospect ${prospect.name} has no email address`);
        failed++;
        continue;
      }

      try {
        // TODO: Integrate with actual email service (SendGrid, etc.)
        // For now, we'll simulate email sending
        console.log(`📧 Sending email to ${prospect.email}...`);
        
        // Simulate email send delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Log the email activity
        await supabase.from('activity_logs').insert({
          user_id: userId,
          user_name: userName,
          action: 'sent email',
          entity_type: 'campaign',
          entity_id: campaignId,
          details: {
            campaign_name: campaign.name,
            prospect_id: prospect.id,
            prospect_name: prospect.name,
            prospect_email: prospect.email,
          },
          timestamp: new Date().toISOString(),
        });

        sent++;
      } catch (error) {
        console.error(`❌ Failed to send email to ${prospect.email}:`, error);
        failed++;
      }
    }

    // Update campaign stats
    await this.updateCampaign(
      campaignId,
      {
        sent: (campaign.sent || 0) + sent,
        status: 'Active',
        sent_at: new Date().toISOString(),
      },
      userId,
      userName
    );

    console.log(`✅ Bulk email complete: ${sent} sent, ${failed} failed`);

    return { sent, failed };
  },

  // Get campaign statistics
  async getCampaignStats(campaignId: string): Promise<{
    sent: number;
    opened: number;
    replied: number;
    converted: number;
    openRate: number;
    replyRate: number;
    conversionRate: number;
  }> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const sent = campaign.sent || 0;
    const opened = campaign.opened || 0;
    const replied = campaign.replied || 0;
    const converted = campaign.converted || 0;

    return {
      sent,
      opened,
      replied,
      converted,
      openRate: sent > 0 ? (opened / sent) * 100 : 0,
      replyRate: sent > 0 ? (replied / sent) * 100 : 0,
      conversionRate: sent > 0 ? (converted / sent) * 100 : 0,
    };
  },
};
