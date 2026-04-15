import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ceptyekecjzpoustlpan.supabase.co";
const supabaseKey = "sb_publishable__Df9ViMfNfdutb-BfqfqSw_ClsBdFkU";

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        persistSession: false,
        detectSessionInUrl: false,
    }
});