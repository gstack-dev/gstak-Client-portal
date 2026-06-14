import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/components/web/LogOutButton";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      <h1>home</h1>
      {session?.user ?(
        <LogoutButton />
      ):  <Link href="/login">Login</Link>}
    </div>
  );
}
