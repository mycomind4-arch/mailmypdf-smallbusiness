// Cloudflare Pages Function — returns public Supabase config at runtime
export const onRequestGet: PagesFunction = async () => {
  const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const anonKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    return Response.json({ configured: false, url: null, anonKey: null });
  }

  return Response.json({ configured: true, url, anonKey });
};
