// File: components/forms/appointment-form.tsx

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../custom-form-field"
import SubmitButton from "../submit-button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./patient-form"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/constants"
import Image from "next/image"
import { getAppointmentSchema } from "@/lib/validation"
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions"
import { Timestamp } from "firebase/firestore"

type Status = "pending" | "scheduled" | "cancelled"

interface RegisterUserParams {
  id: string
  name: string
}

const AppointmentForm = ({
  userId,
  patients,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string
  patientId?: string
  patients?: Array<RegisterUserParams>
  type: "create" | "cancel" | "schedule"
  appointment?: Appointment
  setOpen?: (open: boolean) => void
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const AppointmentFormValidation = getAppointmentSchema(type)

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      patient: patients
        ? patients[0].name
        : appointment
        ? appointment.patient
        : "",
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment.schedule.seconds * 1000)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  })

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true)

    let status: Status

    switch (type) {
      case "schedule":
        status = "scheduled"
        break
      case "cancel":
        status = "cancelled"
        break
      default:
        status = "pending"
        break
    }

    try {
      if (type === "create" && patients) {
        const appointmentData = {
          userId,
          patientId:
            patients.find((patient) => patient.name === values.patient)?.id ??
            "",
          patient: values.patient,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason ?? "",
          note: values.note ?? "",
          status,
        }

        const appointment = await createAppointment(appointmentData)

        if (appointment) {
          form.reset()
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}&patientId=${appointmentData.patientId}`
          )
        }
      } else if (appointment) {
        const appointmentToUpdate = {
          appointment: {
            id: appointment.id,
            patient: values.patient,
            userId,
            reason: values.reason ?? "",
            primaryPhysician: values.primaryPhysician,
            schedule: values.schedule,
            patientId:
              patientId ??
              patients?.find((patient) => patient.name === values.patient)
                ?.id ??
              "",
            status,
            cancellationReason: values.cancellationReason ?? "",
          },
          type,
        }

        const updatedAppointment = await updateAppointment(appointmentToUpdate)

        if (updatedAppointment) {
          setOpen && setOpen(false)
          form.reset()
        }
      } else {
        console.error("Appointment data is missing for update")
      }
    } catch (error) {
      console.error("Error in form submission", error)
    } finally {
      setIsLoading(false)
    }
  }

  let buttonLabel

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment"
      break
    case "schedule":
      buttonLabel = "Schedule Appointment"
      break
    case "create":
      buttonLabel = "Create Appointment"
      break
    default:
      buttonLabel = "Submit"
      break
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            {patients && (
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="patient"
                label="Patient"
                placeholder="Select a Patient"
              >
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{patient.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            )}

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a Doctor"
            >
              {Doctors.map((physician) => (
                <SelectItem key={physician.name} value={physician.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={physician.image}
                      alt={`${physician.name}`}
                      height={32}
                      width={32}
                    />
                    <p>{physician.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected Appointment Date"
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason for Appointment"
                placeholder="Enter reason for appointment"
                disabled={type !== "create"}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Notes"
                placeholder="Enter Notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for Cancellation"
            placeholder="Enter a reason for cancellation"
          />
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm
