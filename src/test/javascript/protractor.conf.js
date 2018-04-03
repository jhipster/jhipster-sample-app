const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const JasmineReporters = require('jasmine-reporters');

exports.config = {
    allScriptsTimeout: 20000,

    specs: [
        './e2e/account/**/*.spec.ts',
        './e2e/admin/**/*.spec.ts',
        './e2e/entities/**/*.spec.ts',
        /* jhipster-needle-add-protractor-tests - JHipster will add protractors tests here */
    ],

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [ "--disable-gpu", "--window-size=800,600" ]
        }
    },

    directConnect: true,

    baseUrl: 'http://localhost:8080/',

    framework: 'jasmine2',

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 720000
    },

    beforeLaunch: function() {
        require('ts-node').register({
            project: ''
        });
    },

    onPrepare: function() {
        browser.driver.manage().window().setSize(1280, 1024);
        jasmine.getEnv().addReporter(new JasmineReporters.JUnitXmlReporter({
            savePath: 'target/reports/e2e',
            consolidateAll: false
        }));
        jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
            dest: "target/reports/e2e/screenshots"
        }));
    },

    useAllAngular2AppRoots: true
};
