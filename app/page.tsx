import { redirect } from 'next/navigation'

export default function Home() {
  // This Vercel deployment is for admin only
  // Main site is at littlespaceworld.com (Hostinger)
  redirect('/admin/products')
}
