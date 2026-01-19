const express=require('express')
const { createNote, getNote, updateNote, deleteNote } = require('../controller/note.controller')
const { noteAddValidation,noteUpdateValidation } = require('../validation/note.validation')
const validate = require('../middleware/validate')
const router=express.Router()

// Create a new note
router.post('/',validate(noteAddValidation),createNote)
// Get all notes
router.get('/',getNote)
// Update a note by ID
router.patch('/:id',validate(noteUpdateValidation),updateNote)
// Delete a note by ID
router.delete("/:id",deleteNote)

module.exports=router

