// ==========================================
// SUPABASE KEEP-ALIVE CRON JOB
// This function runs every 3 days to keep 
// the Supabase free tier database active
// ==========================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    try {
        // Get Supabase credentials from environment variables
        const supabaseUrl = process.env.SUPABASE_URL || 'https://misbpisiyxsyxkwhttxh.supabase.co';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_MthEVIBk0iRKcuHvVy5Mlg_o0GMMFsB';

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Perform a simple query to keep the database active
        const { data, error } = await supabase
            .from('certificates')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Keep-alive query error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to ping database',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }

        // Log success
        console.log('Keep-alive ping successful at:', new Date().toISOString());

        return res.status(200).json({
            success: true,
            message: 'Database pinged successfully',
            timestamp: new Date().toISOString(),
            recordsFound: data ? data.length : 0
        });

    } catch (error) {
        console.error('Keep-alive function error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
