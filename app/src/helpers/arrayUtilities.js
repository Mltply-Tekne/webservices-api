function findDuplicates(arry) {
    return arry.filter((e, i, a) => a.indexOf(e) !== i)
}

module.exports = {findDuplicates}