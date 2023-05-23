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
  writeBatch,
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

const colRef = collection(database, "feedbacks");
// const notRef = collection(database, "orderNotification");


 
const auth = getAuth();

//check if user is logged in or not
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

  } else {

    window.location.href = "login.html";
  }
});

function formatDate(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
  }
async function getFeedBack() {

  const currentYear = new Date().getFullYear();
  document.getElementById("currentYear").textContent = currentYear;
  let tableRow = document.getElementById("bookingTable");
  const loader = document.getElementById("loader");
  // show the loader initially
  loader.style.display = "block";

  try {

  
    

    const q = query(colRef, orderBy("createdBy", "desc"));

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
                <div>${data.emailAddress}</div>
              </td>
              <td>${data.phoneNumber}</td>
              <td>${data.subject}</td>
              <td>${data.message}</td>
              <td>${data.sourceType}</td>
              <td >${formatDate(data.createdBy)}</td>
           
             
              <td>
                <i
                  class="icon-ellipsis"
                  id="dropdownMenuSplitButton1" data-toggle="${
                    "dropdown"
                  }" aria-haspopup="true" aria-expanded="false"
                ></i>
                <div
                  class="dropdown-menu"
                  aria-labelledby="dropdownMenuSplitButton1"
                >
                  <h6 class="dropdown-header">Action</h6>
                  <a class="dropdown-item accept-action" data-email="${doc.data.emailå}" data-docid="${
                    doc.id
                  }">Reply</a>
             
                
                </div>
              </td>
            </tr>`;

        rows += row;
      });
      tableRow.innerHTML = rows;
      // Add event listener to accept dropdown item
      const acceptItems = document.querySelectorAll(".accept-action");
      acceptItems.forEach((item) => {
        item.addEventListener("click", (event) => {
          const email = event.target.dataset.email;
          const mailtoUrl = 'mailto:' + email ;
    window.location.href = mailtoUrl;
        });
      });

      // Add event listener to complete dropdown item
      
    
    });

    

   
  } catch (error) {
    console.log(error);
  }
}

window.onload = function () {
  // call both functions
  getFeedBack();

}; 
