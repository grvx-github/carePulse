/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

declare type Gender = "Male" | "Female" | "Other"
declare type Status = "pending" | "scheduled" | "cancelled"

declare interface CreateUserParams {
  name: string
  email: string
  phone: string
}
declare interface User extends CreateUserParams {
  id: string
}

declare interface FileUploaderProps {
  files: File[] | undefined
  onChange: (files: File) => void
}

declare interface customProps {
  control: Control<any>
  fieldType: FormFieldType
  name: string
  label?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  renderSkeleton?: (field: any) => React.ReactNode
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string
  birthDate: Date
  gender: Gender
  address: string
  occupation: string
  emergencyContactName: string
  emergencyContactNumber: string
  primaryPhysician: string
  insuranceProvider: string
  insurancePolicyNumber: string
  allergies: string | undefined
  currentMedication: string | undefined
  familyMedicalHistory: string | undefined
  pastMedicalHistory: string | undefined
  identificationType: string | undefined
  identificationNumber: string | undefined
  identificationDocument: FormData | undefined
  privacyConsent: boolean
}

declare type CreateAppointmentParams = {
  id?: string
  patientId: string
  userId: string
  primaryPhysician: string
  reason: string
  schedule: Date
  status: Status
  note: string | undefined
}

declare type UpdateAppointmentParams = {
  appointment: Appointment
  type: string
}

declare type StatCardProps = {
  type: "appointments" | "pending" | "cancelled"
  count: number
  label: string
  icon: string
}

declare type Appointment = {
  patient: string
  cancellationReason?: string | undefined
  id: string
  userId: string
  patientId: string
  primaryPhysician: string
  reason: string
  schedule: Timestamp
  status: string
  note?: string
}
