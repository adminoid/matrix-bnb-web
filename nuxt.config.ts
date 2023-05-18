// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

console.info(process.env.CHAIN_ID)

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      CHAIN_ID:
        (process.env.CHAIN_ID)
          ? process.env.CHAIN_ID
          : '0x7A69',
      RPC_URL:
        (process.env.RPC_URL)
          ? process.env.RPC_URL
          : 'http://127.0.0.1:8545',
      CHAIN_NAME:
        (process.env.CHAIN_NAME)
          ? process.env.CHAIN_NAME
          : 'HardHat Network',
      CONTRACT_ADDRESS:
        (process.env.CONTRACT_ADDRESS)
          ? process.env.CONTRACT_ADDRESS
          : '0x5fbdb2315678afecb367f032d93f642f64180aa3',
      CURRENCY_NAME:
        (process.env.CURRENCY_NAME)
          ? process.env.CURRENCY_NAME
          : 'Hardhat coin',
      CURRENCY_SYMBOL:
        (process.env.CURRENCY_SYMBOL)
          ? process.env.CURRENCY_SYMBOL
          : 'HNB',
      CURRENCY_DECIMALS:
        (process.env.CHAIN_ID)
          ? process.env.CHAIN_ID
          : 18,
    }
  }
})
