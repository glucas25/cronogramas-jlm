# Cronogramas JLM

Aplicación web para la gestión y visualización de cronogramas académicos de la institución JLM.

## Características

- 📅 Visualización de cronogramas académicos
- 📊 Tablas interactivas con filtros
- 📱 Diseño responsive
- 🎨 Interfaz moderna y intuitiva
- 📄 Exportación a PDF
- ⚡ Desarrollado con React + TypeScript + Vite

## Tecnologías

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Estilos**: CSS personalizado con variables CSS
- **PDF**: jsPDF + jsPDF-AutoTable
- **CSV**: PapaParse

## Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd cronogramas-jlm
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Ejecutar ESLint

## Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── hooks/         # Custom hooks
├── types/         # Definiciones TypeScript
├── utils/         # Utilidades y helpers
└── assets/        # Recursos estáticos
```

## Despliegue

### Despliegue en VPS (Recomendado)

1. **En el VPS, instalar Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Construir la aplicación localmente**
   ```bash
   npm run build
   ```

3. **Subir archivos al VPS**
   ```bash
   scp -r dist/* usuario@tu-vps:/var/www/html/
   ```

4. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Reiniciar Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### Despliegue en Servicios de Hosting

- **Netlify**: Arrastra la carpeta `dist` al panel de Netlify
- **Vercel**: Conecta tu repositorio de GitHub
- **GitHub Pages**: Usa la acción de GitHub Actions para build automático

## Desarrollo

### Agregar Nuevos Componentes

1. Crear archivo en `src/components/`
2. Exportar el componente
3. Importar en `App.tsx`

### Modificar Estilos

- Los estilos globales están en `src/App.css`
- Variables CSS definidas en `:root`
- Diseño responsive con media queries

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.
