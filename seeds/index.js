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
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla amet est, dolorem, porro at totam mollitia incidunt maiores nostrum fugiat veniam ipsa. Aliquam voluptatum laboriosam maiores id, voluptatem sequi earum!'
            ,price: price,  geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:[{ 
     url: 'https://res.cloudinary.com/dzbciez6r/image/upload/v1768006806/YelpCamp/wkvh9gsuuamq3qykfx5z'
   , filename: 'YelpCamp/wkvh9gsuuamq3qykfx5z'},
{
    url:'https://res.cloudinary.com/dzbciez6r/image/upload/v1768006807/YelpCamp/tuiqh8o4nhlma02e2cn4.jpg',
    filename: 'YelpCamp/tuiqh8o4nhlma02e2cn4'
}]
      

});
            await camp.save();
    }

}

seedbd().then(()=>{
    mongoose.connection.close()
})