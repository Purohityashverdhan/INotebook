const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const router = express.Router();


//Route1: Get All notes using Get "api/notes/fetchallnotes".Login Required
router.get('/fetchallnote', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Some error occurred", notes: [] })
    }
})


//Route2: Add a new Note using  POST "api/notes/addnote".Login Required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() })
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save()
        res.json(savedNotes)
    } catch (error) {
        console.log(error)
        res.status(500).send("Some error occured")
    }
})

//Route3: Update an existing Note using  PUT "api/notes/updatenote".Login Required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newnote = {}
        if (title) { newnote.title = title }
        if (description) { newnote.description = description }
        if (tag) { newnote.tag = tag }

        //find note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
        res.json(note)
    } catch (error) {
        console.log(error)
        res.status(500).send("Some error occured")
    }
})


//Route4: Delete an existing Note using  PUT "api/notes/deletenote".Login Required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //find note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note Has been removed", note: note })
    } catch (error) {
        console.log(error)
        res.status(500).send("Some error occured")
    }
})

module.exports = router