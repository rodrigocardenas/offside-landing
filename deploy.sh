#!/bin/bash
set -e

# --- CONFIGURACIÓN ---
SERVER_ALIAS="offside-app"              # Alias del servidor (configurado en ~/.ssh/config)
REMOTE_PATH="/var/www/html/offside-landing"  # Ruta en el servidor
REQUIRED_BRANCH="main"
DEPLOY_INITIATOR=$(whoami)
COMMIT_SHA=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%s | sed 's/"/\"/g')

echo "🔍 Validando entorno de despliegue..."

# 1. Validar que estamos en la rama correcta
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$REQUIRED_BRANCH" ]; then
    echo "❌ ERROR: Estás en la rama '$CURRENT_BRANCH'. Solo se permite desplegar desde '$REQUIRED_BRANCH'."
    exit 1
fi

# 2. Validar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️ ADVERTENCIA: Tienes cambios locales sin guardar en Git."
    exit 1
fi

echo "🚀 Rama validada. Iniciando despliegue de '$REQUIRED_BRANCH'..."

# 3. Instalar dependencias (completas)
echo "📥 Instalando dependencias..."
npm install

# 4. Compilar localmente
echo "📦 Compilando aplicación Next.js..."
npm run build

# 5. Comprimir carpetas necesarias
echo "📦 Comprimiendo archivos para subir..."
tar -czf deploy.tar.gz .next public package.json package-lock.json node_modules

# 6. Subir al servidor
echo "🚀 Subiendo archivos al servidor..."
scp deploy.tar.gz $SERVER_ALIAS:$REMOTE_PATH/

# 7. Operaciones en servidor
echo "🔄 Desplegando en servidor remoto..."
ssh -T $SERVER_ALIAS << EOF
    set -e
    cd $REMOTE_PATH
    
    # Backup anterior
    if [ -d ".next" ]; then
        echo "💾 Creando backup..."
        tar -czf .next.backup.tar.gz .next
    fi
    
    echo "🧹 Extrayendo nuevos archivos..."
    tar -xzf deploy.tar.gz
    rm deploy.tar.gz
    
    echo "🔧 Ajustando permisos..."
    sudo chown -R www-data:www-data /var/www/offside-landing
    sudo chmod -R 755 /var/www/offside-landing
    
    # Limpiar caché de Next.js
    echo "🗑️  Limpiando caché..."
    rm -rf .next/.cache
    
    # Reiniciar PM2 (si usas PM2)
    if command -v pm2 &> /dev/null; then
        echo "🔄 Reiniciando con PM2..."
        sudo pm2 restart offside-landing || sudo pm2 start npm --name "offside-landing" -- start
    fi
    
    echo "✅ Despliegue completado exitosamente"
    echo "📊 Commit: $COMMIT_SHA - $COMMIT_MESSAGE"
EOF

# 8. Limpieza local
echo "🧹 Limpiando archivos locales temporales..."
rm deploy.tar.gz

echo "🎉 ¡Despliegue finalizado!"
