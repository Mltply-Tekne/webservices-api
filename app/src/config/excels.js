// Docs
// https://www.freakyjolly.com/create-excel-from-json-in-angular-98-using-exceljs-tutorial-with-example/

const ExcelJS = require('exceljs')

const makeExcel = (pJson) => {

    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet('My Sheet');

    columns = Object.keys(pJson[0])
    columnsWithoutSpecialCharacters = []

    for (columnNumber in columns) {
        
        columnNumber = parseInt(columnNumber)
        columnName = columns[columnNumber]

        if (columnName[0] == '$') {
            worksheet.getColumn(columnNumber + 1).numFmt = '$#,##0.00;-$#,##0.00';
            columnsWithoutSpecialCharacters.push(columnName.slice(1))

        } else {
            columnsWithoutSpecialCharacters.push(columnName)
        }
    }

    let headerRow = worksheet.addRow(columnsWithoutSpecialCharacters)

    headerRow.eachCell((cell, number) => {
        cell.font = {
            bold: true
        }
    })

    for (i in pJson) {
        let row = worksheet.addRow(Object.values(pJson[i]))
    }

    // workbook.xlsx.writeFile(`${process.env.srcPath}/config/studentsData.xlsx`)
    return workbook.xlsx.writeBuffer()
    // workbook.xlsx.writeBuffer().then((data) => {
    //     let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     return blob
    // })

}

// async function readExcel (excelFile) {
//     var workbook = new ExcelJS.Workbook();
//     const worksheet = await workbook.xlsx.readFile(excelFile);
//     return worksheet
// }

module.exports = {makeExcel}