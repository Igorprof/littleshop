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
      this.goods = [
        { title: 'Shirt', price: 150 },
        { title: 'Socks', price: 50 },
        { title: 'Jacket', price: 350 },
        { title: 'Shoes', price: 250 },
      ];
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


class Cart extends GoodsList {
    constructor() {
        super()
    }

    addGood(good) {
        return true;
    }

    deleteGood(good) {
        return true;
    }
    
}


class CartElement extends GoodsList {
    constructor() {
        super()
    }

}

const list = new GoodsList();
list.fetchGoods();
list.render();
