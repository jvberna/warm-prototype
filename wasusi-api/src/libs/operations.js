
function Fact(num) {
    var rval = 1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function Rows(long, cicles) {
    const max = Math.max(cicles, long - cicles);
    let value = 1;
    for (let i = long; i > max; i--) {
        value *= i / (i - max);
    }
    return value;
}

function comparaArray(a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
}

function matrixP(long, cicles) {

    let mP = [];

    let Cini = [];
    let Cfin = [];
    let Cgen = []; 
    
    // Inicializamos los arrays
    for (let i = 1; i <= cicles; i++) {
        Cini.push(i);
        Cfin.push(long - (cicles - i));
    }
    Cgen=Cini.slice();

    // console.log(C);
    // console.log('Cgen:', Cgen);
    // console.log('Cini:', Cini);
    // console.log('Cfin:', Cfin);

    let bucle = 1;
    let elemento = 1;
    let pivote = cicles - 1
    let sumar = true;
    mP.push(Cgen.slice());
    //console.log(elemento++, Cgen);
    while (!comparaArray(Cgen, Cfin)) {

        sumar ? Cgen[pivote]++ : 1;

        if (Cgen[pivote] > Cfin[pivote]) {
            //console.log('Cgen se pasa:', Cgen, ' retrocede pivote de: ', pivote, ' --> ', pivote - 1);
            pivote--;
            continue;
        }

        if (pivote < cicles - 1) {
            //console.log('Cgen avanza:', Cgen, 'Avanzamos pivote de: ', pivote, ' --> ', pivote + 1)
            pivote++;
            sumar = false;
            Cgen[pivote] = Cgen[pivote - 1] + 1
            if (pivote == cicles - 1) {
                //console.log('-', elemento++, Cgen);
                mP.push(Cgen.slice());
                sumar = true;
            }

            continue;
        }

        //console.log(elemento++, Cgen);
        mP.push(Cgen.slice());

        bucle = bucle + 1;
        //bucle++ == 1500 ? Cgen = Cfin : 1;

    }
    //console.log(mP.length, mP);
    return mP;

}

module.exports = {
    Fact, Rows, comparaArray, matrixP
}
