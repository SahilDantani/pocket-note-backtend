const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../modules/Notes");
const {body,validationResult} = require("express-validator");


// fetching all notes
router.get("/fetchallnotes",fetchuser,async (req,res)=>{
    try {
    const notes = await Note.find({user:req.user.id});
    res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
})

// add new notes
router.post("/addnote",fetchuser,[
    body("title","Enter a valid title").isLength({min:3}),
    body("description","Enter Valid description").isLength({min:5})
],async (req,res)=>{
    try {
    const{title,description,tag}=req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const note = new Note({
        title,description,tag,user:req.user.id
    })
    const saveNote = await note.save(); 
    res.json(saveNote)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error")
}
})

// update notes
router.put("/updatenote/:id",fetchuser,async (req,res)=>{
try {
const{title,description,tag}=req.body;

const newNote = {};
if(title){newNote.title=title};
if(description){newNote.description=description};
if(tag){newNote.tag=tag};

let note =await Note.findById(req.params.id);
if(!note){return res.status(404).send("Not Found")}
if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
}

note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
res.json({note})
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error")
}
})

// deleting note
router.delete("/deletenote/:id",fetchuser,async (req,res)=>{
    try {
    let note =await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success":"Succesfully Deleted"})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error")
    }
    })

module.exports = router;