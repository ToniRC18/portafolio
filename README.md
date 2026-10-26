# Portafolio · Antonio Rosas Castillo

Sitio estático (HTML/CSS/JS vanilla, sin build ni frameworks) con proyectos, habilidades y ruta DevOps.

## Estructura

```
index.html      contenido
css/styles.css  estilos
js/main.js      interacciones (reveal, count-up, terminales, lightbox, nav)
img/            foto, capturas y og.png
cv/             CV en PDF
favicon.svg, robots.txt
```

## Qué poner y dónde

Si el archivo no existe, el sitio muestra el placeholder y no da errores.

| Qué | Archivo |
|---|---|
| Foto de perfil (cuadrada, mín. 400×400) | `img/foto.jpg` |
| Capturas UMIForms | `img/umiforms-1.png`, `img/umiforms-2.png` |
| Capturas UMI Evangelismo | `img/umievangelismo-1.png`, `img/umievangelismo-2.png` |
| Capturas Cobro y CRM (RCA) | `img/rca-1.png`, `img/rca-2.png` |
| Imagen para redes (Open Graph) | `img/og.png` (1200×630) |
| CV | `cv/Antonio_Rosas_CV.pdf` (si no existe, se ocultan los botones de CV) |

Usa solo capturas con datos de demostración.

### Links de repos y demos

Edita el objeto `LINKS` al inicio de `js/main.js`. Un link vacío mantiene su botón oculto.

```js
const LINKS = {
  "umiforms.repo": "", "umiforms.demo": "",
  "umievangelismo.repo": "", "umievangelismo.demo": "",
  "rca.repo": "", "rca.demo": ""
};
```

Pendiente también: llenar `<link rel="canonical" href="">` en `index.html` con el dominio, y las rutas absolutas de `og:image`/`twitter:image` cuando haya dominio.

## Correr local

```
python3 -m http.server 8000
```

Abre http://localhost:8000

## Deploy

Pendiente: S3 + CloudFront.
