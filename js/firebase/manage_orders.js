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

// Initialize  Database and get a reference to the service
const database = getFirestore(app);
 // Initialize Firebase Authentication and get a reference to the service
 const auth = getAuth(app);
const colRef = collection(database, "orders");
// const notRef = collection(database, "orderNotification");


  async function updateNotificationStatus() {
    const notificationRef = collection(database, "orderNotification");

    
    const batch = writeBatch(database);
  
    const unsubscribe = onSnapshot(notificationRef, (querySnapshot) => {
      console.log(querySnapshot.size);
      querySnapshot.forEach((doc) => {
        const docRef = doc.ref;
        batch.update(docRef, { status: "read" });
      });
  
       batch.commit(); batch.commit().then(() => {
        console.log("Batch update completed successfully.");
      }).catch((error) => {
        console.error("Error committing batch update:", error);
      });
    });
  
    // Call unsubscribe when you are finished listening to the snapshot.
    // For example, if this function is used in a Vue.js component, you could
    // call unsubscribe in the "beforeDestroy" hook.
    // unsubscribe();
  }
  

async function getOrders() {

  const currentYear = new Date().getFullYear();
  document.getElementById("currentYear").textContent = currentYear;

   //check if user is logged in or not
   onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
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
              <td>${data.orderId}</td>
              <td>${data.customerName}</td>
              <td>
                <div>${data.customerPhone}</div>
              </td>
              <td>${data.customerEmail}</td>
              <td>${data.productName}</td>
              <td>${data.productQuantity}</td>
              <td>${data.productPrice}</td>
              <td id="instruction">${data.instructions}</td>
              <td>${data.sourceType}</td>
            
              <td>${data.paymentStatus}</td>

              
              <td>
              <label class="badge ${
                data.orderStatus == "Accepted"
                  ? "badge-info"
                  : data.orderStatus == "Cancelled"
                  ? "badge-danger"
                  : data.orderStatus == "Completed"
                  ? "badge-dark"
                  : "badge-success"
              }" id="statusLabel"
                >${data.orderStatus}</label
              >
              
       </td>
              
          
            
             
              <td>
                <i
                  class="icon-ellipsis"
                  id="dropdownMenuSplitButton1" data-toggle="${
                    data.orderStatus == "Completed"||data.orderStatus == "Cancelled" ? "" : "dropdown"
                  }" aria-haspopup="true" aria-expanded="false"
                ></i>
                <div
                  class="dropdown-menu"
                  aria-labelledby="dropdownMenuSplitButton1"
                >
                  <h6 class="dropdown-header">Action</h6>
                  <a class="dropdown-item accept-action" data-docid="${
                    doc.id
                  }">Accept</a>
                  <a class="dropdown-item complete-action" data-docid="${
                    doc.id
                  }">Complete</a>
                  <a class="dropdown-item cancel-action" data-docid="${
                    doc.id
                  }">Cancel</a>

                
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

      const docRef = doc(database, "orders", docId);

      const data = {
        orderStatus: "Accepted",
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
      const docRef = doc(database, "orders", docId);

      const data = {
        orderStatus: "Completed",
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
        comment: "order status has been update to completed.",

        timestamp: serverTimestamp(),
      })
        .then((docRef) => {
          console.log("Order has been updated successfully");
        })
        .catch((error) => {
          console.log(error);
          // document.getElementById("productForm").reset();
        });
    }
    function cancelFunction(docId) {
      // Execute your complete function here with the docId parameter
      console.log("Complete function executed for docId", docId);
      const docRef = doc(database, "orders", docId);

      const data = {
        orderStatus: "Cancelled",
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
        comment: "Order status has been updated to cancelled.",

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
      const docRef = doc(database, "orders", docId);

      const data = {
        orderStatus: "Rejected",
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
        comment: "Order status has been update to rejected.",

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
  getOrders();
  updateNotificationStatus();
}; 
