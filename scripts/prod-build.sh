#! /bin/sh

# Remove any existing builds, clean up prod-dist folder.
rm -rf tmp/builds
rm -rf prod-dist
mkdir -p tmp/builds

# Install NPM packages
npm install

# Get variables we need.
buildtime=`date +'%Y%m%d-%H%M'`
sha=`git rev-parse HEAD | tr -d ' ' | head -c 7`
filename="speak-easy-app_${buildtime}_${sha}.txz"

# Only argument is an optional path to the s3cmd config.
# Otherwise uses default.
if [ $# -eq 1 ] ; then
  s3cfg="-c $1"
fi

# Build app
gulp build-production


if [[ $? != 0 ]] ; then
  echo 'App build failed'
else
  tar cfJ tmp/builds/$filename ./prod-dist/
fi
