// lib/actions/patients.actions.ts

import {
  addDoc,
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
} from "firebase/firestore"
import { db } from "../firebase"
import { parseStringify } from "../utils"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

export const createUser = async (userData: CreateUserParams) => {
  try {
    // Query to check if the user already exists
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", userData.email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // User already exists, return the existing user
      const existingUserDoc = querySnapshot.docs[0]
      const existingUser = { id: existingUserDoc.id, ...existingUserDoc.data() }
      return existingUser
    }

    // User does not exist, create a new user
    const docRef = await addDoc(usersRef, userData)
    console.log(docRef)

    return { id: docRef.id, ...userData }
  } catch (e) {
    console.error("Error adding document: ", e)
    throw new Error("Failed to create user")
  }
}

export const getUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const user = userSnap.data()
      const userData = parseStringify(user)
      return { ...userData, id: userSnap.id }
    } else {
      console.error("User not found")
    }
  } catch (error) {
    console.error("Error getting document:", error)
  }
}

export const getPatient = async (userId: string) => {
  try {
    // Reference to the 'patients' sub-collection within the specific user's document
    const patientsRef = collection(db, `users/${userId}/patients`)

    // Get all documents in the 'patients' sub-collection
    const querySnapshot = await getDocs(patientsRef)

    if (!querySnapshot.empty) {
      const patientData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      return parseStringify(patientData)
    } else {
      console.error("No patients found")
      return null
    }
  } catch (error) {
    console.error("Error getting documents:", error)
    throw new Error("Could not retrieve patients")
  }
}

export const registerPatient = async ({
  userId,
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let documentURL = ""

    if (identificationDocument) {
      const file = identificationDocument.get("blobFile") as File
      if (!file) {
        throw new Error("File not found in FormData")
      }

      const storage = getStorage()
      const storageRef = ref(storage, `verificationDocuments/${file.name}`)
      await uploadBytes(storageRef, file)
      documentURL = await getDownloadURL(storageRef)
    }

    const patientData = {
      ...patient,
      identificationDocument: documentURL,
    }

    const docRef = await addDoc(
      collection(db, `users/${userId}/patients`),
      patientData
    )

    const globalPatientData = {
      ...patientData,
      userId: userId,
      appointmentRefs: [], // To store references to appointments
    }

    const globalPatientRef = await addDoc(
      collection(db, "patients"),
      globalPatientData
    )
    return { id: docRef.id, ...patientData }
  } catch (error) {
    console.error("Error registering patient:", error)
    throw new Error("Failed to register patient")
  }
}
