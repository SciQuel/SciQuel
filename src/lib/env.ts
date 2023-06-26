export default {
  NEXT_PUBLIC_SITE_URL: process.env.VERCEL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL,
};
