import { CronJob } from "cron";
import { Client } from "discord.js";

export default class Cron {
    private readonly client: Client;
    private serverIconIndex: number = 0;
    constructor(client: Client) {
        this.serverIconIndex = 0;
        this.client = client;
    }

    public start() {
        this.changeServerIconCron()
    }

    public changeServerIconCron() {
        CronJob.from({
            cronTime: '*/10 * * * *',
            onTick: async () => {
                const guild = this.client.guilds.cache.get(process.env.GUILD_ID as string)
                if (!guild) return
                try {
                    await guild.setIcon(`src/img/logo_${this.serverIconIndex+1}.jpg`)
                    this.serverIconIndex = (this.serverIconIndex + 1) % 15
                } catch (error) {
                    console.error(error)
                }
            }
        })
    }
}