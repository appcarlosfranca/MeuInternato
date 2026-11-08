/* Supabase JS 2.119.0 is vendored for reproducible static hosting.
 * This gate controls UI access. Public static assets are not confidential.
 * Data added to Supabase must be protected separately with RLS.
 */
(() => {
  'use strict';
  const panel = document.getElementById('authPanel');
  const status = document.getElementById('authStatus');
  const form = document.getElementById('loginForm');
  const submit = document.getElementById('loginSubmit');
  if (!window.supabase) {
    status.textContent = 'Não foi possível carregar o login. Recarregue a página.';
    submit.disabled = true;
    return;
  }
  const client = window.supabase.createClient(
    window.CIRURGIA_SUPABASE_CONFIG.url,
    window.CIRURGIA_SUPABASE_CONFIG.publishableKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'cirurgia-auth-v1' } }
  );
  window.CirurgiaAuthClient=client;
  let started = false, owner = null, checking = null;
  function lock(message) {
    document.body.classList.add('auth-locked');
    panel.hidden = false;
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
    status.textContent = message;
  }
  function script(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = () => reject(new Error('Falha ao carregar o app.'));
      document.body.appendChild(el);
    });
  }
  async function verify() {
    if (checking) return checking;
    checking = (async () => {
      if(!started)lock('Verificando sessão…');
      try {
        const { data, error } = await client.auth.getUser();
        if (error || !data.user) {
          lock('Entre para continuar. É necessário estar conectado à internet.');
          return;
        }
        if (owner && owner !== data.user.id) { location.reload(); return; }
        owner = data.user.id;
        const binding=localStorage.getItem('cirurgia-sync-owner-v1');
        if(binding&&binding!==owner){
          const keys=['cirurgia-carlos-v1','cirurgia-library-v2'];
          const archive=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
          localStorage.setItem('cirurgia-user-archive-'+binding,JSON.stringify(archive));
          const target=JSON.parse(localStorage.getItem('cirurgia-user-archive-'+owner)||'{}');
          for(const key of keys){if(target[key])localStorage.setItem(key,target[key]);else localStorage.removeItem(key)}
        }
        localStorage.setItem('cirurgia-sync-owner-v1',owner);
        // Restore local data only for the validated owner before the app loads.
        if (!started) {
          started = true;
          for (const file of ['seed.js', 'library-data.js', 'library.js', 'app.js', 'sync.js']) await script(file);
          document.getElementById('logout').onclick = async () => {
            lock('Saindo…');
            // Clear this browser's session even if the network is unavailable.
            await client.auth.signOut({ scope: 'local' }).catch(() => {});
            location.reload();
          };
        }
        document.body.classList.remove('auth-locked');
        panel.hidden = true;
        document.getElementById('authPassword').value = '';
      } catch {
        lock('Não foi possível validar o acesso. Verifique a conexão e recarregue.');
      }
    })().finally(() => { checking = null; });
    return checking;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    submit.disabled = true;
    status.textContent = 'Entrando…';
    try {
      const { error } = await client.auth.signInWithPassword({
        email: document.getElementById('authEmail').value.trim(),
        password: document.getElementById('authPassword').value
      });
      if (error) { lock('Acesso não concluído. Confira e-mail, senha e confirmação da conta.'); return; }
      await verify();
    } catch { lock('Sem conexão com o serviço de login. Tente novamente.'); }
    finally { submit.disabled = false; }
  });
  document.getElementById('authSignup').onclick=async()=>{
    if(!form.reportValidity())return;
    submit.disabled=true;status.textContent='Criando conta…';
    try{const {data,error}=await client.auth.signUp({email:document.getElementById('authEmail').value.trim(),password:document.getElementById('authPassword').value});
      if(error){status.textContent=error.message;return}
      if(data.session)await verify();else status.textContent='Confirme o e-mail recebido e retorne a esta tela para entrar.';
    }catch{status.textContent='Não foi possível criar a conta. Verifique a conexão.'}finally{submit.disabled=false}
  };
  // Keep this callback synchronous: calling Auth methods inside it can deadlock.
  client.auth.onAuthStateChange(event => {
    if (event === 'SIGNED_OUT') {
      lock('Sessão encerrada. Entre novamente.');
      if (started) location.reload();
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      setTimeout(verify, 0);
    }
  });
  window.addEventListener('offline', () => lock('Sem internet. Conecte-se para validar seu acesso.'));
  window.addEventListener('online', verify);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) lock('Verificando sessão…');
    else verify();
  });
  setInterval(verify, 60000);
  // Register immediately so existing offline installs can receive the gate update.
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
  verify();
})();
