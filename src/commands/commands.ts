import { Command } from "./command";
import { PingCommand } from "./ping/ping";
import { VerifyCommand } from "./verify/verify";

export const Commands: Command[] = [
    PingCommand,
    VerifyCommand
];