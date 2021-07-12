# Paste to iTerm send text in dedicated profile:

echo "Monitoring..."
fswatch -0 /Users/garmoshka-mo/Dropbox/Docs/тян/*.yml | while read -d "" file; do
  node --experimental-modules ~/repos/insight/scripts/check_yml.mjs "$file"
done
