import {createAntProgram} from "../createAntProgram";

export const cells = createAntProgram({
    ant: {
        count: 10000,
        intensity: 0.3,
        speed: 1,
        steerSpeed: 0.5,
        sensorSize: 3,
        sensorAngle: 1,
        sensorOffset: 4,
        randomBorderBounce: true,
    },
    trails: {
        diffuseSpeed: 2e-2,
        evaporateSpeed: 1e-3,
        color: [0.8, 0.3, 0.4],
    },
    initialize: () => [Math.random(), Math.random(), Math.random() * Math.PI * 2],
});
