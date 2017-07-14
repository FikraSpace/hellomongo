const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// define a schema
let bookSchema = mongoose.Schema({
	name: String,
	author: String,
	ISBN: Number
})

// define a model
let Books = mongoose.model('books', bookSchema)

// get all books
router.get('/api/books', (req, res)=>{
	
	Books.find({name:req.params.name, }, (err, result)=>{
		if(err) throw err;
		res.status(200).json(result)	
	})
})


// get a specific book
router.get('/api/books/:id', (req, res)=>{
	Books.findOne({ISBN: req.params.id}, (err, result)=>{
		if (err) throw err;
		res.status(200).json(result)
	})
})


// insert a new book
router.post('/api/books', (req, res)=>{

	let book = new Books({
		name: req.body.name,
		author: req.body.author,
		ISBN: req.body.ISBN
	})

	book.save((err, result)=>{
		if (err) throw err;
		res.status(200).json(result)	
	})

		
})



// delete a specific book
router.delete('/api/books/:id', (req, res)=>{
	Books.findOneAndRemove({ISBN:req.params.id}, (err, result)=>{
		if (err) throw err
		res.status(200).json(result)	
	})
})

router.put('/api/books/:id', (req, res)=>{
	Books.findOne({ISBN: req.params.id}, (err, result)=>{
		
		if (err) throw err;

		result.name = req.body.name;
		result.author = req.body.author;


		result.save((err, result)=>{
			if (err) throw err;
			res.status(200).json(result)	
		})

	})
})


module.exports = router;
