# Docker Setup for Cronogramas JLM

Este proyecto incluye configuración Docker completa para desarrollo y producción.

## Archivos Creados

- `Dockerfile` - Para producción (multi-stage build)
- `Dockerfile.dev` - Para desarrollo (hot reload)
- `docker-compose.yml` - Configuración de servicios y redes
- `nginx.conf` - Configuración de Nginx para producción
- `.dockerignore` - Archivos excluidos del build

## Uso

### Desarrollo

Para ejecutar en modo desarrollo con hot reload:

```bash
# Construir y ejecutar en modo desarrollo
docker-compose --profile dev up --build

# O ejecutar en segundo plano
docker-compose --profile dev up -d --build
```

La aplicación estará disponible en: http://localhost:5173

### Producción

Para ejecutar en modo producción:

```bash
# Construir y ejecutar en modo producción
docker-compose --profile prod up --build

# O ejecutar en segundo plano
docker-compose --profile prod up -d --build
```

La aplicación estará disponible en: http://localhost:80

### Con Nginx Reverse Proxy

Para usar con Nginx como reverse proxy:

```bash
# Ejecutar con Nginx
docker-compose --profile prod up -d --build

# La aplicación estará disponible en: http://localhost:8080
```

## Comandos Útiles

```bash
# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Reconstruir sin cache
docker-compose build --no-cache

# Limpiar volúmenes y redes
docker-compose down -v --remove-orphans
```

## Estructura de Redes

- `app-network`: Red bridge para comunicación entre servicios

## Servicios

### app-dev
- **Puerto**: 5173
- **Propósito**: Desarrollo con hot reload
- **Volúmenes**: Montaje del código fuente para cambios en tiempo real

### app-prod
- **Puerto**: 80
- **Propósito**: Aplicación optimizada para producción
- **Build**: Multi-stage con Nginx

### nginx (opcional)
- **Puerto**: 8080
- **Propósito**: Reverse proxy con configuración optimizada
- **Características**: Compresión gzip, cache, headers de seguridad

## Optimizaciones Incluidas

### Dockerfile de Producción
- Multi-stage build para reducir tamaño de imagen
- Nginx Alpine para servir archivos estáticos
- Optimización de capas Docker

### Dockerfile de Desarrollo
- Hot reload habilitado
- Montaje de volúmenes para cambios en tiempo real
- Todas las dependencias de desarrollo incluidas

### Nginx Configuration
- Soporte para client-side routing (SPA)
- Compresión gzip
- Headers de seguridad
- Cache optimizado para assets estáticos

## Variables de Entorno

Puedes agregar un archivo `.env` para configurar variables de entorno:

```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

## Troubleshooting

### Puerto ya en uso
Si el puerto 5173 o 80 está ocupado, modifica los puertos en `docker-compose.yml`:

```yaml
ports:
  - "3000:5173"  # Cambiar puerto externo
```

### Problemas de permisos
En algunos sistemas, puede ser necesario ajustar permisos:

```bash
sudo chown -R $USER:$USER .
```

### Limpiar Docker
Si hay problemas con imágenes o contenedores:

```bash
docker system prune -a
docker volume prune
``` 