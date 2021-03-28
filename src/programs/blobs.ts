import {createAntProgram} from "../createAntProgram";

export const blobs = createAntProgram({
    ant: {
        count: 10000,
        intensity: 0.3,
        speed: 1,
        steerSpeed: 0.5,
        sensorSize: 10,
        sensorAngle: 1,
        sensorOffset: 4,
        randomBorderBounce: true,
    },
    trails: {
        diffuseSpeed: 2 * 1e-2,
        evaporateSpeed: 1 * 1e-3,
        color: [0.5, 0.5, 1],
    },
    initialize: () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.5;
        return [0.5 - Math.cos(dir) * dist, 0.5 - Math.sin(dir) * dist, dir];
    },
});
