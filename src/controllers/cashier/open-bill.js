"use strict"

const axios          = require('axios');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes   = require('node-thermal-printer').types;
const path           = require('path');
const Queue          = require('better-queue');
const fs             = require('fs');
const sharp          = require('sharp');
const sdk            = require("../../libraries");

async function accept_customer_order(request, response) {
  try {
    console.log(request.query);
    // update notification with id  = request.query.id
    await sdk.db.notification.updateOne({ _id: request.query.id }, { $set: { status: "accepted" } });

    return response.status(200).json({
      message: "Success accept customer order",
      result: "success",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to accept customer order",
      error: error.message
    });
  }
}

async function print_qr_code(request, response) {
  try {
    console.log(request.body.printer_interface);

    const printer = new ThermalPrinter({
      type                    : PrinterTypes.EPSON,
      interface               : request.body.printer_interface,
      options                 : { timeout: 1000 },
      width                   : 86,
      removeSpecialCharacters : false,
      lineCharacter           : "-",
      encoding                : "UTF8"
    });

    printer.alignCenter();
    printer.printQR(`http://192.168.1.3:6002/${request.body.outlet_id}/${request.body.table_id}`, {
      cellSize: 8,             // 1 - 8
      correction: 'H',         // L(7%), M(15%), Q(25%), H(30%)
      model: 2
    });
    // printer. // print qr of https://youtube.com here
    // const qr_code = await sdk.db.open_bill.findOne({ invoice_id: request.query.ref });
    console.log(request.body);

    printer.cut();

    await printer.execute();

    return response.status(200).json({
      message: "Success get qr code",
      result: "qr_code",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to get qr code",
      error: error.message
    });
  }
}

async function get_open_bill(request, response) {
  const open_bill = await sdk.db.open_bill.find({});

  return response.status(200).json({
    message: "Success get open bill",
    result: open_bill,
  });
}

async function save_open_bill(request, response) {
  const open_bill = await sdk.db.open_bill.create(request.body);
  console.log("save_open_bill", JSON.stringify(request.body, 0, 2));
  console.log("___open_bill", open_bill);

  await sdk.db.table.updateOne(
    {
      "tables.id": request.body.table_id
    },
    {
      $set: {
        "tables.$.reference_id": request.body.invoice_id,
        "tables.$.is_occupied": true
      }
    }
  );

  return response.status(200).json({
    message: "Success save open bill",
    result: null,
  });
}

async function save_and_print_open_bill (request, response) {
  try {
    const open_bill = await sdk.db.open_bill.create(request.body);
    console.log("save_and_print_open_bill", JSON.stringify(request.body, 0, 2));
    console.log("___open_bill", open_bill);
  
    await sdk.db.table.updateOne(
      {
        "tables.id": request.body.table_id
      },
      {
        $set: {
          "tables.$.reference_id": request.body.invoice_id,
          "tables.$.is_occupied": true
        }
      }
    );

    const outlet = await sdk.db.outlet.findOne({});
    
    // If outlet is a Mongoose document, try accessing the raw object
    const outletObj = outlet.toObject ? outlet.toObject() : outlet;
    console.log("Outlet as plain object image:", outletObj);

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
      cashier_queue.push({
        data: {
          ...request.body,
          logo: '../../assets/outlet-logo.png',
          footers: outletObj.config.footer_content,
        },
        printer_interface: outletObj.config.printer,
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  
    return response.status(200).json({
      message: "Success save open bill",
      result: null,
    });
  } catch (error) {
    console.log("Error save_and_print_open_bill", error);
    return response.status(500).json({
      message: "Failed to save and print open bill",
      error: error.message
    });
  }
}

async function update_and_print_open_bill(request, response) {
  try {
    console.log('Update payload invoice_id:', request.body.invoice_id);
    console.log('Update payload type:', typeof request.body.invoice_id);
    
    // Ensure invoice_id is a string
    const invoice_id = String(request.body.invoice_id).trim();
    
    // First check if document exists
    const existingBill = await sdk.db.open_bill.findOne({ invoice_id });
    console.log('Existing bill:', existingBill ? 'Found' : 'Not found');
    
    const open_bill = await sdk.db.open_bill.updateOne(
      { invoice_id },
      { $set: request.body }
    );
    
    console.log('Update result:', open_bill);

    return response.status(200).json({
      message: "Success update open bill",
      result: open_bill,
    });
  } catch (error) {
    console.error('Error updating open bill:', error);
    return response.status(500).json({
      message: "Failed to update open bill",
      error: error.message
    });
  }
}

async function update_open_bill(request, response) {
  try {
    console.log('Update payload invoice_id:', request.body.invoice_id);
    console.log('Update payload type:', typeof request.body.invoice_id);
    
    // Ensure invoice_id is a string
    const invoice_id = String(request.body.invoice_id).trim();
    
    // First check if document exists
    const existingBill = await sdk.db.open_bill.findOne({ invoice_id });
    console.log('Existing bill:', existingBill ? 'Found' : 'Not found');
    
    const open_bill = await sdk.db.open_bill.updateOne(
      { invoice_id },
      { $set: request.body }
    );
    
    console.log('Update result:', open_bill);

    if (!open_bill.matchedCount) {
      return response.status(404).json({
        message: "No open bill found with this invoice_id",
        result: null,
        debug: {
          searchedFor: invoice_id,
          updateResult: open_bill
        }
      });
    }

    return response.status(200).json({
      message: "Success update open bill",
      result: open_bill,
    });
  } catch (error) {
    console.error('Error updating open bill:', error);
    return response.status(500).json({
      message: "Failed to update open bill",
      error: error.message
    });
  }
}

async function get_open_bill_info(request, response) {
  const open_bill = await sdk.db.open_bill.findOne({ invoice_id: request.query.ref });

  return response.status(200).json({
    message: "Success get open bill info",
    result: open_bill
  });
}

const failedTasks = [];

const cashier_queue = new Queue(async function (task, cb) {
  let retries = 0;
  const maxRetries = 10000;
  const retryDelay = 5000;

  console.log("cashier_queue");

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
        await print_receipt(printer, failedTask.data);
      }

      // Print current task
      await print_receipt(printer, task.data);

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

const station_queue = new Queue(async function (task, cb) {
  let retries = 0;
  const maxRetries = 10000;
  const retryDelay = 5000;

  console.log("Station queue", task.printer_interface);

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
        await print_station(printer, failedTask.data);
      }

      // Print current task
      await print_station(printer, task.data);

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

async function print_receipt(printer, data) {
  try {
    console.log("print_receipt", JSON.stringify(data, null, 2));
    
    // Print receipt
    printer.clear();
    // Header
    printer.alignCenter();
    
    // Order details
    printer.alignLeft();
    printer.println(`Invoice    : ${data.invoice_id}`);
    printer.println(`Order No   : ${data.order_number}`);
    printer.println(`Order Time : ${new Date(data.created_at).toLocaleString('en-GB', {
      day   : '2-digit',
      month : 'short',
      year  : 'numeric',
      hour  : '2-digit',
      minute: '2-digit',
      hour12: false
    })}`);
    
    if (data.table_group_name && data.table_name) {
      printer.println(`Table      : ${data.table_group_name} - ${data.table_name}`);
    }
    
    printer.println(`Type       : ${data.sales_type_name}`);
    
    printer.drawLine();
    
    // Items
    data.transaction_items.forEach((item, item_index) => {
      if (+item.option.pricing.discount) {
        console.log("kesini kan, karena ada discount");
        
        printer.tableCustom([
          { text: `${item.qty} x ${item.name}`, align: 'LEFT', width: 0.6 },
          { text: "", align: 'RIGHT', width: 0.4 }
        ]);
        
        // Addons
        item.addon.forEach(addon => {
          addon.list.forEach(opt => {
            printer.tableCustom([
              { text: `    ${addon.name} - ${opt.name}`, align: 'LEFT', width: 0.6 },
              { text: "", align: 'RIGHT', width: 0.4 }
            ]);
          });
        });

        printer.tableCustom([
          { text: `* ${item.option.pricing.discount_name}`, align: 'LEFT', width: 0.6 },
          { text: "", align: 'RIGHT', width: 0.4 }
        ]);
      } else {
        console.log("kesini kan, karena tidak ada discount", item);
        
        printer.tableCustom([
          { text: `${item.qty} x ${item.name}`, align: 'LEFT', width: 0.6 },
          { text: "", align: 'RIGHT', width: 0.4 }
        ]);
        
        // Addons
        item.addon.forEach(addon => {
          addon.list.forEach(opt => {
            printer.tableCustom([
              { text: `    ${addon.name} - ${opt.name}`, align: 'LEFT', width: 0.6 },
              { text: "", align: 'RIGHT', width: 0.4 }
            ]);
          });
        });
      }

      if (item_index < data.transaction_items.length - 1) {
        printer.newLine();
      }
    });
    
    printer.drawLine();
    
    // Totals
    printer.println(`Total Items: ${data?.total_items || 0}`);
    
    printer.cut();

    await printer.openCashDrawer();
    await printer.execute();

    print_stations(data);
    
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    throw error;
  }
}

async function print_stations(data) {
  try {
    const stations = await sdk.db.station.find({
      printer_id: { $ne: null }  // Only get stations where printer field is not null
    });

    for (let station of stations) {
      station = station.toObject();

      console.log("station : ", station);

      const items = data.transaction_items.filter(item => item.option.pricing.station_id === station.station_id);

      if (items.length > 0) {
        const [printer_interface] = station.printers.filter(printer => printer.id === station.printer_id);

        await new Promise((resolve, reject) => {
          station_queue.push({
            data: {
            station_name      : station.name,
            invoice_id        : data.invoice_id,
            sales_type_name   : data.sales_type_name,
            transaction_items : items,
            order_number      : data.order_number,
            created_at        : data.created_at,
          },
          printer_interface: printer_interface.ip_address,
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
      }
    }
    
    return true;
  } catch (error) {
    console.log("Error print_stations", error);
    return false;
  }
}

async function print_station(printer, data) {
  try {
    console.log("udah sampe sini?", printer);
    
    // Print receipt
    printer.clear();
    // Header
    printer.alignCenter();
    printer.bold(true);
    printer.println(data.station_name);
    printer.bold(false);
    printer.alignLeft();
    printer.drawLine();
    printer.println(`Invoice    : ${data.invoice_id}`);
    printer.println(`Order No   : ${data.order_number}`);
    printer.println(`Order Time : ${new Date(data.created_at).toLocaleString('en-GB', {
      day   : '2-digit',
      month : 'short',
      year  : 'numeric',
      hour  : '2-digit',
      minute: '2-digit',
      hour12: false
    })}`);
    printer.println(`Type       : ${data.sales_type_name}`);
    printer.drawLine();

    for (const item of data.transaction_items) {
      printer.println(`${item.qty} x ${item.name}`);

      // Addons
      item.addon.forEach(addon => {
        addon.list.forEach(opt => {
          printer.println(`    ${addon.name} - ${opt.name}`);
        });
      });
    }

    printer.cut();
    await printer.execute();
    
    return true;
  } catch (error) {
    console.log("Error print_station", error);
    return false;
  }
}

module.exports = {
  get_open_bill,
  save_open_bill,
  save_and_print_open_bill,
  update_open_bill,
  update_and_print_open_bill,
  get_open_bill_info,
  print_qr_code,
  accept_customer_order,
};