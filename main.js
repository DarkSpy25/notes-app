const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

var mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456&*",
  database: 'project',
  port: "3306"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

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

// app.get('/', (req, res) => {
//     res.send(notes)
// })
app.get('/', (req, res) => {
    const query = 'SELECT * FROM notes';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching notes', error: err });
        }
        res.send(results);
    });
});

// app.post('/add-note', (req, res) => {
//     const newNote = req.body
//     notes.push(newNote)
//     res.status(201).json({ message: 'Note added successfully', note: newNote });
// })

app.post('/add-note', (req, res) => {
    const newNote = req.body;
    const query = 'INSERT INTO notes (content) VALUES (?)';
    db.query(query, [newNote.content], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding note', error: err });
        }
        res.status(201).json({ message: 'Note added successfully', note: { id: result.insertId, ...newNote } });
    });
});

// app.put('/update-note/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     const updateNote = req.body
//     const index = notes.findIndex(note => note.id === parseInt(id));
//     if (index != -1){
//         notes[index].content = updateNote.content
//         res.status(200).json({ message: 'Note updated successfully', note: notes[index] });
//     } else {
//         res.status(404).json({ message: 'Note not found' });
//     }
// })
app.put('/update-note/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const updateNote = req.body
    const query = 'UPDATE notes SET content = ? WHERE id = ?';
    db.query(query, [updateNote.content, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating note', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note updated successfully', note: { id: id, ...updateNote } });
    });
});

// app.delete('/delete-note/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     const index = notes.findIndex(note => note.id === parseInt(id));
//     if (index != -1){
//         notes.splice(index, 1)
//         res.status(200).json({ message: 'Note deleted successfully' });
//     } else {
//         res.status(404).json({ message: 'Note not found' });
//     }
// })
app.delete('/delete-note/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const query = 'DELETE FROM notes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting note', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    });
});
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});