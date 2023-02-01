var transunionCredentials = require(`${process.env.srcPath}/auth/transunionCredentials.js`)
var transunionModels = require(`${process.env.srcPath}/models/transunionModels.js`)
// We use transunionCredentials to obain valid clients, and check them in the request.

vhsSchema = {
    "type": "object",
    "properties": {
        "vins": {
            "type": "array",
            "items": {
                    "type": "string",
                    "minLength": 10
            },
        },
        "quoteref": {
            "type": "string",
            "minLength": 6
        }
    },
    "required": ['vins', 'quoteref']
}

async function mvrSchema(){ 
    pMvrSchema = {
        "type": "object",
        "properties": {
            "businessState": {
                "type": "string",
                "minLength": 2,
            },
            "drivers" : {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "licenseNumber": {
                            "type": "string",
                            "minLength": 1
                        },
                        "firstName": {
                            "type": "string",
                            "minLength": 1
                        },
                        "lastName": {
                            "type": "string",
                            "minLength": 1
                        },
                        "streetNumber": {
                            "type": "number",
                            "minLength": 1
                        },
                        "streetName": {
                            "type": "string",
                            "minLength": 1
                        },
                        "licenseState": {
                            "type": "string",
                            "minLength": 2
                        },
                        "city": {
                            "type": "string",
                            "minLength": 1
                        },
                        "dob": {
                            "type": "string",
                            // "format" : "date-time",
                            "minLength": 1
                        },
                        "selfReportedMinorViolationPoints": {
                            "type": "number",
                            "minLength": 1
                        },
                        "selfReportedMajorViolationPoints": {
                            "type": "number",
                            "minLength": 1
                        },
                        "selfReportedAccidentPoints": {
                            "type": "number",
                            "minLength": 1
                        }
                    },
                    "required": ['licenseNumber', 'firstName', 'lastName', 'streetNumber', 'streetName', 'licenseState', 'dob','selfReportedMinorViolationPoints','selfReportedMajorViolationPoints','selfReportedAccidentPoints']
                }
            }
        },
        "required": ['businessState', 'drivers']
    }
    stateList = await transunionModels.getStatesWithMvrMapping()
    pMvrSchema.properties.businessState.enum = stateList
    return pMvrSchema
}



module.exports = {vhsSchema, mvrSchema}