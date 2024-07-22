"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from "@/lib/utils"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { MouseEvent, useEffect, useState } from "react"

const PasskeyModal = () => {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [passkey, setPasskey] = useState("")
  const [error, setError] = useState("")

  const closeModal = () => {
    setOpen(false)
    router.push("/")
  }

  const path = usePathname()
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("adminPasskey")
      : null

  useEffect(() => {
    const adminPasskey = encryptedKey && decryptKey(encryptedKey)

    if (path)
      if (adminPasskey === process.env.ADMIN_PASSKEY) {
        setOpen(false)
        router.push("/admin")
      } else {
        setOpen(true)
      }
  }, [encryptedKey, path, router])

  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (passkey === process.env.ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey)
      localStorage.setItem("adminPasskey", encryptedKey)
      setOpen(false)
    } else {
      setError("Invalid passkey")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src={"/assets/icons/close.svg"}
              alt="close"
              height={20}
              width={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page please enter the passkey
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
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
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PasskeyModal
