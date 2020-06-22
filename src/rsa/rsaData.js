// import Barrett from '@/rsa/Barrett.js'
// import BigInt from '@/rsa/BigInt.js'
// import RSA from '@/rsa/RSA.js'
import rsa from '@/rsa/rsa.js'

rsa.setMaxDigits(130);
export default{
    encrypt(post){
        var key = rsa.RSAKeyPair("10001","","889d95c19bd07c68217d4585bb72067a23b6ec27f778ed5950bf7bbb255fff3f0dd38b38417b18819b44d5ddc1df22b6f47a211f859fe73c7821d5c2e8e5e7b7ed5af56e2a077b48d296724b8f9ae1e7a4f3a2c36d3a733e3c5cda51be2d0103957cdb00b976c906b9fae0dbacb9cf71df41d9709acfe1342a21660007ba649b"); 
        var post =rsa.encryptedString(key, encodeURIComponent(post));
        return post;
    }
}