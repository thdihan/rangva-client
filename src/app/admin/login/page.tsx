import type { Metadata } from "next"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
  title: "Login - RANGVA Admin Dashboard",
  description: "Sign in to your RANGVA Admin account",
}

export default function LoginPage() {
  return <LoginForm />
}
