const { loadCSV } = require('../libs/loadcsv');

const knn = async (req, res) => {
    // Extraemos los parámetros de la llamada
    let n = parseInt(req.query.n) || 1;
    let horanum = parseInt(req.query.horanum) || 12;
    let diasemana = parseInt(req.query.diasemana) || 6;
    let semanaanyo = parseInt(req.query.semanaanyo) || 4;
    let semanaanyoplus = (parseInt(req.query.semanaanyoplus) || 0) + semanaanyo;
    let semanaanyominus = semanaanyo - (parseInt(req.query.semanaanyominus) || 0);
    const long = parseInt(req.query.long) || 1;
    const period = 0.25;

    let vectorknn=[];
    let datacalc=[];

    // Cargamos el CSV
    const { columns, labels } = loadCSV(process.env.FILECSV, ';');
    
    try {

        // hacemos un bucle para calcular el KNN de long elementos
        for (let i=0; i<long; i++) {
            const datosfiltrados = columns.filter((row) => row[7] == horanum && row[8] == diasemana && (row[9] <= semanaanyoplus && row[9] >= semanaanyominus));
            // Si no hay datos filtrados, saltamos al siguiente bucle
            if (datosfiltrados.length<=0) continue;
            // Ordenamos de más nuevo a antiguo por año y día de la semana
            const datosordenados = datosfiltrados.sort((a, b) => b[6] - a[6]).sort((a, b) => b[8] - a[8]);
            // Obtenemos el año más reciente
            const firstyear = datosordenados[0][6];
            // Sacamos una lista de n elementos
            const datosseleccionados = datosordenados.slice(0, n);
            // Calculamos el valor de KNN
            let numerador = 0;
            let denominador = 0;
            datosseleccionados.map((row, index) => {
                // Hacemos el valor basoluto de consumo para prevenir errores de consumos negativos
                numerador += Math.abs(row[3]) / (firstyear - row[6] + 1);
                denominador += 1 / (firstyear - row[6] + 1);
            })
            valorKNN = numerador / denominador;
            vectorknn.push(valorKNN);
            datacalc.push(datosseleccionados)

            horanum += period;
            if (horanum>23.75) {
                horanum = 0;
                diasemana += 1;
                if (diasemana>7) {
                    diasemana = 1;
                    semanaanyo += 1;
                    if (semanaanyo>53) semanaanyo=1
                }
            }
        }


        res.json({
            msg: 'KNN con n=' + n + ' horanum=' + horanum + ' diasemana=' + diasemana + ' semanyo=' + semanaanyo + '(+' + semanaanyoplus + '/-' + semanaanyominus + ') long='+long,
            vectorknn,
            labels,
            datacalc
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error en KNN',
            error
        })
    }

}

module.exports = {
    knn
}