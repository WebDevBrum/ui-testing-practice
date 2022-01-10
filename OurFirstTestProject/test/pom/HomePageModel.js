module.exports = class HomePageModel {
  constructor(page, config) {
    this.page = page;
    this.config = config;
  }

  async go() {
    await this.page.goto("https://www.packtpub.com/");
  }

  async title() {
    return await this.page.title();
  }
};
