import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic"; // This disables SSG and ISR

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <h1>Selamat datang, {session?.user?.name}</h1>;
}
