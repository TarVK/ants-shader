import {createAntProgram} from "../createAntProgram";

export const ants = createAntProgram({
    ant: {
        count: 1000,
        intensity: 1,
        speed: 1,
        steerSpeed: 0.2,
        sensorSize: 3,
        sensorAngle: 0.5,
        sensorOffset: 4,
        randomBorderBounce: true,
    },
    trails: {
        diffuseSpeed: 5 * 1e-2,
        evaporateSpeed: 1 * 1e-3,
        color: [0.8, 0.3, 0.4],
    },
    initialize: () => [Math.random(), Math.random(), Math.random() * Math.PI * 2],
});
