const { Rows, matrixP } = require('../libs/operations');

const control = async (req, res) => {
    try {
        // console.log(req.query)
        // Obtenemos todos los párametros como número
        const P = String(req.query.P || "0").split(',').map(value => Number(value));
        const tl = Number(req.query.tl);
        const ps = req.query.ps === 'true' ? 1 : 0;
        const max = Number(req.query.max);
        const min = Number(req.query.min);
        const long = Number(req.query.long);
        const wcm = Number(req.query.wcm);
        const ppc = Number(req.query.ppc);
        const constA = Number(req.query.constA);
        const constB = Number(req.query.constB);
        const constC = Number(req.query.constC);
        //console.log(P, tl, ps, max, min, long, wcm, ppc, constA, constB, constC);

        // agua excedente
        const we = wcm * (tl - min);
        // total de agua prevision consumo
        const wp = P.reduce((a, b) => a + b, 0)
        // agua necesaria
        const wn = wp - we < 0 ? 0 : wp - we;
        // ciclos de llenado
        const cicles = Math.ceil(wn / ppc);
        // rows
        const rows = Rows(long, cicles);

        //console.log(we, wp, wn, cicles, rows)

        // Calcular matrizP
        const matrixPos = matrixP(long, cicles);
        const mPos = [];
        const mPer = [];
        const mL = [];
        const mC = [];

        // Para cada fila, calculamos el coste
        for (let i = 0; i < rows; i++) {
            // [1,4,5,8]

            let vPosOBJ = {};
            vPosOBJ['index'] = i+1;
            matrixPos[i].forEach((element,index) => {
                vPosOBJ['v'+(index+1)] = element
            });
            mPos.push(JSON.parse(JSON.stringify(vPosOBJ)));

            // Creo un vector con todos los números
            let vPermuta = Array(long + 1).fill(0)
            // el primer elemento de la permutación es ps, el estado de las bombs
            vPermuta[0] = ps;
            
            // El resto de elementos los rellenamos con los 1 que hay en el vector de posicones mP
            matrixPos[i].forEach(element => {
                vPermuta[element] = 1
            });

            let vPermutaOBJ = {};
            vPermutaOBJ['index'] = i+1;
            vPermutaOBJ['ps'] = ps
            vPermuta.forEach((element, index)=> {
                if (index>0) vPermutaOBJ['v'+index]=element;
            } );

            let vLevel = [];
            let emin = 0, emax = 0, changes = 0;
            vLevel.push(tl);
            let vLevelOBJ = {};
            vLevelOBJ['index'] = i+1;
            vLevelOBJ['tl'] = tl;

            for (let j = 1; j < vPermuta.length; j++) {
                // Se utiliza P[j-1] porque P tiene long posiciones y vLevel y vPermuta tienen long+1+1
                vLevel[j] = vLevel[j - 1] + (((vPermuta[j] * ppc) - P[j - 1]) / wcm);
                vLevelOBJ['v'+j] = vLevel[j];
                emin += Math.max((min - vLevel[j]), 0);
                emax += Math.max((vLevel[j] - max), 0);
                changes += Math.abs(vPermuta[j - 1] - vPermuta[j]);
            }
            const cost = ((constA * emin) + (constB * emax) + (constC * changes));
            mC.push({index: i+1, emin, emax, changes, cost});
            mL.push(JSON.parse(JSON.stringify(vLevelOBJ)));
            //mPer.push(vPermuta.slice());
            mPer.push(JSON.parse(JSON.stringify(vPermutaOBJ)));
        }

        // Calculamos los nombres de columnas
        const mCColumns = ['index','emin', 'emax', 'changes', 'cost'];
        let mLColumns = ['index', 'tl'];
        let mPerColumns = ['index', 'ps'];
        for (let i=1;i<=long;i++) {
            mLColumns.push('v'+i);
            mPerColumns.push('v'+i);
        }
        let mPosColumns = ['index'];
        for (let i=1;i<=cicles;i++) {
            mPosColumns.push('v'+i);
        }


        console.log('listo')
        //console.log(mP)
        res.json({
            msg: 'Control devuelve: filas en las matrices, matriz de posición, matriz de permutación, matriz de nivel y matriz de coste',
            rows,
            mPos,
            mPosColumns,
            mPer,
            mPerColumns,
            mL,
            mLColumns,
            mC,
            mCColumns
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error en CONTROL',
            error
        })
    }

}

module.exports = {
    control
}