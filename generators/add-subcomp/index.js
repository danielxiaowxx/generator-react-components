'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var glob = require("glob");
var _ = require('lodash');
var Promise = require('bluebird');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');

var scrFolderPath, scrFolder, demoFolderPath, demoFolder;

module.exports = yeoman.generators.Base.extend({

  init: function() {
    var done = this.async();

    var prompts = [{
      name    : 'componentName',
      message : 'What is your main component name?',
      required: true
    }, {
      name    : 'subcompName',
      message : 'What is your sub component name?',
      required: true
    }];

    this.prompt(prompts, function(props) {

      // example: name = demo-user
      this.componentName = s(props.componentName).slugify().value(); // => demo-user
      this.camelComponentName = s(this.componentName).camelize().value(); // => demoUser
      this.firstCapCamelComponentName = s(this.camelComponentName).capitalize().value(); // => DemoUser

      // example: name = demo-user
      this.subcompName = s(props.subcompName).slugify().value(); // => demo-user
      this.camelSubcompName = s(this.subcompName).camelize().value(); // => demoUser
      this.firstCapCamelsubcompName = s(this.camelSubcompName).capitalize().value(); // => DemoUser

      scrFolder = 'src/' + this.componentName + '/' + this.subcompName;
      scrFolderPath = './' + scrFolder + '/';
      demoFolder = 'demo/' + this.componentName + '/' + this.subcompName;
      demoFolderPath = './' + demoFolder + '/';

      done();
    }.bind(this));
  },

  copyComponent: function() {
    var done = this.async();
    Promise.all([
      common.exec('cp -rf ' + this.templatePath('./src') + ' ' + this.destinationPath(scrFolderPath)),
      common.exec('cp -rf ' + this.templatePath('./demo') + ' ' + this.destinationPath(demoFolderPath))
    ]).then(function() {
      done();
    })
  },

  copyTemplates: function() {
    var self = this;
    var done = this.async();

    glob('{' + scrFolderPath + ',' + demoFolderPath + '}' + "*.*", {}, function(er, files) {
      _.each(files, function(filePath) {
        var toFilePath = filePath.replace('_.', '');
        self.fs.copyTpl(
          filePath,
          toFilePath,
          {
            componentName             : self.componentName,
            camelComponentName        : self.camelComponentName,
            firstCapCamelComponentName: self.firstCapCamelComponentName,
            subcompName               : self.subcompName,
            camelSubcompName          : self.camelSubcompName,
            firstCapCamelsubcompName  : self.firstCapCamelsubcompName
          });
      });

      done();
    });
  },

  updateWebpackConfig: function() {
    var fullPath = './webpack.config.js';
    util.rewriteFile({
      file      : fullPath,
      insertPrev: true,
      needle    : "// Don't touch me",
      splicable : [
        this.firstCapCamelComponentName + this.firstCapCamelsubcompName + ": ['./" + this.componentName + '/' + this.subcompName + "/index'],"
      ]
    });
  },

  removeFiles: function() {
    common.removeFiles(this, [
      '_.*.*'
    ], scrFolder);

    common.removeFiles(this, [
      '*.*'
    ], demoFolder)
  },

  usageTip: function() {
    logger.log('=========================');
    logger.log('Congratulations, sub component added successfully!');
    logger.log("Gook Luck!");
    logger.log('=========================');
  }

});
