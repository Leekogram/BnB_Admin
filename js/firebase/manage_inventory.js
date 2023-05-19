// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getFirestore,
  collection, addDoc,serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getStorage,ref as sRef, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
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
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
// Initialize Realtime Database and get a reference to the service
const database = getFirestore(app);

const auth = getAuth();

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

let pictureUrl;

const currentYear = new Date().getFullYear();
document.getElementById("currentYear").textContent = currentYear;

const addProductBtn = document.getElementById('addProductBtn');


document.getElementById("productForm").addEventListener("submit", addProduct);

const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('imagePreview');
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      imagePreview.setAttribute('src', reader.result);
    });

    reader.readAsDataURL(file);
  }
});








function addProduct(e) {
  e.preventDefault();


  // Change submit button to spinner
  addProductBtn.innerHTML = '<span class="spinner"></span>Sending...';

  // Get values
  
  var productTitle = getInputVal("productTitle");
  var productPrice = getInputVal("productPrice");
  var productQty = getInputVal("productQuantiy");
  var productDescription = getInputVal("productDescription");



 // const storRef = sRef(storage,'products');
  const file = document.querySelector("#product-image").files[0];
  if (!file) return;
  
  const storageRef = sRef(storage, `productsImages/${file.name}`+ new Date());
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on("state_changed",
  (snapshot) => {
    const progress =
      Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
   // setProgresspercent(progress);
  },
  (error) => {
    alert(error);
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
     // setImgUrl(downloadURL)
      pictureUrl=downloadURL;
      setTimeout(
       addProducts(
         pictureUrl,
         productTitle,
         productPrice,
         productQty,
         productDescription
       ),
       5000
     );
    });
  }
);



}

// Function to get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

// Save products to firebase
async function addProducts(
  productPicture,
  productName,
  productPrice,
  productQty,
  productDesc
) {
 
    // Add a new document with a generated id.
 await addDoc(collection(database, "products"), {
  productPicture: productPicture,
  productName: productName,
  productPrice: productPrice,
  productQty: productQty,
  productDesc: productDesc,
  timestamp: serverTimestamp()
}).then(docRef =>  {
  addProductBtn.innerHTML = 'Submit';
  // Data sent successfully!
  createAlert('','Success!',productName +' was added successfully','success',true,true,'pageMessages');
  console.log("Product has been added successfully");
  document.getElementById("productForm").reset();
  imagePreview.setAttribute('src', "");

}).catch(error => {
  // Data sent failed...
  addProductBtn.innerHTML = 'Submit';
  createAlert('Opps!','Something went wrong',error+'','danger',true,false,'pageMessages');
  console.log(error);
 // document.getElementById("productForm").reset();
});


addDoc(collection(database, "log"), {
  comment: "Added "+productName,
  timestamp: serverTimestamp()
}).then(docRef => {

  console.log("Product has been added successfully");


}).catch(error => {

  console.log(error);
  // document.getElementById("productForm").reset();
});

}



function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId) {
  var iconMap = {
    info: "fa fa-info-circle",
    success: "fa fa-thumbs-up",
    warning: "fa fa-exclamation-triangle",
    danger: "fa ffa fa-exclamation-circle"
  };

  var iconAdded = false;

  var alertClasses = ["alert", "animated", "flipInX"];
  alertClasses.push("alert-" + severity.toLowerCase());

  if (dismissible) {
    alertClasses.push("alert-dismissible");
  }

  var msgIcon = $("<i />", {
    "class": iconMap[severity] // you need to quote "class" since it's a reserved keyword
  });

  var msg = $("<div />", {
    "class": alertClasses.join(" ") // you need to quote "class" since it's a reserved keyword
  });

  if (title) {
    var msgTitle = $("<h4 />", {
      html: title
    }).appendTo(msg);
    
    if(!iconAdded){
      msgTitle.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (summary) {
    var msgSummary = $("<strong />", {
      html: summary
    }).appendTo(msg);
    
    if(!iconAdded){
      msgSummary.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (details) {
    var msgDetails = $("<p />", {
      html: details
    }).appendTo(msg);
    
    if(!iconAdded){
      msgDetails.prepend(msgIcon);
      iconAdded = true;
    }
  }
  

  if (dismissible) {
    var msgClose = $("<span />", {
      "class": "close", // you need to quote "class" since it's a reserved keyword
      "data-dismiss": "alert",
      html: "<i class='fa fa-times-circle'></i>"
    }).appendTo(msg);
  }
  
  $('#' + appendToId).prepend(msg);
  
  if(autoDismiss){
    setTimeout(function(){
      msg.addClass("flipOutX");
      setTimeout(function(){
        msg.remove();
      },1000);
    }, 5000);
  }
}

