const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000; // Render usually uses 10000

// Static files ko 'src/public' folder se uthane ke liye
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Main route jo index.html ko serve karega
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
