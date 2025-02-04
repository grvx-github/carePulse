"use client"

import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../status-badge"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../appointment-modal"
import { Timestamp } from "firebase/firestore"
import { formatSchedule } from "@/lib/utils"

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original
      return <p className="text-14-medium">{appointment.patient}</p>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status as Status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatSchedule(row.original.schedule)}
      </p>
    ),
  },

  {
    accessorKey: "primaryPhysician",
    header: () => "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      )

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt={`${doctor?.name}`}
            height={100}
            width={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            patientId={data.patientId}
            userId={data.userId}
            appointment={data}
          />
          <AppointmentModal
            type="cancel"
            patientId={data.patientId}
            userId={data.userId}
            appointment={data}
          />
        </div>
      )
    },
  },
]
