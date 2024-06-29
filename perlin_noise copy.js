export { PerlinNoise, generatePerlinNoise };

class PerlinNoise {
    constructor(seed = Math.random()) {
        this.seed = seed;
        this.p = new Uint8Array(512);
        for (let i = 0; i < 256; i++) this.p[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor((seed * 256) % (i + 1));
            [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
            this.p[i + 256] = this.p[i];
        }
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = this.p[X] + Y, B = this.p[X + 1] + Y;
        return this.lerp(
            v,
            this.lerp(
                u,
                this.grad(this.p[A], x, y),
                this.grad(this.p[B], x - 1, y)
            ),
            this.lerp(
                u,
                this.grad(this.p[A + 1], x, y - 1),
                this.grad(this.p[B + 1], x - 1, y - 1)
            )
        );
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t, a, b) { return a + t * (b - a); }
    grad(hash, x, y) {
        const h = hash & 15;
        const grad = 1 + (h & 7);
        return ((h & 8) ? -grad : grad) * x + ((h & 4) ? -grad : grad) * y;
    }
}

function generatePerlinNoise(width, height, modifier=0, mult=1, scale = 0.1, seed = Math.random()) {
    const perlin = new PerlinNoise(seed);
    const noiseArray = new Array(height);
    for (let y = 0; y < height; y++) {
        noiseArray[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            let noise = perlin.noise(x * scale, y * scale);
            noise = Math.max((noise + 1) / 2 + modifier,0);  // normalize to 0-1
            noise *= mult
            noiseArray[y][x] = noise;
        }
    }
    return noiseArray;
}

