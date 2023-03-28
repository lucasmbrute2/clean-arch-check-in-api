import { MongoClient } from "mongodb"

export const MongoHelper = {
  client: null as MongoClient, // não conflitar a tipagem com o obj do js
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },
  async disconnect(): Promise<void> {
    await this.client.close()
  }
}