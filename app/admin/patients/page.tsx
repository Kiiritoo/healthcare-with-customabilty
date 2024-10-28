import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";

import { PatientList } from "@/components/PatientList";
import { getAllPatients } from "@/lib/actions/patient.actions";
import { decryptKey } from "@/lib/utils";

const PatientAdminPage = async () => {
  // Check for admin access on the server side
  const cookieStore = cookies();
  const accessKey = cookieStore.get('accessKey')?.value;

  if (!accessKey) {
    redirect("/?admin=true");
  }

  const decryptedKey = decryptKey(accessKey);
  if (decryptedKey !== process.env.NEXT_PUBLIC_ADMIN_PATIENT_PASSKEY) {
    redirect("/?admin=true");
  }

  const patients = await getAllPatients();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/admin" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <div className="flex items-center gap-4">
          <p className="text-16-semibold">Patient Admin Dashboard</p>
          <LogoutButton />
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Patient Records 📋</h1>
          <p className="text-dark-700">
            View and manage patient information
          </p>
        </section>

        <PatientList patients={patients} />
      </main>
    </div>
  );
};

export default PatientAdminPage;
