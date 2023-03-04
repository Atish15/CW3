
<template>
  <div id="app">
    <button v-on:click="consoleTest">Test Console</button>
    <div v-if="testConsole==true">
    <button v-on:click="deleteAllCaches">Delete Caches</button>
    <button v-on:click="reloadPage">Reload</button>
      <a>HTTP<strong v-bind:href="serverURL" target="_blank">Link</strong></a>
    <button v-on:click="unregisterServices">Unregister Services</button>


    </div>



    <header>
      <div id="up">
        <input id="search" v-model="newTask" v-on:input="changes" type="text" placeholder="To search" value=newTask
               v-if="showcart==false">
        <button id="buttons" v-if="cart.length>0" v-on:click="cartout">{{cart.length}} <font-awesome-icon icon=" fas fa-shopping-cart" /> {{this.cartinfo}}
        </button>
      </div>
      <div id="rem">
        <div id="top">
          <div id="sidenav" v-if="showcart==false">
            <div>
              <p>Sort By:</p>
              <input type="checkbox" v-model="sortsubject"><a>Subject</a><br>
              <input type="checkbox" v-model="sortlocation"><a>Location</a><br>
              <input type="checkbox" v-model="sortprice"><a>Price</a><br>
              <input type="checkbox" v-model="sortavailability"><a>Availability</a><br>
            </div>
            <br></br>
            <div>
              <input type="checkbox" v-model="sortascending"
                     value="this.sortascending"><a>Ascending</a><br>
              <input type="checkbox" v-model="sortdescending"><a>Descending</a><br>
            </div>
            <br>
            <button id="sortbutton" v-on:click="shw()">Sort</button>
          </div>
        </div>
      </div>

    </header>

    <main>
      <component :is="currentComponent" :products="products" :baseUrl="baseUrl" :cart="cart"
                 @finishCarts="finishCart" @clickCart="addToCart" @removeItem="remove" ></component>

    </main>
  </div>
</template>
<script>
import Lesson from './components/Lesson.vue'
import Checkout from './components/Checkout.vue'

export default {
  name: "App",
  data(){
    return{
      serverURL:'https://courseworkapp-env.eba-z4p932sy.eu-west-2.elasticbeanstalk.com/collections/products',
      testConsole:false,
      currentComponent:'Lesson',
      baseUrl:'',
      cartinfo: 'Go To Cart',
      products: [],
      cart: [],
      temp:[],
      showcart: false,
      newTask: '',
      searched: [],
      showsearch: false,
      sortsubject: false,
      sortavailability: false,
      sortlocation: false,
      sortprice: false,
      sortascending: false,
      sortdescending: false
    }
  },
  components:{Lesson, Checkout},
  created:async function(){

    //  fetch("http://localhost:3000/collections/products")
   let webstore=this;
    fetch("https://courseworkapp-env.eba-z4p932sy.eu-west-2.elasticbeanstalk.com/collections/products")
        .then(function (response){
          response.json().then(
              function (json){
               webstore.products=json;
               webstore.temp=webstore.products;
              });

        });

    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("service-worker.js");
    }


  },

  methods:{

    consoleTest(){
      this.testConsole=!this.testConsole;
    },
    unregisterServices(){
     navigator.serviceWorker.getRegistrations().then(function(registrations){
       for(let registration of registrations){
         registration.unregister();
       }
     })
      console.log("Service Worker ungistered");
    },
    deleteAllCaches(){
     caches.keys().then(function (names){
       for(let name of names){
         caches.delete(name);
       }
     })
    },
    reloadPage(){
      window.location.reload();
    },

    finishCart(){
     this.cart=[];
     this.currentComponent="Lesson";
     this.showpage("home");
    },
    remove: function (product) {

      if (this.cart.includes(product)) {
        let index = this.cart.indexOf(product);
        this.cart.splice(index, 1);

        for (let i = 0; i < this.products.length; i++) {
          if (product == this.products[i]) {

            this.products[i].count = this.products[i].count + 1;
          }
        }
      }
      if (this.cart.length == 0) {
        this.currentComponent="Lesson";
        this.showpage("home");
      }
    },

    addToCart: function (product) {
      if ((product.count) >= 1) {
        product.count = product.count - 1;
        this.cart.push(product);

      }


    },
    cartout: function () {
      if (this.currentComponent=="Lesson") {
       this.currentComponent="Checkout";
        this.cartinfo = "Go To Cart";
        this.showcart=true;

      }
      else {
        this.currentComponent="Lesson";
        this.cartinfo = "Go To Home";
        this.showcart=false;

      }
    },
    showpage: function (show) {
      if (show == "search") {
        this.showsearch = true;
        this.showcart
            = false;
      }
      if (show == "home") {
        this.showsearch = false;
        this.showcart = false;
      }
      if (show == "cart") {
        this.showsearch = false;
        this.showcart = true;
      }
    },
    changes: function () {
      let app=this;
      console.log(this.newTask);
      if (this.newTask=='' || this.newTask==undefined) {
        this.showpage("home");
        this.searched = [];
        this.products=this.temp;
        console.log(this.products.length)

      }
      else {

        this.searched = [];
        // let foundsomething = false;
        let searchTerm=this.newTask.replace(/" "/g,"%20");
        console.log(searchTerm);
        fetch("https://courseworkapp-env.eba-z4p932sy.eu-west-2.elasticbeanstalk.com/collections/products/search?q="+searchTerm,{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
          }

        }).then(function(response){
          response.json().then(
              function (json){
                let finalSearch=[];
                let arr1=[];
                let arr2=[];
                for(let i=0;i<2;i++){
                  arr1=json[0];
                  arr2=json[1];
                }
                for(let i=0;i<arr1.length;i++){
                  finalSearch.push(arr1[i]);
                }
                for(let ii=0;ii<arr2.length;ii++) {
                  let found=false;
                  for (let i = 0; i < arr1.length; i++) {
                    if (arr2[ii].id == arr1[i].id){
                      found=true;
                    }
                  }
                  if(found==false){
                    finalSearch.push(arr2[ii]);
                  }
                }

                 app.searched=finalSearch;
                if(app.searched.length>0){
                  app.products=app.searched;
                  // console.log(this.products)
                }
                else{
                  app.products=[];
                }


              });

        });


      }

    },
    shw: function () {
      let condition = false;
      if (this.sortascending == true && this.sortdescending == true) {
        condition = true;


        this.sortsubject = false;
        this.sortlocation = false;
        this.sortprice = false;
        this.sortavailability = false;
        this.sortdescending = false;
        this.sortascending = false;
        alert("Please choose just one feature ascending or descending")
      }
      if ((this.sortprice == false && this.sortlocation == false && this.sortavailability == false && this.sortsubject == false && (this.sortascending == true || this.sortdescending == true))) {
        condition = true;
        this.sortdescending = false;
        this.sortascending = false;
        alert("Please select a sort feature")

      }
      if ((this.sortprice == false && this.sortlocation == false && this.sortavailability == false && this.sortsubject == false && (this.sortascending == false && this.sortdescending == false))) {
        condition = true;
        alert("Please select a sort feature")

      }

      if ((this.sortprice == true && (this.sortlocation == false && this.sortavailability == false && this.sortsubject == false) && (this.sortascending !== this.sortdescending))) {
        condition = true;
        if (this.sortascending) {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              return parseFloat(a.price) - parseFloat(b.price);
            });
          } else {
            this.searched.sort(function (a, b) {
              return parseFloat(a.price) - parseFloat(b.price);
            });
          }

        } else {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              return parseFloat(b.price) - parseFloat(a.price);
            });
          } else {
            this.searched.sort(function (a, b) {
              return parseFloat(b.price) - parseFloat(a.price);
            });
          }
        }
      } else if ((this.sortlocation == true && (this.sortprice == false && this.sortavailability == false && this.sortsubject == false) && (this.sortascending !== this.sortdescending))) {
        condition = true;

        if (this.sortascending) {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              if (b.location.charAt(0) > a.location.charAt(0))
                return -1;
              if (b.location.charAt(0) < a.location.charAt(0))
                return 1;
              return 0;
            });
          } else {
            this.searched.sort(function (a, b) {
              if (b.location.charAt(0) > a.location.charAt(0))
                return -1;
              if (b.location.charAt(0) < a.location.charAt(0))
                return 1;
              return 0;
            });
          }
        } else {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              if (b.location.charAt(0) < a.location.charAt(0))
                return -1;
              if (b.location.charAt(0) > a.location.charAt(0))
                return 1;
              return 0;
            });
          } else {
            this.searched.sort(function (a, b) {
              if (b.location.charAt(0) < a.location.charAt(0))
                return -1;
              if (b.location.charAt(0) > a.location.charAt(0))
                return 1;
              return 0;
            });
          }
        }
      } else if ((this.sortavailability == true && (this.sortlocation == false && this.sortprice == false && this.sortsubject == false) && (this.sortascending !== this.sortdescending))) {
        condition = true;
        if (this.sortascending) {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              return parseFloat(a.count) - parseFloat(b.count);
            });
          } else {
            this.searched.sort(function (a, b) {
              return parseFloat(a.count) - parseFloat(b.count);
            });
          }
        } else {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              return parseFloat(b.count) - parseFloat(a.count);
            });
          } else {
            this.searched.sort(function (a, b) {
              return parseFloat(b.count) - parseFloat(a.count);
            });
          }
        }

      } else if ((this.sortsubject == true && (this.sortprice == false && this.sortavailability == false && this.sortlocation == false) && (this.sortascending !== this.sortdescending))) {
        condition = true;
        if (this.sortascending) {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              if (b.subject.charAt(0) > a.subject.charAt(0))
                return -1;
              if (b.subject.charAt(0) < a.subject.charAt(0))
                return 1;
              return 0;
            });
          } else {
            this.searched.sort(function (a, b) {
              if (b.subject.charAt(0) > a.subject.charAt(0))
                return -1;
              if (b.subject.charAt(0) < a.subject.charAt(0))
                return 1;
              return 0;
            });
          }
        } else {
          if (this.showsearch == false) {
            this.products.sort(function (a, b) {
              if (b.subject.charAt(0) < a.subject.charAt(0))
                return -1;
              if (b.subject.charAt(0) > a.subject.charAt(0))
                return 1;
              return 0;
            });
          } else {
            this.searched.sort(function (a, b) {
              if (b.subject.charAt(0) < a.subject.charAt(0))
                return -1;
              if (b.subject.charAt(0) > a.subject.charAt(0))
                return 1;
              return 0;
            });
          }
        }
      } else {
        if (condition == false) {
          alert("Please select only one sort feature")
        }

        condition = false;
      }

      if (condition == false) {
        this.sortsubject = false;
        this.sortlocation = false;
        this.sortprice = false;
        this.sortavailability = false;
        this.sortdescending = false;
        this.sortascending = false;
      }


    },



  },
  computed: {



    poundlogo() {
      return ('<i class="fa-solid fa-sterling-sign"></i>');

    },
  },
}
</script>

