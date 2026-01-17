const express=require('express')
const { createNote, getNote, updateNote, deleteNote } = require('../controller/note.controller')
const { noteAddValidation,noteUpdateValidation } = require('../validation/note.validation')
const validate = require('../middleware/validate')
const router=express.Router()

router.post('/',validate(noteAddValidation),createNote)
router.get('/',getNote)
router.patch('/:id',validate(noteUpdateValidation),updateNote)
router.delete("/:id",deleteNote)

module.exports=router

