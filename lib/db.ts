import AsyncStorage from "@react-native-async-storage/async-storage";
import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://foqxuhycqykvwsjulwud.supabase.co";
const supabaseKey = "sb_publishable_YBMc7g-kxNGfD8YF67rE2w_wvcsQ1Ll";

export const supabase =  createClient(supabaseUrl,supabaseKey, {
    auth:{
        storage:AsyncStorage,
        persistSession:false,
        detectSessionInUrl:false
    }
})