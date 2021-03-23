adb reverse tcp:8081 tcp:8081
adb shell am force-stop com.insight
adb shell am start -n com.insight/com.insight.MainActivity
