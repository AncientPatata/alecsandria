import React from "react";
import { useSession } from "next-auth/react";
import AccessDenied from "../../components/accessDenied";

export default function Page() {
  const { data, status } = useSession();

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && status == "loading") return null;

  // If no session exists, display access denied message
  if (status == "unauthenticated") {
    return <AccessDenied />;
  }

  // If session exists, display content
  return (
    <>
      <h1>Protected Page</h1>
      <p>
        <strong>Welcome {data?.user?.name}</strong>
      </p>
    </>
  );
}
