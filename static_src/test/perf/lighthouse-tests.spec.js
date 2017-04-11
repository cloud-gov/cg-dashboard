
// Whhhhaaat? Yeah, you can import and use as you like.

const dedent = require('dedent');
const lighthouse = require('lighthouse');
const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher');
const Printer = require('lighthouse/lighthouse-cli/printer');

// Output both JSON and HTML versions
const outputPath = process.env.CIRCLE_ARTIFACTS || '.';
const jsonOut = `${outputPath}/perf-results.json`;
const htmlOut = `${outputPath}/perf-results.html`;

// Define our test url
// You could just as easily start a local server to test as well
const port = process.env.PORT;
const testUrl = `http://localhost:${port}`;

// Setup lighthouse options
const lighthouseOptions = {
  mobile: true,
  loadPage: true,
  output: 'json',
  outputPath: `${outputPath}/perf-results.json`,
  verbose: true
};

// You can use your define custom Lighthouse configs, audits, and gatherers!
// You could also import pre-existing defines in the lighthouse repo, see:
// https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-core/config
// const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');
const auditConfig = require('./config.json');

const budgets = require('./budgets');

function pullBudget(name) {
  return budgets[name].expectedValue;
}

function launchChromeRunLighthouse(url, port, flags, config) {
  const launcher = new ChromeLauncher({port: 9222, autoSelectChrome: true});

  return launcher.isDebuggerReady()
    .catch(() => {
      if (flags.skipAutolaunch) {
        return;
      }
      return launcher.run(); // Launch Chrome.
    })
    .then(() => lighthouse(testUrl, lighthouseOptions, auditConfig)) // Run Lighthouse.
    .then(results => launcher.kill().then(() => results)) // Kill Chrome and return results.
    .catch(err => {
      // Kill Chrome if there's an error.
      return launcher.kill().then(() => {
        throw err;
      }, console.error);
    });
}


// We'll process the results and then pass to our tests
// Based on Paul Irish's PWMetric sample
// https://github.com/paulirish/pwmetrics/
//const ourMetrics = require('./metrics');

describe('Lighthouse speed test', function() {
  // We'll run our lighthouse set once and store for compare in this sample
  // you could very easily build a different sort of runner
  let result;
  let pullResult = function() {};
  jasmine.getEnv().defaultTimeoutInterval = 150000;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;

  beforeAll((done) => {
    launchChromeRunLighthouse(testUrl, port, {}, lighthouseOptions)
      .then((res) => {
        result = res.audits;
        pullResult = function(name) {
          return result[name].rawValue;
        }
        res.artifacts = undefined; // Causes problems when writing.
        const htmlWrite = Printer.write(res, 'html', htmlOut);
        const jsonWrite = Printer.write(res, 'json', jsonOut);
        Promise.all([jsonWrite, htmlWrite]).then(done, done.fail);
      })
      .catch((err) => {
        done.fail(err);
      });
  });

  afterAll(() => {
    console.log(dedent`\n
    🏎 ____🏎 ____🏎____🏎____🏎____🏎
    Performance testing complete.
    See detailed results at: ${htmlOut} or ${jsonOut}
    `);

  });

  it('should successfully run the test and have results', () => {
    expect(result).toBeDefined();
  });

  it(`should have a speed index under ${pullBudget('speed-index-metric')}`,
      () => {
    expect(pullResult('speed-index-metric'))
      .toBeLessThan(pullBudget('speed-index-metric'));
  });

  it(`should have a input latency under ${pullBudget('estimated-input-latency')}`,
      () => {
    // Disabled as measurement is currently innacurate.
    //expect(pullResult('estimated-input-latency'))
    //.toBeLessThan(pullBudget('estimated-input-latency'));
  });

  it(`should have a time to interactive under ${pullBudget('time-to-interactive')}`,
      () => {
    expect(pullResult('time-to-interactive'))
      .toBeLessThan(pullBudget('time-to-interactive'));
  });

  it(`should have a page weight under ${pullBudget('total-byte-weight')}`,
      () => {
    expect(pullResult('total-byte-weight'))
      .toBeLessThan(pullBudget('total-byte-weight'));
  });

  it(`should have less then ${pullBudget('dom-size')} dom nodes`,
      () => {
    expect(pullResult('dom-size'))
      .toBeLessThan(pullBudget('dom-size'));
  });
});
