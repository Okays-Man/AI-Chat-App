import { auth } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  try {
    await auth.checkAuth({
        Cookie: cookieStore.toString()
    });
  } catch (error) {
    redirect('/login');
  }

  return <>{children}</>;
}