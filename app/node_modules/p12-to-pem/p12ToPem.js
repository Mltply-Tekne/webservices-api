var forge = require("node-forge");
var Buffer = require("buffer").Buffer;

/**
 * Extract the private key from a PKCS12 file.
 * @param  {Buffer|String(Base64-encoded)} p12Buffer
 *         The PKCS12 file as a buffer or base-64 encoded string.
 * @param  {String} password  The password for the PKCS12 file.
 *                            (For Google Auth keys, this is "notasecret".)
 * @return {String}
 */
module.exports = function p12ToPem(p12Buffer, password) {
  if (Buffer.isBuffer(p12Buffer)) {
    p12Buffer = p12Buffer.toString("base64");
  }
  else if (typeof p12Buffer !== "string") {
    throw "p12ToPem only takes strings and buffers.";
  }

  var p12Der = forge.util.decode64(p12Buffer);
  var p12Asn1 = forge.asn1.fromDer(p12Der);
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password || "");
  var keyData = p12.getBags({friendlyName: "privatekey"}).friendlyName[0].key;
  var key = forge.pki.privateKeyToPem(keyData);
  return key.replace(/\r\n/g, '\n');
};
