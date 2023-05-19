// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  query,
  onSnapshot,
  updateDoc,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjW8pGmsL9l5olUhU5je0zKD8hkrQThZw",
  authDomain: "boldandbeautifulsalon-89023.firebaseapp.com",
  projectId: "boldandbeautifulsalon-89023",
  storageBucket: "boldandbeautifulsalon-89023.appspot.com",
  messagingSenderId: "466649288397",
  appId: "1:466649288397:web:150d344db30d3f2185a384",
  measurementId: "G-0V7GXFY5ZP",
  databaseURL:
    "https://boldandbeautifulsalon-89023-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize  Database and get a reference to the service
const database = getFirestore(app);

const colRef = collection(database, "users");

async function getCustomer() {
  const currentYear = new Date().getFullYear();
  document.getElementById("currentYear").textContent = currentYear;
  //check if user is logged in or not
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
      window.location.href = "login.html";
    }
  });
  let tableRow = document.getElementById("customerTable");
  const loader = document.getElementById("loader");
  // show the loader initially
  loader.style.display = "block";

  function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
  }


  try {
    const q = query(colRef, orderBy("createdDateTime", "desc"));

    onSnapshot(q, { includeMetadataChanges: true }, (docsSnap) => {
      loader.style.display = "none";
      let rows = "";
      let index = 0;
      docsSnap.forEach((doc) => {
        index++;
        let data = doc.data();
        let row = `<tr>
              <td>${index}</td>
              <td>${data.fullName}</td>
              <td>
                <div>${data.email}</div>
              </td>
              <td>${data.phoneNo}</td>
              <td>${data.address}</td>
              <td>${formatDate(data.createdDateTime)} </td>
            
              
             
              <td>
             
              </td>
            </tr>`;

        rows += row;
      });
      tableRow.innerHTML = rows;
      // Add event listener to accept dropdown item
      const acceptItems = document.querySelectorAll(".accept-action");
      acceptItems.forEach((item) => {
        item.addEventListener("click", (event) => {
          const docId = event.target.dataset.docid;
          acceptFunction(docId);
        });
      });

      // Add event listener to complete dropdown item
      const completeItems = document.querySelectorAll(".complete-action");
      completeItems.forEach((item) => {
        item.addEventListener("click", (event) => {
          const docId = event.target.dataset.docid;
          completeFunction(docId);
        });
      });

      // Add event listener to cancel dropdown item
      const cancelItems = document.querySelectorAll(".cancel-action");
      cancelItems.forEach((item) => {
        item.addEventListener("click", (event) => {
          const docId = event.target.dataset.docid;
          cancelFunction(docId);
        });
      });

      // Add event listener to reject dropdown item
      const rejectItems = document.querySelectorAll(".reject-action");
      rejectItems.forEach((item) => {
        item.addEventListener("click", (event) => {
          const docId = event.target.dataset.docid;
          rejectFunction(docId);
        });
      });
    });

    function acceptFunction(docId) {
      // Execute your accept function here with the docId parameter
      console.log("Accept function executed for docId", docId);

      const docRef = doc(database, "bookings", docId);

      const data = {
        status: "Accepted",
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          console.log(
            "A New Document Field has been added to an existing document"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function completeFunction(docId) {
      // Execute your complete function here with the docId parameter
      console.log("Complete function executed for docId", docId);
      const docRef = doc(database, "bookings", docId);

      const data = {
        status: "Completed",
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          console.log(
            "A New Document Field has been added to an existing document"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function cancelFunction(docId) {
      // Execute your complete function here with the docId parameter
      console.log("Complete function executed for docId", docId);
      const docRef = doc(database, "bookings", docId);

      const data = {
        status: "Cancelled",
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          console.log(
            "A New Document Field has been added to an existing document"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    function rejectFunction(docId) {
      // Execute your complete function here with the docId parameter
      console.log("Complete function executed for docId", docId);
      const docRef = doc(database, "bookings", docId);

      const data = {
        status: "Rejected",
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          console.log(
            "A New Document Field has been added to an existing document"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log(error);
  }
}

window.onload = getCustomer;
