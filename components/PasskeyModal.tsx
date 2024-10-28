"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

export const PasskeyModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    const isAdmin = searchParams.get('admin') === 'true';
    const isPatientAdmin = pathname.includes('/admin/patients');

    // Load attempts and lockout state from localStorage
    const storedAttempts = localStorage.getItem("passkeyAttempts");
    const storedLockoutEndTime = localStorage.getItem("passkeyLockoutEndTime");

    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts, 10));
    }

    if (storedLockoutEndTime) {
      const endTime = parseInt(storedLockoutEndTime, 10);
      if (Date.now() < endTime) {
        setIsLocked(true);
        setLockoutEndTime(endTime);
      } else {
        localStorage.removeItem("passkeyAttempts");
        localStorage.removeItem("passkeyLockoutEndTime");
      }
    }

    // Check for patient admin access
    if (isPatientAdmin) {
      if (!accessKey || accessKey !== process.env.NEXT_PUBLIC_ADMIN_PATIENT_PASSKEY) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
    // Check for regular admin access
    else if (isAdmin) {
      if (!accessKey || accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(true);
      } else {
        setOpen(false);
        router.push("/admin");
      }
    }
  }, [encryptedKey, searchParams, router, pathname]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockoutEndTime) {
      timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          setIsLocked(false);
          setLockoutEndTime(null);
          localStorage.removeItem("passkeyAttempts");
          localStorage.removeItem("passkeyLockoutEndTime");
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutEndTime]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (isLocked) {
      setError("You are temporarily locked out. Please try again later.");
      return;
    }

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      document.cookie = `accessKey=${encryptedKey}; path=/`;
      setOpen(false);
      router.push("/admin");
      localStorage.removeItem("passkeyAttempts");
    } else if (passkey === process.env.NEXT_PUBLIC_ADMIN_PATIENT_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      document.cookie = `accessKey=${encryptedKey}; path=/`;
      setOpen(false);
      router.push("/admin/patients");
      localStorage.removeItem("passkeyAttempts");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("passkeyAttempts", newAttempts.toString());
      setError("Invalid passkey. Please try again.");

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        const endTime = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(endTime);
        localStorage.setItem("passkeyLockoutEndTime", endTime.toString());
        setError("Too many failed attempts. You are locked out for 5 minutes.");
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
            disabled={isLocked}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
          {isLocked && lockoutEndTime && (
            <p className="text-14-regular mt-4 flex justify-center">
              Locked out until: {new Date(lockoutEndTime).toLocaleTimeString()}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
            disabled={isLocked}
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
