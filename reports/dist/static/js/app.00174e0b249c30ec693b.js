webpackJsonp([1],{DjWV:function(e,t){e.exports=JSON.parse('[\n    {\n      "constant": true,\n      "inputs": [\n        {\n          "name": "",\n          "type": "uint256"\n        }\n      ],\n      "name": "reports",\n      "outputs": [\n        {\n          "name": "textReport",\n          "type": "string"\n        },\n        {\n          "name": "date",\n          "type": "uint256"\n        }\n      ],\n      "payable": false,\n      "stateMutability": "view",\n      "type": "function"\n    },\n    {\n      "constant": true,\n      "inputs": [],\n      "name": "owner",\n      "outputs": [\n        {\n          "name": "",\n          "type": "address"\n        }\n      ],\n      "payable": false,\n      "stateMutability": "view",\n      "type": "function"\n    },\n    {\n      "constant": true,\n      "inputs": [],\n      "name": "counter",\n      "outputs": [\n        {\n          "name": "",\n          "type": "uint256"\n        }\n      ],\n      "payable": false,\n      "stateMutability": "view",\n      "type": "function"\n    },\n    {\n      "constant": false,\n      "inputs": [\n        {\n          "name": "newReport",\n          "type": "string"\n        }\n      ],\n      "name": "addNewReport",\n      "outputs": [],\n      "payable": false,\n      "stateMutability": "nonpayable",\n      "type": "function"\n    },\n    {\n      "constant": false,\n      "inputs": [\n        {\n          "name": "newOwner",\n          "type": "address"\n        }\n      ],\n      "name": "transferOwnership",\n      "outputs": [],\n      "payable": false,\n      "stateMutability": "nonpayable",\n      "type": "function"\n    },\n    {\n      "inputs": [],\n      "payable": false,\n      "stateMutability": "nonpayable",\n      "type": "constructor"\n    }\n  ]')},EEbw:function(e,t){e.exports={version:"0.15.3"}},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("7+uW"),s={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var i=n("VU/8")({name:"app"},s,!1,function(e){n("eOIw")},null,null).exports,r=n("/ocq"),o={props:["tableData"],data:()=>({isEmpty:!1,isBordered:!1,isStriped:!0,isNarrowed:!1,isLoading:!1,hasMobileCards:!0,isPaginated:!0,isPaginationSimple:!1,currentPage:1,perPage:5})},p={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"search-results"}},[n("b-table",{attrs:{data:e.isEmpty?[]:e.tableData,bordered:e.isBordered,striped:e.isStriped,narrowed:e.isNarrowed,loading:e.isLoading,paginated:e.isPaginated,"per-page":e.perPage,"current-page":e.currentPage,"pagination-simple":e.isPaginationSimple,"mobile-cards":e.hasMobileCards},on:{"update:currentPage":function(t){e.currentPage=t}},scopedSlots:e._u([{key:"default",fn:function(t){return[n("b-table-column",{attrs:{field:"report.date",label:"Date",centered:""}},[e._v("\n        "+e._s(t.row.date)+"\n      ")]),e._v(" "),n("b-table-column",{attrs:{label:"Report",centered:""}},[e._v("\n        "+e._s(t.row.report)+"\n      ")])]}}])})],1)},staticRenderFns:[]},u=n("VU/8")(o,p,!1,null,null,null).exports,d={name:"bRadioButton",props:{value:{},nativeValue:{},type:{type:String,default:"is-primary"},disabled:Boolean,name:String,size:String},data(){return{newValue:this.value}},watch:{value(e){this.newValue=e},newValue(e){e===this.nativeValue&&this.$emit("input",e)}}},c={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"control"},[n("label",{ref:"label",staticClass:"b-radio radio button",class:[e.newValue===e.nativeValue?e.type:null,e.size],attrs:{disabled:e.disabled,tabindex:!e.disabled&&0},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key)&&e._k(t.keyCode,"space",32,t.key))return null;t.preventDefault(),e.$refs.label.click()}}},[e._t("default"),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.newValue,expression:"newValue"}],attrs:{type:"radio",disabled:e.disabled,name:e.name},domProps:{value:e.nativeValue,checked:e._q(e.newValue,e.nativeValue)},on:{change:function(t){e.newValue=e.nativeValue}}})],2)])},staticRenderFns:[]},l=n("VU/8")(d,c,!1,null,null,null).exports,m={data(){return{reportAddress:this.$eth.reportAddress,reportText:"",owner:!1,reportNumber:0,searchData:[],isLoading:!1}},methods:{async search(){this.searchReports()},async newReport(){try{await this.$eth.addNewReport(this.reportText)}catch(e){console.log(e)}},async searchReports(){this.searchData=[],this.isLoading=!0;try{for(let e=await this.$eth.reportCounter()-1;e>0;--e){let t=await this.$eth.getReport(e);console.log(t),this.searchData.push({date:new Date(1e3*t[1]).toLocaleString(),report:t[0]})}}catch(e){console.log(e)}this.isLoading=!1},async loadReport(){this.reportNumber=await this.$eth.reportCounter()},async loadETH(){this.isLoading=!0;try{await this.loadReport()}catch(e){console.log(e)}this.isLoading=!1},async checkOwner(){this.owner=await this.$eth.isOwner()}},created(){try{this.loadETH(),this.loadReport(),this.search(),this.checkOwner()}catch(e){console.log(e)}},components:{SearchResults:u,BRadioButton:l}},y={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"main",attrs:{id:"Mainblock"}},[e._m(0),e._v(" "),e._m(1),e._v(" "),e.owner?n("section",{},[n("b-field",[n("b-input",{attrs:{type:"input",placeholder:"Write Report"},model:{value:e.reportText,callback:function(t){e.reportText=t},expression:"reportText"}})],1),e._v(" "),n("a",{staticClass:"button is-info",on:{click:e.newReport}},[e._v("Submit")])],1):e._e(),e._v(" "),n("section",{staticClass:"allMain"},[e._m(2),e._v(" "),n("search-results",{attrs:{tableData:e.searchData}}),e._v(" "),n("b-loading",{attrs:{active:e.isLoading,canCancel:!0},on:{"update:active":function(t){e.isLoading=t}}})],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("button",{staticClass:"button navbar-burger",attrs:{"data-target":"Mainblock"}},[t("span"),this._v(" "),t("span"),this._v(" "),t("span")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"LeftNav",attrs:{id:"navMenu"}},[t("a",{staticClass:"logo",attrs:{href:"#"}},[t("img",{attrs:{src:"static/img/logo.png",width:"200",height:"180"}})]),this._v(" "),t("ul",{staticClass:"MenuLeft"},[t("li",{staticClass:"active"},[t("a",{attrs:{href:"#"}},[t("div",{staticClass:"Rectangle"}),this._v(" "),t("span",[this._v("Reports")])])]),this._v(" "),t("li",[t("a",{attrs:{href:"#"}},[t("div",{staticClass:"Rectangle"}),this._v(" "),t("span",[this._v("Analytics")])])]),this._v(" "),t("li",[t("a",{attrs:{href:"#"}},[t("div",{staticClass:"Rectangle"}),this._v(" "),t("span",[this._v("Analytics")])])])]),this._v(" "),t("ul",{staticClass:"conditions"})])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"h2-contain"},[t("h2",{staticClass:"subtitle"},[this._v("Reports History")])])}]},h=n("VU/8")(m,y,!1,null,null,null).exports;a.a.use(r.a);var b=new r.a({routes:[{path:"/",name:"Report",component:h}],mode:"history"}),f=n("MMSg"),w=n.n(f);n("doPI");a.a.use(w.a);var _=n("8k0n"),v=n.n(_),g=n("DjWV"),x=n.n(g);class C{static install(e,t){const n=new C;Object.defineProperty(a.a.prototype,"$eth",{get:()=>n})}constructor(){this._web3=null,this._reportContract=null,this.loadWeb3()}loadWeb3(){"undefined"!=typeof web3?(window.web3=new v.a(window.web3.currentProvider),this._web3=window.web3,this._web3.eth.defaultAccount=this._web3.eth.accounts[0],this._reportContract=this._web3.eth.contract(x.a).at(C.reportAddress())):(this.load(),console.log("No web3? You should consider trying MetaMask!"))}static reportAddress(){return"0x6AF43411Ee83354C53FC6ff1c8987790fa84AE4d"}load(){try{window.web3=new v.a(new v.a.providers.HttpProvider("https://mainnet.infura.io")),this._web3=window.web3,this._reportContract=this._web3.eth.contract(x.a).at(C.reportAddress())}catch(e){console.log(e)}}async reportCounter(){return new Promise((e,t)=>{this._reportContract.counter((n,a)=>{n?t(n):e(a)})})}async isOwner(){return new Promise((e,t)=>{this._reportContract.owner((n,a)=>{n?t(n):e(a===this._web3.eth.accounts[0])})})}async addNewReport(e){return console.log(this._reportContract,e,this._web3),new Promise((t,n)=>{this._reportContract.addNewReport(e,(e,a)=>{e?n(e):t(a)})})}async getReport(e){return new Promise((t,n)=>{this._reportContract.reports(e,(e,a)=>{e?n(e):t(a)})})}isLoaded(){return null!==this._web3}isAddress(e){return this._web3.utils.isAddress(e)}getBlockNumber(){return new Promise((e,t)=>{this._web3.eth.getBlockNumber((n,a)=>{n?t(n):e(a)})})}getConfirmations(e){return new Promise((t,n)=>{this.getBlockNumber().then(a=>{this._web3.eth.getTransactionReceipt(e,(e,s)=>{e?n(e):t(null!==s?a-s.blockNumber:0)})})})}sum(e,t){return this._web3.toBigNumber(e).add(t)}fromWei(e){return this._web3.utils.fromWei(e)}}a.a.use(C,{});var R=n("bm7V"),P=n.n(R);a.a.use(P.a,{container:"body",duration:500,easing:"ease",offset:0,cancelable:!0,onDone:!1,onCancel:!1,x:!1,y:!0}),a.a.config.productionTip=!1,new a.a({el:"#app",router:b,template:"<App/>",components:{App:i}})},"R/pS":function(e,t){e.exports=[{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"name",outputs:[{name:"o_name",type:"bytes32"}],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"owner",outputs:[{name:"",type:"address"}],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"content",outputs:[{name:"",type:"bytes32"}],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"addr",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"}],name:"reserve",outputs:[],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"subRegistrar",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_newOwner",type:"address"}],name:"transfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_registrar",type:"address"}],name:"setSubRegistrar",outputs:[],type:"function"},{constant:!1,inputs:[],name:"Registrar",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_a",type:"address"},{name:"_primary",type:"bool"}],name:"setAddress",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_content",type:"bytes32"}],name:"setContent",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"}],name:"disown",outputs:[],type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"_name",type:"bytes32"},{indexed:!1,name:"_winner",type:"address"}],name:"AuctionEnded",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"_name",type:"bytes32"},{indexed:!1,name:"_bidder",type:"address"},{indexed:!1,name:"_value",type:"uint256"}],name:"NewBid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"name",type:"bytes32"}],name:"Changed",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"name",type:"bytes32"},{indexed:!0,name:"addr",type:"address"}],name:"PrimaryChanged",type:"event"}]},UIsv:function(e,t){e.exports=[{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"owner",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_refund",type:"address"}],name:"disown",outputs:[],type:"function"},{constant:!0,inputs:[{name:"_name",type:"bytes32"}],name:"addr",outputs:[{name:"",type:"address"}],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"}],name:"reserve",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_newOwner",type:"address"}],name:"transfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"_name",type:"bytes32"},{name:"_a",type:"address"}],name:"setAddr",outputs:[],type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"name",type:"bytes32"}],name:"Changed",type:"event"}]},doPI:function(e,t){},eOIw:function(e,t){},oPsS:function(e,t){e.exports=[{constant:!1,inputs:[{name:"from",type:"bytes32"},{name:"to",type:"address"},{name:"value",type:"uint256"}],name:"transfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"from",type:"bytes32"},{name:"to",type:"address"},{name:"indirectId",type:"bytes32"},{name:"value",type:"uint256"}],name:"icapTransfer",outputs:[],type:"function"},{constant:!1,inputs:[{name:"to",type:"bytes32"}],name:"deposit",outputs:[],type:"function"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"AnonymousDeposit",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"bytes32"},{indexed:!1,name:"value",type:"uint256"}],name:"Deposit",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"bytes32"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!0,name:"from",type:"bytes32"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"indirectId",type:"bytes32"},{indexed:!1,name:"value",type:"uint256"}],name:"IcapTransfer",type:"event"}]}},["NHnr"]);
//# sourceMappingURL=app.00174e0b249c30ec693b.js.map