"use strict"

const sdk = require("../../libraries");
const { exec } = require('child_process');

// Printer commands
const COMMANDS = {
  INIT: '\x1B\x40',         // Initialize printer
  ALIGN_LEFT: '\x1B\x61\x00',
  ALIGN_CENTER: '\x1B\x61\x01',
  ALIGN_RIGHT: '\x1B\x61\x02',
  BOLD_ON: '\x1B\x45\x01',
  BOLD_OFF: '\x1B\x45\x00',
  DOUBLE_WIDTH: '\x1B\x21\x20',
  NORMAL_WIDTH: '\x1B\x21\x00',
  CUT_PAPER: '\x1D\x56\x41'
};

async function create_transaction(request, response) {
  try {
    console.log("create_transaction", JSON.stringify(request.body, null, 2));

    const data = {
      storeName: 'Trans Studio Bandung',
      phone: '02287341730',
      invoice: '1735406506818',
      orderTime: '12/29/2024 12:21:46 AM',
      table: '-',
      type: 'Take Away',
      cashier: 'Admin',
      items: [
        {
          qty: 2,
          name: 'Ice Taro Latte',
          price: 20000,
          options: [
            { name: 'Ice Level - Normal', price: 0 },
            { name: 'Sugar Level - Normal', price: 0 },
            { name: 'Topping - Chips', price: 3600 },
            { name: 'Topping - Jelly', price: 1000 }
          ]
        },
        {
          qty: 1,
          name: 'Ice Taro Latte',
          price: 10000,
          options: [
            { name: 'Ice Level - Less', price: 0 }
          ]
        }
      ],
      totalItems: 3,
      subtotal: 34600,
      total: 34600,
      payment: {
        method: 'CASH',
        amount: 34600
      }
    };

    const dividerLine = '-'.repeat(48) + '\n';

    const receiptContent = [
      COMMANDS.INIT,
      
      // Logo placeholder (you'll need to implement image handling)
      COMMANDS.ALIGN_CENTER,
      '[LOGO]\n\n',
      
      // Header
      data.storeName + '\n\n',
      'Phone: ' + data.phone + '\n',
      
      dividerLine,
      
      // Order details
      COMMANDS.ALIGN_LEFT,
      `Invoice    : ${data.invoice}\n`,
      `Order Time : ${data.orderTime}\n`,
      `Table      : ${data.table}\n`,
      `Type       : ${data.type}\n`,
      `Cashier    : ${data.cashier}\n`,
      
      dividerLine,
      
      // Items
      ...data.items.map(item => {
        let itemString = `${item.qty} x ${item.name}`.padEnd(32) + 
                        `${item.price.toLocaleString()}`.padStart(16) + '\n';
        
        // Add options
        itemString += item.options.map(opt => 
          `    ${opt.name}`.padEnd(32) + 
          `${opt.price.toLocaleString()}`.padStart(16) + '\n'
        ).join('');
        
        return itemString;
      }),
      
      dividerLine,
      
      // Totals
      `Total Items: ${data.totalItems}\n`,
      dividerLine,
      `Subtotal:`.padEnd(32) + `${data.subtotal.toLocaleString()}`.padStart(16) + '\n',
      `Total:`.padEnd(32) + `${data.total.toLocaleString()}`.padStart(16) + '\n',
      dividerLine,
      `${data.payment.method}`.padEnd(32) + `${data.payment.amount.toLocaleString()}`.padStart(16) + '\n',
      
      // Cut paper
      '\n\n\n',
      COMMANDS.CUT_PAPER
    ].join('');

    // Send to printer
    await new Promise((resolve, reject) => {
      const hexContent = Buffer.from(receiptContent).toString('hex');
      exec(
        `echo "${hexContent}" | xxd -r -p | lp -d pos_print`,
        async (error, stdout, stderr) => {
          if (error) {
            console.error('Print error:', error);
            reject(error);
          } else {
            console.log('Print success:', stdout);
            // Execute cut paper command separately
            const cutCommand = Buffer.from(COMMANDS.CUT_PAPER).toString('hex');
            try {
              await exec(`echo "${cutCommand}" | xxd -r -p | lp -d pos_print`);
              console.log('Paper cut successfully');
              resolve(stdout);
            } catch (cutError) {
              console.error('Cut paper error:', cutError);
              reject(cutError);
            }
          }
        }
      );
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
