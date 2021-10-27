const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

function send(url, method = 'GET', data = null, headers = [], timeout = 60000) {
  return new Promise((resolve, reject) => {
    let xhr;

    if (window.XMLHttpRequest) {
        // Chrome, Mozilla, Opera, Safari
        xhr = new XMLHttpRequest();
    }  else if (window.ActiveXObject) { 
        // Internet Explorer
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open(method, url, true);


    headers.forEach((header) => {
        xhr.setRequestHeader(header.key, header.value);
    })
    

    xhr.timeout = timeout;

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status >= 400) {
              reject(xhr.statusText)
          } else {
              resolve(xhr.responseText)
          }
        }
    }

    xhr.send(data);
    })  
}


class GoodsItem {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }

  render() {
    return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p></div>`;
  }
}


class GoodsList {
    constructor() {
      this.goods = [];
    }

    fetchGoods() {
      fetch(`${API_URL}catalogData.json`)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.goods = response.map(good => ({title: good.product_name, price: good.price}))
          this.render();
        })
        .catch((err) => { 
          console.log(err.text)
      })

      // this.goods = [
      //   { title: 'Shirt', price: 150 },
      //   { title: 'Socks', price: 50 },
      //   { title: 'Jacket', price: 350 },
      //   { title: 'Shoes', price: 250 },
      // ];
    }

    render() {
      let listHtml = '';
      this.goods.forEach(good => {
        const goodItem = new GoodsItem(good.title, good.price);
        listHtml += goodItem.render();
      });
      document.querySelector('.goods-list').insertAdjacentHTML('beforeend', listHtml);
      document.querySelector('.total-cost').insertAdjacentHTML('beforeend', `Общая стоимость: ${this.getTotalCost()}`);
    }

    getTotalCost() {
        const totalCost = this.goods.reduce((total, {price}) => (total + price), 0);
        return totalCost;
    }
  }


class CartElement extends GoodsItem {
    constructor(title, price, quantity) {
        super(title, price)
        this.quantity = quantity
    }

    render() {
      return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><p>${this.quantity}</p></div>`
    }
}


class Cart extends GoodsList {
    constructor() {
        super()
    }

    addGood(good) {
      fetch(`${API_URL}addToBasket.json`)
      .then((response) => {
        return response.json();
      })
      .catch((err) => { 
        console.log(err.text)
    })
    }

    deleteGood(good) {
        return true;
    }

    getBasket() {
      fetch(`${API_URL}getBasket.json`)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.goods = response.contents.map(good => ({title: good.product_name, price: good.price, quantity: good.quantity}))
          this.render();
        })
        .catch((err) => { 
          console.log(err.text)
      })
    }

    render() {
      let listHtml = '';
      this.goods.forEach(good => {
        const cartItem = new CartElement(good.title, good.price, good.quantity);
        listHtml += cartItem.render();
      });
      document.querySelector('.goods-list').insertAdjacentHTML('beforeend', listHtml);
      document.querySelector('.total-cost').insertAdjacentHTML('beforeend', `Общая стоимость: ${this.getTotalCost()}`);
    }

    getTotalCost() {
        const totalCost = this.goods.reduce((total, {price, quantity}) => (total + price*quantity), 0);
        return totalCost;
    }    
}


// const list = new GoodsList();
// list.fetchGoods();

const cart = new Cart();
// cart.addGood({title: 'Принтер', price: 12200})
cart.getBasket()
