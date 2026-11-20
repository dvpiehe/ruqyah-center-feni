# Ruqyah Support & Cupping Center - Hostinger Deployment Guide

This guide explains how to deploy this complete Node.js application to **Hostinger** (hPanel Shared/Cloud Hosting or Hostinger VPS).

---

## What is in this Deployment Package?

This package is pre-configured and production-ready:
- **Application Core:** `server.js`, `package.json`, `config/`, `lang/`, `middleware/`, `routes/`, `utils/`, `views/`, `public/`.
- **Database:** `database/ruqyah.db` contains the fully migrated SQLite database with all 10 symptom categories, symptoms, patient records, settings, and appointments.
- **Node Modules Excluded:** As per standard deployment best practices, `node_modules` is excluded from this zip file because binaries compiled on Windows must be installed natively on Hostinger's Linux servers.

---

## Method 1: Hostinger Web Hosting / Cloud Hosting (hPanel Node.js)

Hostinger Business Web Hosting, Cloud Hosting, and newer cPanel plans support Node.js applications directly from the control panel.

### Step 1: Upload the Files
1. Log in to your **Hostinger Control Panel (hPanel)**.
2. Go to **Websites** -> click **Manage** on your domain.
3. Open **Files** -> **File Manager** (Access files of your website).
4. Navigate to your website root directory: `public_html` (or create a subfolder if using a subdomain).
5. Click the **Upload** icon at the top right, select `ruqyah-center-feni-hostinger-deploy.zip`, and upload it.
6. Right-click the uploaded `.zip` file and select **Extract**. Extract all files into your `public_html` directory.
7. You may delete the `.zip` file after extracting.

### Step 2: Set Up the Node.js Application in hPanel
1. In hPanel, use the left search bar or find **Advanced** / **Hosting** -> **Node.js**.
2. Click **Create Application** (or manage existing):
   - **Node.js version:** Select `v18.x`, `v20.x`, or `v22.x` (Recommended: `20.x` or `22.x`).
   - **Application mode:** `Production`
   - **Application root:** `public_html` (or your extracted folder path).
   - **Application startup file:** `server.js`
   - **Application URL:** Select your domain (e.g., `https://yourdomain.com`).
3. Click **Create** or **Save**.

### Step 3: Install Dependencies (NPM Install)
1. Once the application is created, scroll to the **NPM packages** section.
2. Click the **"NPM Install"** or **"Install Dependencies"** button.
   - Hostinger will read `package.json` and install all required packages (`express`, `better-sqlite3`, `bcryptjs`, `cookie-parser`, `cors`, `jsonwebtoken`) compiled specifically for Hostinger's Linux OS.
3. If using Terminal in hPanel, you can alternatively run:
   ```bash
   cd public_html
   npm install --production
   ```

### Step 4: Start / Restart the Application
1. Click **"Run"** / **"Start Application"** (or **"Restart"** if already started).
2. Visit your domain in your browser!
   - Homepage: `https://yourdomain.com/`
   - Online Booking: `https://yourdomain.com/book`
   - Admin Panel: `https://yourdomain.com/admin`
   - Default Admin Credentials: `admin` / `Admin@12345`

---

## Method 2: Hostinger VPS (Ubuntu / Debian / AlmaLinux)

If you have a Hostinger VPS with SSH access:

### Step 1: Connect via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Ensure Node.js & PM2 are installed
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential

# Install PM2 process manager
sudo npm install -g pm2
```

### Step 3: Upload and Extract Application
```bash
mkdir -p /var/www/ruqyah-center
cd /var/www/ruqyah-center
# Upload ruqyah-center-feni-hostinger-deploy.zip via SCP or SFTP, then:
unzip ruqyah-center-feni-hostinger-deploy.zip
```

### Step 4: Install Dependencies & Start
```bash
npm install --production

# Start application with PM2
pm2 start server.js --name "ruqyah-center"
pm2 save
pm2 startup
```

### Step 5: Nginx Reverse Proxy (Sample)
Add this to `/etc/nginx/sites-available/yourdomain.com`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Security & Maintenance Tips
- Change the default admin password immediately upon first login at `/admin` -> **Settings** -> **Change Password**.
- The SQLite database file is located at `database/ruqyah.db`.
- Daily automatic backups can be downloaded directly from the Admin Panel under **Settings** -> **Export JSON Backup**.
