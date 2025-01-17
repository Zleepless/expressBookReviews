const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    try {
        res.send(JSON.stringify(books, null, 10));
    } catch (error) {
        console.error(error);
        res.status(500).send('Fetching Error');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        res.send(books[isbn])
    } catch (error) {
        console.error(error);
        res.status(500).send('Fetching Error');
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    try {
        const author = req.params.author;
        const matchingBooks = [];
        for (const key in books) {
            if (books.hasOwnProperty(key) && books[key].author === author) {
                matchingBooks.push(books[key]);
            }
        }

        res.send(matchingBooks);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Fetching Error');
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    try {
        const title = req.params.title;
        const matchingTitles = [];

        for (const key in books) {
            if (books.hasOwnProperty(key) && books[key].title === title) {
                matchingTitles.push(books[key]);
            }
        }

        res.send(matchingTitles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Fetching Error');
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
