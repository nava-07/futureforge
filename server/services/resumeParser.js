const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const parseResume = async (filePath, fileType) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let extractedText = '';

    // Handle PDF parsing
    if (fileType === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } 
    // Handle DOCX parsing
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      filePath.toLowerCase().endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } 
    // Unsupported formats
    else {
      throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
    }

    if (!extractedText || !extractedText.trim()) {
      throw new Error('Extracted text is empty. The file might be corrupted or image-based.');
    }

    return { text: extractedText };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

module.exports = {
  parseResume
};
