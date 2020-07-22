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
    let bookForm = document.getElementById("book-form");   
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

        if (readBtn.textContent === "Read") {
            readBtn.style.backgroundColor = "green";
        } else {
            readBtn.style.backgroundColor = "crimson";
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
            console.log(index);
            // Change the read status of that book to its opposite
            if (myLibrary[index].read === "Read") {
                myLibrary[index].read = "Not Read";
                button.textContent = "Not Read";
                button.style.backgroundColor = "crimson";
            } else {
                myLibrary[index].read = "Read";
                button.textContent = "Read";
                button.style.backgroundColor = "green";
            }
            console.log(myLibrary[index].read);

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


// Create example objects
let theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, "Not Read");
let lotr1 = new Book("The Lord of the Rings: The Fellowship of the Ring", "J.R.R. Tolkien", 450, "Not Read");
let lotr2 = new Book("The Lord of the Rings: The Two Towers", "J.R.R. Tolkien", 500, "Not Read");
let lotr3 = new Book("The Lord of the Rings: The Return of the King", "J.R.R. Tolkien", 550, "Not Read");

// Store array of book objects
let myLibrary = getFromLocalStorage();
console.log(myLibrary);
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