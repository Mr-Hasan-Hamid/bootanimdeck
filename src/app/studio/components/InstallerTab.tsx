"use client";

export function InstallerTab() {
  const downloadInstallerScript = (os: "windows" | "unix") => {
    let content = "";
    let filename = "";

    if (os === "windows") {
      filename = "install_bootanimation.bat";
      content = `@echo off\r\n` +
        `echo ==================================================\r\n` +
        `echo       Android Boot Animation Auto-Installer\r\n` +
        `echo ==================================================\r\n` +
        `echo Make sure your phone is connected with USB Debugging enabled.\r\n` +
        `echo Press any key to start installer...\r\n` +
        `pause > nul\r\n\r\n` +
        `echo Checking for connected device...\r\n` +
        `adb devices\r\n\r\n` +
        `echo Requesting root permissions...\r\n` +
        `adb root\r\n` +
        `adb remount\r\n\r\n` +
        `echo Backing up old bootanimation to /system/media/bootanimation.zip.bak...\r\n` +
        `adb shell mv /system/media/bootanimation.zip /system/media/bootanimation.zip.bak\r\n\r\n` +
        `echo Copying new bootanimation.zip...\r\n` +
        `adb push bootanimation.zip /system/media/bootanimation.zip\r\n\r\n` +
        `echo Setting correct file permissions (644 rw-r--r--)...\r\n` +
        `adb shell chmod 644 /system/media/bootanimation.zip\r\n\r\n` +
        `echo Installation complete! Rebooting device to test...\r\n` +
        `adb reboot\r\n` +
        `echo Done. Press any key to exit.\r\n` +
        `pause > nul\r\n`;
    } else {
      filename = "install_bootanimation.sh";
      content = `#!/usr/bin/env bash\n` +
        `echo "=================================================="\n` +
        `echo "      Android Boot Animation Auto-Installer"\n` +
        `echo "=================================================="\n` +
        `echo "Make sure your phone is connected with USB Debugging enabled."\n` +
        `echo "Press enter to start installer..."\n` +
        `read -r\n\n` +
        `echo "Checking for connected device..."\n` +
        `adb devices\n\n` +
        `echo "Requesting root permissions..."\n` +
        `adb root\n` +
        `adb remount\n\n` +
        `echo "Backing up old bootanimation..."\n` +
        `adb shell mv /system/media/bootanimation.zip /system/media/bootanimation.zip.bak\n\n` +
        `echo "Copying new bootanimation.zip..."\n` +
        `adb push bootanimation.zip /system/media/bootanimation.zip\n\n` +
        `echo "Setting correct file permissions (644)..."\n` +
        `adb shell chmod 644 /system/media/bootanimation.zip\n\n` +
        `echo "Installation complete! Rebooting device to test..."\n` +
        `adb reboot\n` +
        `echo "Done."\n`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel border border-neutral-200 dark:border-neutral-900 rounded-2xl p-6 md:p-8 space-y-8 max-w-4xl mx-auto font-sans leading-relaxed shadow-sm text-neutral-800 dark:text-neutral-200 bg-white/70 dark:bg-neutral-950/70 relative z-10">
      <section className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
        <h2 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
          Installing Android Boot Animations
        </h2>
        <p className="text-neutral-450 dark:text-neutral-500 text-[10px] mt-1 font-mono uppercase tracking-widest font-extrabold text-cyan-550 dark:text-cyan-400">
          Guide: Root Access Required
        </p>
      </section>

      <div className="space-y-6">
        <div className="space-y-3 bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl">
          <h3 className="text-sm font-bold tracking-tight text-neutral-850 dark:text-white flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 items-center justify-center text-[10px] text-cyan-550 dark:text-cyan-400 font-bold font-mono">1</span>
            Prerequisites
          </h3>
          <ul className="list-disc list-inside text-xs text-neutral-500 dark:text-neutral-400 pl-6 space-y-1.5 leading-relaxed font-mono">
            <li>Unlocked Bootloader with Root Access (via Magisk or KernelSU)</li>
            <li>Root File Explorer (e.g. Solid Explorer, MiXplorer) or ADB commands installed on PC.</li>
          </ul>
        </div>

        {/* Auto Installer Scripts download block */}
        <div className="space-y-3 bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl">
          <h3 className="text-sm font-bold tracking-tight text-neutral-850 dark:text-white flex items-center gap-2">
            🚀 One-Click Auto Installer Scripts
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Place the downloaded installer script in the same folder as your custom <code className="text-neutral-600 dark:text-neutral-300 font-mono bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-850 text-[10px]">bootanimation.zip</code>, connect your phone, and double-click to install.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => downloadInstallerScript("windows")}
              className="relative overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold text-center bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-800 dark:border-neutral-205 shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              <span className="absolute inset-0 block w-full h-full pointer-events-none">
                <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
              </span>
              <span className="relative z-10 flex items-center gap-1.5">
                🪟 Download installer.bat (Windows)
              </span>
            </button>
            <button
              onClick={() => downloadInstallerScript("unix")}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-semibold text-neutral-650 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              🐧 Download installer.sh (Linux/macOS)
            </button>
          </div>
        </div>

        <div className="space-y-3 bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl">
          <h3 className="text-sm font-bold tracking-tight text-neutral-850 dark:text-white flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 items-center justify-center text-[10px] text-cyan-550 dark:text-cyan-400 font-bold font-mono">2</span>
            Manual Installation Path
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6 leading-relaxed">
            Most custom ROMs (Pixel Experience, LineageOS, EvolutionX) store the boot animation zip at:
            <code className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white font-mono px-2 py-0.5 rounded mx-1.5 text-[10px] border border-neutral-200 dark:border-neutral-850">/system/media/bootanimation.zip</code>.
          </p>
          <div className="text-xs text-neutral-450 dark:text-neutral-500 pl-6 space-y-2 leading-relaxed">
            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Steps to manually copy:</p>
            <ol className="list-decimal list-inside pl-2 space-y-1.5 font-mono text-[11px]">
              <li>Download your compiled zip file and rename it to <code className="text-neutral-600 dark:text-neutral-350">bootanimation.zip</code>.</li>
              <li>Open your root explorer app, navigate to <code className="text-neutral-600 dark:text-neutral-355">/system/media/</code>.</li>
              <li>Rename the existing default <code className="text-neutral-600 dark:text-neutral-355">bootanimation.zip</code> to <code className="text-neutral-600 dark:text-neutral-355">bootanimation.zip.bak</code> (highly recommended for backup).</li>
              <li>Copy your new zip into <code className="text-neutral-600 dark:text-neutral-355">/system/media/</code>.</li>
              <li>Set file permissions to <code className="text-yellow-600 dark:text-yellow-500 font-semibold">644 (rw-r--r--)</code>. If permissions are incorrect, the bootanimation will load as a black screen!</li>
            </ol>
          </div>
        </div>

        <div className="space-y-3 bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl">
          <h3 className="text-sm font-bold tracking-tight text-neutral-850 dark:text-white flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 items-center justify-center text-[10px] text-cyan-550 dark:text-cyan-400 font-bold font-mono">3</span>
            Samsung Devices Note
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-6 leading-relaxed">
            Samsung OneUI devices use a proprietary QMG image format instead of standard ZIP sequences:
            <code className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-white font-mono px-2 py-0.5 rounded mx-1.5 text-[10px] border border-neutral-200 dark:border-neutral-850">/system/media/bootsamsung.qmg</code>.
            Standard ZIPs will NOT play on stock Samsung ROMs unless they are heavily customized or using custom kernels that support standard zip boot loaders.
          </p>
        </div>

        <div className="space-y-3 bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl">
          <h3 className="text-sm font-bold tracking-tight text-neutral-850 dark:text-white flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 items-center justify-center text-[10px] text-cyan-550 dark:text-cyan-400 font-bold font-mono">4</span>
            Troubleshooting
          </h3>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 pl-6 space-y-4 leading-relaxed">
            <div>
              <h4 className="text-neutral-800 dark:text-white font-extrabold mb-1 font-mono text-[11px] uppercase tracking-wider text-neutral-600">Symptom: Black screen on boot</h4>
              <p className="text-neutral-455 dark:text-neutral-500">• Root Cause 1: Zip file permissions are not set to 644 (rw-r--r--).</p>
              <p className="text-neutral-455 dark:text-neutral-500">• Root Cause 2: The ZIP was generated with compression. Our compiler uses <code className="text-neutral-600 dark:text-neutral-300 font-mono">STORE (no compression)</code>, but if you used custom compression on a PC, re-pack it in our Studio to fix it.</p>
            </div>
            <div>
              <h4 className="text-neutral-800 dark:text-white font-extrabold mb-1 font-mono text-[11px] uppercase tracking-wider text-neutral-600">Symptom: Boot loop (Stuck on bootanimation)</h4>
              <p className="text-neutral-455 dark:text-neutral-500">• This does not mean your device is soft-bricked. If the ROM boots, it means your boot animation is simply playing too slowly or has parsing faults. Force a reboot (hold power button) or mount file system via TWRP recovery and delete the file to return to standard fallback defaults.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallerTab;
