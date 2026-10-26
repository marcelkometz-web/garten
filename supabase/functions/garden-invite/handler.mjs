const originAllowed='https://marcelkometz-web.github.io';
const redirectTo='https://marcelkometz-web.github.io/garten/';
export function createInviteHandler({createClient,env}){
  return async request=>{
    const origin=request.headers.get('origin'),headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS',...(origin===originAllowed?{'Access-Control-Allow-Origin':origin}:{})};
    const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers});
    if(origin!==originAllowed)return reply(403,{error:'Diese Herkunft ist nicht freigegeben.'});
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(request.method!=='POST')return reply(405,{error:'Methode nicht erlaubt.'});
    if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'JSON erforderlich.'});
    const token=request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];if(!token)return reply(401,{error:'Bitte melde dich an.'});
    let input;
    try{const reader=request.body?.getReader();if(!reader)throw new Error();let size=0,text='';const decoder=new TextDecoder();try{while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>4096){await reader.cancel();throw new Error();}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();input=JSON.parse(text);}finally{reader.releaseLock();}}catch{return reply(400,{error:'Ungültige Eingabe.'});}
    if(typeof input?.email!=='string'||input.email.length>254||typeof input.unlock_token!=='string'||!/^[a-f0-9]{64}$/.test(input.unlock_token))return reply(400,{error:'E-Mail-Adresse und aktuelle Adminfreigabe erforderlich.'});
    let publicKey=env('SUPABASE_ANON_KEY'),secretKey=env('SUPABASE_SERVICE_ROLE_KEY');
    try{publicKey=JSON.parse(env('SUPABASE_PUBLISHABLE_KEYS')||'{}').default||publicKey;secretKey=JSON.parse(env('SUPABASE_SECRET_KEYS')||'{}').default||secretKey;}catch{/* Legacy configuration remains supported. */}
    if(!publicKey||!secretKey)return reply(503,{error:'Der Einladungsversand ist noch nicht eingerichtet.'});
    const options={auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(url,init={})=>fetch(url,{...init,signal:init.signal||AbortSignal.timeout(20000)})}};
    const userClient=createClient(env('SUPABASE_URL'),publicKey,{...options,global:{...options.global,headers:{Authorization:`Bearer ${token}`}}}),admin=createClient(env('SUPABASE_URL'),secretKey,options);
    let reservation=null,actor=null;
    try{
      const verified=await userClient.auth.getUser(token);actor=verified.data?.user?.id;
      if(verified.error||!actor)return reply(401,{error:'Deine Anmeldung ist abgelaufen.'});
      const reserved=await userClient.rpc('rg_admin_invitation',{action:'reserve',email_address:input.email,unlock_token:input.unlock_token});input.unlock_token='';
      if(reserved.error)return reply(403,{error:reserved.error.message});
      reservation=reserved.data;
      if(!reservation?.id||!reservation.email)throw new Error('Invalid reservation');
      // The browser cannot choose redirect, role, family or an existing account.
      const invited=await admin.auth.admin.inviteUserByEmail(reservation.email,{redirectTo});
      if(invited.error){
        await admin.rpc('rg_finish_invitation',{invitation_id:reservation.id,actor_id:actor,delivered:false});
        const limited=invited.error.status===429||/rate.limit|email.*limit/i.test(invited.error.code||'');
        return reply(limited?429:503,{error:limited?'Das E-Mail-Limit von Supabase ist erreicht. Bitte später erneut versuchen.':'Supabase konnte die Einladung nicht versenden. Beim kostenlosen Standardversand sind Empfänger und Versandmenge eingeschränkt; bitte die Auth-E-Mail-Einstellungen prüfen.'});
      }
      const completed=await admin.rpc('rg_finish_invitation',{invitation_id:reservation.id,actor_id:actor,recipient_id:invited.data?.user?.id,delivered:true});
      if(completed.error||completed.data?.sent!==true)throw new Error('Invitation not recorded');
      return reply(200,{sent:true});
    }catch{return reply(503,{error:reservation?'Der Versandstatus konnte nicht sicher bestätigt werden. Bitte die Einladungsübersicht prüfen, bevor du erneut sendest.':'Die Einladung konnte nicht ausgeführt werden. Bitte später erneut versuchen.'});}
  };
}
