const { getDailySales, getNextDueDate } = require("../models/redirectModels");

var excelModule = require(`${process.env.srcPath}/config/excels.js`);

// Data Sources
const pouchRequests = require(`${process.env.srcPath}/requests/pouchRequests.js`)
const instandaRequests = require(`${process.env.srcPath}/requests/instandaRequests.js`)
var redirectModels = require(`${process.env.srcPath}/models/redirectModels`)

getPouchUpdate = async function (requestParameters) {

    agencyUpdates = await redirectModels.getPouchUpdates(requestParameters)

    if (agencyUpdates.length){
        excelBuffer = excelModule.makeExcel(agencyUpdates)
        return excelBuffer
    }

}

getAgencyUpdateFileBuffer = async function (requestParameters) {

    agencyUpdates = await redirectModels.getAgencyUpdates(requestParameters)

    if (agencyUpdates.length){
        excelBuffer = excelModule.makeExcel(agencyUpdates)
        return excelBuffer
    }

}

getDailySalesReport = async function (requestParameters){
    
    salesReport = await redirectModels.getDailySales(requestParameters)

    if(salesReport.length){
        excelReport = excelModule.makeExcel(salesReport)
        return excelReport
    }

}

getAboutToExpireReport = async function(requestParameters){

    expireReport =  await redirectModels.getAboutToExpireInfo(requestParameters)

    if(expireReport.length){
        excelReport =  excelModule.makeExcel(expireReport)
        return excelReport
    } 

}

getNextDueDateReport = async function(){
    
    dueDateReport =  await redirectModels.getNextDueDate()

    if (dueDateReport.length){
        excelReport =  excelModule.makeExcel(dueDateReport)
        return excelReport
    }
}

// Getting dataset and generating excel.
async function downloadDataset(pDatasetName, pFilters) {

    let mData = await pouchRequests.getDataset(pDatasetName, pFilters)

    if (mData.success == true) {

        if (mData.dataset.length) {
            excelReport = await excelModule.makeExcel(mData.dataset)

            return {
                fileName: mData.datasetName,
                excel: excelReport
            }
            
        } 

    } else {

        return undefined

    }
    

}

async function downloadPolicyPdf(pQuoteRef, pBusinessState) {

    let allDocumentsDownloadLinks = await instandaRequests.getAllDocumentsDownloadLinks(pQuoteRef)

    if (!allDocumentsDownloadLinks) {
        return null
    }

    allDocumentsDownloadLinks = allDocumentsDownloadLinks.Documents
    
    // let policyPdf = allDocumentsDownloadLinks.find(document => 
    //     ((document.Name.slice(0, 12) == `PCA${pBusinessState}POLPAK_` || document.Name.slice(0, 9) == `PCA${pBusinessState}POL_`)
    //     && document.Base64DownloadUrl != null)
    // )

    let policyPdf = allDocumentsDownloadLinks.find(document => 
        ((document.Name.slice(0, 12) == `PCA${pBusinessState}POLPAK_`)
        && document.Base64DownloadUrl != null)
    )

    
    if (policyPdf?.Base64DownloadUrl) {

        let policyPdfBase64 = await instandaRequests.getPolicyPdfBase64(policyPdf.Base64DownloadUrl)

        return JSON.parse(policyPdfBase64).Base64Document

    } else {

        return null

    }
    

}


module.exports = {
    getPouchUpdate, 
    getAgencyUpdateFileBuffer,
    getDailySalesReport,
    getAboutToExpireReport, 
    getNextDueDateReport,
    downloadDataset,
    downloadPolicyPdf
}