import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useSupabaseData = (table, query = '*') => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: result, error: fetchError } = await supabase
                    .from(table)
                    .select(query)
                    .order('order', { ascending: true });

                if (fetchError) throw fetchError;
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [table, query]);

    return { data, loading, error };
};

export const useSettings = (section) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value')
                .eq('section', section);

            if (!error && data) {
                const settingsObj = {};
                data.forEach(item => {
                    settingsObj[item.key] = item.value;
                });
                setSettings(settingsObj);
            }
            setLoading(false);
        };

        fetchSettings();
    }, [section]);

    return { settings, loading };
};
