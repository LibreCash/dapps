<template>
    <div id="app">
        <div class="main" id="Mainblock">
            <div class="navbar-burger burger" @click="toggleMenu" :class="{'is-active': navIsActive}" data-target="Mainblock">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="LeftNav" id="navMenu">
                <div href="#" class="logo">
                    <img src="/src/assets/img/logo.svg" width="200" height="180" />
                    <h3 >Testing. Works on Rinkeby</h3>
                </div>
                <ul class="MenuLeft">
                    <li>
                        <router-link to="/">
                            <div class="Rectangle"></div>
                            <span>Reports</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/fund">
                            <div class="Rectangle"></div>
                            <span>Fund Status</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/status">
                            <div class="Rectangle"></div>
                            <span>Contract Status</span>
                        </router-link>
                    </li>
                    <!--li>
                        <router-link to="/dao">
                            <div class="Rectangle"></div>
                            <span>DAO</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/loans">
                            <div class="Rectangle"></div>
                            <span>Loans</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/deposit">
                            <div class="Rectangle"></div>
                            <span>Deposit</span>
                        </router-link>
                    </li-->
                </ul>
                <ul class="conditions">
                    <li>
                        <a href="https://librebank.com">LibreBank Site</a>
                    </li>
                    <li>
                        <a href="https://librecash.com">LibreCash Site</a>
                    </li>
                    <li>
                        <a href="https://blog.librebank.com">LibreBank Blog</a>
                    </li>
                </ul>
            </div>
        </div>
        <router-view/>
    </div>
</template>
<script>
export default {
  name: "navbar",
  data() {
    return {
      navIsActive: false
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
#search-results {
  margin-top: 20px;
  padding: 0 60px;
}
#search-results .table thead {
  display: none;
}
#search-results .table tr {
  display: block;
  padding: 20px 0;
}
#search-results .table tr td {
  display: block;
  border: 0;
  padding-left: 0px;
}
#search-results .table tr td:first-child {
  font-size: 14px;
}
#search-results .table tr td.has-text-centered {
  text-align: left !important;
}
.logo {
  display: block;
  text-align: center;
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
  #search-results {
    padding: 0 15px;
  }
  #search-results .table tr td {
    padding: 5px 10px;
    font-size: 14px;
  }
  #search-results .table tr {
    padding: 7px 0;
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
  #search-results .table tr td:first-child {
    font-size: 14px;
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
  border-width: 0 0 1px 0;
  border-color: #949191;
  background-color: white;
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
