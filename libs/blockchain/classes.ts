import Web3 from 'web3'
import {
  TCurrency,
  ICommon, IExternal, INetwork
} from '~/libs/blockchain/types'
import CoreJson from '~/contracts/Core.sol/Core.json'

class Config {
  private static _instance: any
  CONTRACT_ADDRESS: string
  CHAIN_ID: string
  CHAIN_NAME: string
  RPC_URL: string;
  CURRENCY: TCurrency
  constructor() {
    if (!Config._instance) {
      Config._instance = useRuntimeConfig()
    }
    return Config._instance
  }
}

class CoreContract {
  private static _instance: any
  methods: any
  constructor(web3, contractAddress) {
    if (!CoreContract._instance) {
      web3.eth.handleRevert = true
      CoreContract._instance = new web3.eth.Contract(
        CoreJson.abi,
        contractAddress,
      )
    }
    return CoreContract._instance
  }
}

class Common implements ICommon {
  Nuxt
  Ethereum
  Web3
  Config
  Core
  Wallet
  constructor (nuxt, globalThis) {
    this.Nuxt = nuxt
    this.Ethereum = globalThis['ethereum']
    this.Web3 = new Web3(this.Ethereum)
    this.Config = new Config()['public']
    this.Core = new CoreContract(this.Web3, this.Config.CONTRACT_ADDRESS)
  }
  async init() {
    const accounts = await this.Web3.eth.getAccounts()
    this.Wallet = accounts[0]
  }
  EmitDisabled (cause: string, status: boolean) {
    this.Nuxt.$emit('disabled', {
      cause,
      status,
    })
  }
  async ThrowAlert (type: string, error: any) {
    let message: any = error
    // only for error messages
    if (
      type === 'danger'
      && typeof error === 'string'
      && error.includes('reverted with reason string')
    ) {
      // @ts-ignore
      message = error.match(/transaction:\s(.+?)"/)[1]
    } else if (error.includes('while formatting outputs from RPC')) {
      // "message":"Nonce too high. Expected nonce to be 0 but got 4. Note that transactions can't be queued when automining."
      message = error.match(/"message":"([^"]+)"/)[1]
    }
    this.Nuxt.$emit('alert', {
      type,
      message,
    })
  }
}

class Network extends Common implements INetwork {
  constructor (nuxt, globalThis) {super(nuxt, globalThis)}
  private checkInstalledMetamask (): boolean {
    return Boolean(this.Ethereum && this.Ethereum.isMetaMask);
  }
  async setNetwork (): Promise<void> {
    if (!this.checkInstalledMetamask() || !this.Ethereum) {
      await this.ThrowAlert('danger', 'Metamask is not installed!')
    } else {
      try {
        // check if the chain that for connect to is installed
        await this.Ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: this.Config.CHAIN_ID }],
        })
      } catch (e) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (e.code === 4902) {
          await this.addNetwork()
        } else {
          await this.ThrowAlert('danger', e.message)
        }
      }
    }
  }
  private async addNetwork (): Promise<void> {
    try {
      await this.Ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: this.Config.CHAIN_ID,
            chainName: this.Config.CHAIN_NAME,
            rpcUrls: [this.Config.RPC_URL],
            nativeCurrency: this.Config.CURRENCY,
          },
        ],
      })
    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    }
  }
}

export class External extends Network implements IExternal {
  constructor (nuxt, globalThis) {super(nuxt, globalThis)}
  async connect (): Promise<void> {
    this.EmitDisabled('connect', true)
    await this.setNetwork()
    try {
      const accounts = await this.Ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        this.Wallet = accounts[0]
      }
    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    } finally {
      this.EmitDisabled('connect', false)
    }
  }

  async getCoreUser (wallet: string): Promise<void> {
    if (!this.Wallet) {
      await this.ThrowAlert('danger', 'Please connect Metamask')
    } else {
      try {
        this.EmitDisabled(`getCoreUser`, true)
        const resp = await this.Core
          .methods.getUserFromCore(wallet)
          .call({
            from: this.Wallet,
          })
        // display resp in web interface
        let msg
        if (!resp.isValue) {
          msg = `user ${wallet} is not registered`
        } else {
          msg = `
getCoreUser() method response:
claims: ${this.Web3.utils.fromWei(resp.claims, "ether")} BNB
gifts: ${this.Web3.utils.fromWei(resp.gifts, "ether")} BNB
level: ${resp.level}
whose: ${resp.whose}
`
        }
        await this.ThrowAlert('primary', msg)
      } catch (e) {
        await this.ThrowAlert('danger', e.message)
      } finally {
        this.EmitDisabled(`getCoreUser`, false)
      }
    }
  }
  async getMatrixUser (level: number | string, wallet: string): Promise<void> {
    try {
      this.EmitDisabled(`getMatrixUser`, true)
      const resp = await this.Core
        .methods.getUserFromMatrix(level, wallet)
        .call({
          from: this.Wallet,
          to: new Config().CONTRACT_ADDRESS,
        })

      // todo: display resp in web interface
      let msg
      if (!resp.isValue) {
        msg = `user ${wallet} is not registered`
      } else {
        msg = `
getMatrixUser() method response:
number: ${resp.index}
parent: ${resp.parent}
isRight: ${resp.isRight}
plateau: ${resp.plateau}
`
      }
      await this.ThrowAlert('primary', msg)
    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    } finally {
      this.EmitDisabled(`getMatrixUser`, false)
    }
  }

  async registerWhose (whose: string): Promise<void> {
    try {
      this.EmitDisabled(`registerWhose`, true)
      // const value = await this.Core.methods
      //   .payUnit()
      //   .call({
      //     from: this.Wallet,
      //   });
      const resp = await this.Core
      .methods.register(whose).send({
        from: this.Wallet,
        value: 10000000000000000,
        // gasLimit: 5000000, // not required
        gas: 300000, // 274633
      })

      // display resp in web interface
      const msg = `
registerWhose() method params:
FROM: ${resp.from}
TO: ${resp.to}
GAS: ${resp.gasUsed}
TX: ${resp.transactionHash}
`
      await this.ThrowAlert('success', msg)
    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    } finally {
      this.EmitDisabled(`registerWhose`, false)
    }
  }
  async withdrawClaim (amount: number | string): Promise<void> {
    this.EmitDisabled(`withdrawClaim`, true)
    try {
      const resp = await this.Core.methods
        .withdrawClaim(this.Web3.utils.toWei(amount, "ether"))
        .send({
          from: this.Wallet,
          gasLimit: 310000, // not required
        });
      // from - address for withdrawing
      // gasUsed - used gas
      const msg = `
withdrawClaim() method params:
FROM: ${resp.from}
AMOUNT: ${amount}
GAS: ${resp.gasUsed}
TX: ${resp.transactionHash}
`
      await this.ThrowAlert('success', msg)
    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    } finally {
      this.EmitDisabled(`withdrawClaim`, false)
    }
  }
  async sendAmount (amount: string | number): Promise<void> {
    this.EmitDisabled(`sendAmount`, true)
    try {
      const resp = await this.Web3.eth.sendTransaction({
        from: this.Wallet,
        to: this.Config.CONTRACT_ADDRESS,
        value: this.Web3.utils.toWei(amount, "ether")
      });
      const msg = `
sendAmount() method params:
FROM: ${resp.from}
TO: ${resp.to}
GAS: ${resp.gasUsed}
TX: ${resp.transactionHash}
`
      await this.ThrowAlert('success', msg)
    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    } finally {
      this.EmitDisabled(`sendAmount`, false)
    }
  }
  async withdrawTen (): Promise<void> {
    this.EmitDisabled(`withdrawTen`, true)
    try {
      await this.Core.methods
        .getTenPercentOnceYear()
        .send({
          from: this.Wallet,
          gasLimit: 310000, // not required
        })
      await this.ThrowAlert('success', "check your balance")

    } catch (e) {
      await this.ThrowAlert('danger', e.message)
    } finally {
      this.EmitDisabled(`withdrawTen`, false)
    }
  }
}
