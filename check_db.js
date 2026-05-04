const mongoose = require('mongoose');
const User = require('./models/user');

async function check() {
    await mongoose.connect('mongodb://127.0.0.1:27017/serviceDB');
    const users = await User.find({});
    users.forEach(u => {
        console.log(`User: ${u.email}, favorites:`, u.favorites);
        console.log(`Types:`, u.favorites.map(f => typeof f));
    });
    await mongoose.disconnect();
}

check();
