<template>
    <div id="app">
        <div class="main" id="Mainblock" :class="{'is-active': navIsActive}">
            <div class="navbar-burger burger" @click="toggleMenu" :class="{'is-active': navIsActive}" data-target="Mainblock">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="LeftNav" id="navMenu">
                <div class="logo">
                  <router-link to="/">
                    <img src="/static/img/logo.svg" width="200" height="180" />
                  </router-link>
                </div>
                <ul class="MenuLeft">
                  <li v-for="route in $router.options.routes" :key="route.path">
                    <router-link :to="route.path" v-if="route.enabled">
                          <div class="icon">
                            <i :class="route.icon"></i>
                          </div>
                          <span>{{route.name }}</span>
                    </router-link>
                  </li>
                </ul>
            </div>
        </div>
        <section class="allMain">
          <div class="h2-contain">
            <h2 class="subtitle">{{ $route.name }}</h2>
          </div>
          <div class="level"></div>
          <router-view/>
      </section>
    </div>
</template>
<script>
export default {
  name: "navbar",
  data() {
    return {
      navIsActive: true
    };
  },
  methods: {
    toggleMenu: function() {
      this.navIsActive = !this.navIsActive;
    }
  }
};
</script>
<style>
.centered {
  vertical-align:middle
}
.flex {
  display: flex;
}
.is-text-overflow {
    flex: 1;
    overflow: auto;
    white-space: nowrap;
}

.is-text-overflow::-webkit-scrollbar { 
    display: none; 
}

.h2-contain > .subtitle {
  text-align: center;
}
.eth-address {
  font-size: 1em;
  color: #3498db;
  font-weight: bold;
}
@media screen and (min-device-width: 320px) {
  .eth-address {
    font-size: 0.63em;
  }
}
@media screen and (min-device-width: 375px) {
  .eth-address {
    font-size: 0.7em;
  }
}
@media screen and (min-device-width: 425px) {
  .eth-address {
    font-size: 0.8em;
  }
}
.LeftNav {
  width: 340px;
  top: 0;
  left: 0;
  z-index: 9;
  display: block;
  height: 100%;
  background: #3c3636;
  max-height: 100%;
  min-height: 100%;
  position: fixed;
  font-family: "Lato", sans-serif;
  padding-top: 60px;
  overflow-y: auto;
}
.allMain {
  margin-left: 340px;
  min-height: 500px;
  background: white;
  color: #333;
  font-family: "Lato", sans-serif;
  padding: 0;
}
.allMain h2 {
  font-size: 34px;
}
.allMain .h2-contain {
  -webkit-box-shadow: 0px 2px 27px 1px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 2px 27px 1px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 2px 27px 1px rgba(0, 0, 0, 0.25);
  padding: 30px 60px;
  justify-content: flex-start;
}

.logo {
  display: block;
  text-align: center;
  color: white;
}
.MenuLeft {
  margin-top: 75px;
}
.MenuLeft li a {
  color: #ffffff;
  font-size: 20px;
  display: block;
  padding: 20px 10px 20px 40px;
  border-left: 4px solid transparent;
}
.MenuLeft li a.router-link-exact-active {
  border-left: 4px solid #fcc14a;
}
.MenuLeft li a:hover {
  color: #fcc14a;
}
.Rectangle {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #d8d8d8;
  display: inline-block;
  vertical-align: middle;
}
.MenuLeft li a span {
  display: inline-block;
  vertical-align: middle;
  margin-left: 24px;
}
.conditions {
  position: absolute;
  bottom: 30px;
  left: 40px;
}
.conditions li a {
  color: #ffffff;
  font-size: 14px;
}
.conditions li a:hover {
  color: #fcc14a;
}
.allMain .level {
  justify-content: flex-start;
  align-items: flex-start;
}
.allMain .pagination-link.is-current {
  background-color: #fcc14a;
  border-color: #fcc14a;
}
.logo h3 {
  color: white;
}
.allMain .pagination-link,
.allMain .pagination-previous[disabled],
.allMain .pagination-next[disabled],
.allMain .pagination-link[disabled],
.allMain .pagination-previous,
.allMain .pagination-next,
.allMain .pagination-link {
  background: transparent;
  border: 0;
  color: #3c3636;
}
@media only screen and (min-width: 991px) {
  .hamburger {
    display: none;
  }
}
@media only screen and (max-width: 991px) {
  .main {
    overflow: hidden;
  }
  .LeftNav {
    width: 100%;
    position: relative;
    height: 0px;
    overflow: hidden;
    padding: 0;
    overflow-y: auto;
  }
  .MenuLeft {
    margin-top: 25px;
  }
  .conditions {
    bottom: 10px;
    left: 15px;
    position: relative;
    margin-top: 30px;
  }
  .MenuLeft li a {
    padding: 10px 10px 10px 15px;
  }
  .allMain {
    margin-left: 0px;
  }
  .allMain .h2-contain {
    padding: 10px 15px 10px 15px;
    box-shadow: none;
  }
  .allMain h2 {
    font-size: 22px;
  }
  #Mainblock.is-active .LeftNav {
    height: auto;
    overflow: visible;
    padding-top: 20px;
    padding-bottom: 10px;
  }
  .main .navbar-burger {
    margin: 5px 0 10px 15px;
  }
  .conditions li a {
    display: block;
    padding: 2px 0;
  }
}
.table-padding {
  padding: 0 40px;
}
input.address {
  width: 100%;
  text-align: inherit;
  border: 0;
  background: transparent;
  font-size: inherit;
}
.chart-height {
  min-height: 200px;
}
.b-table > div.level {
  justify-content: center;
}
#app {
  font-family: "GothamProRegular", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
