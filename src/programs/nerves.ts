import {createAntProgram} from "../createAntProgram";

export const nerves = createAntProgram({
    ant: {
        count: 50000,
        intensity: 0.01,
        speed: 2,
        steerSpeed: 1,
        sensorSize: 2,
        sensorAngle: 0.2,
        sensorOffset: 10,
        randomBorderBounce: true,
    },
    trails: {
        diffuseSpeed: 1 * 1e-2,
        evaporateSpeed: 1 * 1e-3,
        color: [0.3, 0.4, 1],
    },
    initialize: () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.5;
        return [0.5 - Math.cos(dir) * dist, 0.5 - Math.sin(dir) * dist, dir];
    },
});
