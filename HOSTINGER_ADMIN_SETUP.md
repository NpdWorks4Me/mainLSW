Hostinger Admin Subdomain Setup
==============================

Goal
----
This document explains how to host your static admin SPA (already built as `/public_html/admin/index.html` in this repo) under `admin.littlespaceworld.com` on Hostinger shared hosting. The key actions are:

- Ensure `public_html/admin/` contains a static admin SPA with `index.html` and `.htaccess` (already in the repo).
- Set the subdomain Document Root to `public_html/admin` via hPanel Subdomains (or create the subdomain with that root) so the subdomain serves the admin bundle.

Quick steps (Hostinger hPanel)
-----------------------------
1. Log in to Hostinger and open hPanel.
2. Go to Websites → Subdomains.
3. Find or create the `admin` subdomain for your site (e.g., admin.littlespaceworld.com).
4. When creating or editing the subdomain, set the Document Root to: `public_html/admin`
   - If a Document Root field isn't editable, remove and re-create the subdomain while setting the Document Root during creation.
5. Save changes, clear any Hostinger cache or CDN if enabled, and wait a minute for propagation.

Alternatively: If subdomains in hPanel are forced to a specific home folder for your Hostinger plan, you can keep the admin bundle under that subdomain root and upload the admin build files into wherever the subdomain's Document Root is configured.

Deploy the admin build
----------------------
- The built admin SPA location in this repo: `public_html/admin/`
- Recommended ways to push the admin build to Hostinger:
  1. SFTP upload (File Manager/FTP client): Upload `public_html/admin/*` to Hostinger's `public_html/admin/`.
  2. `rsync` via SSH (if you have SSH); use the repo's helper script.

Automated upload (rsync)
------------------------

Example: upload locally built admin bundle into Hostinger `public_html/admin/` with rsync:

```bash
# From the repo root, after building the admin bundle:
export RSYNC_USER="<your-ssh-user>"
export RSYNC_HOST="<your-hostinger-host>"
# On Hostinger shared hosting, document roots are often under the domain-specific folder:
# domains/<domain>/public_html/admin
export RSYNC_DEST="domains/littlespaceworld.com/public_html/admin"
# Upload
rsync -avz --delete public_html/admin/ "$RSYNC_USER@$RSYNC_HOST:$RSYNC_DEST/"
```

Note: If you use FTP (no SSH), use an SFTP client like FileZilla or Hostinger's file manager to upload the files.

Validate the subdomain
----------------------
After deployment (and Document Root update), verify the subdomain is serving the admin SPA.

Run (local terminal):

```bash
NOTE: This doc is deprecated — the Next.js admin app and its subdomain have been removed from the repository.

If you need to host a separate admin UI in the future, create a dedicated admin repository and follow Hostinger docs for deploying a static site or Next.js app. Keep admin deployment and secrets separate from the main site repository.

- List your main directories (don't run the previous combined command string; separate them correctly):

```bash
# show root files
ls -la ~
# show public_html and the admin folder contained within
ls -la ~/public_html
# show public_html admin content
ls -la ~/public_html/admin
Common shell mistake: chaining commands incorrectly
------------------------------------------------
When copying commands from tutorials or chats, double-check you didn't accidentally paste multiple commands with no separators. For example, this incorrect command:

```bash
ls -la ls -la public_html/admin du -sh admin public_html/admin
```

The shell treats `ls` as a filename to list, producing `No such file or directory` error messages. Use separate commands on new lines or separate them with `;` or `&&`:

```bash
ls -la ~; ls -la ~/public_html; ls -la ~/public_html/admin
du -sh ~/admin ~/public_html/admin
```

``` 

- Get folder sizes and permissions:

```bash
du -sh ~/admin ~/public_html/admin 2>/dev/null || true
ls -ld ~/admin ~/public_html/admin 2>/dev/null || true

Also, check for nested copies (common when a whole `public_html` directory gets uploaded inside itself). This often explains why `public_html/admin` doesn't exist even though there are admin files:

```bash
# find any folder named 'admin' under your home directory (depth 4 to reduce noise)
find ~ -type d -name admin -mindepth 1 -maxdepth 4 -print

# find deep copies of public_html (search for public_html/public_html/admin)
find ~/public_html -type d -name admin -path '*/public_html/admin' -print

# find domains folder layout (Hostinger common layout) and check for admin folders
find ~/domains -maxdepth 2 -type d -name admin -print -exec ls -ld {} \; -exec du -sh {} + 2>/dev/null || true

# example that prints both folder and size in KB
find ~ -type d -name admin -exec du -sh {} +
```
``` 

- Validate which environment the site serves from (should be `public_html/admin`). If `test-ok.html` is served from the subdomain but a `test-ok` file placed in `~/admin` is not accessible, the Document Root is `public_html` and it's safe to proceed.

Safe backup -> rename -> (optional) delete flow
---------------------------------------------
1. Backup or rename the root-level `admin` folder prior to permanent deletion. Use `tar` or just rename it so you can revert the change:

```bash
# create a compressed backup in your home directory (safe and non-destructive)
cd ~
tar -czf admin.BACKUP.$(date +%Y%m%d-%H%M).tgz ./admin || echo "no root admin folder found"
# alternatively rename it instead of deleting so the server won't serve it
mv ./admin ./admin_OLD_$(date +%Y%m%d-%H%M) || echo "no root admin folder found"
```

2. If you want to immediately test the Document Root after renaming, place a `test-ok.html` in `public_html/admin` and curl it:

```bash
echo ok > ~/public_html/admin/test-ok.html
curl -I https://admin.littlespaceworld.com/test-ok.html

Test the domain-level admin folder in the (Hostinger) domain-specific layout as well:

```bash
# write a unique test page into the domain admin
echo "root admin" > ~/domains/littlespaceworld.com/admin/admin-test-root.html
# write a unique test page into the public_html admin
echo "public admin" > ~/domains/littlespaceworld.com/public_html/admin/admin-test-public.html

# test which one is served
curl -I https://admin.littlespaceworld.com/admin-test-root.html
curl -I https://admin.littlespaceworld.com/admin-test-public.html
```

If the subdomain serves `admin-test-public.html` (200), Document Root points to `public_html/admin`. If it serves `admin-test-root.html`, Document Root is pointing to `domains/<domain>/admin` which is unusual; update hPanel to `public_html/admin` and/or move content to `public_html/admin`.
```

3. If `test-ok.html` returns `200 OK` and `~/admin` has been moved/renamed, you can delete the old `admin` folder at the host if desired (do this only after verifying everything works and the backup is taken):

```bash
# delete — only if you've backed up and confirmed everything works
rm -rf ~/admin_OLD_*
```

Scripted helper (optional)
--------------------------
If you'd like, run this command to locate admin folders first. Then run our helper script to backup/rename/delete the top-level admin folder if present.

```bash
# guard: find any admin dir under home and report
find ~ -type d -name admin -exec ls -ld {} \; -exec du -sh {} + 2>/dev/null || true

# run the helper safely in the home folder (this script inspects ~ and public_html by default)
./scripts/cleanup-admin-duplicate.sh --inspect
```
The repo contains a safe, idempotent helper `scripts/cleanup-admin-duplicate.sh` to inspect, backup and optionally rename or delete a root-level `admin` folder. The script is non-destructive by default: it only prints progression and issues until you pass `--delete` to actually remove files.

Example usage:

```bash
# dry-run inspections only
./scripts/cleanup-admin-duplicate.sh --inspect

# backup and rename the root admin to admin_OLD_TIMESTAMP
./scripts/cleanup-admin-duplicate.sh --backup

# backup and delete the root admin (destructive, needs explicit --delete)
./scripts/cleanup-admin-duplicate.sh --backup --delete
```

If you'd like me to add more automated verification or a GitHub Action, tell me which permissions you have (SFTP or SSH) and I will include a preflight verification step in the deploy workflow.

