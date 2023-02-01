function getViolation(pSource, pViolationDate, pAdjudicatedDate, pEvcCode, pViolationDescription, pPoints){
    violationObj = {
        "source": pSource,
        "violationDate": pViolationDate,
        "adjudicatedDate": pAdjudicatedDate,
        "evcCode": pEvcCode,
        "violationDescription": pViolationDescription,
        "points": pPoints
    }

    
    return violationObj
}

function getSelfReportedViolation(pViolationDescription,pPoints){
    violationObj = {
        "source": "selfReported",
        "violationDate": "",
        "adjudicatedDate": "",
        "evcCode": "",
        "violationDescription": pViolationDescription,
        "points": pPoints
    }
    
    return violationObj

}

function getMonthDifference(startDate, endDate) {

    startDate = new Date(startDate)
    endDate = new Date(endDate)

    return (endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear())))
}


module.exports = {getViolation, getSelfReportedViolation, getMonthDifference}