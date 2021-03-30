import {createAntProgram} from "../createAntProgram";

export const diagonal = createAntProgram({
    ant: {
        count: 10000,
        intensity: 0.1,
        speed: 2,
        steerSpeed: 0.1,
        sensorSize: 2,
        sensorAngle: 0.2,
        sensorOffset: 10,
        randomBorderBounce: true,
    },
    trails: {
        diffuseSpeed: 2e-1,
        evaporateSpeed: 1e-3,
        color: [1, 0, 0],
    },
    initialize: () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.3;
        return [0.5 - Math.cos(dir) * dist, 0.5 - Math.cos(dir) * dist, dir];
    },
});
