/**Funciones auxiliares para KNN */

// Devuelve el día de la semana de una fehca 1-lunes a 7 domingo
function diasemana(fecha) {
    return fecha.getDay() || 7; // devuelve un valor de 1 a 6 o 7 si era el 0 del domingo
}

// Devuelve la semana del año de una fecha
function semanaanyo(fecha) {
    var d = new Date(fecha);  //Creamos un nuevo Date con la fecha de "this".
    d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
    //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
}

// desplaza una fecha los X minutos indicados
function sumaminutos(fecha, minutos) {
    function horanum(fecha) {
        // debe devolver la hora + 0, 0.25, 0.5 o 0.75
        if (fecha.getMinutes()<16) return fecha.getHours()
        if (fecha.getMinutes()<31) return fecha.getHours() + 0.25
        if (fecha.getMinutes()<46) return fecha.getHours() + 0.5
        return fecha.getHours() + 0.75;
    }
    //return new Date(fecha.getTime() + (minutos * 60 * 1000))
}

// Codifica la hora como necesita
function horanum(fecha) {
    return fecha.getHours() + (fecha.getMinutes() / 60);
}

/** Fin funciones auxiliares para KNN */

module.exports = {
    diasemana, semanaanyo, sumaminutos, horanum
}