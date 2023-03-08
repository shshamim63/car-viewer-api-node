import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { firestore } from "firebase-admin";

import serviceAccount from '../../gcp_key.json'

initializeApp({
  credential: cert(serviceAccount as ServiceAccount)
})

const db = firestore()

module.exports = db