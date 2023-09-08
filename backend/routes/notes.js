const express = require('express');
const router = express.Router()
const Notes = require('../models/Notes');
const fetchuser = require('../middlewares/fetchuser')
const { body, validationResult } = require('express-validator');

// Route 1: Get all the notes using: GET 'api/notes/fetchallnotes'. Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
   try {
    const notes = await Notes.find({user:req.user.id})
    res.json(notes)
   } catch (error) {
    console.log(error.message)
    res.status(500).send('Interval Server Error')
   }
})

// Route 2: Add a new note using: POST 'api/notes/addnote'. Login required
router.post('/addnotes',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Enter a valid description').isLength({min:5})
], async (req,res)=>{
    try {
        const {title,description,tag} = req.body

        // If there are errors, return bad request and the errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const addNote = new Notes({
            user:req.user.id,
            title,
            description,
            tag
        })
        const newNotes = await addNote.save()
        res.json(newNotes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Error')
    }
})


// Route 4: Delete an existing note using: DELETE 'api/notes/deletenote'. Login required
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
    try {
        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        // If the note doesn't exist 
        if (!note) {return res.status(404).send('Not found!')}

        //Allow deletion only if user owns this Note
        if (req.user.id !== note.user.toString()) {
            return res.status(401).send('Not Allowed!')
        }
        
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json(note)

    } catch (error) {
        console.log(error.message)
        res.status(500).send('Internal Server Error')
    }
})
module.exports = router