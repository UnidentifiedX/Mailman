import { verificationMembers } from "./verify";

export default () => {
    setInterval(() => {
        // Remove object from verificationList if the verification code has expired
        verificationMembers.forEach((instance, index) => {
            if (new Date() > instance.expiresAt) {
                verificationMembers.splice(index, 1);
            }
        })
    }, 300000)
}