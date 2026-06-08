#!/usr/bin/env node
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function buildProject() {
  try {
    console.log("🏗️  Building ADR Shield Project...\n");

    console.log("📦 Building Frontend...");
    await execAsync("cd adr-shield && npm run build", { stdio: "inherit" });
    console.log("✅ Frontend built successfully!\n");

    console.log("📦 Building Backend...");
    await execAsync("cd api-server && npm run build", { stdio: "inherit" });
    console.log("✅ Backend built successfully!\n");

    console.log("🎉 Build completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildProject();
