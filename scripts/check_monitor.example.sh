# brew install fswatch
# cp ~/repos/insight/scripts/check_monitor.example.sh ~/repos/insight/scripts/check_monitor.sh
# chmod a+x ~/repos/insight/scripts/check_monitor.sh
# Paste to iTerm send text in dedicated profile:
# ~/repos/insight/scripts/check_monitor.sh

echo "Monitoring..."
fswatch -0 ~/Dropbox/Docs/тян/*.yml | while read -d "" file; do
  node --experimental-modules ~/repos/insight/scripts/check_yml.mjs "$file"
done
