import subprocess
import sys
import os
import time

# --- Configuration ---
TARGET_SCRIPT = "WindowsClient.pyw"

# Magic flags to detach the process completely from the current console/process tree
# DETACHED_PROCESS = 0x00000008, CREATE_NEW_PROCESS_GROUP = 0x00000200
# These flags ensure the launched process survives the parent (Ignition.pyw) exiting.
creation_flags = 0x00000200 | 0x00000008

def launch_client(script_path):
    """Attempts to launch the client at the specified absolute path."""
    if not os.path.exists(script_path):
        return False

    print(f"[*] Attempting launch: {script_path}")
    
    try:
        # Launch the client using the py launcher
        subprocess.Popen(
            ["py", "-3", script_path],
            creationflags=creation_flags,
            close_fds=True,
            shell=False
        )
        # Add a tiny delay to ensure the OS starts the first process before the second attempt
        time.sleep(0.5) 
        return True
    except Exception as e:
        print(f"[!] Failed to launch {script_path}: {e}")
        return False

def launch_redundantly():
    
    # 1. Define Paths
    # Primary Location (Rails Root Folder)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    primary_path = os.path.join(current_dir, TARGET_SCRIPT)
    
    # Fallback Location (Current User's Desktop)
    desktop_path = os.path.join(os.environ.get('USERPROFILE', ''), 'Desktop', TARGET_SCRIPT)
    
    # 2. Attempt Primary Launch (Priority)
    launched_primary = launch_client(primary_path)
    
    # 3. Attempt Backup Launch (Redundancy)
    launched_backup = launch_client(desktop_path)
    
    if not launched_primary and not launched_backup:
        print("[!] Client not found or failed to launch from either location.")
    else:
        print("[*] Redundant launch sequence complete.")

if __name__ == "__main__":
    launch_redundantly()
    # Script exits immediately, severing the link with Rails
    sys.exit()
