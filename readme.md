# JavaScript Path Tracer

A very simple path tracer in the browser with zero dependencies.

![output](https://user-images.githubusercontent.com/364501/27105261-c4fc70c4-5043-11e7-98d7-3b39d1d7fe65.png)

## Scenes

- [Spheres](https://hunterloftis.github.io/pathtracer/?scene=spheres)
- [Box](https://hunterloftis.github.io/pathtracer/?scene=box)

## Features

- Unbiased monte carlo integration
- Adaptive sampling
- Russian roulette
- Physically based materials
  - Fresnel reflection, transmission, absorption, diffusion
  - Color, index of refraction, gloss, transparency, separate fresnel channels, metals
- Arbitrary light sources
- Physically based camera
  - sensor, aperture, focus, depth of field

## Code

The renderer is about 430 lines written for readability, not terseness.
The core components of any monte carlo path tracer are its
[trace function](https://github.com/hunterloftis/pathtracer/blob/gh-pages/scripts/tracer.js#L81) function
and
[Bidirectional Scattering Distribution Function](https://github.com/hunterloftis/pathtracer/blob/gh-pages/scripts/material.js#L16) (bsdf).

## Running locally

```
$ git clone https://github.com/hunterloftis/pathtracer.git
$ cd pathtracer
$ yarn install
$ yarn start
$ open localhost:8000
```