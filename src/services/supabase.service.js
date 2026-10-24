import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mcynpfcozpxabgymjxov.supabase.co"
const supabaseKey = "sb_publishable_t9NNVAVK9Oph1tOotTd41Q_SWpfFPq1"

export const supabase = createClient(supabaseUrl, supabaseKey);

