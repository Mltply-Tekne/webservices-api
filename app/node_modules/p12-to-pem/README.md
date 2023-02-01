# p12ToPem

This JavaScript library allows you to easily extract the private key from a
PKCS12 (.p12) file in a buffer or base64 encoded string. Usage is pretty simple
and straightforward:

```javascript
var p12ToPem = require("../p12-to-pem.js");
var p12File = fs.readFileSync("/path/to.p12");
var privateKey = p12ToPem(p12File, "password");
```

This library is licensed under the BSD 2-clause license, copyright 2015 Zebrafish Labs, Inc.
See [`LICENSE` file](https://github.com/imgix/p12ToPem/blob/master/LICENSE) for details.
