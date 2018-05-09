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
                  <li v-for="route in $router.options.routes" :key="route.path" v-if="route.enabled">
                    <router-link :to="route.path">
                      <div class="icon">
                        <i :class="route.icon"></i>
                      </div>
                      <span>{{ $t(`lang.tabs.${route.meta.locale}`) }}</span>
                    </router-link>
                  </li>
                  <li class="level">
                    <b-field class="level-item">
                      <b-select v-model="locale">
                        <option
                          v-for="(locale, index) in $i18n.messages.locales"
                          :value="index"
                          :key="index">
                          {{ locale }}
                        </option>
                      </b-select>
                    </b-field>
                  </li>
                </ul>
            </div>
        </div>
        <section class="allMain">
          <div class="h2-contain">
            <h2 class="subtitle">{{ $t(`lang.tabs.${$route.meta.locale}`) }}</h2>
          </div>
          <div class="level"></div>
          <router-view/>
      </section>
    </div>
</template>
<script>
import Vue from 'vue'
import i18n from './locales'

export default {
  name: "navbar",
  data() {
    return {
      locale: i18n.messages.locales.indexOf(i18n.locale),
      navIsActive: true
    };
  },
  methods: {
    toggleMenu: () => this.navIsActive = !this.navIsActive
  },
  watch: {
    locale: function (newVal) {
      i18n.locale = i18n.messages.locales[+newVal];
      localStorage.setItem("locale", newVal);
    }
  },
  async created () {
    await this.$store.dispatch('startUpdating', this.$eth.getLatestBlockTime)
  }
};
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Lato:400,700&subset=latin-ext');
/* Read this: https://github.com/jgthms/bulma/issues/218 */
.bm--card-equal-height {
   display: flex;
   flex-direction: column;
   height: 100%;
}
.bm--card-equal-height .card-footer {
   margin-top: auto;
}
p.card-header-title {
  text-align: center;
  justify-content: center;
}
.card-footer-item { 
  text-align: center;
  justify-content: center;
}

.breakall {
    word-break: break-all
}

.card-content > .content {
  text-align: center;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.text-wrap > span {
  white-space:normal;
  word-wrap: break-word;
  text-align: left;
  word-break:break-all;
}

.max-width {
  max-width:100% !important;
  width:100% !important;
}

.max-height {
  max-height: 100% !important;
}


.full-height-field > .field-body, .full-height-field .control, button.full-height   {
  height: 100%
}

@media screen and (max-width: 768px) {
#app {
  margin-top:0;
}

.flex-mobile {
  display: flex;
}

.mobile-centered {
  text-align: center;
}

table.has-mobile-cards {
  display:flex
}
table.has-mobile-cards tbody {
  max-width: 100%;
  width: 100%;
}
table.has-mobile-cards .text-wrap {
  white-space:normal;
  word-wrap: break-word;
  text-align: left;
  word-break:break-all;
}

table.has-mobile-cards .flex-wrap {
  flex-wrap:wrap;
}

.is-text-overflow {
    flex: 1;
    overflow: auto;
    white-space: nowrap;
}

.is-text-overflow::-webkit-scrollbar { 
    display: none; 
}
}

.table-container {
  max-width: 100%;
}

.flex {
  display: flex;
}

.h2-contain > .subtitle {
  text-align: center;
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
.MenuLeft li a, .MenuLeft li .lang-selector {
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
  .table-padding {
    padding: 0 40px;
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

.b-table > div.level {
  justify-content: center;
}

td.flex, footer.modal-card-foot.flex {
    justify-content: center;
}
</style>
