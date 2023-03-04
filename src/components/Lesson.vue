<template>
  <div id="info">
    <h1>Home Page</h1>
    <h2 v-if="products.length==0">No Result. Search again</h2>

    <div id="box" v-for="product in products">
      <div id="boxdetail">
        <h3>Subject: {{product.subject}}</h3>
        <h3>Location: {{product.location}}</h3>
        <h3>Price:<a v-html="poundlogo"></a>{{product.price}}</h3>
        <h3>Spaces: {{product.count}}</h3>
      </div>
      <div id="boximage">
        <img v-bind:src="baseUrl+product.imagesrc" width="80" height="70"/>
      </div>
      <div id="boxbutton">
        <button id="enablebutton" v-if="canAddToCart(product)" @click="$emit('clickCart',product)">Add To
          Cart
        </button>
        <button id="disablebuttons" v-else disabled="disabled">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Lesson",
  props:["products","baseUrl"],

  methods:{
    canAddToCart: function (product) {
      return product.count >= 1;
    },



  },
  computed: {

    poundlogo() {
      return ('<i class="fa-solid fa-sterling-sign"></i>');

    },
  },

}
//try adding props producst properly and see what data is need here and try to use props here and thereS
//images link see
</script>

<style scoped>

</style>