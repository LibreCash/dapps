<template>
  <div>
      <div class="table-padding">
        <div class="columns">
          <div class="column">
            <div class="card bm--card-equal-height">
              <div class="card-content">
                <address-block />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card bm--card-equal-height">
              <div class="card-content">
                {{ $t('lang.common.current-time') }}: {{ $d(curBlockchainTime * 1000, 'long+') }}
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6">
            <div class="card bm--card-equal-height">
              <header class="card-header">
                <p class="card-header-title">
                  {{ $t('lang.bounty.bank-program') }}
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <p class="flex">{{ $t('lang.contracts.bounty') }}: <a :href="this.$libre.addressToLink(bountyBankAddress)" class="is-text-overflow">{{ bountyBankAddress }}</a></p>
                  <b-field grouped group-multiline>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.bounty-word') }}</b-tag>
                          <b-tag type="is-info">{{ bank.bounty }} ETH</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.deadline-low') }}</b-tag>
                          <b-tag type="is-info">{{ bank.deadlineUnix == 0 ? '...' : $d(bank.deadlineUnix * 1000, 'short') }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.claimed') }}</b-tag>
                          <b-tag type="is-info">{{ bank.claimed ? $t('lang.common.yes') : $t('lang.common.no') }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.payment') }}</b-tag>
                          <b-tag type="is-info">{{ bank.payment == 0 ? $t('lang.common.nothing') : bank.payment + 'ETH' }}</b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                </div>
              </div>
              <footer class="card-footer">
                <a v-if="bank.claimed && debugButtons" class="card-footer-item" v-on:click="testEraseBankClaim()">Unclaim</a>
                <a v-if="bank.payment > 0" class="card-footer-item" v-on:click="withdraw('bank')">{{ $t('lang.common.withdraw') }}</a>
                <a class="card-footer-item" v-on:click="targetsBankModal()">{{ $t('lang.bounty.new-targets') }}</a>
                <a class="card-footer-item" v-on:click="tabsBounty = 0; termsShown = true">{{ $t('lang.bounty.terms') }}</a>
              </footer>
            </div>
          </div>
          <div class="column is-6">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  {{ $t('lang.bounty.exchanger-program') }}
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  <p class="flex">{{ $t('lang.contracts.bounty') }}: <a :href="this.$libre.addressToLink(bountyExchangerAddress)" class="is-text-overflow">{{bountyExchangerAddress }}</a></p>
                  <b-field grouped group-multiline>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.bounty-word') }}</b-tag>
                          <b-tag type="is-info">{{ exchanger.bounty }} ETH</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.deadline-low') }}</b-tag>
                          <b-tag type="is-info">{{ exchanger.deadlineUnix == 0 ? '...' : $d(exchanger.deadlineUnix * 1000, 'short') }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.claimed') }}</b-tag>
                          <b-tag type="is-info">{{ exchanger.claimed ? $t('lang.common.yes') : $t('lang.common.no') }}</b-tag>
                      </b-taglist>
                    </div>
                    <div class="control">
                      <b-taglist attached>
                          <b-tag>{{ $t('lang.common.payment') }}</b-tag>
                          <b-tag type="is-info">{{ exchanger.payment == 0 ? $t('lang.common.nothing') : exchanger.payment + 'ETH' }}</b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                </div>
              </div>
              <footer class="card-footer">
                <a v-if="exchanger.claimed && debugButtons" class="card-footer-item" v-on:click="testEraseExchangerClaim()">Unclaim</a>
                <a v-if="exchanger.payment > 0" class="card-footer-item" v-on:click="withdraw('exchanger')">{{ $t('lang.common.withdraw') }}</a>
                <a class="card-footer-item" v-on:click="targetsExchangerModal()">{{ $t('lang.bounty.new-targets') }}</a>
                <a class="card-footer-item" v-on:click="tabsBounty = 1; termsShown = true">{{ $t('lang.bounty.terms') }}</a>
              </footer>
            </div>
          </div>
        </div>

        <b-table
          v-if="searchData.length > 0"
          :data="searchData"
          :bordered="false"
          :striped="true"
          :narrowed="false"
          :loading="tableLoading"
          :mobile-cards="true"
          :responsive="true"
          :paginated="true"
          :per-page="10"
          :pagination-simple="false">
          <template slot-scope="props" v-if="!props.row.tempHide">
            <b-table-column label='Address' centered v-if="props.row.address == '-'">
              {{ $t('lang.common.not-set') }}
            </b-table-column>
            <b-table-column :label="$t('lang.bounty.address-row')" centered v-else>
              <a :href="'https://rinkeby.etherscan.io/address/'+props.row.address">{{ $t('lang.common.address') }}</a>
            </b-table-column>

            <b-table-column :label="$t('lang.bounty.name-row')" centered>
              {{ props.row.name }}
              <b-tag>{{ props.row.type }}</b-tag>
              <b-tag v-if="(props.row.type == 'bank' && bank.claimed) ||
                      (props.row.type == 'exchanger' && exchanger.claimed)">{{ $t('lang.common.claimed') }}</b-tag>
              <b-tag v-if="(props.row.type == 'bank' && bank.deadlineUnix < curBlockchainTime) ||
                      (props.row.type == 'exchanger' && exchanger.deadlineUnix < curBlockchainTime)">{{ $t('lang.common.deadlined') }}</b-tag>
            </b-table-column>
            <b-table-column :label="$t('lang.bounty.abi-row')" centered>
                <b-tooltip :label="$t('lang.bounty.get-abi-row')" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="showABI(props.row)"><i class="fas fa-code"></i></button>
                </b-tooltip>
                <b-tooltip :label="$t('lang.bounty.mist-row')" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="showMist(props.row)"><i class="fas fa-terminal"></i></button>
                </b-tooltip>
            </b-table-column>
            <b-table-column :label="$t('lang.bounty.hacked-row')" centered>
                {{ props.row.hacked }}
                <b-tooltip :label="$t('lang.bounty.update-info-row')" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="update(props.row)"><i class="fas fa-sync"></i></button>
                </b-tooltip>
            </b-table-column>
            <b-table-column :label="$t('lang.bounty.actions-row')" centered>
                <b-tooltip :label="$t('lang.bounty.claim-row')" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="claim(props.row)" :disabled="
                      !props.row.hacked ||
                      (props.row.type == 'bank' && (bank.claimed || bank.deadlineUnix < curBlockchainTime)) ||
                      (props.row.type == 'exchanger' && (exchanger.claimed || exchanger.deadlineUnix < curBlockchainTime))
                    "><i class="fas fa-bullseye"></i></button>
                </b-tooltip>
                <b-tooltip :label="$t('lang.bounty.kill-row')" type="is-dark" position="is-bottom">
                    <button class="button" v-on:click="destruct(props.row)"><i class="fas fa-bomb"></i></button>
                </b-tooltip>
                <b-tooltip label="Hack [test feature]" type="is-dark" position="is-bottom" v-if="debugButtons">
                    <button class="button" v-on:click="hack(props.row, true)" v-if="!props.row.hacked"><i class="fas fa-thumbs-down"></i></button>
                </b-tooltip>
                <b-tooltip label="Unhack [test feature]" type="is-dark" position="is-bottom" v-if="debugButtons">
                    <button class="button" v-on:click="hack(props.row, false)" v-if="props.row.hacked"><i class="fas fa-thumbs-up"></i></button>
                </b-tooltip>
            </b-table-column>
          </template>
        </b-table>
      </div>
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
        <button class="button" type="button" @click="abiShown = false">{{ $t('lang.common.close') }}</button>
      </footer>
    </b-modal>
    <!-- bounty terms modal -->
    <b-modal :active.sync="termsShown">
      <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('lang.bounty.terms') }}</p>
      </header>
      <section class="modal-card-body">
        <b-tabs type="is-boxed" v-model="tabsBounty">
            <b-tab-item :label="$t('lang.bounty.bank-program')" icon="university" icon-pack="fas">
              <b-message :title="$t('lang.bounty.term.rate0-title')" :closable="false" type="is-info">
                  {{ $t('lang.bounty.term.rate0') }}
              </b-message>
              <b-message :title="$t('lang.bounty.term.buy-bigger-title')" :closable="false" type="is-info">
                  {{ $t('lang.bounty.term.buy-bigger') }}
              </b-message>
              <b-message :title="$t('lang.bounty.term.much-libre-title')" :closable="false" type="is-info">
                  <span v-html="$t('lang.bounty.term.much-libre')"></span>
              </b-message>
              <b-message :title="$t('lang.bounty.term.overflow-libre-title')" :closable="false" type="is-info">
                  {{ $t('lang.bounty.term.overflow-libre') }}
              </b-message>
            </b-tab-item>
            <b-tab-item :label="$t('lang.bounty.exchanger-program')" icon="exchange-alt" icon-pack="fas">
              <b-message :title="$t('lang.bounty.term.rate0-title')" :closable="false" type="is-info">
                  {{ $t('lang.bounty.term.rate0') }}
              </b-message>
              <b-message :title="$t('lang.bounty.term.buy-bigger-title')" :closable="false" type="is-info">
                  {{ $t('lang.bounty.term.buy-bigger') }}
              </b-message>

            </b-tab-item>
        </b-tabs>
      </section>
      <footer class="modal-card-foot flex">
        <button class="button" type="button" @click="termsShown = false">{{ $t('lang.common.close') }}</button>
      </footer>
    </b-modal>
    <!-- new targets modal -->
    <b-modal :active.sync="newTargetsShown">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ $t('lang.bounty.new-targets-for') }} {{ newTargetsType }}</p>
        </header>
        <section class="modal-card-body">
            <b-field :label="$t('lang.bounty.labels.buy-fee')">
                <b-input v-model="buyFee"></b-input>
            </b-field>
            <b-field :label="$t('lang.bounty.labels.sell-fee')">
                <b-input v-model="sellFee"></b-input>
            </b-field>
            <b-field :label="$t('lang.bounty.labels.deadline')" v-if="newTargetsType == 'exchanger'">
                <b-input v-model="targetDeadline"></b-input>
            </b-field>
            <b-field :label="$t('lang.bounty.labels.wallet')" v-if="newTargetsType == 'exchanger'">
                <b-input v-model="targetWithdraw"></b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot flex">
            <button class="button" type="button" @click="newTargetsShown = false">{{ $t('lang.common.close') }}</button>
            <button class="button is-primary" @click="createTargets" :class="{'is-loading' : newTargetLoading}"
              :disabled="!canCreateTarger">{{ $t('lang.bounty.create-targets') }}</button>
        </footer>
    </b-modal>
  </div>
</template>

<script>
import AddressBlock from '@/components/AddressBlock'
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
      tableLoading: false,
      curBlockchainTime: 0,
      bountyBankAddress: '',
      bountyExchangerAddress: '',
      searchData: [],
      defaultAddress: '',
      targetCount: 0,
      curBlockchainTime: 0,
      bank: {
        claimed: false,
        payment: 0,
        bounty: '...',
        deadlineUnix: 0
      },
      exchanger: {
        claimed: false,
        payment: 0,
        bounty: '...',
        deadlineUnix: 0
      }
    }
  },
  computed: {
    canCreateTarger() {
        return (this.isValidFee(this.buyFee) && this.isValidFee(this.sellFee) &&
                ((this.newTargetsType == 'bank' && this.bank.deadlineUnix > this.curBlockchainTime) ||
                  (this.newTargetsType == 'exchanger' && this.isInteger(this.targetDeadline) &&
                    this.isAddress(this.targetWithdraw) && this.exchanger.deadlineUnix > this.curBlockchainTime)))
    }
  },
  methods: {
    // TODO: use it from $eth
    isAddress (address) {
      return web3.isAddress(address)
    },
    
    // TODO: use it from $eth
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
            result = await this.$eth.isSuccess(txHash) ? this.$t('lang.tx.targets-creation.success') :
                            this.$t('lang.tx.targets-creation.fail');

          this.$libre.notify(result);
          this.newTargetLoading = false;
          this.newTargetsShown = false;
          this.loadTargets();
        } catch(err) {
          this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
          this.newTargetLoading = false;
          this.newTargetsShown = false;
          this.loadTargets();
        }
    },
    getABI (row) {
        let ABI;
        if (row.name == "LibreCash") ABI = this.config.bounty.bank.targets.token.abi;
        else if (row.name == "ComplexBank") ABI = this.config.bounty.bank.targets.bank.abi;
        else if (row.name == "ComplexExchanger") ABI = this.config.bounty.exchanger.targets.exchanger.abi;
        else ABI = this.$t('lang.bounty.no-abi');
        return ABI;
    },
    showABI (row) {
      this.abiTitle = this.$t('lang.bounty.abi-title');
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
        this.abiTitle = this.$t('lang.bounty.mist-title');
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

        this.$libre.notify(result);
        this.updateClaimed();
        this.tableLoading = false;
      } catch(err) {
        this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
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

        this.$libre.notify(result);
        this.updateClaimed();
        this.tableLoading = false;
      } catch(err) {
        this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
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

        this.$libre.notify(result);
        this.loadTargets();
        this.tableLoading = false;
      } catch(err) {
        this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
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
          result = await this.$eth.isSuccess(txHash) ? this.$t('lang.tx.withdraw.success') :
                            this.$t('lang.tx.withdraw.fail');

        this.$libre.notify(result);
        this.updateClaimed();
        this.getBounties();
        this.tableLoading = false;
      } catch(err) {
        this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
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
          result = await this.$eth.isSuccess(txHash) ? this.$t('lang.tx.claim.success') :
                            this.$t('lang.tx.claim.fail');

        this.$libre.notify(result);
        this.updateClaimed();
        this.tableLoading = false;
      } catch(err) {
        this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
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
          result = await this.$eth.isSuccess(txHash) ? this.$t('lang.tx.destruct.success') :
                            this.$t('lang.tx.destruct.fail');

        this.$libre.notify(result);
        this.tableLoading = false;
        this.loadTargets();
      } catch(err) {
        this.$libre.notify(this.$eth.getErrorMsg(err),'is-danger');
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
      this.bank.bounty = this.$libre.toToken(await this.$eth.getBalance(this.config.bounty.bank.address));
      this.exchanger.bounty = this.$libre.toToken(await this.$eth.getBalance(this.config.bounty.exchanger.address));
    },
    async getDeadlines () {
      this.bank.deadlineUnix = +await this.$libre.bounty.bank.deadline();
      this.exchanger.deadlineUnix = +await this.$libre.bounty.exchanger.deadline();
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
                target.type == 'bank' ? this.config.bounty.bank.targets.bank.abi : this.config.bounty.exchanger.targets.exchanger.abi,
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
                this.searchData[searchDataLength - 1].contract = this.$libre.getContract(this.config.bounty.bank.targets.token.abi, target.address);
              }
              if (_name == "ComplexExchanger") {
                this.searchData[searchDataLength - 1].contract = this.$libre.getContract(this.config.bounty.exchanger.targets.exchanger.abi, target.address);
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
      this.bountyBankAddress = this.config.bounty.bank.address;
      this.bountyExchangerAddress = this.config.bounty.exchanger.address;
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