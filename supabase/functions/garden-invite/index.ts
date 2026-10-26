import {createClient} from 'npm:@supabase/supabase-js@2.106.1';
import {createInviteHandler} from './handler.mjs';
Deno.serve(createInviteHandler({createClient,env:(name:string)=>Deno.env.get(name)||''}));
