
autoWatch = false;
singleRun = true;
logLevel = LOG_INFO;
logColors = true;
browsers = ['Chrome']
runnerPort = 0;
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'components/angular/angular.js',
  'components/angular-cookies/angular-cookies.js',
  'components/angular-mocks/angular-mocks.js',
  {pattern: 'components/angular-i18n/*.js', included: false, served: true},
  'src/*.js',
  'test/*Spec.js'
];
junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
