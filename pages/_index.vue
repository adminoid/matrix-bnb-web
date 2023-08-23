<template lang="pug">
.container
  .row
    .col
    .col-md-10.col-lg-10.col-xl-8
      .center-block(v-if="!eth && isMobile")
        .center-block__content
          h1 Click to qr code to open site in MetaMask
          a(:href="appLink")
            img(:src="'/' + $Blockchain.Config.QR_IMG")
      metamask(v-else)
    .col
</template>

<script setup>
// metamask link generates there https://metamask.github.io/metamask-deeplinks/
import { onMounted, computed } from 'vue'
import Web3 from 'web3'
import { useNuxtApp } from '#app'

const { $Blockchain } = useNuxtApp()
const { isMobile } = useDevice()
let isShowMobileStuff = ref(false)
let eth = ref(true)
nextTick(() => {
  eth.value = !!$Blockchain.Ethereum
  isShowMobileStuff = ref(!eth && isMobile)
})

const appLink = computed(() => {
  // get whose wallet
  const whoseWallet = localStorage.getItem('whose_param')
  return (whoseWallet)
    ? $Blockchain.Config.APP_LINK + whoseWallet
    : $Blockchain.Config.APP_LINK
})

const route = useRoute();

/**
 * debugging for events history
 * @returns {Promise<void>}
 */
const testEvents = async () => {
  // todo: test work with event logs
  //  event Transfer(address indexed from, address indexed to, uint256 value);

  const { Web3 } = await import('web3')

  const web3 = new Web3(new Web3.providers.HttpProvider("https://eth.llamarpc.com/"))

  const abi = (await import('../testing/abi/pepe.json')).default
  // const abi = await import('../testing/abi/pepe.json').default
  // const abi = JSON.parse(await import('../testing/abi/pepe.json').default)
  // const abi = JSON.parse(await import('../testing/abi/pepe.json'))
  // console.log(typeof abi.default, abi.default)
  // console.log(web3)

  const contractAddress = '0x6982508145454ce325ddbe47a25d4ec3d2311933'

  const contract = new web3.eth.Contract(abi, contractAddress);
  const foundEvents = await contract.getPastEvents('Transfer', {
    filter: {
      // from: '0x5D5862a6f280d511FEaaE8245C60648858Af60f4',
      to: '0x5D5862a6f280d511FEaaE8245C60648858Af60f4',
      // from: '0x31d27b76c043B0c5A300D81321fCD551196BD8D3',
      // to: '0x31d27b76c043B0c5A300D81321fCD551196BD8D3',
    },
    fromBlock: 0,
    toBlock: 'latest',
  })

  foundEvents.map(async (tx) => {
    const txHash = tx.transactionHash
    const blockN = await web3.eth.getTransaction(txHash)
    const blockData = await web3.eth.getBlock(blockN.blockNumber)
    console.info('date of tx')

    // todo: need to figure out of get real date of block

    const readableDate = new Date(Number(blockData.timestamp) * 100)
    console.log(readableDate)

  })

}


onMounted(async () => {
  // save to localStorage route.params.w
  const W = route.params.w
  if (Web3.utils.isAddress(W)) {
    localStorage.setItem('whose_param', W)
  }
  if (route.name !== 'read') {
    await navigateTo({ path: '/' })
  }

  await testEvents()
})
</script>

<style lang="sass">
.btn-group
  width: 600px
.center-block
  display: flex
  justify-content: center
  align-items: center
  &__content
    text-align: center
    h1
      max-width: 370px
</style>
