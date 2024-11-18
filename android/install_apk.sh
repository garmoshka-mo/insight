#!/bin/bash

if [ -z $@ ]; then
  APK=android/app/build/outputs/apk/staging/debug/app-staging-debug.apk
else
  APK=$@
fi

adb install -r $APK && \
adb shell am start -n com.insight/.MainActivity
