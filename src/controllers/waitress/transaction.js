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

const void_queue = new Queue(async function (task, cb) {
  let retries = 0;
  const maxRetries = 10000;
  const retryDelay = 5000;

  console.log("void_queue");

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
        await print_void_item(printer, failedTask.data);
      }

      // Print current task
      await print_void_item(printer, task.data);

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

async function print_void_item(printer, data) {
  try {
    console.log("udah sampe sini?", printer);
    
    // Print receipt
    printer.clear();
    // Header
    printer.alignCenter();
    printer.bold(true);
    printer.println("Void Item");
    printer.bold(false);
    printer.alignLeft();
    printer.drawLine();
    printer.println(`Invoice    : ${data.invoice_id}`);
    printer.println(`Order No   : ${data.order_number}`);
    printer.drawLine();

    console.log("data.transaction_items", JSON.stringify(data.transaction_items, null, 2));
    

    for (const item of data.transaction_items) {
      printer.println(`${item.name}`);

      // Addons
      item.addon.forEach(addon => {
        addon.list.forEach(opt => {
          if (opt.selected) {
            printer.println(`    ${addon.name} - ${opt.name}`);
          }
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

async function create_transaction(request, response) {
  try {
    console.log("create_transaction", JSON.stringify(request.body, null, 2));
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

    request.body.original_cart = request.body
      .original_cart.filter(item => !item.is_existing_item && !item.is_voided);
      
    request.body.original_cart = request.body
      .original_cart.map(item => {
      item.is_existing_item = true;

        return item;
      });

    request.body.transaction_items = request.body
      .transaction_items.filter(item => !item.is_existing_item && !item.is_voided);
      
    request.body.transaction_items = request.body
      .transaction_items.map(item => {
      item.is_existing_item = true;

        return item;
      });

    const todayCount = open_bill_count + transaction_count;

    console.log("Today's transaction count:", todayCount);
    const formatted_number = String(todayCount + 1).padStart(6, '0');

    sdk.db.notification.insertMany({
      ...request.body,
      order_number: formatted_number,
      created_by: "waitress",
      status: "accepted",
    });

    console.log("sampe sini kah?");

    const existing_order = await sdk.db.open_bill.findOne({
      invoice_id: request.body.invoice_id,
    });

    if (existing_order) {
      await sdk.db.open_bill.updateOne(
        {
          invoice_id: request.body.invoice_id
        },
        { $set: { ...request.body } },
      );
    } else {
      await sdk.db.open_bill.create({
        ...request.body,
        order_number: formatted_number,
        created_by: "waitress",
        status: "accepted",
      });
    }
    
    let target_table = await sdk.db.table.findOne({ "tables.id": request.body.table_id });

    target_table = target_table.toObject();

    const [_target] = target_table.tables.filter(_table => _table.id === request.body.table_id);

    console.log("_target 1", _target);
    console.log("_target 2", );

    _target.running_orders.push({
      ...request.body,
      order_index  : _target.running_orders.length + 1,
      order_number : formatted_number,
      created_by   : "waitress",
      status       : "accepted",
    })

    await sdk.db.table.updateOne(
      {
        "tables.id": request.body.table_id
      },
      {
        $set: {
          "tables.$.reference_id"  : request.body.invoice_id,
          "tables.$.is_occupied"   : true,
          "tables.$.running_orders": _target.running_orders,
        }
      }
    );
    // If outlet is a Mongoose document, try accessing the raw object
    const outletObj = request.body.outlet;
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

    execute_printer(request.body, outletObj.config.printer, outletObj.config.footer_content)

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

async function void_table_item(request, response) {
  try {
    let [cashier] = await sdk.db.cashier.find({
      $or: [{ cashier_id: request.body.user }],
    });
    
    cashier = cashier.toObject();
    const target_item = [];

    console.log("cashier", cashier);
    if (String(cashier.pin) !== String(request.body.pin)) {
      return response.status(401).json({
        message: "Invalid credentials",
        error: "Invalid credentials"
      });
    }

    if (!cashier) {
      return response.status(401).json({
        message: "Invalid credentials",
        error: "Invalid credentials"
      });
    }

    let target_table = await sdk.db.table.findOne({ "tables.id": request.body.table_id });

    target_table = target_table.toObject();

    console.log("target_table", target_table);

    const [_target] = target_table.tables.filter(_table => _table.id === request.body.table_id);

    console.log("_target", _target);
    
    const order_items = _target.running_orders.map(order => {
      if (order.order_index == request.body.order_index) {
        order.original_cart.map((item, index) => {
          console.log("ada 0", index, request.body.void_item_target);

          if (index == request.body.void_item_target) {
            console.log("ada 1");
            
            item.is_existing_item = true;
            item.is_voided = true;
            item.voided_reason = request.body.reason;
            item.voided_by = request.body.user;
            item.voided_at = new Date();

            target_item.push(item);
          }

          return item;
        });
        
        order.transaction_items.map((item, index) => {
          console.log("ada 0", index, request.body.void_item_target);

          if (index == request.body.void_item_target) {
            console.log("ada 1");
            
            item.is_existing_item = true;
            item.is_voided = true;
            item.voided_reason = request.body.reason;
            item.voided_by = request.body.user;
            item.voided_at = new Date();
          }

          return item;
        });
      }

      return order;
    });

    await sdk.db.table.updateOne(
      {
        "tables.id": request.body.table_id
      },
      {
        $set: {
          "tables.$.running_orders": order_items,
        }
      }
    );

    // console.log("kesini?", request.body.table_id, JSON.stringify(order_items, null, 2));
    let table = await sdk.db.table.findOne({ "tables.id": request.body.table_id });

    table = table.toObject();

    let [_table] = table.tables.filter(table => table.id === request.body.table_id);

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
      void_queue.push({
        data: {
          invoice_id: request.body.invoice_id,
          order_number: request.body.order_number,
          transaction_items: target_item,
          logo: '../../assets/outlet-logo.png',
          footers: outletObj.config.footer_content,
        },
        printer_interface: outletObj.config.printer,
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return response.json(_table);
  } catch (error) {
    console.log("[void_table_item].error", error);
  }
}

async function execute_printer(body, printer, footer) {
  try {
    // Add print job to queue
    await new Promise((resolve, reject) => {
      cashier_queue.push({
        data: {
          ...body,
          is_open_bill: true,
          logo: '../../assets/outlet-logo.png',
          footers: footer,
        },
        printer_interface: printer,
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    print_stations(body);

    return true;
  } catch (error) {
    console.log("Error execute_printer", error);
    return false;
  }
}

async function print_receipt(printer, data) {
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

    // if (!is_open_bill) {
    //   print_stations(data);
    // }
    
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    throw error;
  }
}

async function print_stations(data) {
  try {
    console.log("kesini 1?");
    const stations = await sdk.db.station.find({
      printer_id: { $ne: null }  // Only get stations where printer field is not null
    });

    console.log("kesini?", stations);

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
    
    if (data.table_name) {
      printer.println(`Table      : ${data.table_group_name} - ${data.table_name}`);
    }

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

    const transactions = await sdk.db.transaction.find({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

    console.log("Transactions:", transactions);

    return response.status(200).json({
      message : "Success get_history_transaction",
      result  : transactions,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message : "Error get_history_transaction",
      error   : error.message
    });
  }
}

async function update_transaction(request, response) {
  try {
    console.log("update_transaction", JSON.stringify(request.body.invoice_id, null, 2));

    const transaction = await sdk.db.open_bill.findOne({ invoice_id: request.body.invoice_id });

    console.log("transaction", transaction);

    await sdk.db.open_bill.updateOne(
      { invoice_id: request.body.invoice_id },
      {
        $set: {
          "notes" : request.body.notes,
          "subtotal" : request.body.subtotal,
          "total_discount" : request.body.total_discount,
          "special_discount" : request.body.special_discount,
          "total_charges" : request.body.total_charges,
          "grand_total" : request.body.grand_total,
          "subtotal_without_product_discount" : request.body.subtotal_without_product_discount,
          "unpaid_amount" : request.body.unpaid_amount,
          "transaction_items" : request.body.transaction_items,
          "original_cart" : request.body.original_cart,
          "total_items" : request.body.total_items,
          "updatedAt" : new Date(),
        }
      }
    );

    return response.send("success > update_transaction");
  } catch (error) {
    console.log("[update_transaction].error", error);

    return response.send("failed");
  }
}

async function transfer_table(request, response) {
  try {
    return response.send("success > transfer_table");
  } catch (error) {
    console.log("[transfer_table].error", error);

    return response.send("failed");
  }
}

async function history_transaction(request, response) {
  try {
    return response.send("success > history_transaction");
  } catch (error) {
    console.log("[history_transaction].error", error);

    return response.send("failed");
  }
}

async function waitress_notification(request, response) {
  try {
    return response.send("success > waitress_notification");
  } catch (error) {
    console.log("[waitress_notification].error", error);

    return response.send("failed");
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

    // Count transactions for today
    const todayCount = await sdk.db.transaction.countDocuments({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

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

module.exports = {
  create_transaction,
  update_transaction,
  transfer_table,
  history_transaction,
  waitress_notification,
  get_order_number,
  get_history_transaction,
  void_table_item,
};
