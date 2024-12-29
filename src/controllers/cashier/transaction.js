"use strict"

const axios = require('axios');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;
const path = require('path');
const Queue = require('better-queue');
const sdk = require("../../libraries");
const fs = require('fs');
const sharp = require('sharp');

const failedTasks = [];

const printerQueue = new Queue(async function (task, cb) {
  let retries = 0;
  const maxRetries = 10000;
  const retryDelay = 5000;

  while (retries < maxRetries) {
    try {
      const printer = new ThermalPrinter({
        type                    : PrinterTypes.EPSON,
        interface               : task.printer_interface,
        options                 : { timeout: 1000 },
        width                   : 46,
        removeSpecialCharacters : false,
        lineCharacter           : "-",
        encoding                : "UTF8"
      });

      // Try to print any failed tasks first
      while (failedTasks.length > 0) {
        const failedTask = failedTasks.shift();
        await printReceipt(printer, failedTask.data);
      }

      // Print current task
      await printReceipt(printer, task.data);

      console.log('Print success');
      cb(null, { success: true });
      return;
    } catch (error) {
      retries++;
      console.log(`Print attempt ${retries} failed:`, error);
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        // Store failed task for later retry
        failedTasks.push(task);
        cb(error);
      }
    }
  }
});

async function printReceipt(printer, data) {
  try {
    // Print receipt
    printer.clear();
    // Header
    printer.alignCenter();
    await printer.printImage(path.join(__dirname, data.logo), { align: 'center' });
    printer.println();
    
    printer.bold(true);
    printer.println(data.storeName);
    printer.bold(false);
    printer.println();
    
    printer.println('Phone: ' + data.phone);
    printer.drawLine();
    
    // Order details
    printer.alignLeft();
    printer.println(`Invoice    : ${data.invoice}`);
    printer.println(`Order Time : ${data.orderTime}`);
    printer.println(`Table      : ${data.table}`);
    printer.println(`Type       : ${data.type}`);
    printer.println(`Cashier    : ${data.cashier}`);
    
    printer.drawLine();
    
    // Items
    data.items.forEach(item => {
      printer.tableCustom([
        { text: `${item.qty} x ${item.name}`, align: 'LEFT', width: 0.6 },
        { text: item.price.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
      ]);
      
      // Options
      item.options.forEach(opt => {
        printer.tableCustom([
          { text: `    ${opt.name}`, align: 'LEFT', width: 0.6 },
          { text: opt.price.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
        ]);
      });
    });
    
    printer.drawLine();
    
    // Totals
    printer.println(`Total Items: ${data.totalItems}`);
    printer.drawLine();
    
    printer.tableCustom([
      { text: 'Subtotal:', align: 'LEFT', width: 0.6 },
      { text: data.subtotal.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
    ]);
    
    printer.tableCustom([
      { text: 'Total:', align: 'LEFT', width: 0.6 },
      { text: data.total.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
    ]);
    
    printer.drawLine();
    
    for (const payment of data.payment) {
      printer.tableCustom([
        { text: payment.method, align: 'LEFT', width: 0.6 },
        { text: `IDR ${payment.amount.toLocaleString().replace(/,/g, ".")}`, align: 'RIGHT', width: 0.4 }
      ]);
    }

    printer.newLine();

    // Footer
    printer.alignCenter();
    for (const footer of data.footers) {
      printer.println(footer.text);
    }
    
    printer.cut();
    await printer.execute();
    
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    throw error;
  }
}

async function create_transaction(request, response) {
  try {
    console.log("create_transaction", JSON.stringify(request.body, null, 2));

    const data = request.body;

    const outlet = await sdk.db.outlet.findOne({});
    
    // If outlet is a Mongoose document, try accessing the raw object
    const outletObj = outlet.toObject ? outlet.toObject() : outlet;
    console.log("Outlet as plain object image:", outletObj.image);

    // Download image
    const outlet_image = await axios.get(outletObj.image, { responseType: 'arraybuffer' });
    const imagePath = path.join(__dirname, '../../assets/outlet-logo.png');
    
    // Ensure assets directory exists
    const assetsDir = path.dirname(imagePath);
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Resize image and save
    await sharp(outlet_image.data)
      .resize(200, 200, {  // Adjust width and height as needed
        fit: 'contain',     // Other options: 'cover', 'fill', 'inside', 'outside'
        background: { r: 255, g: 255, b: 255, alpha: 0 }  // White background
      })
      .png()  // Convert to PNG format
      .toFile(imagePath);

    console.log("Resized image saved to:", imagePath);

    // Add print job to queue
    await new Promise((resolve, reject) => {
      printerQueue.push({
        data: {
          ...data,
          logo: '../../assets/outlet-logo.png',
          footers: [
            {
              text: 'Thank you for your purchase!',
              align: 'center'
            },
            {
              text: 'Please come again',
              align: 'center'
            },
          ],
        },
        printer_interface: 'tcp://192.168.100.168:9100'
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return response.status(200).json({
      message: "Success create_transaction",
      result: null,
    });
  } catch (error) {
    console.log("Error create_transaction", error);
    return response.status(500).json({
      message: "Error printing",
      error: error.message
    });
  }
}

module.exports = {
  create_transaction,
};
