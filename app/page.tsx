import Image from "next/image"
import { Button } from "@/components/ui/button"
import PatientForm from "@/components/forms/patient-form"
import Link from "next/link"
import PasskeyModal from "@/components/passkey-modal"

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === "true"

  return (
    <main className="text-white flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src={"/assets/icons/logo-full.svg"}
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              &#169; 2024 CarePulse
            </p>
            <Link href={"/?admin=true"} className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src={"/assets/images/onboarding-img.png"}
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </main>
  )
}
