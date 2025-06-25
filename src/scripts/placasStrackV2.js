const { firefox } = require('playwright');

async function placasSatrackV2(vehicle, userSatrack) {
  const browser = await firefox.launch({ headless: false });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    page.on('dialog', async dialog => {
      console.log('✅ Apareció un alert con mensaje:', dialog.message(), " Placa ", vehicle.licensePlate);
      await dialog.accept();
    });

    await page.goto('https://login.satrack.com/login', {
      timeout: 60000,
      waitUntil: 'load'
    });

    await page.fill('input[data-placeholder="Usuario"]', vehicle.user);
    await page.fill('input[data-placeholder="Contraseña"]', vehicle.password);
    await page.click('.login-button');
    await page.waitForTimeout(2000);

    let errorTexto = null;
    try {
      errorTexto = await page.locator('.error-login > div').textContent({ timeout: 5000 });
    } catch (err) {
      // No se encontró el selector en 5 segundos: continuar
    }

    if (errorTexto && errorTexto.trim() === 'Usuario y/o contraseña incorrectos, intenta de nuevo.') {
      console.log("❌ Credenciales Erradas de la", " Placa ", vehicle.licensePlate);
      await page.waitForTimeout(30000);
      await browser.close();
      return;
    } else {
      console.log("✅ Credenciales Correctas de la ", " Placa ", vehicle.licensePlate );
    }


    await page.waitForSelector("#tab_nav_menu_Services");
    const services = await page.$("#tab_nav_menu_Services");
    if (!services) {
      console.log("❌ Error, no alcanzo a cargar los elementos", " Placa ", vehicle.licensePlate);
      await browser.close();
      return;
    }

    await page.evaluate(() => {
      const label = document.querySelector("#tab_nav_menu_Services");
      if (label) label.click();
    });

    await page.waitForTimeout(2000);

    const divSelector = '#divMenuServices > portal-menu-services-web-root > menu-web-services > div.container-services > div:nth-child(6)';
    const tieneAppDisabled = await page.$(`${divSelector} app-disabled-service`) !== null;
    await page.waitForTimeout(2000);

    if (tieneAppDisabled) {
      console.log("❌ Sin Modulo de terceros en el vehiculo ", vehicle.licensePlate);
      await browser.close();
      return;
    } else {
      await page.evaluate(() => {
        const divs = document.querySelectorAll("#div_service_title");
        for (const div of divs) {
          if (div.innerText.includes("Módulo autorización monitoreo terceros")) {
            div.click();
            break;
          }
        }
      });
    }

    await page.waitForTimeout(2000);

    const frameIfPlacasEstados = page.frame({ name: 'ifPlacasEstados' });

    if (frameIfPlacasEstados) {
      await frameIfPlacasEstados.click('a#A5');
      await page.waitForTimeout(2000);

      const frame2 = page.frame({ name: 'ifPlacasEstados' });
      if (frame2) {
        const data = await frame2.$$eval('table#gvPlacas_DXMainTable tbody tr td', tds =>
          tds.map(td => td.textContent.trim())
        );

        let userHasLicensePlates = true;
        for (let text of data) {
          text = text.replace(/[^a-zA-Z0-9]/g, '');
          if (text.includes('Nohayinformacinenelmomentoparapresentar')) {
            userHasLicensePlates = false;
            break;
          }
        }

        await page.waitForTimeout(2000);

        if (userHasLicensePlates) {
          await frame2.fill('input[id="gvPlacas_DXFREditorcol1_I"]', vehicle.licensePlate);
          await page.waitForTimeout(2000);

          const elements = await frame2.$$('td.dxgv');
          let placa = null;
          for (const el of elements) {
            const text = await el.innerText();
            if (text === vehicle.licensePlate) {
              placa = el;
              break;
            }
          }

          if (placa) {
            await page.waitForTimeout(2000);
            await frame2.selectOption('select#DrgSeleccionar', '2');
            await page.waitForTimeout(2000);
            await frame2.fill('input[id="txtSeleccion"]', userSatrack);
            await page.waitForTimeout(2000);
            await frame2.click("#gvPlacas_col0 > input#chkAllRowOnPage");
            await page.waitForTimeout(2000);
            await frame2.click('input[id="btnSeleccion"]');
            await page.waitForTimeout(2000);
            await frame2.fill("#gvUsuarios_DXFREditorcol1_I", userSatrack);
            await page.waitForTimeout(2000);

            await frame2.evaluate((user) => {
              const usuarios = document.querySelectorAll(".dxgvDataRow > td");
              for (const usuario of usuarios) {
                if (usuario.innerText === user.toUpperCase()) {
                  const fila = usuario.parentElement;
                  const input = fila.querySelector("td > span > span > input");
                  if (input) input.click();
                  break;
                }
              }
            }, userSatrack);

            await frame2.evaluate(() => {
              document.querySelector('input#txtfecha').value = '31/12/2030';
            });

            await frame2.click('input[id="checkCondiciones"]');
            await page.waitForTimeout(2000);
            await frame2.click('img[onclick="Asignar();"]');
            await page.waitForTimeout(2000);

            const confirmButtons = await frame2.$$('button.ui-button');
            if (confirmButtons.length > 1) {
              await confirmButtons[1].click();
            }

            await page.waitForTimeout(2000);
            console.log("✅ Registro de placa " + vehicle.licensePlate + " Completo");
            await browser.close();
            return;
          } else {
            console.log("❌ no hay placa " + vehicle.licensePlate);
            await browser.close();
            return;
          }
        } else {
          console.log("❌ no tine placas para compartir");
          await browser.close();
          return;
        }
      }
    }
  } catch (error) {
    console.error("❌ Error general:", error.message);
    await browser.close();
  } finally {
    console.log("Finalizo el proceso de la Placa ", vehicle.licensePlate);
    
  if (browser) await browser.close(); 
}
}

module.exports = placasSatrackV2;