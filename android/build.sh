#!/bin/bash
# launch from root
set -e
set -o pipefail

echo 'Android fast build started (JS bundle not re-built)'
cd android

echo "Building react bundle"
yarn react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output android/app/src/main/assets/index.android.bundle \
    --assets-dest android/app/src/main/res

./gradlew assembleDebug
#open app/build/outputs/apk/debug/

APK=app/build/outputs/apk/debug/app-debug.apk
adb install -r $APK && \
adb shell am start -n com.insight/.MainActivity
