const express = require('express');
const path = require('path');
const app = express();

// Render ke liye port 10000 zaroori hai
const PORT = process.env.PORT || 10000;

// Ye line Render ko batayegi ki files kahan hain
// Humne folders ko case-sensitive raste se connect kiya hai
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'), (err) => {
        if (err) {
            res.status(404).send("Error: index.html nahi mili. Check karein ki folder ka naam 'src' aur 'public' hi hai.");
        }
    });
});

app.listen(PORT, () => {
    console.log(`MFLIX Server live on port ${PORT}`);
});
