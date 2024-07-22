// File: pages/index.tsx

import Image from "next/image"
import AppointmentForm from "@/components/forms/appointment-form"
import { getPatient } from "@/lib/actions/patients.actions"

export default async function Home({
  params: { userId },
}: {
  params: { userId: string }
}) {
  const patients = await getPatient(userId)

  return (
    <main className="text-white flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px]">
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patients={patients!}
          />

          <p className="copyright mt-10 py-12">&#169; 2024 CarePulse</p>
        </div>
      </section>
      <Image
        src={"/assets/images/appointment-img.png"}
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </main>
  )
}
