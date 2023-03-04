<template>

  <div id="bottom">
      <div id="cartinfo">
        <h1>Shopping Cart</h1>s
        <div id="box" v-for="product in minicart" v-if="cartCount(product.id)>0">
          <div id="boxdetail">
            <h3>Subject: {{product.subject}}</h3>
            <h3>Location: {{product.location}}</h3>
            <h3>Price: <a v-html="poundlogo"></a>{{product.price}}</h3>
            <h3>Total: {{cartCount(product.id)}}</h3>
          </div>
          <div id="boximage">
            <img v-bind:src="baseUrl+product.imagesrc" width="70" height="80"/>
          </div>
          <div id="boxbutton">
            <button id="enablebutton" @click="$emit('removeItem',product)">Remove</button>
          </div>
        </div>
      </div>
      <div id="checkout">
        <h1>CheckOUT</h1>
        <div id="checkoutinfos">

          <input id="search" v-model="name" v-on:input="checkvalidation" type="text"
                 placeholder="Your Name" value=name>
          <input id="search" v-model="phonenumber" v-on:input="checkvalidation" type="text"
                 placeholder="Your Phone Number"
                 value=phonenumber>

          <button v-on:click="finishcart" v-if="validation">Checkout</button>
        </div>
      </div>
    </div>


</template>

<script>
export default {
  name: "Checkout",
  props:["cart","baseUrl","products"],
  data(){
    return{
      name: '',
      phonenumber: '',
      validation: false,
      minicart:[],


    }},
  created() {
    if(this.cart.length>0){
   this.cart.forEach(product=>{
     if (!(this.minicart.includes(product))) {
       this.minicart.push(product);
     }
   })
  }
    },


  methods:{
    checkvalidation: function () {
      if (this.name.length != 0 && this.phonenumber.length != 0) {
        if (/^[a-zA-Z]+$/.test(this.name) && /^\d+$/.test(this.phonenumber) && this.name.length >= 2 && this.phonenumber.length >= 10) {
          this.validation = true;
        } else {
          this.validation = false;
        }
      }
    },
    finishcart: function () {

      alert("Order has been placed.For " + this.name + "  ," +
          "Contact Details: " + this.phonenumber);
      let ncart=[];
      let ndat={};
      for(let b=0;b<this.minicart.length;b++){
        let rspaces=this.itemCount(this.minicart[b].id);

        fetch("https://courseworkapp-env.eba-z4p932sy.eu-west-2.elasticbeanstalk.com/collections/products/"+this.minicart[b].id,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({"count":rspaces})

        }).then(function(response){
          response.text().then(
              function (text){
                console.log(text);
              });

        });


        ndat={
          id:this.minicart[b].id,
          subject:this.minicart[b].subject,
          location:this.minicart[b].location,
          price:this.minicart[b].price,
          spaces:this.cartCount(this.minicart[b].id)
        }
        ncart.push(ndat);
      }
      let newProduct={
        name: this.name,
        phonenumber: this.phonenumber,
        productDetails:ncart,
      };
      fetch("https://courseworkapp-env.eba-z4p932sy.eu-west-2.elasticbeanstalk.com/collections/order",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(newProduct)

      }).then(function(response){
        response.text().then(
            function (text){
              console.log(text);
            });

      });




      this.minicart = [];
      this.$emit('finishCarts');
      // this.showpage("home");
      this.name = '';
      this.phonenumber = '';
      this.validation = false;

    },

    itemCount: function (id) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          return this.products[i].count;
        }
      }
      return 0;
    },
    cartCount: function (id) {
      let cartcount = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === id) {
          cartcount++;
        }
      }
      return cartcount;
    },

  },
  computed: {

    poundlogo() {
      return ('<i class="fa-solid fa-sterling-sign"></i>');

    },
  },
}
</script>

<style scoped>

</style>