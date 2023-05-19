// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  query,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  orderBy,
  
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

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

// Initialize  Database and get a reference to the service
const database = getFirestore(app);
const auth = getAuth();

const colRef = collection(database, "messages");
// const notRef = collection(database, "orderNotification");



// Function to convert Firebase timestamp to a formatted date and time
function convertFirebaseTimestamp(timestamp) {
  // Create a new Firebase timestamp object
  const firebaseTimestamp = Timestamp.fromMillis(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

  // Convert the Firebase timestamp to JavaScript Date
  const date = firebaseTimestamp.toDate();

  // Format the date and time without the time zone
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleString('en-US', options);
}

async function getMessages() {

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
  let tableRow = document.getElementById("bookingTable");
  const loader = document.getElementById("loader");
  // show the loader initially
  loader.style.display = "block";

  try {


    

    const q = query(colRef, orderBy("timestamp", "desc"));

    onSnapshot(q, { includeMetadataChanges: true }, (docsSnap) => {
      loader.style.display = "none";
      let rows = "";
      let index = 0;
      docsSnap.forEach((doc) => {
        index++;
        let data = doc.data();
    
        let row = `<tr>
              <td>${index}</td>
              <td>${data.recipientName}</td>
              <td>
                ${data.recipientEmail}
              </td>
              <td>${data.recipientPhone}</td>
           
              <td>${data.subject}</td>
              <td>${data.message}</td>
              <td>${data.optionalLink}</td>
              <td>${convertFirebaseTimestamp(data.timestamp)}</td>

            
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

      addDoc(collection(database, "log"), {
        comment: "Booking status has been updated to accepted.",

        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          console.log("Product has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
          // document.getElementById("productForm").reset();
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

      addDoc(collection(database, "log"), {
        comment: "Booking status has been update to completed.",

        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          console.log("Product has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
          // document.getElementById("productForm").reset();
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

      addDoc(collection(database, "log"), {
        comment: "Booking status has been updated to cancelled.",

        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          console.log("Product has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
          // document.getElementById("productForm").reset();
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

      addDoc(collection(database, "log"), {
        comment: "Booking status has been update to rejected.",

        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          console.log("Product has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
          // document.getElementById("productForm").reset();
        });
    }
  } catch (error) {
    console.log(error);
  }
}

window.onload = function () {
  // call both functions
  getMessages();

}; 
