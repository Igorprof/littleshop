const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

Vue.component('goods-list', {
  props: ['goods'],
  template: `
    <div class="goods-list container">
      <goods-item v-for="good of goods" :good="good"></goods-item>
    </div>
  `
})


Vue.component('goods-item', {
  props: ['good'],
  template: `
    <div class="goods-item">
      <h3>{{ good.title }}</h3>
      <p>{{ good.price }}₽</p>
    </div>
  `
})


var app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    basketGoods: [],
    searchLine: '',
    isVisibleCart: false,
    cartButtonText: 'Корзина',
    isQuickSearch: false,
  },
  methods: {
    loadGoods() {
      fetch(`${API_URL}catalogData.json`)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.goods = response.map(good => ({title: good.product_name, price: good.price}));
          this.filteredGoods = response.map(good => ({title: good.product_name, price: good.price}));
        })
        .catch((err) => { 
          console.log(err.text)
      })
    },

    filterGoods(isCheck=false) {
      if (!isCheck || this.isQuickSearch) {
        const searchReg = new RegExp(this.searchLine);
        this.filteredGoods = this.goods.filter(good => searchReg.test(good.title));
      }      
    },

    getBasketGoods() {
      fetch(`${API_URL}getBasket.json`)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.basketGoods = response.contents.map(good => ({title: good.product_name, price: good.price, quantity: good.quantity}))
        })
        .catch((err) => { 
          console.log(err.text)
      })
    },

    showCart() {
      this.isVisibleCart = !this.isVisibleCart;
      this.cartButtonText = this.isVisibleCart ? 'Скрыть корзину' : 'Корзина'
      this.getBasketGoods();      
    }

  },

  computed: {
    totalCost() {
      return this.basketGoods.reduce((total, {price, quantity}) => (total + price*quantity), 0);
    }    
  },

  mounted() {
    this.loadGoods();
  }
})
