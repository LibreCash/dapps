<template>
  <div>
      <div class="table-padding">
        <div class="columns">
          <div class="column">
            <div class="card bm--card-equal-height">
              <div class="card-content">
                <address-block>one</address-block>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card bm--card-equal-height">
              <div class="card-content">
                Current time: {{ new Date(curBlockchainTime * 1000).toLocaleString() }}
              </div>
            </div>
          </div>          
        </div>
        <div class="columns">
          <div class="column is-6">
            <div class="card bm--card-equal-height">
              <header class="card-header">
                <p class="card-header-title">
                  Bank Bounty
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <p>Bounty contract: {{ bountyBankAddress }}</p>
                  <b-field grouped group-multiline>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>bounty</b-tag>
                          <b-tag type="is-info">{{ bank.bounty }} ETH</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>deadline</b-tag>
                          <b-tag type="is-info">{{ bank.deadlineUnix == 0 ? '...' : bank.deadline }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>claimed</b-tag>
                          <b-tag type="is-info">{{ bank.claimed ? 'yes' : 'no' }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>payment</b-tag>
                          <b-tag type="is-info">{{ bank.payment == 0 ? 'nothing' : bank.payment + 'ETH' }}</b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                </div>
              </div>
              <footer class="card-footer">
                <a v-if="bank.claimed && debugButtons" class="card-footer-item" v-on:click="testEraseBankClaim()">Unclaim</a>
                <a v-if="bank.payment > 0" class="card-footer-item" v-on:click="withdraw('bank')">Withdraw</a>
                <a class="card-footer-item" v-on:click="targetsBankModal()">New targets</a>
                <a class="card-footer-item" v-on:click="tabsBounty = 0; termsShown = true">Bounty terms</a>
              </footer>
            </div>
          </div>
          <div class="column is-6">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Exchanger Bounty
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <p>Bounty contract: {{ bountyExchangerAddress }}</p>
                  <b-field grouped group-multiline>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>bounty</b-tag>
                          <b-tag type="is-info">{{ exchanger.bounty }} ETH</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>deadline</b-tag>
                          <b-tag type="is-info">{{ exchanger.deadlineUnix == 0 ? '...' : exchanger.deadline }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>claimed</b-tag>
                          <b-tag type="is-info">{{ exchanger.claimed ? 'yes' : 'no' }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>payment</b-tag>
                          <b-tag type="is-info">{{ exchanger.payment == 0 ? 'nothing' : exchanger.payment + 'ETH' }}</b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                </div>
              </div>
              <footer class="card-footer">
                <a v-if="exchanger.claimed && debugButtons" class="card-footer-item" v-on:click="testEraseExchangerClaim()">Unclaim</a>
                <a v-if="exchanger.payment > 0" class="card-footer-item" v-on:click="withdraw('exchanger')">Withdraw</a>
                <a class="card-footer-item" v-on:click="targetsExchangerModal()">New targets</a>
                <a class="card-footer-item" v-on:click="tabsBounty = 1; termsShown = true">Bounty terms</a>
              </footer>
            </div>
          </div>
        </div>

        <b-table
          v-if="searchData.length > 0"
          :data="isEmpty ? [] : searchData"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :loading="tableLoading"
          :mobile-cards="hasMobileCards"
          :responsive="isResponsive"
          :paginated="true"
          :per-page="perPage"
          :pagination-simple="false">
          <template slot-scope="props" v-if="!props.row.tempHide">
            <b-table-column label='Address' centered v-if="props.row.address == '-'">
                not set
            </b-table-column>
            <b-table-column label='Address' centered v-else>
              <a :href="'https://rinkeby.etherscan.io/address/'+props.row.address">address</a>
            </b-table-column>

            <b-table-column label='Name' centered>
              {{ props.row.name }}
              <b-tag>{{ props.row.type }}</b-tag>
              <b-tag v-if="(props.row.type == 'bank' && bank.claimed) ||
                      (props.row.type == 'exchanger' && exchanger.claimed)">claimed</b-tag>
              <b-tag v-if="(props.row.type == 'bank' && bank.deadlineUnix < curBlockchainTime) ||
                      (props.row.type == 'exchanger' && exchanger.deadlineUnix < curBlockchainTime)">deadlined</b-tag>
            </b-table-column>
            <b-table-column label='ABI' centered>
                <b-tooltip label="Get ABI" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="showABI(props.row)"><i class="mdi mdi-json"></i></button>
                </b-tooltip>
                <b-tooltip label="Get Mist script" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="showMist(props.row)"><i class="mdi mdi-currency-eth"></i></button>
                </b-tooltip>
            </b-table-column>
            <b-table-column label='Hacked' centered>
                {{ props.row.hacked }}
                <b-tooltip label="Update info" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="update(props.row)"><i class="mdi mdi-refresh"></i></button>
                </b-tooltip>
            </b-table-column>            
            <b-table-column label='Actions' centered>
                <b-tooltip label="Claim reward" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="claim(props.row)" :disabled="
                      !props.row.hacked ||
                      (props.row.type == 'bank' && (bank.claimed || bank.deadlineUnix < curBlockchainTime)) ||
                      (props.row.type == 'exchanger' && (exchanger.claimed || exchanger.deadlineUnix < curBlockchainTime))
                    "><i class="mdi mdi-target"></i></button>
                </b-tooltip>
                <b-tooltip label="Kill target and get the balance" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="destruct(props.row)"><i class="mdi mdi-bomb"></i></button>
                </b-tooltip>
                <b-tooltip label="Hack [test feature]" type="is-dark" position="is-bottom" v-if="debugButtons">
                    <button class="button" v-on:click="hack(props.row, true)" v-if="!props.row.hacked"><i class="mdi mdi-thumb-down"></i></button>
                </b-tooltip>
                <b-tooltip label="Unhack [test feature]" type="is-dark" position="is-bottom" v-if="debugButtons">
                    <button class="button" v-on:click="hack(props.row, false)" v-if="props.row.hacked"><i class="mdi mdi-thumb-up"></i></button>
                </b-tooltip>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </section>
    <!-- abi data modal -->
    <b-modal :active.sync="abiShown">
      <header class="modal-card-head">
          <p class="modal-card-title">{{ abiTitle }}</p>
      </header>
      <section class="modal-card-body">
          <b-field label="Data">
              <b-input type="textarea" :value="abiData"></b-input>
          </b-field>
      </section>
      <footer class="modal-card-foot">
          <button class="button" type="button" @click="abiShown = false">Close</button>
      </footer>
    </b-modal>
    <!-- bounty terms modal -->
    <b-modal :active.sync="termsShown">
      <header class="modal-card-head">
          <p class="modal-card-title">Bounty terms</p>
      </header>
      <section class="modal-card-body">
        <b-tabs type="is-boxed" v-model="tabsBounty">
            <b-tab-item label="Bank Bounty" icon="bank">
              <b-message title="Rate = 0" :closable="false" type="is-info">
                  You get reward if buyRate or sellRate is 0
              </b-message>
              <b-message title="Buy Rate is over Sell Rate" :closable="false" type="is-info">
                  You get reward if buyRate > sellRate
              </b-message>
              <b-message title="Huge number of tokens" :closable="false" type="is-info">
                  You get reward if you own 2<sup>255</sup> LIBRE or more (the half of maximum allowed by smart-contract types)
              </b-message>
              <b-message title="More tokens than issued" :closable="false" type="is-info">
                  You get reward if you own more LIBRE than the bank ever issued
              </b-message>
            </b-tab-item>
            <b-tab-item label="Exchanger Bounty" icon="cash-multiple">
              <b-message title="Rate = 0" :closable="false" type="is-info">
                  You get reward if buyRate or sellRate is 0
              </b-message>
              <b-message title="Buy Rate is over Sell Rate" :closable="false" type="is-info">
                  You get reward if buyRate > sellRate
              </b-message>

            </b-tab-item>
        </b-tabs>
      </section>
      <footer class="modal-card-foot">
          <button class="button" type="button" @click="termsShown = false">Close</button>
      </footer>
    </b-modal>
    <!-- new targets modal -->
    <b-modal :active.sync="newTargetsShown">
        <header class="modal-card-head">
            <p class="modal-card-title">New targets for {{ newTargetsType }}</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Buy fee, %">
                <b-input v-model="buyFee"></b-input>
            </b-field>
            <b-field label="Sell fee, %">
                <b-input v-model="sellFee"></b-input>
            </b-field>
            <b-field label="Deadline, minutes" v-if="newTargetsType == 'exchanger'">
                <b-input v-model="targetDeadline"></b-input>
            </b-field>
            <b-field label="Withdraw wallet" v-if="newTargetsType == 'exchanger'">
                <b-input v-model="targetWithdraw"></b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="newTargetsShown = false">Close</button>
            <button class="button is-primary" @click="createTargets" :class="{'is-loading' : newTargetLoading}"
              :disabled="!(
                isValidFee(buyFee) &&
                isValidFee(sellFee) &&
                (
                  newTargetsType == 'bank' ||
                  (
                    newTargetsType == 'exchanger' &&
                    isInteger(targetDeadline) &&
                    isAddress(targetWithdraw)
                  )
                )
              )">Create targets</button>
        </footer>
    </b-modal>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
import Config from '@/config'

export default {
  data () {
    return {
      debugButtons: false,
      abiShown: false,
      abiTitle: '',
      abiData: '',
      termsShown: false,
      tabsBounty: 0,
      newTargetsShown: false,
      newTargetsType: 'bank',
      sellFee: 0,
      buyFee: 0,
      newTargetLoading: false,
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: false,
      tableLoading: false,
      hasMobileCards: true,
      isResponsive: true,
      perPage: 10,
      curBlockchainTime: 0,
      bountyBankAddress: '',
      bountyExchangerAddress: '',
      searchData: [],
      defaultAddress: '',
      isActive: true,
      isUsed: false,
      isCompleted: false,
      isMine: false,
      targetCount: 0,
      curBlockchainTime: 0,
      bank: {
        claimed: false,
        payment: 0,
        bounty: '...',
        deadlineUnix: 0,
        deadline: ''
      },
      exchanger: {
        claimed: false,
        payment: 0,
        bounty: '...',
        deadlineUnix: 0,
        deadline: ''
      }
    }
  },
  methods: {
    isAddress (address) {
      return web3.isAddress(address)
    },
    isInteger (number) {
      return +number >= 0
    },
    isValidFee (number) {
      return this.isInteger(number) && +number <= 70;
    },
    targetsBankModal () {
      this.buyFee = 2.5;
      this.sellFee = 2.5;
      this.newTargetsType = 'bank';
      this.newTargetsShown = true;
    },
    targetsExchangerModal () {
      this.buyFee = 2.5;
      this.sellFee = 2.5;
      this.targetDeadline = 600;
      this.targetWithdraw = this.defaultAddress;
      this.newTargetsType = 'exchanger';
      this.newTargetsShown = true;
    },
    async createTargets () {
      let buyFee = this.buyFee * 100;
      let sellFee = this.sellFee * 100;
      let targetDeadline, targetWithdraw, txHash;
      if (this.newTargetsType == 'exchanger') {
        targetDeadline = this.targetDeadline * 60 + this.curBlockchainTime;
        targetWithdraw = this.targetWithdraw;
      }
      try {
          this.newTargetLoading = true;
          if (this.newTargetsType == 'exchanger') {
            txHash = await this.$libre.bounty.exchanger.createExchangerTargets(
              buyFee,
              sellFee,
              targetDeadline,
              targetWithdraw
            );
          } else {
            txHash = await this.$libre.bounty.bank.createBankTargets(
              buyFee,
              sellFee
            );
          }
          let
            result = await this.$eth.isSuccess(txHash) ? 'Success targets creation' : 'Failed targets creation';

          alert(result); // Replace it to notify
          this.newTargetLoading = false;
          this.newTargetsShown = false;
          this.loadTargets();
        } catch(err) {
          alert(this.$eth.getErrorMsg(err));
          this.newTargetLoading = false;
          this.newTargetsShown = false;
          this.loadTargets();
        }
    },
    getABI (row) {
        let ABI;
        if (row.name == "LibreCash") ABI = Config.bounty.bank.targets.token.abi;
        else if (row.name == "ComplexBank") ABI = Config.bounty.bank.targets.bank.abi;
        else if (row.name == "ComplexExchanger") ABI = Config.bounty.exchanger.targets.exchanger.abi;
        else ABI = "ABI not fount for this type of target";
        return ABI;
    },
    showABI (row) {
      this.abiTitle = 'Contract ABI';
      this.abiData = JSON.stringify(this.getABI(row));
      this.abiShown = true;
    },
    showMist (row) {
        let ABI = JSON.stringify(this.getABI(row));
        let address = row.address;
        let name = row.name;
        this.abiData = 
`CustomContracts.insert({
    address: "${address}",
    name: "_${name}",
    jsonInterface: ${ABI}
});`;
        this.abiTitle = 'Mist import script';
        this.abiShown = true;
    },
    async updateClaimed () {
      this.bank.claimed = await this.$libre.bounty.bank.claimed();
      this.bank.payment = +await this.$libre.bounty.bank.payments(this.defaultAddress) / 10**18;
      this.exchanger.claimed = await this.$libre.bounty.exchanger.claimed();
      this.exchanger.payment = +await this.$libre.bounty.exchanger.payments(this.defaultAddress) / 10**18;
    },
    async testEraseBankClaim () {
      try {
        this.tableLoading = true;
        let 
          txHash = await this.$libre.bounty.bank.eraseClaim();
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success unclaim transaction' : 'Failed unclaim transaction';

        alert(result); // Replace it to notify
        this.updateClaimed();
        this.tableLoading = false;
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.updateClaimed();
        this.tableLoading = false;
      }
    },
    async testEraseExchangerClaim () {
      try {
        this.tableLoading = true;
        let 
          txHash = await this.$libre.bounty.exchanger.eraseClaim();
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success unclaim transaction' : 'Failed unclaim transaction';

        alert(result); // Replace it to notify
        this.updateClaimed();
        this.tableLoading = false;
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.updateClaimed();
        this.tableLoading = false;
      }
    },
    // test feature too
    async hack (row, _hack) {
      try {
        this.tableLoading = true;
        let 
          txHash = await row.contract.tempHack(_hack);
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success hack transaction' : 'Failed hack transaction';

        alert(result); // Replace it to notify
        this.loadTargets();
        this.tableLoading = false;
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.loadTargets();
        this.tableLoading = false;
      }
    },

    async withdraw (type) {
      try {
        this.tableLoading = true;
        let txHash = (type == 'bank') ? await this.$libre.bounty.bank.withdrawPayments() :
                                        await this.$libre.bounty.exchanger.withdrawPayments();
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success withdraw transaction' : 'Failed withdraw transaction';

        alert(result); // Replace it to notify
        this.updateClaimed();
        this.getBounties();
        this.tableLoading = false;
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.updateClaimed();
        this.getBounties();
        this.tableLoading = false;
      }
    },
    async claim (row) {
      try {
        this.tableLoading = true;
        let 
          txHash = await row.bountyContract.claim(row.address);
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success claim transaction' : 'Failed claim transaction';

        alert(result); // Replace it to notify
        this.updateClaimed();
        this.tableLoading = false;
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.updateClaimed();
        this.tableLoading = false;
      }
    },
    async destruct (row) {
      try {
        this.tableLoading = true;
        let 
          txHash = await row.bountyContract.suicideTarget(row.id);
        let
          result = await this.$eth.isSuccess(txHash) ? 'Success destruct transaction' : 'Failed destruct transaction';

        alert(result); // Replace it to notify
        this.tableLoading = false;
        this.loadTargets();
      } catch(err) {
        alert(this.$eth.getErrorMsg(err));
        this.tableLoading = false;
        this.loadTargets();
      }
    },
    update (row) {
      row.contract.checkInvariant(this.defaultAddress).then((notHacked) => {
        row.hacked = !notHacked;
      });
      this.updateClaimed();
    },
    async getBounties () {
      this.bank.bounty = await this.$eth.getBalance(Config.bounty.bank.address) / 10**18;
      this.exchanger.bounty = await this.$eth.getBalance(Config.bounty.exchanger.address) / 10**18;
    },
    async getDeadlines () {
      this.bank.deadlineUnix = +await this.$libre.bounty.bank.deadline();
      this.exchanger.deadlineUnix = +await this.$libre.bounty.exchanger.deadline();
      this.bank.deadline = new Date(this.bank.deadlineUnix * 1000).toLocaleString();
      this.exchanger.deadline = new Date(this.exchanger.deadlineUnix * 1000).toLocaleString();
    },
    async loadTargets (e) {
      this.searchData = [];

      this.tableLoading = true
      try {
        let bankTargets = await this.$libre.bounty.bank.getMyTargets();
        let exchangerTargets = await this.$libre.bounty.exchanger.getMyTargets();

        let allTargets = bankTargets.map((target, id) => ({address: target, id: id, type: 'bank'}))
                .concat(exchangerTargets.map((target, id) => ({address: target, id: id, type: 'exchanger'})));
        for (var i = 0; i < allTargets.length; i++) {
          // do not use forEach - we do not want async iterations
          let target = allTargets[i];

          this.searchData.push({
              id: target.id,
              address: target.address,
              type: target.type,
              name: '...',
              contract: this.$libre.getContract(
                target.type == 'bank' ? Config.bounty.bank.targets.bank.abi : Config.bounty.exchanger.targets.exchanger.abi,
                target.address
              ),
              hacked: false,
              bountyContract: target.type == 'bank' ? this.$libre.bounty.bank : this.$libre.bounty.exchanger
          });
          let searchDataLength = this.searchData.length;
          
          this.searchData[searchDataLength - 1].contract.targetName().then((_name) => {
              this.searchData[searchDataLength - 1].name = _name;
              // "ComplexBank" -> deafult, see upper
              if (_name == "LibreCash") {
                this.searchData[searchDataLength - 1].contract = this.$libre.getContract(Config.bounty.bank.targets.token.abi, target.address);
              }
              if (_name == "ComplexExchanger") {
                this.searchData[searchDataLength - 1].contract = this.$libre.getContract(Config.bounty.exchanger.targets.exchanger.abi, target.address);
              }            
          });
          this.searchData[searchDataLength - 1].contract.checkInvariant(this.defaultAddress).then((notHacked) => {
              this.searchData[searchDataLength - 1].hacked = !notHacked;
          });
        }
      } catch (err) {
        console.log(err)
      }

      this.tableLoading = false
    },
    async updateBlockTime() {
      this.curBlockchainTime = +(await this.$eth.getLatestBlockTime())
    },

    startUpdatingTime() {
      this.curBlockchainTime = 0
      this.updatingTicker = setInterval(() => {
        this.curBlockchainTime++
      }, 1000)
      this.updatingBlockData = setInterval(() => {
        this.updateBlockTime()
      }, 10 * 60 * 1000 /* 10 minutes */)
      this.updateBlockTime()
    },
    clearTimers() {
      let intervals = [
        this.updatingTicker,
        this.updatingBlockData,
      ]

      intervals.forEach((interval) => clearInterval(interval))
    }
  },
  async created () {
    try {
      await this.$eth.accountPromise;
      await this.$libre.initPromise;
      this.defaultAddress = window.web3.eth.defaultAccount;
      this.bountyBankAddress = Config.bounty.bank.address;
      this.bountyExchangerAddress = Config.bounty.exchanger.address;
      this.startUpdatingTime();
      this.getBounties(); // no await, start async
      this.getDeadlines();
      this.loadTargets();
      this.updateClaimed();
    } catch (err) {
      console.log(err)
    }
  },
  destroyed () {
    this.clearTimers();
  },
  components: {
    AddressBlock
  }
}
</script>