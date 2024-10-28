"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth.actions";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "accessKey=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  return (
    <Button onClick={handleLogout} variant="destructive" size="sm">
      Logout
    </Button>
  );
};

export default LogoutButton;
