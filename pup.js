const puppeteer = require('puppeteer');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  async function app(){
    try{
        let options = {
            defaultViewport: {
              width: 1366,
              height: 768,
            },
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: false,
          };
        
        let browser = await puppeteer.launch(options);
        let page = await browser.newPage();

        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
         behavior: 'allow',
        downloadPath: __dirname,
        })
        
          await page.goto("https://app.pipefy.com/") 
          await page.waitForSelector(".auth0-lock-submit")   
          await delay(4000) 
          var usernameInput = await page.$("input[name='username']");
          var passwordInput = await page.$("input[name='password']");

          await delay(6000)

          await usernameInput.click();
          await page.keyboard.type("feliperosenek@gmail.com", {
            delay: 100
          });
          await passwordInput.click();
          await page.keyboard.type("feliperosene2130", {
            delay: 100
          });

          var loginButton = await page.$("button[name='submit']");
          await loginButton.click()

          await delay(6000)

          await page.goto("https://app.pipefy.com/apollo_databases/301585673")

          await delay(15000)

          var exportButton = await page.$("button[aria-label='Exportar']");
          await exportButton.click()   
          
          await delay(15000)

          browser.close()
       
    }
    catch (error) {
        console.log(error);
        process.exit(1);
      }
  }

  app()