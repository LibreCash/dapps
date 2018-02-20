<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>

@font-face {
	font-family: 'GothamProMedium';
	src: url('/static/fonts/GothamProMedium.woff') format('woff');
}

@font-face {
	font-family: 'GothamProRegular';
	src: url('/static/fonts/GothamProRegular.woff') format('woff');
}

@font-face {
	font-family: 'GothamProLight';
	src: url('/static/fonts/GothamProLight.woff') format('woff');
}

@font-face {
	font-family: 'GothamProBold';
	src: url('/static/fonts/GothamProBold.woff') format('woff');
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
 
#app {
  font-family: 'GothamProRegular', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
