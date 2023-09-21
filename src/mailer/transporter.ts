import { createTransport } from "nodemailer";
import config from "../config.json";

export default createTransport({
    service: "gmail",
    auth: {
        user: config.sender_email,
        pass: config.sender_password
    }
});