const express = require('express');
const path = require('path');
const app = express();

// Port Render automatically provide karta hai, default 3000
const PORT = process.env.PORT || 3000;

// 'public' folder ko frontend ke liye set karna
app.use(express.static(path.join(__dirname, 'public')));

// Kisi bhi route par index.html dikhana (Single Page App ke liye best)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
