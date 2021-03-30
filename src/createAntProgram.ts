import {
    GPU,
    GPUFunction,
    IConstantsThis,
    IKernelFunctionThis,
    IKernelRunShortcut,
    KernelOutput,
    ThreadKernelVariable,
} from "gpu.js";

type IAnt = [
    /** X */
    number,
    /** Y */
    number,
    /** angle */
    number
];

type IPixel = number;

export const createAntProgram = (
    config: {
        /** Ant properties */
        ant: {
            /** Total number of ants */
            count: number;
            /** The pixel intensity of 1 ant */
            intensity: number;
            /** Movement speed */
            speed: number;
            /** The max speed at which the ant can steer */
            steerSpeed: number;
            /** The offset distance of the sensor relative to the ant in pixels */
            sensorOffset: number;
            /** The offset angles of the sensor */
            sensorAngle: number;
            /** The size of the angle */
            sensorSize: number;
            /** Whether to bounce in a random direction on the edge */
            randomBorderBounce: boolean;
        };
        trails: {
            /** The speed at which trails evaporate */
            evaporateSpeed: number;
            /** The speed at which trails diffuse */
            diffuseSpeed: number;
            /** The color of the trails */
            color: [number, number, number];
        };
        /** Initializes the ants */
        initialize: (count: number) => IAnt[] | IAnt;
    },
    updateGetter?: (updater: (reset?: boolean) => void) => void
) => (size: number) => {
    // Create the main update logic
    /** The function that updates the state for the next cycle */
    function updateAnts(
        this: IKernelFunctionThis<IConstantsThis>,
        data: IAnt[],
        pixels: IPixel[][],
        size: number
    ): IAnt {
        const speed = this.constants.speed as number;
        const steerSpeed = this.constants.steerSpeed as number;
        const sensorSize = this.constants.sensorSize as number;
        const sensorOffset = this.constants.sensorOffset as number;
        const sensorAngle = this.constants.sensorAngle as number;
        const randomBorderBounce = this.constants.randomBorderBounce as boolean;

        // Extract data
        let x = data[this.thread.x][0];
        let y = data[this.thread.x][1];
        let angle = data[this.thread.x][2];

        // Movement + border bounce
        let veloX = (Math.cos(angle) * speed) / size;
        let veloY = (Math.sin(angle) * speed) / size;

        x = Math.min(Math.max(0, x + veloX), 1);
        y = Math.min(Math.max(0, y + veloY), 1);
        if (randomBorderBounce) {
            if (x >= 1 || x <= 0 || y >= 1 || y <= 0)
                angle = (Math.random() + 1) * Math.PI * 2;
        } else {
            if (x >= 1 || x <= 0) angle = Math.PI - angle;
            if (y >= 1 || y <= 0) angle = -angle;
        }

        // Compute the sensor values
        const sensors = [0, 0, 0];
        for (let i = -1; i <= 1; i += 1) {
            const baseX = Math.round(
                x * size + Math.cos(Math.PI * 2 + i * sensorAngle + angle) * sensorOffset
            );
            const baseY = Math.round(
                y * size + Math.sin(Math.PI * 2 + i * sensorAngle + angle) * sensorOffset
            );

            for (let x = -sensorSize + 1; x < sensorSize; x++) {
                for (let y = -sensorSize + 1; y < sensorSize; y++) {
                    sensors[i + 1] += pixels[baseY + y][baseX + x];
                }
            }
        }

        // Update the direction
        const randomSteerStrength = Math.random();
        let right = sensors[0];
        const forward = sensors[1];
        let left = sensors[2];

        if (forward > left && forward > right) angle = angle;
        else if (left > forward && right > forward)
            angle += (randomSteerStrength - 0.5) * 2 * steerSpeed;
        else if (left > right) angle += randomSteerStrength * steerSpeed;
        else if (right > left) angle -= randomSteerStrength * steerSpeed;

        return [x, y, angle];
    }

    /** Updates the image data */
    function updatePixels(
        this: IKernelFunctionThis<IConstantsThis>,
        pixels: IPixel[][]
    ): IPixel {
        const evaporateSpeed = this.constants.evaporateSpeed as number;
        const diffusionSpeed = this.constants.diffuseSpeed as number;

        // Blur the trail
        let avg = 0;
        for (let x = this.thread.x - 1; x <= this.thread.x + 1; x++) {
            for (let y = this.thread.y - 1; y <= this.thread.y + 1; y++) {
                avg += pixels[y][x];
            }
        }
        let result =
            (1 - diffusionSpeed) * pixels[this.thread.y][this.thread.x] +
            (diffusionSpeed * avg) / 9;

        // Evaporate the trail
        result = Math.max(0, result - evaporateSpeed);
        return result;
    }

    /** Draws the pixels */
    function draw(this: IKernelFunctionThis<IConstantsThis>, pixels: IPixel[][]): void {
        const v = Math.min(1, pixels[this.thread.y][this.thread.x]);
        const r = this.constants.r as number;
        const g = this.constants.g as number;
        const b = this.constants.b as number;
        this.color(r * v, g * v, b * v, 1);
    }

    // Create the GPU kernels
    const gpu = new GPU();
    let updateAntsK: IKernelRunShortcut;
    let updatePixelsK: IKernelRunShortcut;
    let drawK: IKernelRunShortcut = null as any;

    const span = document.createElement("span");
    function initShaders() {
        updateAntsK?.destroy();
        updateAntsK = gpu
            .createKernel(updateAnts)
            .setOutput([config.ant.count])
            .setConstants(config.ant);
        updatePixelsK?.destroy();
        updatePixelsK = gpu
            .createKernel(updatePixels)
            .setOutput([size, size])
            .setConstants(config.trails);
        (drawK?.canvas as HTMLCanvasElement)?.remove();
        drawK?.destroy();
        drawK = gpu
            .createKernel(draw)
            .setGraphical(true)
            .setOutput([size, size])
            .setConstants({
                r: config.trails.color[0],
                g: config.trails.color[1],
                b: config.trails.color[2],
            });
        span.appendChild(drawK.canvas);
    }
    initShaders();

    updateGetter?.((reset: boolean) => {
        initShaders();
        if (reset) init();
    });

    // Initialize the state
    let ants: IAnt[];
    let pixels: number[][];
    function init() {
        const testAnt = config.initialize(config.ant.count);
        ants =
            testAnt[0] instanceof Array
                ? (testAnt as IAnt[])
                : new Array(config.ant.count)
                      .fill(0)
                      .map(() => config.initialize(1) as IAnt);
        pixels = new Array(size).fill(0).map(() => new Array(size).fill(0));
    }
    init();
    let running = true;

    // Create the render loop
    const render = () => {
        try {
            const antIntensity = config.ant.intensity;
            ants = updateAntsK(ants, pixels, size) as IAnt[];
            ants.forEach(([x, y]) => {
                const px = Math.round(x * (size - 1));
                const py = Math.round(y * (size - 1));
                pixels[py][px] = Math.min(pixels[py][px] + antIntensity, 1);
            });
            pixels = updatePixelsK(pixels) as IPixel[][];
            drawK?.(pixels);
        } catch (e) {
            console.error(e);
        }

        if (running) requestAnimationFrame(render);
    };
    if (running) render();

    // Return the controls
    return {
        canvas: span,
        start: () => {
            running = true;
            render();
        },
        stop: () => {
            running = false;
        },
    };
};
