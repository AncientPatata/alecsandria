import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AccessDenied() {
  const router = useRouter();
  useEffect(() => {
    router.push(`${window.location.origin}/`);
  });
  return (
    <>
      <h1>Access Denied</h1>
      <p>You must be signed in to view this page</p>
    </>
  );
}
