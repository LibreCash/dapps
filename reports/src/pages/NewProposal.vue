<template>
    <div>
    <section class="allMain">
      <div class="h2-contain">
        <h2 class="subtitle">DAO New Proposal</h2>
      </div>
      <br>
      <table>
        <tr>
          <th>Type Proposal:</th>
          <td>
            <select v-model="selectTypeProposal" @click="setType">
              <option v-for="type in typeProposals" v-bind:value="type.value">
                {{ type.text }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th>Beneficiary:</th>
          <td><input v-model="beneficiary"></td>
        </tr>
        <tr>
          <th>Buffer:</th>
          <td><input v-model="buffer"></td>
        </tr>
        <tr>
          <th>Send wei:</th>
          <td><input v-model="weiAmount"></td>
        </tr>
        <tr>
          <th>Description:</th>
          <td><textarea v-model="description"></textarea></td>
        </tr>
        <tr>
          <th>Debating Period (in minutes):</th>
          <td><input v-model="debatingPeriodInMinutes"></td>
        </tr>
        <tr>
          <th>Bytecode:</th>
          <td><textarea v-model="transactionBytecode"></textarea></td>
        </tr>
        <tr colspan="2"><button v-on:click="createProposal()">Create Proposal</button></tr>
      </table>
    </section>
    </div>
</template>

<script>

export default {
  data () {
    return {
      daoAddress: this.$eth.daoAddress,
      selectTypeProposal: '',
      beneficiary: '',
      weiAmount: '',
      description: '',
      debatingPeriodInMinutes: '',
      transactionBytecode: '',
      buffer: '',
      typeProposals: [
        {text: 'Clean', value: 0}, // CLEAN
        {text: 'Universal', value: 1}, // UNIVERSAL
        {text: 'Transfer ownership', value: 2}, // TRANSFER_OWNERSHIP
        {text: 'Set buy limits', value: 3}, // SET_BUY_LIMITS
        {text: 'Set sell limits', value: 4}, // SET_SELL_LIMITS
        {text: 'Cancel buy order', value: 5}, // CANCEL_BUY_ORDER
        {text: 'cancel sell order', value: 6}, // CANCEL_SELL_ORDER
        {text: 'Attach token', value: 7}, // ATTACH_TOKEN
        {text: 'Set bank address', value: 8}, // SET_BANK_ADDRESS
        {text: 'Set relevance period', value: 9}, // RELEVANCE_PERIOD
        {text: 'Set queue period', value: 10}, // QUEUE_PERIOD
        {text: 'Set fees', value: 11}, // SET_FEES
        {text: 'Add oracle', value: 12}, // ADD_ORACLE
        {text: 'Disable oracle', value: 13}, // DISABLE_ORACLE
        {text: 'Enable oracle', value: 14}, // ENABLE_ORACLE
        {text: 'Delete oracle', value: 15}, // DELETE_ORACLE
        {text: 'Set scheduler', value: 16}, // SET_SCHEDULER
        {text: 'Winthdraw balance', value: 17} // WITHDRAW_BALANCE
      ]
    }
  },
  methods: {
    setType() {
      console.log(this.selectTypeProposal)
    },
    createProposal() {
      console.log("Create proposal")
      //await this.$eth.daoContract.newProposal(selectTypeProposal,beneficiary,weiAmount,description,
      //                                    debatingPeriodInMinutes,transactionBytecode)
    }
  },
  created () {
    try {
      console.log("Hello");
    } catch (err) {
      console.log(err)
    }
  },
  components: {
    
  }
}
</script>