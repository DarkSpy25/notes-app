const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let notes = [
    { 
        id: 1, 
        content: "First Note"
    },
    {
        id: 2, 
        content: "Second Note"

    }
] 

app.get('/', (req, res) => {
    res.send(notes)
})

app.post('/add-note', (req, res) => {
    const newNote = req.body
    notes.push(newNote)
    res.status(201).json({ message: 'Note added successfully', note: newNote });
})

app.put('/update-note/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const updateNote = req.body
    const index = notes.findIndex(note => note.id === parseInt(id));
    if (index != -1){
        notes[index].content = updateNote.content
        res.status(200).json({ message: 'Note updated successfully', note: notes[index] });
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
})

app.delete('/delete-note/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = notes.findIndex(note => note.id === parseInt(id));
    if (index != -1){
        notes.splice(index, 1)
        res.status(200).json({ message: 'Note deleted successfully' });
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
})

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});