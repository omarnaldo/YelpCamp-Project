const mongoose= require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const {places, descriptors}= require('./seedHelpers.js');


mongoose.connect('mongodb://localhost:27017/yelp-camp',)
const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', ()=> {
 console.log("Connected to MongoDB!");});



 const sample= array => array[Math.floor(Math.random() * array.length)];


const seedbd= async()=>{
    await Campground.deleteMany({})
    for(let i =0; i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*30)+10;
        const camp= new Campground({
            author:'695c0a842e432aecf4b74562',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`, 
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla amet est, dolorem, porro at totam mollitia incidunt maiores nostrum fugiat veniam ipsa. Aliquam voluptatum laboriosam maiores id, voluptatem sequi earum!'
            ,price: price});
            await camp.save();
    }

}

seedbd().then(()=>{
    mongoose.connection.close()
})