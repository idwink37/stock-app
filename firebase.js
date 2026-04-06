import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "test",
  authDomain: "test",
  projectId: "test",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
