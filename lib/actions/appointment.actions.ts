// lib/actions/appointment.actions.ts
"use server"

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "../firebase"
import { formatSchedule, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"
import twilio from "twilio"

// Initialize Twilio client
const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioClient = twilio(accountSid, authToken)

export const createAppointment = async (
  appointmentData: CreateAppointmentParams
) => {
  try {
    const appointmentsCollectionRef = collection(
      db,
      `users/${appointmentData.userId}/patients/${appointmentData.patientId}/appointments`
    )
    const docRef = await addDoc(appointmentsCollectionRef, appointmentData)

    // Create the appointment in the global collection
    const globalAppointmentData = {
      ...appointmentData,
      userId: appointmentData.userId,
      patientId: appointmentData.patientId,
    }

    const globalAppointmentsCollectionRef = collection(db, "appointments")

    const globalDocRef = await addDoc(
      globalAppointmentsCollectionRef,
      globalAppointmentData
    )
    revalidatePath("/admin")
    return { ...appointmentData, id: docRef.id }
  } catch (error) {
    console.error("Error creating appointment: ", error)
    throw new Error("Could not create appointment")
  }
}

export const updateAppointment = async (
  appointmentToUpdate: UpdateAppointmentParams
) => {
  try {
    const { appointment, type } = appointmentToUpdate

    if (!appointment || !appointment.id) {
      throw new Error("Invalid appointment data")
    }

    const appointmentRef = doc(db, "appointments", appointment.id)

    // Check if the document exists before attempting to update it
    const appointmentSnap = await getDoc(appointmentRef)
    if (!appointmentSnap.exists()) {
      throw new Error(`No appointment found with ID ${appointment.id}`)
    }

    const updateData = { ...appointment }
    if (type !== "cancel") {
      delete updateData.cancellationReason
    }

    await updateDoc(appointmentRef, updateData)

    // Optionally, you might want to verify the update
    const updatedSnap = await getDoc(appointmentRef)
    if (!updatedSnap.exists()) {
      throw new Error("Failed to update appointment")
    }

    revalidatePath("/admin") // Ensure this is correct and needed
    if (appointment) {
      const smsMessage = `Hi, it's CarePulse. ${
        type === "schedule"
          ? `Your appointment has been scheduled for ${formatSchedule(
              Timestamp.fromDate(appointment.schedule)
            )} with Dr. ${appointment.primaryPhysician}.`
          : `We regret to inform you that your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
      }`

      await sendSMSNotification(appointment.userId, smsMessage)
    }

    return parseStringify({ ...appointment, id: appointment.id })
  } catch (error) {
    console.error("Error updating appointment:", error || error)
    throw new Error("Could not update appointment")
  }
}
export const getAppointment = async (
  userId: string,
  patientId: string,
  appointmentId: string
) => {
  try {
    const appointmentRef = doc(
      db,
      `users/${userId}/patients/${patientId}/appointments`,
      appointmentId
    )

    const appointmentSnap = await getDoc(appointmentRef)

    if (appointmentSnap.exists()) {
      const appointmentData = appointmentSnap.data()
      const data = {...appointmentData, id: appointmentSnap.id}
      return parseStringify(data)
    } else {
      console.error("Appointment not found")
      return null
    }
  } catch (error) {
    console.error("Error getting appointment:", error)
    throw new Error("Could not retrieve appointment")
  }
}

export const getAllAppointments = async () => {
  try {
    const appointmentsRef = collection(db, "appointments")
    const querySnapshot = await getDocs(appointmentsRef)

    if (!querySnapshot.empty) {
      const appointmentData = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Appointment),
        id: doc.id,
      }))

      const counts = appointmentData.reduce((acc, appointment) => {
        const status = appointment.status
        if (status) {
          if (!acc[status]) {
            acc[status] = 0
          }
          acc[status]++
        }
        return acc
      }, {} as Record<string, number>)

      const data = {
        appointmentData,
        ...counts,
      }

      return parseStringify(data)
    } else {
      console.error("No appointments found")
      return null
    }
  } catch (error) {
    console.error("Error getting appointments:", error)
    throw new Error("Could not retrieve appointments")
  }
}

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const userPhoneNumber = await getUserPhoneNumber(userId) // Assume this function retrieves the user's phone number
    if (!userPhoneNumber) {
      throw new Error("User phone number not found")
    }

    const message = await twilioClient.messages.create({
      body: content,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: userPhoneNumber,
    })

    return message.sid
  } catch (error) {
    console.error("Error sending SMS notification:", error)
    throw new Error("Could not send SMS notification")
  }
}

// Helper function to retrieve the user's phone number (assume implementation)
const getUserPhoneNumber = async (userId: string): Promise<string | null> => {
  // Retrieve the user's phone number from your database
  // Example implementation
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const userData = userSnap.data()
      return userData.phone as string | null
    } else {
      return null
    }
  } catch (error) {
    console.error("Error retrieving user phone number:", error)
    return null
  }
}
