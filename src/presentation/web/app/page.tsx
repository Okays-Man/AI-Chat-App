import { redirect } from 'next/navigation';
import { auth } from "@/lib/api";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  
  const cookieHeader = cookieStore.toString();

  try {
    await auth.checkAuth({
        Cookie: cookieHeader
    });
    redirect('/chat');
  } catch (error) {
    redirect('/login');
  }
}