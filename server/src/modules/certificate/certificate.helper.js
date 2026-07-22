const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateQRCodeBuffer = async (text) => {
  try {
    return await QRCode.toBuffer(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
    });
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

const generateCertificatePDF = async (data) => {
  const {
    volunteerName,
    programName,
    organization,
    volunteerHours,
    completionDate,
    certificateNumber,
    authorizedSignatory,
    verificationUrl,
    description,
    skillsEarned,
  } = data;

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
  const buffers = [];

  doc.on('data', (chunk) => buffers.push(chunk));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc.rect(30, 30, pageWidth - 60, pageHeight - 60).lineWidth(4).stroke('#1a1a2e');
  doc.rect(36, 36, pageWidth - 72, pageHeight - 72).lineWidth(1).stroke('#d4af37');

  const centerX = pageWidth / 2;

  doc
    .fontSize(40)
    .font('Helvetica-Bold')
    .fillColor('#1a1a2e')
    .text('CERTIFICATE OF COMPLETION', centerX, 80, { align: 'center' });

  doc.moveDown(1.2);

  if (description) {
    doc
      .fontSize(14)
      .font('Helvetica-Oblique')
      .fillColor('#555555')
      .text(description, centerX, null, { align: 'center', width: pageWidth - 200 });
    doc.moveDown(0.8);
  }

  doc
    .fontSize(16)
    .font('Helvetica')
    .fillColor('#333333')
    .text('This is to certify that', centerX, null, { align: 'center' });

  doc.moveDown(0.8);

  doc
    .fontSize(32)
    .font('Helvetica-Bold')
    .fillColor('#1a1a2e')
    .text(volunteerName, centerX, null, { align: 'center' });

  doc.moveDown(0.8);

  doc
    .fontSize(16)
    .font('Helvetica')
    .fillColor('#333333')
    .text('has successfully completed the program', centerX, null, { align: 'center' });

  doc.moveDown(0.4);

  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .fillColor('#1a1a2e')
    .text(programName, centerX, null, { align: 'center' });

  doc.moveDown(1);

  doc
    .fontSize(14)
    .font('Helvetica')
    .fillColor('#555555')
    .text(`Organization: ${organization}`, centerX, null, { align: 'center' });

  doc.text(`Volunteer Hours: ${volunteerHours}`, centerX, null, { align: 'center' });
  doc.text(
    `Completion Date: ${new Date(completionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    centerX,
    null,
    { align: 'center' }
  );
  doc.text(`Certificate Number: ${certificateNumber}`, centerX, null, { align: 'center' });

  if (skillsEarned && skillsEarned.length > 0) {
    doc.text(`Skills: ${skillsEarned.join(', ')}`, centerX, null, { align: 'center' });
  }

  try {
    const qrBuffer = await generateQRCodeBuffer(verificationUrl);
    doc.image(qrBuffer, doc.page.width - 220, 280, { width: 140 });
  } catch (_qrError) {
    doc.fontSize(10).fillColor('#999999').text('QR Code unavailable', doc.page.width - 220, 300, { width: 140, align: 'center' });
  }

  doc
    .fontSize(11)
    .font('Helvetica')
    .fillColor('#777777')
    .text(`Verify at: ${verificationUrl}`, 80, pageHeight - 100, { width: pageWidth - 320 });

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#1a1a2e')
    .text('Authorized Signatory', 80, pageHeight - 140);

  doc
    .moveTo(80, pageHeight - 120)
    .lineTo(300, pageHeight - 120)
    .stroke('#1a1a2e');

  doc.font('Helvetica').fontSize(12).text(authorizedSignatory, 80, pageHeight - 100);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#888888')
    .text('Disha for India', centerX, pageHeight - 60, { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
};

const uploadBufferToCloudinary = async (buffer, folder, resourceType = 'auto') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

module.exports = {
  generateCertificatePDF,
  generateQRCodeBuffer,
  uploadBufferToCloudinary,
  cloudinary,
};
