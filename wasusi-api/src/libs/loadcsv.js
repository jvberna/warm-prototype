const fs = require('fs-extra');

// Cargamos un CSV utilizando el separador indicado
function loadCSV(filename, separator) {
    const data = fs.readFileSync(filename, { encoding: 'utf-8' });
    let columns = data.split('\r\n').map((row, index) => {
        let splitrow = row.split(separator);
        if (index == 0) {
            // la primera fila no la modifico
            return splitrow;
        }
        splitrow[3] = Number(splitrow[3])
        splitrow[4] = Number(splitrow[4])
        splitrow[5] = Number(splitrow[5])
        splitrow[6] = Number(splitrow[6])
        splitrow[7] = Number(splitrow[7])
        splitrow[8] = Number(splitrow[8])
        splitrow[9] = Number(splitrow[9])
        return splitrow;
    });
    const labels = columns.shift();
    return { columns, labels };
}

module.exports= { loadCSV }