if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const name = `${sample(descriptors)} ${sample(places)}`;
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[random1000].city}, ${cities[random1000].state}`
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const camp = new Campground({
            author: '65a6f3ed1c68b562f4a0618c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis id dolores dicta soluta molestiae, quam sint porro voluptatem modi, reprehenderit in, excepturi vel ut facere veniam ratione obcaecati dolore laudantium.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:
                [
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940933/YelpCamp/s1msncxcapwmyhymvegg.jpg',
                        filename: 'YelpCamp/s1msncxcapwmyhymvegg',
                    },
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940933/YelpCamp/gal9x4vehw0c3vg3jcm3.jpg',
                        filename: 'YelpCamp/gal9x4vehw0c3vg3jcm3',
                    },
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940934/YelpCamp/udkrgu4zevgpbc647uei.webp',
                        filename: 'YelpCamp/udkrgu4zevgpbc647uei',
                    },
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940934/YelpCamp/r3sddrtxpcf7kwdq5kht.webp',
                        filename: 'YelpCamp/r3sddrtxpcf7kwdq5kht',
                    },
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940934/YelpCamp/gglfyk6obxdvigpyg0mf.jpg',
                        filename: 'YelpCamp/gglfyk6obxdvigpyg0mf',
                    },
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940935/YelpCamp/blrtxspb30wde7mj9yn4.jpg',
                        filename: 'YelpCamp/blrtxspb30wde7mj9yn4',
                    },
                    {
                        url: 'https://res.cloudinary.com/dmj5l3ejr/image/upload/v1705940935/YelpCamp/burxsqgr8mqfcmu7o0gd.webp',
                        filename: 'YelpCamp/burxsqgr8mqfcmu7o0gd',
                    }
                ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

