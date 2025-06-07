import express from 'express';
import mongoose from 'mongoose';
import userroutes from './Routes/user.routes.js';
import cors from 'cors';
import ChannelRoutes from './Routes/channel.routes.js';
import videoRoutes from './Routes/video.routes.js';

const app = new express();

mongoose.connect('mongodb+srv://Saha88979:SahaB145@cluster0.rnbodrv.mongodb.net/YoutubeCloneDB');

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

app.get('/', (req, res) => {
    return res.send('hello');
});

const db = mongoose.connection;
db.on('open', () => {
    console.log('Connection successfully established');
});

app.use(cors());
app.use(express.json());

userroutes(app);
ChannelRoutes(app);
videoRoutes(app);