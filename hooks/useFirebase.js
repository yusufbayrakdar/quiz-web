import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

export default function useFirebase(firebaseConfig) {
  if (!firebaseConfig) return {};
  let app;
  if (!firebase.apps.length) app = firebase.initializeApp(firebaseConfig);
  else app = firebase.app();

  const firebaseStorage = firebase.storage();
  return { firebaseStorage, app };
}
