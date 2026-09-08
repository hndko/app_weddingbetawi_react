#!/usr/bin/env bash
# ==============================================================================
# MARI PARTNER - CLIENT PROVISIONING & DEPLOYMENT AUTOMATION CLI
# Versi: 1.0.0
# Deskripsi: Otomatisasi penerbitan dan pengelolaan multi-instance klien baru
#            dalam hitungan detik (Nginx + PM2 + MySQL + SSL + Shared node_modules).
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# Pewarnaan Terminal
# ------------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
RESET='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ------------------------------------------------------------------------------
# Muat Konfigurasi Server (deploy.env)
# ------------------------------------------------------------------------------
BASE_DIR="/var/www/weddings"
SOURCE_REPO_DIR="${ROOT_DIR}"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
DEFAULT_DB_HOST="127.0.0.1"
DEFAULT_DB_PORT="3306"
DEFAULT_DB_USER="root"
DEFAULT_DB_PASS=""
START_PORT=5001
WEB_USER="www-data"
WEB_GROUP="www-data"
CERTBOT_EMAIL="admin@maripartner.com"
DEFAULT_SHARED_MODULES=1

if [ -f "${SCRIPT_DIR}/deploy.env" ]; then
    # shellcheck disable=SC1091
    source "${SCRIPT_DIR}/deploy.env"
elif [ -f "/etc/wedding/deploy.env" ]; then
    # shellcheck disable=SC1091
    source "/etc/wedding/deploy.env"
fi

REGISTRY_FILE="${BASE_DIR}/clients_registry.json"

# ------------------------------------------------------------------------------
# Fungsi Utilitas & Helper
# ------------------------------------------------------------------------------
log_info() {
    echo -e "${CYAN}[INFO]${RESET} $1"
}

log_success() {
    echo -e "${GREEN}${BOLD}[SUKSES]${RESET} $1"
}

log_warn() {
    echo -e "${YELLOW}[PERINGATAN]${RESET} $1"
}

log_error() {
    echo -e "${RED}${BOLD}[GALAT]${RESET} $1" >&2
}

banner() {
    echo -e "${MAGENTA}${BOLD}"
    echo "=========================================================================="
    echo "   💍 MARI PARTNER - CLIENT PROVISIONING & DEPLOYMENT AUTOMATION CLI"
    echo "=========================================================================="
    echo -e "${RESET}"
}

check_prerequisites() {
    local missing=0
    for cmd in node npm pm2 mysql nginx openssl; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Perintah prasyarat '$cmd' tidak ditemukan. Harap instal terlebih dahulu."
            missing=1
        fi
    done

    if [ "$missing" -eq 1 ]; then
        exit 1
    fi
}

init_registry() {
    mkdir -p "${BASE_DIR}"
    if [ ! -f "${REGISTRY_FILE}" ]; then
        echo "[]" > "${REGISTRY_FILE}"
    fi
}

find_next_port() {
    local port="${START_PORT}"
    while true; do
        if ! ss -tuln 2>/dev/null | grep -q ":${port} " && ! pm2 jlist 2>/dev/null | grep -q "\"PORT\":\"${port}\""; then
            echo "$port"
            return 0
        fi
        port=$((port + 1))
        if [ "$port" -gt 5999 ]; then
            log_error "Seluruh rentang port 5001-5999 terpakai!"
            exit 1
        fi
    done
}

# ------------------------------------------------------------------------------
# Sub-Command: CREATE / PROVISION
# ------------------------------------------------------------------------------
cmd_create() {
    local slug=""
    local domain=""
    local port=""
    local db_name=""
    local db_user="${DEFAULT_DB_USER}"
    local db_pass="${DEFAULT_DB_PASS}"
    local admin_pass=""
    local enable_ssl=0
    local shared_modules="${DEFAULT_SHARED_MODULES}"
    local non_interactive=0

    # Parse Flags
    while [[ $# -gt 0 ]]; do
        case $1 in
            --slug)
                slug="$2"
                shift 2
                ;;
            --domain)
                domain="$2"
                shift 2
                ;;
            --port)
                port="$2"
                shift 2
                ;;
            --db-name)
                db_name="$2"
                shift 2
                ;;
            --db-user)
                db_user="$2"
                shift 2
                ;;
            --db-pass)
                db_pass="$2"
                shift 2
                ;;
            --admin-pass)
                admin_pass="$2"
                shift 2
                ;;
            --ssl)
                enable_ssl=1
                shift
                ;;
            --standalone)
                shared_modules=0
                shift
                ;;
            --shared-modules)
                shared_modules=1
                shift
                ;;
            --yes|-y)
                non_interactive=1
                shift
                ;;
            *)
                log_warn "Flag tidak dikenal: $1"
                shift
                ;;
        esac
    done

    # Interactive Wizard jika slug atau domain kosong
    if [ -z "$slug" ] || [ -z "$domain" ]; then
        banner
        echo -e "${BOLD}--- WIZARD DEPLOYMENT KLIEN BARU ---${RESET}\n"
        
        if [ -z "$slug" ]; then
            read -rp "1. Masukkan Slug Klien (misal: budi-ani / cecepipeh): " slug
        fi

        if [ -z "$domain" ]; then
            read -rp "2. Masukkan Subdomain/Domain (misal: budiani.maripartner.com): " domain
        fi

        if [ -z "$port" ]; then
            local auto_port
            auto_port=$(find_next_port)
            read -rp "3. Masukkan Port Internal [Default terdeteksi bebas: $auto_port]: " input_port
            port="${input_port:-$auto_port}"
        fi

        if [ -z "$db_name" ]; then
            local def_db="db_wedding_${slug//-/_}"
            read -rp "4. Masukkan Nama Database [Default: $def_db]: " input_db
            db_name="${input_db:-$def_db}"
        fi

        if [ -z "$admin_pass" ]; then
            read -rp "5. Masukkan Kata Sandi Admin Awal [Default acak 10-karakter]: " input_pass
            admin_pass="${input_pass:-}"
        fi

        if [ "$enable_ssl" -eq 0 ]; then
            read -rp "6. Pasang Sertifikat SSL Let's Encrypt Otomatis sekarang? (y/N): " input_ssl
            if [[ "$input_ssl" =~ ^[Yy]$ ]]; then
                enable_ssl=1
            fi
        fi
    fi

    # Normalisasi & Validasi Input
    slug=$(echo "$slug" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
    if [[ ! "$slug" =~ ^[a-z0-9_-]+$ ]]; then
        log_error "Slug hanya boleh berisi huruf, angka, strip (-), dan garis bawah (_)."
        exit 1
    fi

    if [ -z "$port" ]; then
        port=$(find_next_port)
    fi

    if [ -z "$db_name" ]; then
        db_name="db_wedding_${slug//-/_}"
    fi

    if [ -z "$admin_pass" ]; then
        admin_pass=$(openssl rand -base64 8 | tr -dc 'a-zA-Z0-9' | head -c 10)
    fi

    local client_dir="${BASE_DIR}/${slug}"

    # Verifikasi Duplikasi
    if [ -d "$client_dir" ]; then
        log_error "Direktori klien '${client_dir}' sudah ada! Harap gunakan slug lain."
        exit 1
    fi

    if pm2 describe "wedding-${slug}" &> /dev/null; then
        log_error "Proses PM2 'wedding-${slug}' sudah terdaftar!"
        exit 1
    fi

    # Mulai Proses Provisioning
    echo ""
    log_info "Memulai penerbitan instance klien: ${BOLD}${slug}${RESET}"
    log_info "Domain: ${CYAN}https://${domain}${RESET} | Port: ${CYAN}${port}${RESET} | DB: ${CYAN}${db_name}${RESET}"
    echo "--------------------------------------------------------------------------"

    # 1. Buat Direktori & Salin Kode Bersih
    log_info "[1/9] Menyiapkan direktori klien di ${client_dir}..."
    mkdir -p "${client_dir}"

    # Salin source files (kecualikan node_modules, dist, .git, uploads)
    rsync -a --exclude 'node_modules' \
             --exclude 'dist' \
             --exclude '.git' \
             --exclude 'server/uploads/*' \
             --exclude '.env' \
             "${SOURCE_REPO_DIR}/" "${client_dir}/"

    # 2. Pengelolaan node_modules (Shared Symlink vs Standalone)
    if [ "$shared_modules" -eq 1 ]; then
        log_info "[2/9] Menautkan shared node_modules via Symlink (Hemat ~400MB Disk)..."
        if [ ! -d "${SOURCE_REPO_DIR}/node_modules" ]; then
            log_warn "node_modules di master repo tidak ditemukan. Menjalankan npm install di master..."
            (cd "${SOURCE_REPO_DIR}" && npm install)
        fi
        ln -sf "${SOURCE_REPO_DIR}/node_modules" "${client_dir}/node_modules"
    else
        log_info "[2/9] Menginstal dependensi mandiri (npm install)..."
        (cd "${client_dir}" && npm install --production=false)
    fi

    # 3. Pembuatan Database MySQL
    log_info "[3/9] Menyiapkan database MySQL: ${db_name}..."
    local mysql_auth="-h${DEFAULT_DB_HOST} -P${DEFAULT_DB_PORT} -u${db_user}"
    if [ -n "$db_pass" ]; then
        mysql_auth="${mysql_auth} -p${db_pass}"
    fi

    # shellcheck disable=SC2086
    mysql ${mysql_auth} -e "CREATE DATABASE IF NOT EXISTS \`${db_name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

    # 4. Generasi Konfigurasi .env
    log_info "[4/9] Menggenerasi berkas .env produksi & JWT Secret acak..."
    local jwt_secret
    jwt_secret=$(openssl rand -hex 32)

    cat <<EOF > "${client_dir}/.env"
VITE_API_URL=https://${domain}
PORT=${port}
NODE_ENV=production
DB_HOST=${DEFAULT_DB_HOST}
DB_PORT=${DEFAULT_DB_PORT}
DB_USER=${db_user}
DB_PASSWORD=${db_pass}
DB_NAME=${db_name}
JWT_SECRET=${jwt_secret}
CORS_ORIGIN=https://${domain}
EOF

    # 5. Migrasi & Seeding Database
    log_info "[5/9] Menjalankan migrasi database skema & initial seed..."
    (
        cd "${client_dir}"
        npx tsx server/src/db/migrate.ts
        npx tsx server/src/db/seed.ts
    )

    # Ubah kata sandi admin jika ditentukan khusus
    if [ "$admin_pass" != "password" ]; then
        log_info "Mengatur kata sandi kustom akun admin..."
        local hashed_pass
        hashed_pass=$(node -e "const b = require('bcryptjs'); console.log(b.hashSync('${admin_pass}', 10));")
        # shellcheck disable=SC2086
        mysql ${mysql_auth} -e "UPDATE \`${db_name}\`.\`users\` SET \`password\` = '${hashed_pass}' WHERE \`username\` = 'superadmin';"
    fi

    # 6. Kompilasi Frontend React SPA
    log_info "[6/9] Mengompilasi frontend React SPA (Vite Build)..."
    (
        cd "${client_dir}"
        npx vite build
    )

    # 7. Penyiapan Izin Akses Direktori Uploads
    log_info "[7/9] Menyiapkan hak akses folder uploads..."
    mkdir -p "${client_dir}/server/uploads"
    chmod -R 775 "${client_dir}/server/uploads"
    if id "${WEB_USER}" &>/dev/null; then
        chown -R "${WEB_USER}:${WEB_GROUP}" "${client_dir}"
    fi

    # 8. Mendaftarkan Service ke PM2
    log_info "[8/9] Menjalankan backend Express ke PM2 daemon..."
    (
        cd "${client_dir}"
        pm2 start "npx tsx server/src/index.ts" --name "wedding-${slug}" --time
        pm2 save
    )

    # 9. Konfigurasi Nginx Server Block
    log_info "[9/9] Mengonfigurasi Nginx Virtual Host..."
    local nginx_conf="${NGINX_AVAILABLE}/wedding-${slug}.conf"
    local nginx_template="${SCRIPT_DIR}/templates/nginx.conf.template"

    if [ ! -f "$nginx_template" ]; then
        log_error "Berkas template Nginx tidak ditemukan di ${nginx_template}"
        exit 1
    fi

    sed -e "s|{{DOMAIN}}|${domain}|g" \
        -e "s|{{CLIENT_DIR}}|${client_dir}|g" \
        -e "s|{{PORT}}|${port}|g" \
        -e "s|{{SLUG}}|${slug}|g" \
        "${nginx_template}" > "${nginx_conf}"

    ln -sf "${nginx_conf}" "${NGINX_ENABLED}/wedding-${slug}.conf"

    if nginx -t 2>/dev/null; then
        systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true
        log_success "Nginx berhasil dimuat ulang."
    else
        log_warn "Uji sintaks Nginx gagal! Periksa ${nginx_conf} secara manual."
    fi

    # Pemasangan SSL Certbot (Opsional)
    if [ "$enable_ssl" -eq 1 ]; then
        log_info "Menerbitkan sertifikat SSL Let's Encrypt Certbot..."
        certbot --nginx -d "${domain}" --non-interactive --agree-tos --email "${CERTBOT_EMAIL}" --redirect || log_warn "Certbot gagal. Terbitkan SSL manual nanti."
    fi

    # Catat ke Registry JSON
    init_registry
    local now
    now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    node -e "
        const fs = require('fs');
        const reg = JSON.parse(fs.readFileSync('${REGISTRY_FILE}', 'utf8'));
        reg.push({
            slug: '${slug}',
            domain: '${domain}',
            port: ${port},
            db_name: '${db_name}',
            status: 'active',
            admin_user: 'superadmin',
            admin_pass: '${admin_pass}',
            created_at: '${now}'
        });
        fs.writeFileSync('${REGISTRY_FILE}', JSON.stringify(reg, null, 2));
    "

    # Ringkasan Sukses
    echo ""
    echo -e "${GREEN}${BOLD}==========================================================================${RESET}"
    echo -e "${GREEN}${BOLD}   🎉 INSTANCE KLIEN BERHASIL DITERBITKAN DALAM HITUNGAN DETIK!           ${RESET}"
    echo -e "${GREEN}${BOLD}==========================================================================${RESET}"
    echo -e "   🔗 URL Undangan     : ${CYAN}https://${domain}${RESET}"
    echo -e "   🔐 URL Admin Panel  : ${CYAN}https://${domain}/login${RESET}"
    echo -e "   👤 Akun Admin       : ${BOLD}superadmin${RESET}"
    echo -e "   🔑 Kata Sandi       : ${BOLD}${admin_pass}${RESET}"
    echo -e "   ⚡ Port Backend     : ${BOLD}${port}${RESET}"
    echo -e "   💾 Database MySQL   : ${BOLD}${db_name}${RESET}"
    echo -e "   ⚙️  PM2 Service      : ${BOLD}wedding-${slug}${RESET}"
    echo -e "   📂 Folder Instance  : ${BOLD}${client_dir}${RESET}"
    echo -e "${GREEN}==========================================================================${RESET}"
    echo -e "${YELLOW}Perintah Pemeliharaan Cepat:${RESET}"
    echo -e " • Log Realtime : ${BOLD}pm2 logs wedding-${slug}${RESET}"
    echo -e " • Restart      : ${BOLD}pm2 restart wedding-${slug}${RESET}"
    echo -e " • Freeze H+7   : ${BOLD}./scripts/deploy-client.sh freeze ${slug}${RESET}"
    echo -e " • Backup Data  : ${BOLD}./scripts/deploy-client.sh backup ${slug}${RESET}"
    echo ""
}

# ------------------------------------------------------------------------------
# Sub-Command: LIST
# ------------------------------------------------------------------------------
cmd_list() {
    init_registry
    banner
    echo -e "${BOLD}DAFTAR SELURUH INSTANCE KLIEN AKTIF${RESET}\n"

    if [ ! -s "${REGISTRY_FILE}" ] || [ "$(cat "${REGISTRY_FILE}")" = "[]" ]; then
        echo -e "${YELLOW}Belum ada instance klien yang terdaftar di registry.${RESET}"
        return 0
    fi

    printf "%-18s %-7s %-10s %-32s %-12s\n" "SLUG" "PORT" "STATUS" "DOMAIN" "DIBUAT"
    echo "--------------------------------------------------------------------------------"

    node -e "
        const fs = require('fs');
        const reg = JSON.parse(fs.readFileSync('${REGISTRY_FILE}', 'utf8'));
        reg.forEach(c => {
            const date = c.created_at ? c.created_at.substring(0, 10) : '-';
            console.log(
                c.slug.padEnd(18) + ' ' +
                String(c.port).padEnd(7) + ' ' +
                c.status.padEnd(10) + ' ' +
                c.domain.padEnd(32) + ' ' +
                date.padEnd(12)
            );
        });
    "
    echo ""
}

# ------------------------------------------------------------------------------
# Sub-Command: FREEZE (Hemat 70MB RAM Pasca-Resepsi)
# ------------------------------------------------------------------------------
cmd_freeze() {
    local slug="${1:-}"
    if [ -z "$slug" ]; then
        log_error "Gunakan: $0 freeze <slug-klien>"
        exit 1
    fi

    local client_dir="${BASE_DIR}/${slug}"
    if [ ! -d "$client_dir" ]; then
        log_error "Direktori klien '${client_dir}' tidak ditemukan!"
        exit 1
    fi

    log_info "Membekukan instance: ${BOLD}${slug}${RESET} (Freeze Mode)..."

    # 1. Hentikan PM2
    if pm2 describe "wedding-${slug}" &>/dev/null; then
        pm2 stop "wedding-${slug}"
        log_success "Service PM2 'wedding-${slug}' berhasil dimatikan (70MB RAM dibebaskan)."
    fi

    # 2. Ganti Nginx ke Frozen Template (Statis murni)
    local nginx_conf="${NGINX_AVAILABLE}/wedding-${slug}.conf"
    local frozen_template="${SCRIPT_DIR}/templates/nginx-frozen.conf.template"

    if [ -f "$frozen_template" ] && [ -f "$nginx_conf" ]; then
        local domain
        domain=$(grep -m1 "server_name" "$nginx_conf" | awk '{print $2}' | tr -d ';')
        sed -e "s|{{DOMAIN}}|${domain}|g" \
            -e "s|{{CLIENT_DIR}}|${client_dir}|g" \
            -e "s|{{SLUG}}|${slug}|g" \
            "${frozen_template}" > "${nginx_conf}"

        if nginx -t 2>/dev/null; then
            systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true
            log_success "Nginx dialihkan ke mode arsip statis (web tetap buka, beban 0% CPU/RAM)."
        fi
    fi

    # Update Registry
    node -e "
        const fs = require('fs');
        if (fs.existsSync('${REGISTRY_FILE}')) {
            const reg = JSON.parse(fs.readFileSync('${REGISTRY_FILE}', 'utf8'));
            const c = reg.find(x => x.slug === '${slug}');
            if (c) c.status = 'frozen';
            fs.writeFileSync('${REGISTRY_FILE}', JSON.stringify(reg, null, 2));
        }
    "

    log_success "Instance '${slug}' kini dalam mode FROZEN."
}

# ------------------------------------------------------------------------------
# Sub-Command: RESUME
# ------------------------------------------------------------------------------
cmd_resume() {
    local slug="${1:-}"
    if [ -z "$slug" ]; then
        log_error "Gunakan: $0 resume <slug-klien>"
        exit 1
    fi

    local client_dir="${BASE_DIR}/${slug}"
    if [ ! -d "$client_dir" ]; then
        log_error "Direktori klien '${client_dir}' tidak ditemukan!"
        exit 1
    fi

    log_info "Mengaktifkan kembali instance: ${BOLD}${slug}${RESET}..."

    # Baca Port dan Domain dari .env
    local port
    port=$(grep "^PORT=" "${client_dir}/.env" | cut -d'=' -f2)
    local domain
    domain=$(grep "^VITE_API_URL=" "${client_dir}/.env" | cut -d'=' -f2 | sed 's|https://||' | sed 's|http://||')

    # 1. Hidupkan PM2
    pm2 restart "wedding-${slug}" || (
        cd "${client_dir}"
        pm2 start "npx tsx server/src/index.ts" --name "wedding-${slug}" --time
    )
    pm2 save

    # 2. Kembalikan Nginx ke Template Dinamis
    local nginx_conf="${NGINX_AVAILABLE}/wedding-${slug}.conf"
    local nginx_template="${SCRIPT_DIR}/templates/nginx.conf.template"

    sed -e "s|{{DOMAIN}}|${domain}|g" \
        -e "s|{{CLIENT_DIR}}|${client_dir}|g" \
        -e "s|{{PORT}}|${port}|g" \
        -e "s|{{SLUG}}|${slug}|g" \
        "${nginx_template}" > "${nginx_conf}"

    if nginx -t 2>/dev/null; then
        systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true
    fi

    # Update Registry
    node -e "
        const fs = require('fs');
        if (fs.existsSync('${REGISTRY_FILE}')) {
            const reg = JSON.parse(fs.readFileSync('${REGISTRY_FILE}', 'utf8'));
            const c = reg.find(x => x.slug === '${slug}');
            if (c) c.status = 'active';
            fs.writeFileSync('${REGISTRY_FILE}', JSON.stringify(reg, null, 2));
        }
    "

    log_success "Instance '${slug}' berhasil diaktifkan kembali penuh!"
}

# ------------------------------------------------------------------------------
# Sub-Command: BACKUP
# ------------------------------------------------------------------------------
cmd_backup() {
    local slug="${1:-}"
    if [ -z "$slug" ]; then
        log_error "Gunakan: $0 backup <slug-klien>"
        exit 1
    fi

    local client_dir="${BASE_DIR}/${slug}"
    if [ ! -d "$client_dir" ]; then
        log_error "Direktori klien '${client_dir}' tidak ditemukan!"
        exit 1
    fi

    local backup_dir="${BASE_DIR}/backups"
    mkdir -p "${backup_dir}"

    local timestamp
    timestamp=$(date +"%Y%m%d_%H%M%S")
    local db_name
    db_name=$(grep "^DB_NAME=" "${client_dir}/.env" | cut -d'=' -f2)

    log_info "Membuat backup untuk instance '${slug}'..."

    # Dump Database
    local dump_file="${backup_dir}/${slug}_db_${timestamp}.sql"
    local mysql_auth="-h${DEFAULT_DB_HOST} -P${DEFAULT_DB_PORT} -u${DEFAULT_DB_USER}"
    if [ -n "${DEFAULT_DB_PASS}" ]; then
        mysql_auth="${mysql_auth} -p${DEFAULT_DB_PASS}"
    fi

    # shellcheck disable=SC2086
    mysqldump ${mysql_auth} "${db_name}" > "${dump_file}" 2>/dev/null || log_warn "Gagal dump MySQL langsung, periksa kredensial."

    # Tar Uploads dan SQL dump
    local archive_file="${backup_dir}/backup_${slug}_${timestamp}.tar.gz"
    tar -czf "${archive_file}" -C "${client_dir}" server/uploads -C "${backup_dir}" "$(basename "${dump_file}")" 2>/dev/null || true
    rm -f "${dump_file}"

    log_success "Backup selesai: ${BOLD}${archive_file}${RESET}"
    du -h "${archive_file}"
}

# ------------------------------------------------------------------------------
# Sub-Command: DELETE
# ------------------------------------------------------------------------------
cmd_delete() {
    local slug="${1:-}"
    local force=0

    if [[ "${2:-}" == "--force" || "${2:-}" == "-f" ]]; then
        force=1
    fi

    if [ -z "$slug" ]; then
        log_error "Gunakan: $0 delete <slug-klien> [--force]"
        exit 1
    fi

    local client_dir="${BASE_DIR}/${slug}"
    if [ ! -d "$client_dir" ]; then
        log_error "Direktori klien '${client_dir}' tidak ditemukan!"
        exit 1
    fi

    if [ "$force" -eq 0 ]; then
        echo -e "${RED}${BOLD}PERINGATAN! Anda akan menghapus instance klien '${slug}' secara permanen!${RESET}"
        read -rp "Ketik 'HAPUS' untuk mengonfirmasi: " confirm
        if [ "$confirm" != "HAPUS" ]; then
            log_warn "Penghapusan dibatalkan."
            exit 0
        fi
    fi

    # Backup otomatis sebelum hapus
    cmd_backup "$slug" || true

    log_info "Menghapus service PM2..."
    pm2 delete "wedding-${slug}" 2>/dev/null || true
    pm2 save

    log_info "Menghapus konfigurasi Nginx..."
    rm -f "${NGINX_AVAILABLE}/wedding-${slug}.conf" "${NGINX_ENABLED}/wedding-${slug}.conf"
    nginx -t 2>/dev/null && (systemctl reload nginx 2>/dev/null || nginx -s reload 2>/dev/null || true)

    log_info "Menghapus database MySQL..."
    local db_name
    db_name=$(grep "^DB_NAME=" "${client_dir}/.env" 2>/dev/null | cut -d'=' -f2 || echo "")
    if [ -n "$db_name" ]; then
        local mysql_auth="-h${DEFAULT_DB_HOST} -P${DEFAULT_DB_PORT} -u${DEFAULT_DB_USER}"
        if [ -n "${DEFAULT_DB_PASS}" ]; then
            mysql_auth="${mysql_auth} -p${DEFAULT_DB_PASS}"
        fi
        # shellcheck disable=SC2086
        mysql ${mysql_auth} -e "DROP DATABASE IF EXISTS \`${db_name}\`;" 2>/dev/null || true
    fi

    log_info "Menghapus direktori fisik..."
    rm -rf "${client_dir}"

    # Hapus dari registry
    node -e "
        const fs = require('fs');
        if (fs.existsSync('${REGISTRY_FILE}')) {
            let reg = JSON.parse(fs.readFileSync('${REGISTRY_FILE}', 'utf8'));
            reg = reg.filter(x => x.slug !== '${slug}');
            fs.writeFileSync('${REGISTRY_FILE}', JSON.stringify(reg, null, 2));
        }
    "

    log_success "Instance '${slug}' berhasil dibersihkan secara total."
}

# ------------------------------------------------------------------------------
# Sub-Command: HELP
# ------------------------------------------------------------------------------
cmd_help() {
    banner
    echo -e "${BOLD}PANDUAN PENGGUNAAN CLI DEPLOYMENT KLIEN:${RESET}"
    echo ""
    echo "1. Mode Interaktif (Wizard):"
    echo "   ./scripts/deploy-client.sh create"
    echo ""
    echo "2. Mode Cepat 1 Baris Perintah (Flag):"
    echo "   ./scripts/deploy-client.sh create --slug budi-ani --domain budiani.maripartner.com --ssl"
    echo ""
    echo "3. Parameter Flag Lengkap untuk 'create':"
    echo "   --slug <nama>          : Identitas unik klien (huruf kecil, angka, strip)"
    echo "   --domain <domain>      : Subdomain/domain resmi undangan"
    echo "   --port <nomor>         : Port backend khusus (otomatis mendeteksi port kosong)"
    echo "   --db-name <nama>       : Nama database (default: db_wedding_<slug>)"
    echo "   --admin-pass <sandi>   : Sandi awal akun superadmin (default: acak 10 char)"
    echo "   --ssl                  : Menerbitkan sertifikat SSL Let's Encrypt Certbot"
    echo "   --standalone           : Instal node_modules mandiri (bukan symlink)"
    echo "   --yes, -y              : Mode non-interaktif tanpa konfirmasi prompt"
    echo ""
    echo "4. Perintah Manajemen Klien Lainnya:"
    echo "   ./scripts/deploy-client.sh list             : Lihat seluruh instance klien & port"
    echo "   ./scripts/deploy-client.sh freeze <slug>    : Bekukan instance pasca-resepsi (hemat 70MB RAM)"
    echo "   ./scripts/deploy-client.sh resume <slug>    : Aktifkan kembali instance yang dibekukan"
    echo "   ./scripts/deploy-client.sh backup <slug>    : Backup database & foto unggahan klien"
    echo "   ./scripts/deploy-client.sh delete <slug>    : Hapus instance klien secara permanen"
    echo ""
}

# ------------------------------------------------------------------------------
# Router Perintah Utama
# ------------------------------------------------------------------------------
case "${1:-help}" in
    create|provision)
        check_prerequisites
        shift
        cmd_create "$@"
        ;;
    list|ls)
        cmd_list
        ;;
    freeze)
        shift
        cmd_freeze "$@"
        ;;
    resume)
        shift
        cmd_resume "$@"
        ;;
    backup)
        shift
        cmd_backup "$@"
        ;;
    delete|rm)
        shift
        cmd_delete "$@"
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        log_error "Perintah '${1:-}' tidak dikenali."
        cmd_help
        exit 1
        ;;
esac
