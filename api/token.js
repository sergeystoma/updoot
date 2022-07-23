import sha256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

export function tokenHash(req) {
    return sha256(req.session.accessToken).toString(encHex);
}
