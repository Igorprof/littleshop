const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = 3000;
const static_dir = '../public';

const app = express();

app.use(bodyParser.json());
app.use(express.static(static_dir));

app.get('/catalogData', (req, res) => {
    fs.readFile('data/catalog.json', 'utf8', (err, data) => {
        res.send(data);
    })
})

app.get('/basket', (req, res) => {
    fs.readFile('data/cart.json', 'utf8', (err, data) => {
        res.send(data);
    })
})

app.post('/addToCart', (req, res) => {
    fs.readFile('data/cart.json', 'utf8', (err, data) => {
        const cart = JSON.parse(data);
        const item = req.body;
        const itemFound = cart.contents.find(good => (good.product_name == item.product_name) && (good.price == item.price));
        if (itemFound) {
            itemFound.quantity++;
            cart.amount += itemFound.price;
        } else {
            item.quantity = 1;
            item.id_product = cart.contents.length + 1;
            cart.amount += item.price;
            cart.countGoods++;
            cart.contents.push(item);
        }
        fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
            console.log('Done');
        });
    })
})


app.listen(port, function() {
    console.log(`Server is running on port ${port}!`)
})