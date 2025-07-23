import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic"; // This disables SSG and ISR

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <h1>Selamat datang, {session?.user?.name}</h1>;
}
