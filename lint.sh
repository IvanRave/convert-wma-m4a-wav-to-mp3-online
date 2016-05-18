#! /bin/sh -e

jshint *.js
jshint public/*.js

eslint *.js
eslint public/*.js
