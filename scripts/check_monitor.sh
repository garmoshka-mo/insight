# brew install fswatch
# cp ~/repos/insight/scripts/monitor_config.example.sh ~/repos/insight/scripts/monitor_config.sh
# Paste to iTerm send text in dedicated profile:
# ~/repos/insight/scripts/check_monitor.sh

source ~/repos/insight/scripts/monitor_config.sh

echo "Monitoring..."
fswatch -0 --batch-marker $MONITOR_DIR | while read -d "" file; do
	if [[ "$file" == "NoOp" ]] || [[ $PREV_LINE == "NoOp" ]]; then
    echo .
	else
    node --experimental-modules ~/repos/insight/scripts/check_yml.mjs "$file"
	fi
  PREV_LINE="$file"
done
