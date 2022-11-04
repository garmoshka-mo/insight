# DEV

* `yarn build`
* `yarn che path_to_yml print` - check .yml file format and **print** conversion result
* `yarn che dir` - check all .yml files in **dir**
* `~/repos/insight/scripts/check_monitor.sh` - auto-check monitor, see script for usage

## patch package

```
yarn patch-package package_name
yarn patch-package metro-config/metro
```

## Android 

`cp android/local.properties.sample android/local.properties`
Then set path to android sdk

## Troubleshooting

Could not determine the dependencies of task ':app:installDebug'.
> SDK location not found. Define location with an ANDROID_SDK_ROOT environment variable or by setting the sdk.dir path in your project's local properties file at '/Users/garmoshka-mo/repos/insight/android/local.properties'.

