export class GuildEntry {
    public guildId: string
    public verifiedMember: string

    constructor(guildId: string, verifiedMember: string) {
        this.guildId = guildId;
        this.verifiedMember = verifiedMember;
    }
}