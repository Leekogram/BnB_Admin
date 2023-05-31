// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  query,
  onSnapshot,
  updateDoc,
  orderBy,
  getDocs, where, Timestamp
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

// Add an event listener to the dropdown items
const dropdownItems = document.querySelectorAll(".dropdown-item");
dropdownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const start = event.target.dataset.start;
    const end = event.target.dataset.end;
    fetchCustomerData(start, end);
  });
});

// Fetch customer data based on the selected date range
async function fetchCustomerData(start, end) {
  console.log(start);
  console.log(end);
  try {
    const startDate = new Date(`${start} 00:00:00`);
    const endDate = new Date(`${end} 23:59:59`);

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const q = query(colRef, where("createdDateTime", ">=", startTimestamp), where("createdDateTime", "<=", endTimestamp), orderBy("createdDateTime", "desc"));

    getCustomer();
  } catch (error) {
    console.log(error);
  }
}


// Add an event listener to the end Date 
const endDate = document.getElementById('end-date');
const startDateValue = document.getElementById('start-date').value;
const endDateValue = endDate.value;
endDate.addEventListener('click', getCustomer(startDateValue,endDateValue));

async function getCustomer(startDate,endDate) {
  console.log('i have been called');
  const currentYear = new Date().getFullYear();

  const today = new Date();
  const day = today.toLocaleString('en-us', { weekday: 'long' });
  const date = today.getDate();
  const month = today.toLocaleString('en-us', { month: 'short' });
  const year = today.getFullYear();
  const todayString = `Today (${date} ${month} ${year})`;

  // document.getElementById("today").textContent = todayString;
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


  // console.log(newQuery);
  try {
    const q = query(colRef, orderBy("createdDateTime", "desc"));

    onSnapshot(q, { includeMetadataChanges: true }, (docsSnap) => {
      loader.style.display = "none";
      let rows = "";
      let index = 0;
      docsSnap.forEach(async (doc) => {
        index++;
        let data = doc.data();
        const userEmail = doc.data().email;



        let row = `<tr data-useremail="${data.email}" class="clickable-row" id="user-row-${data.email}">
              <td>${index}</td>
              <td>${data.fullName}</td>
              <td>
                <div>${data.email}</div>
              </td>
              <td>${data.phoneNo}</td>
              <td>${data.address}</td>
              <td>${formatDate(data.createdDateTime)} </td>
            
              
             
              <td class="total-spending">
              Loading...
              </td>
            </tr>`;

        rows += row;

        // Query the "orders" collection for the user's orders
        const ordersSnapshot = await getDocs(query(collection(database, 'orders'), where('customerEmail', '==', userEmail) , where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)));

        let totalOrderSpending = 0;
        ordersSnapshot.forEach((orderDoc) => {
          const orderData = orderDoc.data();
          totalOrderSpending += orderData.amountPaid;
        });

        // Query the "bookings" collection for the user's bookings
        const bookingsSnapshot = await getDocs(query(collection(database, 'bookings'), where('email', '==', userEmail),where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)));

        let totalBookingSpending = 0;
        bookingsSnapshot.forEach((bookingDoc) => {
          const bookingData = bookingDoc.data();
          totalBookingSpending += bookingData.amountPaid;
        });

        // Calculate the total spending for the user
        const totalSpending = totalOrderSpending + totalBookingSpending;
        // Update the table row with the total spending information
        const tableRow = document.getElementById(`user-row-${userEmail}`);
        if (tableRow) {
          const totalSpendingCell = tableRow.querySelector('.total-spending');
          if (totalSpendingCell) {
            if (typeof totalSpending === 'number') {
              totalSpendingCell.textContent = formatTotalSpending(totalSpending);
            } else if (typeof totalSpending === 'string') {
              const amountPaid = parseFloat(totalSpending);
              if (!isNaN(amountPaid)) {
                totalSpendingCell.textContent = formatTotalSpending(amountPaid);
              } else {
                totalSpendingCell.textContent = 'N/A'; // or any other placeholder value
              }
            } else {
              totalSpendingCell.textContent = 'N/A'; // or any other placeholder value
            }
          }
        }

      });
      tableRow.innerHTML = rows;
      // Add event listener to accept dropdown item
      function formatTotalSpending(amount) {
        return amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
      }
      
      // Add click event listener to each row
      const rowsElements = document.querySelectorAll("#customerTable tr");
      rowsElements.forEach((row) => {
        row.addEventListener("click", () => {
          const uEmail = row.getAttribute("data-useremail");
          // console.log(uEmail);
          showUserDetails(uEmail);
        });
      });

    });

  } catch (error) {
    console.log(error);
  }
}


async function showUserDetails(userEmail) {
  // const userDetailsDiv = document.getElementById("userDetails");
  // userDetailsDiv.innerHTML = ""; // Clear previous content
  const detailedReports = document.getElementById('detailedReports');
  detailedReports.classList.toggle('active');

  try {
    // Retrieve user details from the Firestore collections (orders and bookings)
    const [ordersSnapshot, bookingsSnapshot] = await Promise.all([
      getDocs(query(collection(database, "orders"), where("customerEmail", "==", userEmail))),
      getDocs(query(collection(database, "bookings"), where("email", "==", userEmail)))
    ]);

    const userDetails = {};

    userDetails.totalSpent = calculateTotalSpent(ordersSnapshot);
    userDetails.totalOrders = ordersSnapshot.size;
    userDetails.totalBookings = bookingsSnapshot.size;
    userDetails.pendingBookings = countBookingsByStatus(bookingsSnapshot, "Pending");
    userDetails.completedBookings = countBookingsByStatus(bookingsSnapshot, "Completed");
    userDetails.cancelledBookings = countBookingsByStatus(bookingsSnapshot, "Cancelled");
    userDetails.pendingOrders = countOrdersByStatus(ordersSnapshot, "New");
    userDetails.completedOrders = countOrdersByStatus(ordersSnapshot, "Completed");
    userDetails.cancelledOrders = countOrdersByStatus(ordersSnapshot, "Cancelled");

    // Call this function with the actual values
updateProgressBars(userDetails.totalOrders, userDetails.totalBookings,  userDetails.completedOrders, userDetails.completedBookings,  userDetails.pendingOrders,   userDetails.pendingBookings);


    // Populate the userDetailsDiv with the retrieved data
    /*   const userDetailsHtml = `
        <h2>User Details</h2>
        <p>Total Spent: $${userDetails.totalSpent.toFixed(2)}</p>
        <p>Total Orders: ${userDetails.totalOrders}</p>
        <p>Total Bookings: ${userDetails.totalBookings}</p>
        <p>Pending Bookings: ${userDetails.pendingBookings}</p>
        <p>Completed Bookings: ${userDetails.completedBookings}</p>
        <p>Cancelled Bookings: ${userDetails.cancelledBookings}</p>
      `; */
    // userDetailsDiv.innerHTML = userDetailsHtml;
    document.getElementById("totalOrder").innerHTML = userDetails.totalOrders;
    document.getElementById("totalBookings").innerHTML = userDetails.totalBookings;
    document.getElementById("totalCompletedBookings").innerHTML = userDetails.completedBookings;
    document.getElementById("totalCompletedOrder").innerHTML = userDetails.completedOrders;
    document.getElementById("totalPendingBookings").innerHTML = userDetails.pendingBookings;
    document.getElementById("totalPendingOrders").innerHTML = userDetails.pendingOrders;
    document.getElementById("totalSpent").innerHTML = userDetails.totalSpent;
  } catch (error) {
    console.log(error);
  }
}

function calculateTotalSpent(ordersSnapshot) {
  let totalSpent = 0;
  ordersSnapshot.forEach((doc) => {
    const orderData = doc.data();
    const amountPaid = parseFloat(orderData.amountPaid);
    if (!isNaN(amountPaid)) {
      totalSpent += amountPaid;
    }
  });
  return totalSpent.toLocaleString();
}


function countBookingsByStatus(bookingsSnapshot, status) {
  let count = 0;
  bookingsSnapshot.forEach((doc) => {
    const bookingData = doc.data();
    if (bookingData.status === status) {
      count++;
    }
  });
  return count;
}
function countOrdersByStatus(orderSnapshot, status) {
  let count = 0;
  orderSnapshot.forEach((doc) => {
    const orderData = doc.data();
    if (orderData.orderStatus === status) {
      count++;
    }
  });
  return count;
}

function updateProgressBars(totalOrder, totalBookings, totalCompletedOrder, totalCompletedBookings, totalPendingOrders, totalPendingBookings) {
  const orderProgress = document.getElementById('orderProgress');
  const bookingProgress = document.getElementById('bookingProgress');
  const completedOrderProgress = document.getElementById('completedOrderProgress');
  const completedBookingProgress = document.getElementById('completedBookingProgress');
  const pendingOrderProgress = document.getElementById('pendingOrderProgress');
  const pendingBookingProgress = document.getElementById('pendingBookingProgress');
  const totalSpending = totalOrder + totalBookings + totalCompletedOrder + totalCompletedBookings + totalPendingOrders + totalPendingBookings;
  const orderPercentage = (totalOrder / totalSpending) * 100;
  const bookingPercentage = (totalBookings / totalSpending) * 100;
  const completedOrderPercentage = (totalCompletedOrder / totalSpending) * 100;
  const completedBookingPercentage = (totalCompletedBookings / totalSpending) * 100;
  const pendingOrderPercentage = (totalPendingOrders / totalSpending) * 100;
  const pendingBookingPercentage = (totalPendingBookings / totalSpending) * 100;

  orderProgress.style.width = `${orderPercentage}%`;
  bookingProgress.style.width = `${bookingPercentage}%`;
  completedOrderProgress.style.width = `${completedOrderPercentage}%`;
  completedBookingProgress.style.width = `${completedBookingPercentage}%`;
  pendingOrderProgress.style.width = `${pendingOrderPercentage}%`;
  pendingBookingProgress.style.width = `${pendingBookingPercentage}%`;
}


// Fetch customer data with default date range
const defaultStart = "01-01";
const defaultEnd = "03-31";
//  fetchCustomerData(defaultStart, defaultEnd);

window.onload = getCustomer();
