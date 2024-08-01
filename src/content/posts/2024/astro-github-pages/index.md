---
title: "Astro en GitHub Pages"
slug: astro-github-pages
description: "Cómo cambiar de base URL sin morir en el intento."
authors: ["Dra. Valina"]
image: "./pexels-khizar-hayat-1114703.jpg"
image_attribution:
    author: Khizar Hayat
    url: https://www.pexels.com/photo/gray-keypad-1114703/
categories: ["apunts"]
tags: ["programació", "astro", "github"]
draft: false
date: 2024-02-20T07:00:00Z
---

Entrada un poco meta, vamos a hablar de algunos problemillas que encontré desplegando este sitio en Github Pages.

Este blog ha sido generado con [Astro](https://astro.build/). Existe una guía oficial para desplegar en [Github Pages](https://docs.astro.build/en/guides/deploy/github/) pero, al contrario que en otros SSG como **Jekyll** o **Hugo**, no es trivial mover el sitio entre el repo *root* (`usuario.github.io`) y uno *non-root* (`usuario.github.io/repo`). En mi caso, el *non-root* me generaba muchos enlaces rotos, así que inicialmente lo dejé en el *root* y más tarde seguí estos pasos para moverlo a uno *non-root*:

1. Editar `base` en `astro.config.mjs` para indicar que el sitio está en un subpath:

```
export default defineConfig(
  site: "https://usuario.github.io",
  base: "/repo",
  ...
}
```

2. Actualizar todos los enlaces para incluir el subpath, este valor es accesible en la variable de entorno `import.meta.env.BASE_URL`. Quedaría algo así:
```
<a href={`${import.meta.env.BASE_URL}/${post.slug}`} ... />
```

Con esto ya tenemos el sitio funcionando desde un repo *non-root*, el problema viene si quieres que tu sitio pueda moverse entre los dos: con un repo *root*, Astro setea `base: "/"`; en el ejemplo anterior el enlace ahora quedaría como `//${post.slug}` (atención al detalle de la doble barra), lo cual rompe la generación de enlaces en Astro.

Para solucionarlo tuve que:

3. Añadir trailing slash a `base`, por ejemplo `/repo/`. Ahora nuestro `base` acaba siempre en barra.

4. Para evitar el problema de la doble barra, quitar la barra después de `base` en todos los enlaces, ejemplo:
```
<a href={`${import.meta.env.BASE_URL}${post.slug}`} ... />
```

5. Setear parámetro [trailingSlash](https://docs.astro.build/en/reference/configuration-reference/#trailingslash) a `"ignore"`. Con `"never"`, Astro quitará el trailing slash que acabamos de añadir a `base`, rompiendo otra vez la generación de enlaces. Con `"always"`, todos los enlaces que no acaben en barra devolverán un 404 (todas las entradas por ejemplo).


Ahora si queremos mover el sitio entre *root* y *non-root* sólo tenemos que cambiar `base`.

Otro detalle a tener en cuenta es que si tenemos contenido en `/public` también debemos cambiar esos enlaces; por ejemplo, si tenemos `/public/images/logo.webp` podemos acceder a esa imagen en un *root* repo con `/images/logo.webp`, pero debemos usar `/repo/images/logo.webp` en uno *non-root*. Para minimizar este problema lo ideal es usar rutas relativas con [Content Collections](https://docs.astro.build/en/guides/images/#images-in-content-collections).
