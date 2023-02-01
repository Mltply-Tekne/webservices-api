const datasetDownloadServices = require(`${process.env.srcPath}/services/datasetDownloadServices`)
const { query } = require('express-validator');
var stream = require('stream');

downloadDataset = async function (request, response) {

    if (request.verifyParametersQuery() && request.verifyClientToken()) {
        let datasetFilterParameters = request.query

        // Deleting keys that we no longer need
        delete datasetFilterParameters.token
        delete datasetFilterParameters.client
        
        // Parameter specified in the URL /downloadDataset/:datasetName
        let datasetName = request.params.datasetName

        // Iterating every key of the filters, and converting each one to an array
        for (keyNumber in datasetFilterParameters) {

            if (!Array.isArray(datasetFilterParameters[keyNumber])) {

                datasetFilterParameters[keyNumber] = [datasetFilterParameters[keyNumber]]
                
            }

        }
        
        // Makes the request to the databaseApi and returns an object with the excel in it
        fileData = await datasetDownloadServices.downloadDataset(datasetName, datasetFilterParameters)

        // If the excel generation was succesfull, we continue
        if (fileData != undefined) {

            fileName = `${fileData.fileName}.xlsx`

            var fileContents = Buffer.from(fileData.excel, "base64");

            var readStream = new stream.PassThrough();
            readStream.end(fileContents);

            response.set('Content-disposition', 'attachment; filename=' + fileName);
            response.set('Content-Type', 'text/plain');

            readStream.pipe(response);

        } else {

            response.json({ 'success': false, 'message': 'No data to export' })

        }
    }

}

downloadPolicyPdf = async function (request, response) {

    if (request.verifyParametersQuery() && request.verifyClientToken()) {
        let datasetFilterParameters = request.query

        // Deleting keys that we no longer need
        delete datasetFilterParameters.token
        delete datasetFilterParameters.client
        
        // Parameter specified in the URL /downloadPolicyPdf/:quoteRef
        let quoteRef = request.query.quoteRef
        let businessState = request.query.businessState

        // Makes the request to the databaseApi and returns an object with the excel in it
        fileData = await datasetDownloadServices.downloadPolicyPdf(quoteRef, businessState)

        // If the excel generation was succesfull, we continue
        if (fileData != null) {

            var fileContents = Buffer.from(fileData, "base64");

            response.set('Content-Type', 'application/pdf');
            response.set('title', 'Test')
            response.send(fileContents)

        } else {

            response.json({ 'success': false, 'message': 'No data to export' })

        }
    }

}


// Old way (need to migrate)
generatePouchReport = async function (request, response) {


    reportParameters = request.query

    for (pParameter of Object.keys(reportParameters)) {

        if (Array.isArray(reportParameters[pParameter]) == false) {
            reportParameters[pParameter] = [reportParameters[pParameter]]
        }
    }

    fileData = await datasetDownloadServices.getPouchUpdate(reportParameters)

    if (fileData != undefined) {
        fileName = 'Pouch quotes report.xlsx'

        var fileContents = Buffer.from(fileData, "base64");

        var readStream = new stream.PassThrough();
        readStream.end(fileContents);

        response.set('Content-disposition', 'attachment; filename=' + fileName);
        response.set('Content-Type', 'text/plain');

        readStream.pipe(response);
    }
    else {
        response.json({ 'success': false, 'message': 'No data to export' })
    }

}

generateReport = async function (request, response) {


    reportParameters = request.query

    for (pParameter of Object.keys(reportParameters)) {

        if (Array.isArray(reportParameters[pParameter]) == false) {
            reportParameters[pParameter] = [reportParameters[pParameter]]
        }
    }

    fileData = await datasetDownloadServices.getAgencyUpdateFileBuffer(reportParameters)

    if (fileData != undefined) {
        fileName = 'Agency Update.xlsx'

        var fileContents = Buffer.from(fileData, "base64");

        var readStream = new stream.PassThrough();
        readStream.end(fileContents);

        response.set('Content-disposition', 'attachment; filename=' + fileName);
        response.set('Content-Type', 'text/plain');

        readStream.pipe(response);
    }
    else {
        response.json({ 'success': false, 'message': 'No data to export' })
    }

}

generateSalesReport = async function (request, response) {
    if (request.verifyParametersQuery() && request.verifyClientToken()) {
        reportParameters = request.query


        for (pParameter of Object.keys(reportParameters)) {

            if (Array.isArray(reportParameters[pParameter]) == false) {
                reportParameters[pParameter] = [reportParameters[pParameter]]
            }
        }

        fileData = await datasetDownloadServices.getDailySalesReport(reportParameters)

        if (fileData != undefined) {
            fileName = 'Sales Report.xlsx'

            var fileContents = Buffer.from(fileData, "base64");

            var readStream = new stream.PassThrough();
            readStream.end(fileContents);

            response.set('Content-disposition', 'attachment; filename=' + fileName);
            response.set('Content-Type', 'text/plain');

            readStream.pipe(response);
        }

        else {
            response.json({ 'success': false, 'message': 'No data to export' })
        }

    }

}

generateAboutToExpireReport = async function (request, response) {
    if (request.verifyParametersQuery() && request.verifyClientToken()) {
        reportParameters = request.query

        reportParameters = request.query

        for (pParameter of Object.keys(reportParameters)) {

            if (Array.isArray(reportParameters[pParameter]) == false) {
                reportParameters[pParameter] = [reportParameters[pParameter]]
            }
        }

        fileData = await datasetDownloadServices.getAboutToExpireReport(reportParameters)

        if (fileData != undefined) {
            fileName = 'About to expire report.xlsx'

            var fileContents = Buffer.from(fileData, "base64");

            var readStream = new stream.PassThrough();
            readStream.end(fileContents);

            response.set('Content-disposition', 'attachment; filename=' + fileName);
            response.set('Content-Type', 'text/plain');

            readStream.pipe(response);
        } else {
            response.json({ 'success': false, 'message': 'No data to export' })
        }
    }
}

generateNextDueDateReport = async function (request, response){
    
    if (request.verifyParametersQuery() && request.verifyClientToken()) {
         reportParameters = request.query

        reportParameters = request.query

        for (pParameter of Object.keys(reportParameters)) {

            if (Array.isArray(reportParameters[pParameter]) == false) {
                reportParameters[pParameter] = [reportParameters[pParameter]]
            }
        }
    }

    fileData = await datasetDownloadServices.getNextDueDateReport(reportParameters)

    if (fileData != undefined) {
        fileName = 'Due Date Report.xlsx'

        var fileContents = Buffer.from(fileData, "base64");

        var readStream = new stream.PassThrough();
        readStream.end(fileContents);

        response.set('Content-disposition', 'attachment; filename=' + fileName);
        response.set('Content-Type', 'text/plain');

        readStream.pipe(response);
    }
    else {
        response.json({ 'success': false, 'message': 'No data to export' })
    }


}

module.exports = {
    generatePouchReport,
    generateReport,
    generateSalesReport,
    generateAboutToExpireReport,
    generateNextDueDateReport,
    downloadDataset,
    downloadPolicyPdf
}