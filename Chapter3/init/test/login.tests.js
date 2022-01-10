const puppeteer = require("puppeteer");
const expect = require("chai").expect;
const should = require("chai").should();
const LoginPageModel = require("./pom/LoginPageModel.js");
const config = require("./config");
const fs = require("fs");

describe("Login Page", () => {
  let browser;
  let page;
  let pageModel;

  before(async () => {
    browser = await puppeteer.launch(config.launchOptions);
  });

  beforeEach(async () => {
    page = await browser.newPage();
    pageModel = new LoginPageModel(page, config);
    await pageModel.go();
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });

  it("Should have the right title", async () => {
    (await pageModel.title()).should.equal("Login");
  });

  it("It should persist the user", async () => {
    const userDataDir = fs.mkdtempSync("profile");

    const options = config.launchOptions;

    options.userDataDir = userDataDir;

    let persistentBrowser = await puppeteer.launch(options);

    let persistentPage = await persistentBrowser.newPage();

    let loginModel = new LoginPageModel(persistentPage, config);

    await loginModel.go();

    (await loginModel.logState()).should.equal("Login");

    await loginModel.login(config.username, config.password);

    (await loginModel.logState()).should.equal("Logout");

    await persistentBrowser.close();

    persistentBrowser = await puppeteer.launch(options);

    persistentPage = await persistentBrowser.newPage();

    loginModel = new LoginPageModel(persistentPage, config);

    await loginModel.go();

    (await loginModel.logState()).should.equal("Logout");

    await persistentBrowser.close();

    deleteFolderRecursive(userDataDir);
  });

  it("Should redirect to the login page", async () => {
    const response = await pageModel.go();

    response.status().should.equal(200);

    response.url().should.contain("login");

    response.request().redirectChain()[0].response().status().should.equal(302);

    response
      .request()
      .redirectChain()[0]
      .response()
      .url()
      .should.contain("admin");
  });

  const deleteFolderRecursive = function (path) {
    try {
      if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
          const curPath = Path.join(path, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    } catch {
      console.log("Unabled to delete folder");
    }
  };
});
