import {createAntProgram} from "../createAntProgram";

export const randomTight = createAntProgram({
    ant: {
        count: 50000,
        intensity: 0.05,
        speed: 2,
        steerSpeed: 0.1,
        sensorSize: 2,
        sensorAngle: 0.2,
        sensorOffset: 10,
        randomBorderBounce: false,
    },
    trails: {
        diffuseSpeed: 2 * 1e-2,
        evaporateSpeed: 5 * 1e-3,
        color: [0.5, 1, 0.5],
    },
    initialize: () => [Math.random(), Math.random(), Math.random() * Math.PI * 2],
});
