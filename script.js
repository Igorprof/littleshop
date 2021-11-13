const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

Vue.component('goods-list', {
  props: ['goods'],
  template: `
    <div class="goods-list">
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


Vue.component('cart', {
  props: ['goods', 'totalcost'],
  template: `
    <div class="cart">
      <p>Корзина</p>
      <div class="goods-list">
        <cart-item v-for="good of goods" :good="good"></cart-item>  
      </div>
      <p class="total-cost">Общая стоимость: {{ totalcost }}</p>
    </div>
  `
})


Vue.component('cart-item', {
  props: ['good'],
  template: `
    <div class="goods-item">
      <h3>{{ good.title }}</h3>
      <p>{{ good.price }}₽</p>
      <p>{{ good.quantity }}</p>
    </div>
  `
})

Vue.component('search', {
  template: `
    <div class="search">
      <input type="text" class="goods-search" v-model="searchLine" @input="filterGoods(true)" />
      <button class="search-button" type="button" @click="filterGoods()">Искать</button>
      <input type="checkbox" id="quickSearch" name="quickSearch" v-model="isQuickSearch" />
      <label for="quickSearch">Быстрый поиск</label>
    </div>
  `,
  data() {
    return {
      searchLine: '',
      isQuickSearch: false,
    }
  },
  methods: {
    filterGoods(isCheck=false) {
      this.$emit('onsearch', this.searchLine, isCheck, this.isQuickSearch);
    }
  }
})

Vue.component('error', {
  template: `
    <p class="error">Сервер не может загрузить данные</p>
  `,
})


var app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    basketGoods: [],
    isVisibleCart: false,
    cartButtonText: 'Корзина',
    isErrorFromServer: false,
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
          console.log(err.text);
          this.isErrorFromServer = true;
      })
    },

    filterGoods(searchLine, isCheck, isQuickSearch) {
      if (!isCheck || isQuickSearch) {
        const searchReg = new RegExp(searchLine, 'i');
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
          console.log(err.text);
          this.isErrorFromServer = true;
      })
    },

    showCart() {
      this.isVisibleCart = !this.isVisibleCart;
      this.cartButtonText = this.isVisibleCart ? 'Скрыть корзину' : 'Корзина'
      if (this.isVisibleCart) {
        this.getBasketGoods();    
      }  
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
