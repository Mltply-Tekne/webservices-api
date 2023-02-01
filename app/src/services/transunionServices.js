const { searchMvrDescription } = require("../models/transunionModels")

var transunionRequests = require(`${process.env.srcPath}/requests/transunionRequests`)
var transunionCredentials = require(`${process.env.srcPath}/auth/transunionCredentials.js`)
var transunionModels = require(`${process.env.srcPath}/models/transunionModels.js`)


// Helpers
var violationsHelpers = require(`${process.env.srcPath}/helpers/transunionHelpers/violationsHelper.js`)

async function getVhs(pVins, pQuoteRef, pClient, pUser) {

    pVinsId = pVins.map(element => {
        if (typeof element === 'string') {
            return element.trim().toUpperCase();
        }
        return element;
    })

    

    pVinsId = pVinsId.sort().join('')


    pScoreOnCache = await transunionModels.getVhsScore(pVinsId, pUser)

    if (pScoreOnCache == undefined) {
        // Making the request to TU
        tuResponse = await transunionRequests.requestVhs(pVins, pQuoteRef, pClient)
        vhsResponseTime = tuResponse['response_time']

        
        pScore = parseInt(tuResponse['json']?.creditBureau?.product?.policyInformation?.addOnProduct?.scoreModel?.score?.results)

        // Validating pScore (if returns Null)
        if (!isNaN(pScore)) {

            pIdScore = await transunionModels.insertVhsVehiclesScore([pScore, vhsResponseTime, pVinsId], pUser)        

        } else {

            pScore = 997

        }

        return { "score": pScore }

    } else {
        return pScoreOnCache

    }
}

async function getMvr(pRequestBody, pClient, pUser) {

    mUser = pUser

    mStateObject = await transunionModels.getStatePerDescription(pRequestBody.businessState)

    // DriverRisk - Product Definitions
        // DriverRisk Base - 07955
        // DriverRisk Alert - 07960
        // DriverRisk Detail Report - 07961
        // DriverRisk MVR - 07963

    // Defining an array where each driver object will be for further iteration
    arrDriverInfo = []
    arrLicensesNotFound = []

    // Making the request to our database to see if any of the driver was previusly requested
    for (driver of pRequestBody.drivers) {

        dbDriverInfo = await transunionModels.searchDriverLicense(driver.licenseNumber, pUser)

        // If licenses were found then we load its JSON object into the arrDriverInfo
        // If not, we load the licenseNumber into the notFound array
        if (dbDriverInfo != undefined) {
            
            arrDriverInfo.push(dbDriverInfo.responsejson)

        } else {

            arrLicensesNotFound.push(driver.licenseNumber)
            
        }

    }

    // Getting metadata of the drivers that were not found
    let arrDriversNotFound = pRequestBody.drivers.filter(Driver => arrLicensesNotFound.includes(Driver['licenseNumber']))

    // Making a request to TU for those drivers that we dont have in the DB
    if (arrDriversNotFound.length != 0) {

        tuResponse = await transunionRequests.requestMvr(arrDriversNotFound, pClient, pRequestBody.businessState)
        mvrResponse = tuResponse['json']
        mvrResponseTime = tuResponse['response_time']

        // Getting drivers from the tuResponse and concating with our drivers array
        tuDriverInfo = mvrResponse['creditBureau']['product']['subject']
        arrDriverInfo = arrDriverInfo.concat(tuDriverInfo)

    }

    endpointResponse = []

    // Iterating drivers from response
    for (driverNumber in arrDriverInfo) {

        // Initializing variables
        mTotalPoints = 0

        driverResponse = {} // Driver obj to send in the response
        driverResponse.violations = []

        let arrViolations = [] // Array to store all the violations obj normalized


        // Iterating 1 driver
        driverInfo = arrDriverInfo[driverNumber]
        
        driverAddOnProducts = driverInfo['subjectRecord']['addOnProduct']
        driverInfo.licenseNumber = driverInfo['subjectRecord']['indicative']['driversLicense']['number']
        driverResponse.driverLicense = driverInfo.licenseNumber.toString()

        // Looking for selfReported data
        selfReportedDriverInfomation = pRequestBody.drivers.find(driver => driver.licenseNumber == driverResponse.driverLicense)

        if (selfReportedDriverInfomation == undefined) {
            throw Error(`Self reported information not found! ${driverResponse.driverLicense}`)
            return
        }
        
        // MVR Error Status
        mvrErrorObj = driverAddOnProducts[2].driverRiskAddon?.mvrPayload?.DHIMvr?.Errors?.Error

        // Checking if the driver has contents into the DriverRisk MVR product (07963) (default)
        // if not, we use the DriverRisk Detail Report (07961) product
        if (Object.keys(driverAddOnProducts[2]).length == 3 && mvrErrorObj == undefined) {

            driverResponse.transUnionSearchStatus = driverAddOnProducts[2]['driverRiskAddon']['@_searchStatus']
            
            // Shortcut
            let driverViolations = driverAddOnProducts[2].driverRiskAddon?.mvrPayload?.DHIMvr?.Violations?.Violation

            // Checking if we have violations
            if (driverViolations != undefined) {

                // Iterating TU response (MVR), and pushing all the violations to the arrViolations
                for (mViolation of driverViolations) {

                    violationObj = {
                        violationEVC: mViolation.EVCCode,
                        violationDate: mViolation.ViolationDate,
                        violationDescription: null,
                        adjudicatedDate: mViolation.AdjudicatedDate,
                        disposition: 'Guilty',
                        source: 'mvr'
                    }

                    arrViolations.push(violationObj)

                }

            } else {

                console.log('No violations found to iterate. MVR')

            }

        } else {

            let responseError = driverAddOnProducts[1]['driverRiskAddon']['error']
            driverResponse.transUnionSearchStatus = driverAddOnProducts[1]['driverRiskAddon']['@_searchStatus']

            if (driverResponse.transUnionSearchStatus != undefined) {

                driverResponse.validatedLicense = true

            } else {

                driverResponse.validatedLicense = false

            }
            
            
    
            if (responseError != undefined) {
    
                driverResponse.transUnionSearchStatus = null
                driverResponse.transUnionErrorCode = responseError.code
                driverResponse.transUnionErrorDescription = responseError.description
    
                if (responseError.code == 456) {
                    driverResponse.validatedLicense = false
                }
    
            }

            // Shortcut
            let driverViolations = driverAddOnProducts[1]['driverRiskAddon']['driverViolations']

            // Checking if we have violations
            if (driverViolations != undefined) {

                // Iterating TU response, and pushing all the violations to the arrViolations
                for (mViolation of driverViolations.driverViolation) {

                    violationObj = {
                        violationEVC: mViolation.violationEVC,
                        violationDate: mViolation.violationDate,
                        violationDescription: mViolation.violationDescription,
                        adjudicatedDate: mViolation.adjudicatedDate,
                        disposition: mViolation.disposition,
                        source: 'transunion'
                    }

                    arrViolations.push(violationObj)

                }

            }

        }

        // Filters, iterates and pushes violations into "driverResponse.violations"
        await iterateViolations(arrViolations)

        // If we have violations we save the TU request into the db
        if (arrViolations.length != 0) {
            
            await storeDriverInDB()
            
        }
        
        
        if (mTotalPoints == 0) {

            pMinorViolationsPoints = selfReportedDriverInfomation['selfReportedMinorViolationPoints']
            pMajorViolationsPoints = selfReportedDriverInfomation['selfReportedMajorViolationPoints']
            pAccidentPoints = selfReportedDriverInfomation['selfReportedAccidentPoints']
            pushSelfReportedViolations(driverResponse, pMinorViolationsPoints, pMajorViolationsPoints, pAccidentPoints)
            mTotalPoints += selfReportedDriverInfomation['selfReportedMinorViolationPoints'] + selfReportedDriverInfomation['selfReportedMajorViolationPoints'] +
                selfReportedDriverInfomation['selfReportedAccidentPoints']

        }

        // Adding totalPoints to the response
        driverResponse.totalPoints = mTotalPoints

        if (mTotalPoints >= 6) {

            driverResponse.exceedsMaxPoints = true
            
        } else {

            driverResponse.exceedsMaxPoints = false

        }

        endpointResponse.push(driverResponse)

    }


    return endpointResponse

}

async function initializeClient(pNewClient) {

    mNewClient = transunionModels.initializeClient(pNewClient)
    return mNewClient

}

function pushSelfReportedViolations(pDriverResponse, pMinorViolationsPoints, pMajorViolationsPoints, pAccidentPoints) {

    if (pMinorViolationsPoints > 0) {
        pDriverResponse.violations.push(violationsHelpers.getSelfReportedViolation("Self reported minor violation", pMinorViolationsPoints))
    }
    if (pMajorViolationsPoints > 0) {
        pDriverResponse.violations.push(violationsHelpers.getSelfReportedViolation("Self reported major violation", pMajorViolationsPoints))
    }
    if (pAccidentPoints > 0) {
        pDriverResponse.violations.push(violationsHelpers.getSelfReportedViolation("Self reported accident", pAccidentPoints))
    }

}

async function iterateViolations (pArrViolations) {

    // Filtering iterable violations
    let mMonthsLimit = mStateObject.violation_months_limit
    iterableViolations = pArrViolations.filter(violation => violationsHelpers.getMonthDifference(violation.violationDate, Date()) <= mMonthsLimit && violation.violationEVC != undefined && violation.disposition == 'Guilty')

    // If we dont have any violations to iterate, then we use the selfReported points.
    if (iterableViolations.length == 0) {

        pMinorViolationsPoints = selfReportedDriverInfomation['selfReportedMinorViolationPoints']
        pMajorViolationsPoints = selfReportedDriverInfomation['selfReportedMajorViolationPoints']
        pAccidentPoints = selfReportedDriverInfomation['selfReportedAccidentPoints']

        pushSelfReportedViolations(driverResponse, pMinorViolationsPoints, pMajorViolationsPoints, pAccidentPoints)

        mTotalPoints += selfReportedDriverInfomation['selfReportedMinorViolationPoints'] + selfReportedDriverInfomation['selfReportedMajorViolationPoints'] + selfReportedDriverInfomation['selfReportedAccidentPoints']

    } else {

        // Iterating driverViolations
        for (driverViolation of iterableViolations) {

            mEvcSearchPrefix = driverViolation.violationEVC.substring(5,10)
            let mvrDescription = await transunionModels.searchMvrDescription(mEvcSearchPrefix, mStateObject.id_state)

            // If neither the acd nor evc code are found on the Db, we set 0 points
            if (mvrDescription != undefined && mvrDescription.points > 0) {

                driverResponse.violations.push(

                    violationsHelpers.getViolation(
                        source = driverViolation.source,
                        violationDate = driverViolation.violationDate,
                        adjudicatedDate = driverViolation.adjudicatedDate,
                        //acdCode = driverViolation.violationAcdCode,
                        evcCode = driverViolation.violationEVC,
                        violationDescription = mvrDescription.pnc_description,
                        points = mvrDescription.points
                    )

                )

                mTotalPoints += mvrDescription.points

            }
        }


    }

}

async function storeDriverInDB () {

    let mvrResponseJsonString = JSON.stringify(driverInfo)

    if (arrLicensesNotFound.includes(driverResponse.driverLicense)) {
        transunionModels.loadApiResponse([driverResponse.driverLicense, mvrResponseJsonString, mvrResponseTime], mUser)
    }

}

module.exports = { getMvr, getVhs, initializeClient }