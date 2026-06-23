const PDFDocument = require('pdfkit');

exports.generateReceiptPdf = (transaction) => {
   return new Promise((resolve, reject) => {
      try {
         const doc = new PDFDocument({ margin: 50, size: 'A4' });
         const buffers = [];

         doc.on('data', buffers.push.bind(buffers));
         doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
         });

         doc.font('Times-Roman')
            .fontSize(28)
            .fillColor('#1B263B')
            .text('THE SATURATION POINT', { align: 'center', characterSpacing: 2 })
            .moveDown(0.5);

         doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#D4AF37')
            .text('OFFICIAL RECEIPT', { align: 'center', characterSpacing: 4 })
            .moveDown(3);

         doc.fillColor('#2D3436');
         doc.fontSize(10)
            .text(`ORDER ID:`, { continued: true }).font('Helvetica-Bold').text(` ${transaction.id}`)
            .font('Helvetica').text(`DATE:`, { continued: true }).font('Helvetica-Bold').text(` ${new Date(transaction.createdAt).toLocaleString()}`)
            .font('Helvetica').text(`PAYMENT:`, { continued: true }).font('Helvetica-Bold').text(` ${transaction.paymentMethod}`)
            .moveDown();

         const userName = transaction.User ? `${transaction.User.firstName} ${transaction.User.lastName}` : 'Guest User';
         const userEmail = transaction.User ? transaction.User.email : 'N/A';

         doc.font('Helvetica').text(`CUSTOMER:`, { continued: true }).font('Helvetica-Bold').text(` ${userName}`)
            .font('Helvetica').text(`EMAIL:`, { continued: true }).font('Helvetica-Bold').text(` ${userEmail}`)
            .moveDown(3);

         const tableTop = doc.y;
         doc.font('Times-Bold')
            .fontSize(10)
            .fillColor('#636E72')
            .text('ITEM DESCRIPTION', 50, tableTop)
            .text('UNIT PRICE', 300, tableTop, { width: 80, align: 'right' })
            .text('QTY', 400, tableTop, { width: 40, align: 'center' })
            .text('SUBTOTAL', 460, tableTop, { width: 90, align: 'right' });

         doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#E2E8F0').stroke();

         let yPosition = tableTop + 30;
         doc.font('Helvetica').fillColor('#2D3436');

         if (transaction.TransactionItems && transaction.TransactionItems.length > 0) {
            transaction.TransactionItems.forEach(item => {
               const product = item.Product;
               const name = product ? product.name : 'Unknown Product';
               const price = parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 });
               const qty = item.quantity;
               const subtotal = parseFloat(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 });

               doc.text(name, 50, yPosition, { width: 240 })
                  .text(`PHP ${price}`, 300, yPosition, { width: 80, align: 'right' })
                  .text(qty.toString(), 400, yPosition, { width: 40, align: 'center' })
                  .text(`PHP ${subtotal}`, 460, yPosition, { width: 90, align: 'right' });

               yPosition += 25;
            });
         }

         doc.moveTo(50, yPosition + 10).lineTo(550, yPosition + 10).strokeColor('#E2E8F0').stroke();

         const subtotal = parseFloat(transaction.totalAmount) - 150;
         yPosition += 30;

         doc.font('Helvetica')
            .text('Subtotal:', 360, yPosition, { width: 80, align: 'right' })
            .text(`PHP ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 460, yPosition, { width: 90, align: 'right' })
            .moveDown();

         yPosition += 20;
         doc.text('Shipping Fee:', 360, yPosition, { width: 80, align: 'right' })
            .text('PHP 150.00', 460, yPosition, { width: 90, align: 'right' })
            .moveDown();

         yPosition += 30;
         doc.font('Times-Bold')
            .fontSize(12)
            .fillColor('#D4AF37')
            .text('GRAND TOTAL:', 340, yPosition, { width: 100, align: 'right' })
            .text(`PHP ${parseFloat(transaction.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 460, yPosition, { width: 90, align: 'right' });

         doc.end();

      } catch (error) {
         reject(error);
      }
   });
};
