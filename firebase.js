import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "실제값",
  authDomain: "실제값",
  projectId: "실제값",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
