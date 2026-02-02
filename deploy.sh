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
# if [ -n "$(git status --porcelain)" ]; then
#     echo "⚠️ ADVERTENCIA: Tienes cambios locales sin guardar en Git."
#     exit 1
# fi

echo "🚀 Rama validada. Iniciando despliegue de '$REQUIRED_BRANCH'..."

# 3. Limpiar build anterior para evitar problemas de permisos
echo "🧹 Limpiando build anterior..."
rm -rf .next

# 4. Instalar dependencias (completas)
echo "📥 Instalando dependencias..."
npm install

# 5. Compilar localmente
echo "📦 Compilando aplicación Next.js..."
npm run build

# 6. Comprimir carpetas necesarias
echo "📦 Comprimiendo archivos para subir..."
echo "  - Comprimiendo código compilado..."
tar -czf deploy-app.tar.gz .next public package.json package-lock.json

echo "  - Comprimiendo dependencias (esto puede tardar)..."
tar -czf deploy-modules.tar.gz node_modules

# 7. Subir al servidor a directorio temporal
echo "🚀 Subiendo archivos al servidor..."
echo "  - Subiendo código compilado..."
scp deploy-app.tar.gz $SERVER_ALIAS:/tmp/
echo "  - Subiendo dependencias..."
scp deploy-modules.tar.gz $SERVER_ALIAS:/tmp/

# 7. Operaciones en servidor
echo "🔄 Desplegando en servidor remoto..."
ssh -T $SERVER_ALIAS << EOF
    set -e
    cd $REMOTE_PATH
    
    # Backup anterior
    if [ -d ".next" ]; then
        echo "💾 Creando backup..."
        sudo tar -czf .next.backup.tar.gz .next 2>/dev/null || true
    fi
    
    echo "🧹 Extrayendo nuevos archivos..."
    # Cambiar a /tmp para extraer con permisos correctos
    cd /tmp
    tar -xzf /tmp/deploy-app.tar.gz
    tar -xzf /tmp/deploy-modules.tar.gz
    
    # Limpiar carpetas del servidor
    sudo rm -rf $REMOTE_PATH/.next $REMOTE_PATH/public $REMOTE_PATH/node_modules
    
    # Copiar los archivos extraídos al servidor
    sudo mv /tmp/.next $REMOTE_PATH/
    sudo mv /tmp/public $REMOTE_PATH/
    sudo mv /tmp/node_modules $REMOTE_PATH/
    sudo mv /tmp/package.json $REMOTE_PATH/
    sudo mv /tmp/package-lock.json $REMOTE_PATH/
    
    rm /tmp/deploy-app.tar.gz /tmp/deploy-modules.tar.gz
    
    echo "🔧 Ajustando permisos..."
    sudo chown -R www-data:www-data $REMOTE_PATH
    # Directorios: 755, Archivos: 644
    sudo find $REMOTE_PATH -type d -exec chmod 755 {} \;
    sudo find $REMOTE_PATH -type f -exec chmod 644 {} \;
    # Asegurar permisos de ejecución para directorios .next y binarios
    sudo chmod -R 755 $REMOTE_PATH/.next
    sudo chmod +x $REMOTE_PATH/node_modules/.bin/*
    sudo chmod +x $REMOTE_PATH/node_modules/next/dist/bin/next 2>/dev/null || true
    
    # Limpiar caché de Next.js
    echo "🗑️  Limpiando caché..."
    rm -rf .next/.cache
    
    # Reiniciar PM2 (si usas PM2)
    if command -v pm2 &> /dev/null; then
        echo "🔄 Reiniciando con PM2..."
        sudo pm2 restart next-app || sudo pm2 start npm --name "next-app" -- start -- -p 3000
    fi
    
    echo "✅ Despliegue completado exitosamente"
    echo "📊 Commit: $COMMIT_SHA - $COMMIT_MESSAGE"
EOF

# 8. Limpieza local
echo "🧹 Limpiando archivos locales temporales..."
rm deploy-app.tar.gz deploy-modules.tar.gz

echo "🎉 ¡Despliegue finalizado!"
