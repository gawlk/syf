import { createBaseAPI } from '../base'

export const createGithubAPI = () => {
  return {
    ...createBaseAPI({
      baseUrl: 'https://raw.githubusercontent.com/syf-org/assets/main',
    }),
    fetchCryptoRGBs: function () {
      return this.fetchJSON<RGBs>('/crypto.json')
    },
    fetchDefaultEquities: async function () {
      return (await this.fetchJSON<FetchedAsset[]>('/equities.json')).map(
        (asset): FetchedAsset => {
          return {
            ...asset,
            kind: 'equity',
          }
        }
      )
    },
    fetchDefaultETFs: async function () {
      return (await this.fetchJSON<FetchedAsset[]>('/etfs.json')).map(
        (asset): FetchedAsset => {
          return {
            ...asset,
            kind: 'etf',
          }
        }
      )
    },
  }
}
