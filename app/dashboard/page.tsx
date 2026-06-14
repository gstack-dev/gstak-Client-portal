import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/components/web/LogOutButton";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="">
      <h1>Dashboard</h1>
      {session?.user ?(
        <LogoutButton />
      ):  <Link href="/login">Login</Link>}
    </div>
  );
}
