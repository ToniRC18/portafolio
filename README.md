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

## Correr local

```
python3 -m http.server 8000
```

Abre http://localhost:8000

## Deploy real

Sitio en https://antoniorosascastillo.com (y `www`).

```
navegador ─▶ Cloudflare DNS (solo DNS, nube gris) ─▶ CloudFront ─OAC─▶ S3 privado
                                                      │
                                                      └─ certificado ACM (us-east-1)
```

- **S3 privado** (us-east-1): Block Public Access, versionado y cifrado SSE-S3. Sin website hosting; solo CloudFront puede leerlo (Origin Access Control + bucket policy limitada a esa distribución).
- **CloudFront**: HTTP→HTTPS, HTTP/2 y HTTP/3, Brotli/Gzip, `index.html` como root. Los 403/404 del origen devuelven `404.html` con código 404 (no es una SPA).
- **Headers de seguridad** (response headers policy): HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy` y una CSP estricta (`'self'` + Google Fonts). Por eso no hay JS ni `style=""` inline: la clase `js` la pone `js/head.js` y los estilos sueltos viven en `css/styles.css`.
- **Caché**: HTML con `no-cache`; css/js/img con `max-age=3600` (los archivos no llevan hash).
- **DNS**: en Cloudflare, todos los registros de este sitio en *DNS only*: `@` y `www` (CNAME a CloudFront) y los 2 CNAME de validación de ACM (no borrar: renuevan el certificado).

### Publicar cambios

```
cp deploy/.env.example deploy/.env   # una sola vez: BUCKET, DISTRIBUTION_ID, AWS_PROFILE (opcional)
./deploy/deploy.sh
```

Requiere AWS CLI con credenciales. El script sincroniza el sitio a S3 (sin `.git`, `deploy`, `*.md`, etc.), sube el HTML con `no-cache` y el resto con `max-age=3600`, e invalida `/*` en CloudFront. `deploy/.env` está en `.gitignore`.

### Actualizar contenido

1. Edita los archivos (HTML, CSS, JS, imágenes o `cv/Antonio_Rosas_CV.pdf`) y pruébalo con `python3 -m http.server`.
2. Si agregas un recurso externo (otro CDN, fuente, analítica), amplía la CSP en la response headers policy de CloudFront o el navegador lo bloqueará.
3. `./deploy/deploy.sh`. La invalidación tarda ~1 min; el HTML se ve al recargar.
4. Un borrado local también borra en S3 (`--delete`); el versionado del bucket permite recuperar versiones anteriores.
