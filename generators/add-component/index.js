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
    this.argument('name', {
      required: true,
      type    : String,
      desc    : 'The component name'
    });

    this.log('You called the react-components add-compoent with the argument ' + this.name + '.');

    // example: name = demo-user
    this.componentName = s(this.name).slugify().value(); // => demo-user
    this.camelComponentName = s(this.componentName).camelize().value(); // => demoUser
    this.firstCapCamelComponentName = s(this.camelComponentName).capitalize().value(); // => DemoUser

    scrFolder = 'src/' + this.componentName;
    scrFolderPath = './' + scrFolder + '/';
    demoFolder = 'demo/' + this.componentName;
    demoFolderPath = './' + demoFolder + '/';
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
            firstCapCamelComponentName: self.firstCapCamelComponentName
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
        this.firstCapCamelComponentName + ": ['./" + this.componentName + "/index'],"
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
    logger.log('Congratulations, component added successfully!');
    logger.green("Now You can run: 'yo inspinia-mean:add-subcomp' to add your first sub component");
    logger.log("Gook Luck!");
    logger.log('=========================');
  }

});
