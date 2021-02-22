import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDirtmkoeAQ54FMNMvixJiy7TZMNAoQYmE",
    authDomain: "instagram-be639.firebaseapp.com",
    projectId: "instagram-be639",
    storageBucket: "instagram-be639.appspot.com",
    messagingSenderId: "1321920272",
    appId: "1:1321920272:web:5a84863d05f2809c052795",
    measurementId: "G-M43K0FEE6P"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };