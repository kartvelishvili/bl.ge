// Hostinger Node.js startup file for Next.js standalone mode
// 
// SETUP (run once via SSH after Git deployment):
//   npm install --production
//   npm run build  
//   cp -r public .next/standalone/public
//   cp -r .next/static .next/standalone/.next/static
//   cp .env.production .next/standalone/.env.production
//
// Then set this as the startup file in hPanel, or run:
//   node server.js

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const standaloneDir = path.join(__dirname, ".next", "standalone");
const standaloneServer = path.join(standaloneDir, "server.js");

// Check if build exists
if (!fs.existsSync(standaloneServer)) {
  console.log("Build not found. Running build...");
  execSync("npm install --production", { stdio: "inherit", cwd: __dirname });
  execSync("npm run build", { stdio: "inherit", cwd: __dirname });
}

// Copy static assets if not already done
const publicDest = path.join(standaloneDir, "public");
const staticDest = path.join(standaloneDir, ".next", "static");

if (!fs.existsSync(publicDest)) {
  console.log("Copying public/ to standalone...");
  fs.cpSync(path.join(__dirname, "public"), publicDest, { recursive: true });
}

if (!fs.existsSync(staticDest)) {
  console.log("Copying .next/static/ to standalone...");
  fs.cpSync(path.join(__dirname, ".next", "static"), staticDest, { recursive: true });
}

// Copy .env.production if not there
const envSrc = path.join(__dirname, ".env.production");
const envDest = path.join(standaloneDir, ".env.production");
if (fs.existsSync(envSrc) && !fs.existsSync(envDest)) {
  fs.copyFileSync(envSrc, envDest);
}

// Set port and hostname
process.env.PORT = process.env.PORT || "3000";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

// Start the Next.js standalone server
console.log(`Starting Next.js on port ${process.env.PORT}...`);
require(standaloneServer);
