import { Command } from "./command";
import { DomainCommand } from "./domain/domain";
import { HelpCommand } from "./help/help";
import { PingCommand } from "./ping/ping";
import { SetupCommand } from "./setup/setup";
import { VerifyCommand } from "./verify/verify";

export const Commands: Command[] = [
    PingCommand,
    VerifyCommand,
    SetupCommand,
    DomainCommand,
    HelpCommand
];