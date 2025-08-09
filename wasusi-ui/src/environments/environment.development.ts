export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/wasusi-api',
    timer: 3000,
    knnconfig: {
        knn: 9,
        weekplus: 1,
        weekminus: 1
    },
    controlconfig: {
        tl: 1,
        ps: true,
        min: 0.5,
        max: 1,
        long: 12
    },
    infraestructureconfig: {
        wcm: Math.round(1500/3.5),
        ppc: 100,
        constA: 1000000,
        constB: 1000,
        constC: 1
    }
};
