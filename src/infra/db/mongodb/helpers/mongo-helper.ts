import { Collection, MongoClient } from "mongodb"

export const MongoHelper = {
  client: null as MongoClient, // não conflitar a tipagem com o obj do js
  url: null as string,

  async connect(url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  }
}