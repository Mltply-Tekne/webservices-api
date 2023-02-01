const got = require('got');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require('fs')
const https = require('https');

var transunionCredentials = require(`${process.env.srcPath}/auth/transunionCredentials.js`)
var transunionModels = require(`${process.env.srcPath}/models/transunionModels.js`)

var excels = require(`${process.env.srcPath}/config/excels.js`)


const alwaysArray = [
    "creditBureau.product.subject.subjectRecord.addOnProduct.driverRiskAddon.driverViolations.driverViolation"
 ];

const options = {
    ignoreAttributes: false,
    //name: is either tagname, or attribute name
    //jPath: upto the tag name
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if( alwaysArray.indexOf(jpath) !== -1) return true;
    }
};

const parser = new XMLParser(options);

// The certificates were generated with OpenSSL (exporting from the .p12 file from TU), using the following command:
// openssl pkcs12 -info -in ANYCONN1_SHA2.p12 -out data.txt -nodes

// Makes a request to TransUnion, and returns an XML
async function tuRequest(pXML, pUrl, pHttpsKey, pHttpsCert) {
    const start = Date.now()

    let xmlResponse


	await got.post(pUrl, 
		{
			headers: {
				'Content-Type': 'application/xml'
			},
			body: pXML,
			https: {
				rejectUnauthorized: false,
				key: fs.readFileSync(pHttpsKey),
				certificate: fs.readFileSync(pHttpsCert)
			}
			
		})
	.then(res => {
		xmlResponse = res.body
	})
	.catch(err => {
		
		console.log(err)
		console.log(err.response.body)
		response = undefined

	})
    
	
    
    // Obtain time spent on the request
    const stop = Date.now()
    let responseTime = (stop - start)/1000

    // Parsing XML -> JSON
    const jsonResponse = parser.parse(xmlResponse);
    
    // const parser = new XMLParser();
    // let jsonResponse = parser.parse(xmlResponse);
    
    let response = {
        xml: xmlResponse,
        json: jsonResponse,
        response_time: responseTime
    }

    return response
}

async function requestVhs (pVins, pQuoteRef, pClient) {

    // Obtaining credentials to make XML with them
    tuCredentials = transunionCredentials.obtainVHSCredentials(pClient)

    // Credentials
    let industryCode = tuCredentials.industryCode
    let memberCode = tuCredentials.memberCode
    let inquirySubscriberPrefixCode = tuCredentials.inquirySubscriberPrefixCode
    let password = tuCredentials.password
    let vendorUserID = tuCredentials.vendorUserID


    // Request Data
    let httpsKey = tuCredentials.httpsKey
    let httpsCert = tuCredentials.httpsCert
    let url = tuCredentials.url


    baseXML = `<creditBureau xmlns="http://www.transunion.com/namespace" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <document>request</document>
    <version>2.38</version>
    <transactionControl>
        <userRefNumber>TEST</userRefNumber>
        <subscriber>
            <industryCode>${industryCode}</industryCode>
            <memberCode>${memberCode}</memberCode>
            <inquirySubscriberPrefixCode>${inquirySubscriberPrefixCode}</inquirySubscriberPrefixCode>
            <password>${password}</password>
        </subscriber>
        <options>
            <country>us</country>
            <language>en</language>
            <processingEnvironment>standardTest</processingEnvironment>
            <productVersion>standard</productVersion>
        </options>
        <identity>
            <type>vendorUserID</type>
            <value>${vendorUserID}</value>
        </identity>
        <clientVendorSoftware>
            <vendor>
                <id>50445</id>
                <name>INSTANDA</name>
            </vendor>
            <software>
                <name>INSTANDA</name>
            </software>
        </clientVendorSoftware>
    </transactionControl>
    <product>
        <code>07964</code>
        <!-- Commercial Auto Solution -->
        <policyInformation>
            <policyNmbrOrQuoteId>${pQuoteRef}</policyNmbrOrQuoteId>
            <carrierName>POUCH</carrierName>
            <addOnProduct>
                <code>00A09</code>
            </addOnProduct>
           `

    endOfXML = `
                </policyInformation>
                <responseInstructions>
                    <returnErrorText>true</returnErrorText>
                </responseInstructions>
            </product>
            </creditBureau>`

    // Iterating Vins from parameters
    for (mVin of pVins) {

        baseXML += `
        <policyVehicle>
                <vehicleHistory>
                    <vehicle>
                        <vin>${mVin}</vin>
                    </vehicle>
                </vehicleHistory>
        </policyVehicle>
        `
    }

    baseXML += endOfXML

    return tuRequest(baseXML, url, httpsKey, httpsCert)
}

async function requestMvr (pDrivers, pClient, pbusinessState) {

    // Obtaining credentials to make XML with them
    tuCredentials = transunionCredentials.obtainMVRCredentials(pClient)
    
    let industryCode = tuCredentials.industryCode
    let memberCode = tuCredentials.memberCode
    let inquirySubscriberPrefixCode = tuCredentials.inquirySubscriberPrefixCode
    let password = tuCredentials.password
    let vendorUserID = tuCredentials.vendorUserID

    // Request Data
    let httpsKey = tuCredentials.httpsKey
    let httpsCert = tuCredentials.httpsCert
    let url = tuCredentials.url

    issuanceState = pbusinessState

    baseXML = `
            <creditBureau xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.transunion.com/namespace">
            <document>request</document>
            <version>2.38</version>
            <transactionControl>
                <userRefNumber>TEST</userRefNumber>
                <subscriber>
                    <industryCode>${industryCode}</industryCode>
                    <memberCode>${memberCode}</memberCode>
                    <inquirySubscriberPrefixCode>${inquirySubscriberPrefixCode}</inquirySubscriberPrefixCode>
                    <password>${password}</password>
                </subscriber>
                <options>
                    <country>us</country>
                    <language>en</language>
                    <processingEnvironment>standardTest</processingEnvironment>
                    <productVersion>standard</productVersion>
                </options>
                <identity>
                    <type>vendorUserID</type>
                    <value>${vendorUserID}</value>
                </identity>
                <clientVendorSoftware>
                    <vendor>
                        <id>50445</id>
                        <name>INSTANDA</name>
                    </vendor>
                    <software>
                        <name>INSTANDA</name>
                    </software>
                </clientVendorSoftware>
            </transactionControl>
            <product>
                <code>07955</code>
                <custom>
                    <driverRisk>
                        <issuanceState>${issuanceState}</issuanceState>
                    </driverRisk>
                </custom>
    `

    // Iterating drivers from parameters
    for (mDriver of pDrivers) {
        
        mLicenseNumber = mDriver.licenseNumber
        mFirstName = mDriver.firstName
        mLastName = mDriver.lastName
        mStreetNumber = mDriver.streetNumber
        mStreetName = mDriver.streetName
        mState = mDriver.licenseState
        mDob = mDriver.dob
		mCity = mDriver.city
        

        baseXML += `
                <subject>
                    <number>1</number>
                    <subjectRecord>
                        <indicative>
                            <name>
                                <person>
                                    <first>${mFirstName}</first>
                                    <last>${mLastName}</last>
                                </person>
                            </name>
                            <address>
                                <status>current</status>
                                <street>
                                    <number>${mStreetNumber}</number>
                                    <name>${mStreetName}</name>
                                </street>
                                <location>
                                    <city>${mCity}</city>
                                    <state>${mState}</state>
                                    <zipCode>60750</zipCode>
                                </location>
                            </address>
                            <dateOfBirth>${mDob}</dateOfBirth>
                            <driversLicense>
                                <number>${mLicenseNumber}</number>
                                <issuanceState>${mState}</issuanceState>
                            </driversLicense>
                        </indicative>
                        <addOnProduct>
                            <code>07960</code>
                        </addOnProduct>
                        <addOnProduct>
                            <code>07961</code>
                        </addOnProduct>
                        <addOnProduct>
                            <code>07963</code>
                        </addOnProduct>
                    </subjectRecord>
                </subject>`
    }

    baseXML += `
                <permissiblePurpose>
                    <code>IN</code>
                </permissiblePurpose>
                <responseInstructions>
                    <returnErrorText>true</returnErrorText>
                </responseInstructions>
            </product>
        </creditBureau>
    `
    
    // Making TU Request
    tuResponse = await tuRequest(baseXML, url, httpsKey, httpsCert)

    // If the following transformation fails, then we have an error in the request
    try {

        // In case the following key is an object instead of an array, we convert it for further use
        if (!Array.isArray(tuResponse.json.creditBureau.product.subject)) {
            tuResponse.json.creditBureau.product.subject = [tuResponse.json.creditBureau.product.subject]
        }

        // Parsing XML payload from MVR
        for (iDriver in tuResponse.json.creditBureau.product.subject) {

            let mvrPayload = tuResponse.json.creditBureau.product.subject[iDriver].subjectRecord?.addOnProduct[2]?.driverRiskAddon?.mvrPayload

            // If we find the key, we continue
            if (mvrPayload != undefined) {

                // We delete this line because it breaks the XML format
                mvrPayload = mvrPayload.replace('<![CDATA[<?xml version="1.0"?>', '')
                tuResponse.json.creditBureau.product.subject[iDriver].subjectRecord.addOnProduct[2].driverRiskAddon.mvrPayload = parser.parse(mvrPayload)

				// Converting the violations into an array if we only have 1 violation
				if (!Array.isArray(tuResponse.json.creditBureau.product.subject[iDriver].subjectRecord.addOnProduct[2].driverRiskAddon.mvrPayload.DHIMvr.Violations.Violation)) {
					tuResponse.json.creditBureau.product.subject[iDriver].subjectRecord.addOnProduct[2].driverRiskAddon.mvrPayload.DHIMvr.Violations.Violation = [tuResponse.json.creditBureau.product.subject[iDriver].subjectRecord.addOnProduct[2].driverRiskAddon.mvrPayload.DHIMvr.Violations.Violation]
				}

            }
            
        }

    } catch (e) {

        console.log('TransUnion error in response.', e)
        
    }
    

    return tuResponse

}

module.exports = {
	requestVhs,
	requestMvr
}
