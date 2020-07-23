// Book object constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return title + " by " + author + ", " + pages + " pages, " + read;
    }
}

// Add book to library
function addBookToLibrary() {
    // Get the values from the new book form 
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let read = "";
    let readState = document.getElementById("read");

    // Change read base on checkbox value
    if (readState.checked === true) {
        read = "Read";
    } else {
        read = "Not Read";
    }

    // Clear library so that they are not duplicated when calling render
    unrender(myLibrary);

    // New book object and add to book list
    let addedBook = new Book(title, author, pages, read);
    myLibrary.push(addedBook);
    render(myLibrary);

    // Add to storage
    addToLocalStorage(myLibrary);
    
    // Clear form data so that it is blank for next entry
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("pages").value = "";
    document.getElementById("read").checked = false;
    document.getElementById("not-read").checked = false;
}

// Display books that have already been added
function render(array) {
    let container = document.getElementById("container");
    array.forEach(book => {
        // Get index of book in array
        let index = array.indexOf(book);

        // Create element to contain book info
        let bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        
        // Create title element
        let title = document.createElement("div");
        title.textContent = book.title;
        title.style.fontWeight = "900";
        title.style.fontSize = "1.2em";

        // Create author element
        let author = document.createElement("div");
        author.textContent = book.author;

        // Create pages element
        let pages = document.createElement("div");
        pages.textContent = "Pages: " + book.pages;

        // Create read element
        let read = document.createElement("div");

        //Create read button
        let readBtn = document.createElement("button");
        readBtn.textContent = book.read;
        readBtn.classList.add("read-button");
        readBtn.setAttribute("data-index", index);

        // Change style depending on read or not
        if (readBtn.textContent === "Read") {
            readBtn.style.backgroundColor = "#b39ddb";
            readBtn.style.color = "black";
        } else {
            readBtn.style.backgroundColor = "#7e56c2";
            readBtn.style.color = "white";
        }
        read.appendChild(readBtn);
        
        // Create delete button and add it into read div
        let deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-button");
        deleteBtn.setAttribute("data-index", index);
        read.appendChild(deleteBtn);
        
        // Append elements to book element
        bookDiv.appendChild(title);
        bookDiv.appendChild(author);
        bookDiv.appendChild(pages);
        bookDiv.appendChild(read);

        // Add data attribute of array location
        bookDiv.setAttribute("data-index", index);

        // Append into container element
        let newBookDiv = document.getElementById("new-book-div");
        container.insertBefore(bookDiv, newBookDiv);
    }); 
    
    // Add new event listeners every time
    addDeleteButton()
    addReadButton();
}

// Remove already displayed books before adding again when new book
function unrender() {
    let books = document.getElementsByClassName("book");
    for (let i = books.length - 1; i >= 0; i--) {
        books[i].remove();
    }
}

// Button to change read to not read or vise versa
function addReadButton() {
    let readToggle = document.querySelectorAll(".read-button");
    readToggle.forEach(button => {
        button.addEventListener('click', () => {
            let index = button.getAttribute("data-index");
            // Change the read status of that book to its opposite
            if (myLibrary[index].read === "Read") {
                myLibrary[index].read = "Not Read";
                button.textContent = "Not Read";
                button.style.backgroundColor = "#7e56c2";
                button.style.color = "white";
            } else {
                myLibrary[index].read = "Read";
                button.textContent = "Read";
                button.style.backgroundColor = "#b39ddb";
                button.style.color = "black";
            }
        // Add to storage
        addToLocalStorage(myLibrary);
        })
    })
}

// Button to delete book
function addDeleteButton() {
    let deleteBook = document.querySelectorAll(".delete-button");
    let books = document.getElementsByClassName("book");
    deleteBook.forEach(button => {
        button.addEventListener('click', () => {
            // Delete book from book divs
            let index = button.getAttribute("data-index");
            books[index].remove();

            // Delete book from library array
            myLibrary.splice(index, 1);

            // Re render books to avoid index being wrong next time delete pressed
            unrender();
            render(myLibrary);

            // Add to storage
            addToLocalStorage(myLibrary);
        })
    })
}

// Store array in local storage
function addToLocalStorage(array) {
    window.localStorage.setItem('books', JSON.stringify(array));
}

// Retrieve books from local storage
function getFromLocalStorage() {
    return JSON.parse(window.localStorage.getItem('books'));
}

// Store array of book objects
let myLibrary = getFromLocalStorage();
if (myLibrary == null) {
    myLibrary = [];
}

let modal = document.getElementById("new-book-modal");

// New book button opens modal for entering details
let newBook = document.getElementById("new-book");
newBook.addEventListener('click', () => {
    modal.style.display = "block";
})

// Submit button closes modal and adds book
let submitBtn = document.getElementById("submit");
submitBtn.addEventListener('click', () => {
    addBookToLibrary();
    modal.style.display = "none";
})

// Cancel button on modal closes it
let cancel = document.getElementById("cancel");
cancel.addEventListener('click', () => {
    modal.style.display = "none";
})

// Close modal if clicking away from it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
})

render(myLibrary)