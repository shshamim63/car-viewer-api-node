import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { firestore } from "firebase-admin";

import serviceAccount from '../../gcp_key.json'

initializeApp({
  credential: cert(serviceAccount as ServiceAccount)
})

export const dbFirestore = firestore

export const db = dbFirestore()

export const CarRef = db.collection('Cars')