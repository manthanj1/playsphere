import { redirect } from "next/navigation";

export default function Home() {
  // Instantly redirect users from the root URL to the signup page
  redirect("/signup");
}