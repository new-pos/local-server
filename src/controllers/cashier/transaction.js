"use strict"

const axios          = require('axios');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes   = require('node-thermal-printer').types;
const path           = require('path');
const Queue          = require('better-queue');
const fs             = require('fs');
const sharp          = require('sharp');
const sdk            = require("../../libraries");

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
        await print_receipt(printer, failedTask.data, failedTask.is_open_bill);
      }

      // Print current task
      await print_receipt(printer, task.data, task.is_open_bill);

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

async function create_transaction(request, response) {
  try {
    console.log("create_transaction", JSON.stringify(request.body, null, 2));

    // check if invoice_id is exist in open_bill
    const open_bill = await sdk.db.open_bill.findOne({ invoice_id: request.body.invoice_id });
    let is_open_bill = false;

    await sdk.db.transaction.create(request.body);

    if (open_bill) {
      is_open_bill = true;
      // delete from open_bill
      await sdk.db.open_bill.deleteOne({ invoice_id: request.body.invoice_id });
      // update table
      await sdk.db.table.updateOne(
        { "tables.reference_id": request.body.invoice_id },
        { $set: { "tables.$.is_occupied": false, "tables.$.reference_id": null, "tables.$.running_orders": [] } }
      );
    }

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

    execute_printer(request.body, is_open_bill, outletObj.config.printer, outletObj.config.footer_content)

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

async function execute_printer(body, is_open_bill, printer, footer) {
  try {
    // Add print job to queue
    await new Promise((resolve, reject) => {
      cashier_queue.push({
        data: {
          ...body,
          is_open_bill,
          logo: '../../assets/outlet-logo.png',
          footers: footer,
        },
        printer_interface: printer,
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return true;
  } catch (error) {
    console.log("Error add print job to queue", error);

    return false;
  }
}

async function print_receipt(printer, data, is_open_bill) {
  try {
    console.log("print_receipt", JSON.stringify(data, null, 2));
    
    // Print receipt
    printer.clear();
    // Header
    printer.alignCenter();
    await printer.printImage(path.join(__dirname, data.logo), { align: 'center' });
    printer.println();
    
    printer.bold(true);
    printer.println(data.store_name);
    printer.bold(false);
    printer.println();
    
    printer.println(data.outlet_address);
    
    printer.println('Phone: ' + data.outlet_phone);
    printer.drawLine();
    
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
    
    if (data.table_name) {
      printer.println(`Table      : ${data.table_group_name} - ${data.table_name}`);
    }
    
    printer.println(`Type       : ${data.sales_type_name}`);
    printer.println(`Cashier    : ${data.cashier_name}`);
    
    printer.drawLine();
    
    // Items
    data.transaction_items.forEach((item, item_index) => {
      if (+item.option.pricing.discount) {
        console.log("kesini kan, karena ada discount");
        
        printer.tableCustom([
          { text: `${item.qty} x ${item.name}`, align: 'LEFT', width: 0.6 },
          { text: (+item.option.pricing.final_price_per_item).toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
        ]);
        
        // Addons
        item.addon.forEach(addon => {
          addon.list.forEach(opt => {
            printer.tableCustom([
              { text: `    ${addon.name} - ${opt.name}`, align: 'LEFT', width: 0.6 },
              { text: (+opt.pricing.final_price_per_item).toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
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
          { text: (+item.option.pricing.price).toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
        ]);
        
        // Addons
        item.addon.forEach(addon => {
          addon.list.forEach(opt => {
            printer.tableCustom([
              { text: `    ${addon.name} - ${opt.name}`, align: 'LEFT', width: 0.6 },
              { text: (+opt.pricing.price).toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
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
    printer.drawLine();
    
    printer.tableCustom([
      { text: 'Subtotal:', align: 'LEFT', width: 0.6 },
      { text: data.subtotal_without_product_discount.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
    ]);
    
    if (data.total_product_discount) {
      printer.tableCustom([
        { text: 'Product Discount:', align: 'LEFT', width: 0.6 },
        { text: data.total_product_discount.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
      ]);
    }
    
    if (data.total_voucher_discount) {
      printer.tableCustom([
        { text: 'Voucher Discount:', align: 'LEFT', width: 0.6 },
        { text: data.total_voucher_discount.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
      ]);
    }
    
    printer.tableCustom([
      { text: 'Total:', align: 'LEFT', width: 0.6 },
      { text: data.grand_total.toLocaleString().replace(/,/g, "."), align: 'RIGHT', width: 0.4 }
    ]);
    
    printer.drawLine();
    
    for (const payment of data.payment_method) {
      printer.tableCustom([
        { text: payment.name, align: 'LEFT', width: 0.6 },
        { text: `IDR ${payment.amount.toLocaleString().replace(/,/g, ".")}`, align: 'RIGHT', width: 0.4 }
      ]);
    }

    printer.newLine();

    // Footer
    printer.alignCenter();

    for (const footer_text of data.footers) {
      printer.println(footer_text);
    }
    
    printer.cut();

    await printer.openCashDrawer();
    await printer.execute();

    if (!is_open_bill) {
      print_stations(data);
    }
    
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

async function get_order_number(request, response) {
  try {
    // Get today's start and end dates in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Log the query parameters for debugging
    console.log("Query date range:", {
      start: today.toISOString(),
      end: tomorrow.toISOString()
    });

    // Count open_bill for today
    const open_bill_count = await sdk.db.open_bill.countDocuments({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

    // Count transaction for today
    const transaction_count = await sdk.db.transaction.countDocuments({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

    const todayCount = open_bill_count + transaction_count;

    console.log("Today's transaction count:", todayCount);
    const formatted_number = String(todayCount + 1).padStart(6, '0');

    return response.status(200).json({
      message: "Success get_order_number",
      result: formatted_number,
    });
  } catch (error) {
    console.log("Error get_order_number", error);
    return response.status(500).json({
      message: "Error get_order_number",
      error: error.message
    });
  }
}

async function get_history_transaction(request, response) {
  try {
    const shift_running = await sdk.db.shift_running.findOne({}).lean();
    
    if (!shift_running) {
      return response.status(404).json({
        message: "No active shift found",
        result: []
      });
    }

    // Check if shift_running date is in the future
    const currentDate = new Date();
    if (shift_running.createdAt > currentDate) {
      return response.status(400).json({
        message: "Invalid shift: start time is in the future",
        shift_date: shift_running.createdAt,
        result: []
      });
    }

    // Convert the date string to Date object if it isn't already
    const shiftStartDate = new Date(shift_running.createdAt);

    // Try the query with ISOString
    const transactions = await sdk.db.transaction.find({
      created_at: {
        $gte: shiftStartDate.toISOString()
      }
    })
    .sort({ created_at: -1 })
    .lean();

    return response.status(200).json({
      message: "Success get_history_transaction",
      result: transactions
    });
  } catch (error) {
    console.error("Error in get_history_transaction:", error);
    return response.status(500).json({
      message: "Error fetching transaction history",
      error: error.message,
      result: []
    });
  }
}

module.exports = {
  create_transaction,
  get_order_number,
  get_history_transaction,
};