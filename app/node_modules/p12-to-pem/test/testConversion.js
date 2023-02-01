var assert = require("assert");
var fs = require("fs");
var p12ToPem = require("../p12ToPem.js");

describe("p12ToPem", function() {
  var p12Buffer = fs.readFileSync(__dirname + "/example.p12");
  var p12BufferWithPass = fs.readFileSync(__dirname + "/example-password.p12");
  var expectedKey = fs.readFileSync(__dirname + "/example.pem");

  it("should extract the private key from a p12 buffer", function() {
    var key = p12ToPem(p12Buffer);
    assert.equal(key, expectedKey);
  });

  it("should extract the private key from a base64 encoded p12", function() {
    var key = p12ToPem(p12Buffer.toString("base64"));
    assert.equal(key, expectedKey);
  });

  it("should extract the private key with a password", function() {
    var key = p12ToPem(p12BufferWithPass, "notasecret");
    assert.equal(key, expectedKey);
  });

  it("should fail to extract the private key with no/wrong password", function() {
    assert.throws(function() {
      p12ToPem(p12BufferWithPass);
    }, Error);
  });
});
