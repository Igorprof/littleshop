const API_URL = 'http://127.0.0.1:3000/'

Vue.component('goods-list', {
  props: ['goods'],
  template: `
    <div class="goods-list">
      <goods-item v-for="good of goods" :good="good" @addedgood="addedGood"></goods-item>
    </div>
  `,
  methods: {
    addedGood() {
      this.$emit('addednewgood');
    }
  }
})


Vue.component('goods-item', {
  props: ['good'],
  template: `
    <div class="goods-item">
      <h3>{{ good.title }}</h3>
      <p>{{ good.price }}₽</p>
      <button class="add-del-cart-button" type="button" @click="addToCart">Добавить в корзину</button>
    </div>
  `,
  methods: {
    addToCart() {
      fetch(`${API_URL}addToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({product_name: this.good.title, price: this.good.price}),
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.status_code == 200) {
          this.$emit('addedgood');
        }
      });
    }
  }
})


Vue.component('cart', {
  props: ['goods', 'totalcost'],
  template: `
    <div class="cart">
      <p>Корзина</p>
      <div class="goods-list">
        <cart-item v-for="good of goods" :good="good" @deletedgood="deletedGood"></cart-item>  
      </div>
      <p class="total-cost">Общая стоимость: {{ totalcost }}</p>
    </div>
  `,
  methods: {
    deletedGood() {
      this.$emit('deletedgood');
    }
  }
})


Vue.component('cart-item', {
  props: ['good'],
  template: `
    <div class="goods-item">
      <h3>{{ good.title }}</h3>
      <p>{{ good.price }}₽</p>
      <p>{{ good.quantity }}</p>
      <button class="add-del-cart-button" type="button" @click="delFromCart">Удалить из корзины</button>
    </div>
  `,
  methods: {
    delFromCart() {
      fetch(`${API_URL}deleteFromCart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({product_name: this.good.title, price: this.good.price}),
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.status_code == 200) {
          this.$emit('deletedgood');
        }
      });
    }
  }
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
      fetch(`${API_URL}catalogData`)
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
      fetch(`${API_URL}basket`)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.basketGoods = response.contents.map(good => ({title: good.product_name, price: good.price, quantity: good.quantity}))
        })
        .catch((err) => { 
          console.log(err);
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
