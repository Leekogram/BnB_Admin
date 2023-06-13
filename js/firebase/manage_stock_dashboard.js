  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    onSnapshot,
    updateDoc,
    query,
    orderBy, where, deleteDoc, serverTimestamp, addDoc
  } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
  import {
    getStorage,
    ref as sRef,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject
  } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
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


  const database = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const colRef = collection(database, "products");

  async function getStock() {
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;

    //check if user is logged in or not
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        window.location.href = "../../../login.html";
      }
    });
    let tableRow = document.getElementById("stockTable");
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
            <td><img src="${data.productPicture}" class="image-zoom"  style="border-radius:5px;width:50px;heigth:120px"/></td>
            <td>${data.productName}</td>
            <td>${data.productPrice}</td>
            <td>${data.productQty}</td>
            <td><div class="section-des">${data.productDesc}</div> </td>
            <td>
              <label class="badge ${data.productQty == 0
              ? "badge-secondary"
              : data.productQty <= 2
                ? "badge-warning"
                : data.productQty >= 3
                  ? "badge-success" : "badge-dart"

            }" id="statusLabel"
                >${data.productQty == 0
              ? "Not available"
              : data.productQty <= 2
                ? "Low in stock"
                : data.productQty >= 3
                  ? "Available"
                  : "Not available"}</label
              >
            </td>
           
            <td>
              <i
                class="icon-ellipsis"
                id="dropdownMenuSplitButton1" data-toggle="${data.status == "Completed" ? "" : "dropdown"}" aria-haspopup="true" aria-expanded="false"
              ></i>
              <div
                class="dropdown-menu"
                aria-labelledby="dropdownMenuSplitButton3">
                <h3 class="dropdown-header text-dark">Action</h3>
          
              
<a class="dropdown-item update-action" data-docid="${doc.id}" data-productpic="${doc.data().productPicture}" data-productname="${doc.data().productName}" data-productcat="${doc.data().productCategory}" data-productprice="${doc.data().productPrice}" data-productdesc="${doc.data().productDesc}" data-productqty="${doc.data().productQty}")">Edit</a>
<a class="dropdown-item delete-action " data-docid="${doc.id}" data-productpic="${doc.data().productPicture}" data-productname="${doc.data().productName}" data-productcat="${doc.data().productCategory}" data-productprice="${doc.data().productPrice}" data-productdesc="${doc.data().productDesc}" data-productqty="${doc.data().productQty}")">Delete</a>

               
            
              
              </div>
            </td>
          </tr>`;

          rows += row;
        });
        tableRow.innerHTML = rows;
        // Add event listener to modify dropdown item
        const modifyItems = document.querySelectorAll(".update-action");
        modifyItems.forEach((item) => {
          item.addEventListener("click", (event) => {

            const docId = event.target.dataset.docid;
            const productPicture = event.target.dataset.productpic;
            const productTitle = event.target.dataset.productname;
            const productCat = event.target.dataset.productcat;
            const productPrice = event.target.dataset.productprice;
            const productQuantity = event.target.dataset.productqty;
            const productDescription = event.target.dataset.productdesc;

            // Show confirmation alert
            const confirmation = window.confirm(`Do you really want to modify ${productTitle} ?`);
            if (confirmation) {
              openModal(docId, productPicture, productTitle, productCat, productPrice, productQuantity, productDescription);
            }
          });
        });
        // Add event listener to delete dropdown item
        const deleteItems = document.querySelectorAll(".delete-action");
        deleteItems.forEach((item) => {
          item.addEventListener("click", (event) => {

            const docId = event.target.dataset.docid;       
            const productTitle = event.target.dataset.productname;



            // Show confirmation alert
            const confirmation = window.confirm(`Do you really want to delete ${productTitle} ? `);
            if (confirmation) {
              deleteDocument("products", docId, productTitle);
            }
          });
        });



        // Add event listener to the image element for hover effect and modal opening
        /*      const imageElements = document.querySelectorAll("#stockTable img");
             imageElements.forEach((image) => {
               image.addEventListener("mouseover", (event) => {
                 // Apply zoom effect
                 event.target.classList.add("image-zoom");
   
                 // Set the source of the modal image to the hovered image
                 const modalImage = document.getElementById("modalImage");
                 modalImage.src = event.target.src;
   
                 // Show the modal
                 const modal = document.getElementById("imageModal");
                 modal.style.display = "block";
               });
   
               image.addEventListener("mouseout", (event) => {
                 // Remove zoom effect
                 event.target.classList.remove("image-zoom");
   
                 // Hide the modal
                 const modal = document.getElementById("imageModal");
                 modal.style.display = "none";
               });
             });
   
             // Add event listener to the close button in the modal
             const closeButton = document.querySelector("#imageModal .imageClose");
             closeButton.addEventListener("click", () => {
               const modal = document.getElementById("imageModal");
               modal.style.display = "none";
             }); */

      });

    } catch (error) {
      console.log(error);
    }
  }



  // Add the openModal and closeModal functions
  function openModal(docId, productImage, productTitle, productCat, productPrice, productQuantity, productDescription) {

    // Populate the modal with the data
    document.getElementById("productTitle").value = productTitle;
    document.getElementById("productCat").value = productCat;
    document.getElementById("productPrice").value = productPrice;
    document.getElementById("productQuantiy").value = productQuantity;
    document.getElementById("productDescription").value = productDescription;
    document.getElementById("documentId").value = docId;
    document.getElementById("imagePreview").setAttribute("src", productImage);



    // Show the modal
    const modal = document.getElementById("modifyModal");
    modal.style.display = "block";
  }


  const closeModalBtn = document.getElementById("close");
  closeModalBtn.addEventListener("click", () => {
    const modal = document.getElementById("modifyModal");
    modal.style.display = "none";
  });

  const updateProductBtn = document.getElementById("updateProductBtn");

  document.getElementById("productForm").addEventListener("submit", updateProduct);
  const imageInput = document.getElementById("product-image");
  const imagePreview = document.getElementById("imagePreview");
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        imagePreview.setAttribute("src", reader.result);
      });

      reader.readAsDataURL(file);
    }
  });

  function updateProduct(e) {
    e.preventDefault();

    // Change submit button to spinner
    updateProductBtn.innerHTML = '<span class="spinner"></span> Updating...';

    // Get values
    var productTitle = getInputVal("productTitle");
    var productPrice = getInputVal("productPrice");
    var productCat = getInputVal("productCat");
    var productQty = getInputVal("productQuantiy");
    var productDescription = getInputVal("productDescription");
    var documentId = getInputVal("documentId");

    const file = document.querySelector("#product-image").files[0];

    if (file) {
      const storageRef = sRef(storage, `productsImages/${file.name}` + new Date());

      const deleteOldImagePromise = deleteOldImage(documentId); // Delete old image
      const uploadNewImagePromise = uploadNewImage(storageRef, file); // Upload new image

      Promise.all([deleteOldImagePromise, uploadNewImagePromise])
        .then(([oldImageDeleted, downloadURL]) => {
          // Update image fields and other corresponding fields
          if (oldImageDeleted) {
            // Old image deleted successfully
            updateProducts(documentId, downloadURL, productTitle, productPrice, productCat, productQty, productDescription);
          } else {
            // Failed to delete old image
            console.error("Failed to delete old image");
          }
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        })
        .finally(() => {
          // Change submit button back to normal text
          updateProductBtn.innerHTML = "Update Product";
        });
    } else {
      // No new image selected, update other fields only
      updateProducts(documentId, null, productTitle, productPrice, productCat, productQty, productDescription);
    }
  }


  function updateProducts(documentId, downloadURL, productTitle, productPrice, productCat, productQty, productDescription) {



    const productRef = doc(database, "products", documentId);

    if (downloadURL != null) {
      updateDoc(productRef, {
        productPicture: downloadURL,
        productName: productTitle,
        productPrice: productPrice,
        productCategory: productCat,
        productQty: productQty,
        productDesc: productDescription
      })
        .then(() => {
          // Product updated successfully
          // Show success message or perform any additional actions
          addDoc(collection(database, "log"), {
            comment: `${productTitle} was modified`,
            timestamp: serverTimestamp(),
          });
          document.getElementById("modifyModal").style.display = "none";
          showSnackbar("Product updated successfully", true);
        })
        .catch((error) => {
          // Error occurred while updating the product
          console.error("Error updating product:", error);
          // Show error message or perform any error handling
          document.getElementById("modifyModal").style.display = "none";
          showSnackbar("Failed to update product, please try again", false);
        })
        .finally(() => {
          // Reset the submit button
          updateProductBtn.innerHTML = "Update Product";
        });
    } else {
      updateDoc(productRef, {
        productName: productTitle,
        productPrice: productPrice,
        productCategory: productCat,
        productQty: productQty,
        productDesc: productDescription
      })
        .then(() => {
          // Product updated successfully
          // Show success message or perform any additional actions
          addDoc(collection(database, "log"), {
            comment: `${productTitle} was modified`,
            timestamp: serverTimestamp(),
          });
          document.getElementById("modifyModal").style.display = "none";
          showSnackbar("Product updated successfully", true);
        })
        .catch((error) => {
          // Error occurred while updating the product
          console.error("Error updating product:", error);
          // Show error message or perform any error handling
          document.getElementById("modifyModal").style.display = "none";
          showSnackbar("Failed to update product, please try again", false);
        })
        .finally(() => {
          // Reset the submit button
          updateProductBtn.innerHTML = "Update Product";
        });
    }

  }

  function deleteObjectFromURL(url) {
    // Assuming you have initialized the Firebase Storage instance as `storage`
    // Extract the storage path from the URL
    const storagePath = url.replace(
      "https://firebasestorage.googleapis.com/v0/b/productsImages/o/",
      ""
    );

    const storageRef = sRef(storage, storagePath);
    return deleteObject(storageRef)
      .then(() => {
        console.log("Old image deleted successfully");
        return true;
      })
      .catch((error) => {
        console.error("Error deleting old image:", error);
        return false;
      });
  }





  function deleteOldImage(documentId) {
    // Get the URL of the old image from the database
    // Assuming you have a function to retrieve the old image URL based on the document ID
    return getOldImageURL(documentId)
      .then((oldImageURL) => {
        if (!oldImageURL) {
          // No old image to delete
          return true;
        }

        // Delete the old image from the storage bucket
        return deleteObjectFromURL(oldImageURL);
      })
      .catch((error) => {
        console.error("Error retrieving old image URL:", error);
        return false;
      });
  }


  function uploadNewImage(storageRef, file) {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          // setProgresspercent(progress);
        },
        (error) => {
          console.error("Error uploading new image:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("New image uploaded successfully");
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Error retrieving download URL for new image:", error);
              reject(error);
            });
        }
      );
    });
  }



  function getOldImageURL(documentId) {
    const docRef = doc(database, "products", documentId);
    return getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          return data.productPicture; // Assuming the field storing the image URL is named 'productPicture'
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error("Error retrieving old image URL:", error);
        return null;
      });
  }


  function getFilenameFromURL(url) {
    // Check if the URL is null, undefined, or not a string
    if (!url || typeof url !== "string") {
      return null;
    }
    const parts = url.split("/");
    return parts[parts.length - 1];
  }

  // Function to get form values
  function getInputVal(id) {
    return document.getElementById(id).value;
  }

  // Function to delete a document from Firestore
  async function deleteDocument(collectionName, documentId, productName) {
    try {

      const documentRef = doc(database, collectionName, documentId);

      await deleteDoc(documentRef);
      console.log("Document deleted successfully");
      addDoc(collection(database, "log"), {
        comment: `${productName} was deleted`,
        timestamp: serverTimestamp(),
      });
      showSnackbar(`${productName} was deleted successfully`, true);
    } catch (error) {
      console.error("Error deleting document:", error);
      showSnackbar(`Failed to delete document ${productName}, try again`, false);
    }
  }
  function showSnackbar(message, isSuccess) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;

    if (isSuccess) {
      snackbar.style.backgroundColor = "#4CAF50";
    } else {
      snackbar.style.backgroundColor = "#F44336";
    }

    snackbar.classList.add("show");

    setTimeout(() => {
      snackbar.classList.remove("show");
    }, 2000);
  }

  //handle sign out
  const signOutBtn = document.getElementById("sign-out-btn");
  const signOutModal = document.getElementById("sign-out-modal");
  const confirmSignOutBtn = document.getElementById("confirm-sign-out-btn");
  const cancelSignOutBtn = document.getElementById("cancel-sign-out-btn");

  // Show the modal when the sign-out button is clicked
  signOutBtn.addEventListener("click", () => {
    signOutModal.style.display = "block";
  });

  // Hide the modal when the cancel button is clicked
  cancelSignOutBtn.addEventListener("click", () => {
    signOutModal.style.display = "none";
  });

  // Sign the user out of Firebase when the confirm button is clicked
  confirmSignOutBtn.addEventListener("click", () => {
    auth.signOut()
      .then(() => {
        console.log("User signed out successfully");
        signOutModal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        signOutModal.style.display = "none";
      });
  });

  //get notifications
  async function getNotifications() {
    try {
      // Get a reference to the notificationTray element
      const notificationTray = document.getElementById('notificationTray');
      // const notSpan = document.getElementById('notSpan');



      const q = query(collection(database, "orderNotification"), where("status", "==", "unread"), orderBy("timestamp", "desc"));
      await
        onSnapshot(q, (querySnapshot) => {
          const notificationCount = querySnapshot.size;

          if (querySnapshot.size > 0) {
            document.getElementById('notSpan').style.visibility = "visible";
            document.getElementById('count').innerHTML = notificationCount
            document.getElementById('notCount').innerHTML = notificationCount;
            document.getElementById('notificationDropdown').classList.add("count-indicator");
          } else {
            document.getElementById('notSpan').style.visibility = "hidden";
            document.getElementById('notificationDropdown').classList.remove("count-indicator");
          }


          // Loop through each document in the query snapshot and create an HTML element for it
          querySnapshot.forEach((doc) => {
            // Get the data from the document
            const notification = doc.data();

            // Create a new anchor element for the notification
            const notificationLink = document.createElement('a');
            notificationLink.classList.add('dropdown-item', 'preview-item');
            if (notification.type == "service") {
              notificationLink.setAttribute('href', './booking-page.html');
            } else if (notification.type == "feedback") {
              notificationLink.setAttribute('href', '../feedbacks/feedbacks.html');
            } else {
              notificationLink.setAttribute('href', '../orders/orders.html');
            }



            // Create the preview-thumbnail element
            const previewThumbnail = document.createElement('div');
            previewThumbnail.classList.add('preview-thumbnail');

            // Create the preview-icon element
            const previewIcon = document.createElement('div');
            previewIcon.classList.add('preview-icon', 'bg-success');
            const icon = document.createElement('i');
            icon.classList.add('ti-info-alt', 'mx-0');
            previewIcon.appendChild(icon);
            previewThumbnail.appendChild(previewIcon);

            // Create the preview-item-content element
            const previewItemContent = document.createElement('div');
            previewItemContent.classList.add('preview-item-content');
            const subject = document.createElement('h6');
            subject.classList.add('preview-subject', 'font-weight-normal');
            subject.textContent = notification.title;
            const message = document.createElement('p');
            message.classList.add('font-weight-light', 'small-text', 'mb-0', 'text-muted');
            message.textContent = notification.message;
            const time = document.createElement('p');
            time.classList.add('font-weight-light', 'small-text', 'mb-0', 'text-muted');
            time.textContent = getTimeAgo(notification.timestamp.toDate().toLocaleString());
            previewItemContent.appendChild(subject);
            previewItemContent.appendChild(message);
            previewItemContent.appendChild(time);

            // Add the preview-thumbnail and preview-item-content elements to the anchor element
            notificationLink.appendChild(previewThumbnail);
            notificationLink.appendChild(previewItemContent);

            // Add the anchor element to the notificationTray element
            notificationTray.appendChild(notificationLink);
          });

        });


      function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.round(diffMs / 1000);
        const diffMin = Math.round(diffSec / 60);
        const diffHr = Math.round(diffMin / 60);
        const diffDays = Math.round(diffHr / 24);

        if (diffSec < 60) {
          return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
        } else if (diffMin < 60) {
          return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        } else if (diffHr < 24) {
          return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
          return `1 day ago`;
        } else if (diffDays < 30) {
          return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
          const diffMonths = Math.floor(diffDays / 30);
          return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
        }
      }


    } catch (error) {
      console.log(error);
    }
  }


  window.onload = function () {

    getStock();
    getNotifications();
  }