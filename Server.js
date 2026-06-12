const express = require('express');
const app = express();
app.use(express.json());

let database = {
    users: {},       
    friends: {},     
    requests: {},    
    messages: {},    
    reels: []        
};

app.post('/register', (req, res) => {
    const { username, userId, currentServerId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing data" });
    database.users[userId.toString()] = { username, currentServerId, status: "Online" };
    res.json({ success: true });
});

app.get('/active-users', (req, res) => {
    res.json(database.users);
});

app.get('/search', (req, res) => {
    const query = req.query.name.toLowerCase();
    let results = [];
    for (let id in database.users) {
        if (database.users[id].username.toLowerCase().includes(query)) {
            results.push({ userId: id, username: database.users[id].username });
        }
    }
    res.json(results);
});

app.post('/send-message', (req, res) => {
    const { chatRoomId, sender, text } = req.body;
    if (!database.messages[chatRoomId]) database.messages[chatRoomId] = [];
    database.messages[chatRoomId].push({ sender, text, time: Date.now() });
    res.json({ success: true });
});

app.get('/messages', (req, res) => {
    const { chatRoomId } = req.query;
    res.json(database.messages[chatRoomId] || []);
});

app.post('/post-reel', (req, res) => {
    const { username, title, type, content } = req.body;
    database.reels.push({ username, title, type, content });
    res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => console.log("BloxMedia Live"));