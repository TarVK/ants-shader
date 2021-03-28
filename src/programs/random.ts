import {createAntProgram} from "../createAntProgram";

export const random = createAntProgram({
    ant: {
        count: 10000,
        intensity: 0.1,
        speed: 1,
        steerSpeed: 0.1,
        sensorSize: 1,
        sensorAngle: 0.4,
        sensorOffset: 10,
        randomBorderBounce: false,
    },
    trails: {
        diffuseSpeed: 2 * 1e-1,
        evaporateSpeed: 1e-3,
        color: [0.5, 1, 0.5],
    },
    initialize: () => [Math.random(), Math.random(), Math.random() * Math.PI * 2],
});
