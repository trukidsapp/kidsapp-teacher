#!/usr/bin/env bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] ; then
    git init

    git remote add deploy "ssh://teamcity_user@24.70.42.226:229/home/teamcity_user/remote/teacher"
    git config user.name "Travis CI"
    git config user.email "travisCI@travisci.com"

    git add .
    git commit -m "Deploy"
    git push --force deploy master
else
    echo "Not deploying, since this branch isn't master."
fi