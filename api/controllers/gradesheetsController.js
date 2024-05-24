const axios = require('axios');
const { PDFDocument } = require('pdf-lib');

async function fetchGradesheet(admnNo) {
    console.log("admnNo", admnNo);
    const url = "https://parent.iitism.ac.in/index.php/parent_portal/grade_sheet/print_grade_report/0/B.TECH";
    const data = { "admn_no": admnNo };

    try {
        const response = await axios.post(url, data, {
            responseType: 'arraybuffer',
             // Ensure response data is treated as binary
             headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Add any required headers
                // Add any additional headers if needed
            }
        });

        return response.data; // Return the gradesheet PDF content
    } catch (error) {
        throw new Error(`Error fetching gradesheet for admission number ${admnNo}: ${error.message}`);
    }
}

async function getGradesheets(req, res, next) {
    try {
        // Retrieve roll number range from query parameters
        const startRollNo = parseInt(req.query.startRollNo);
        const endRollNo = parseInt(req.query.endRollNo);

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Loop through roll numbers in the range
        for (let rollNo = startRollNo; rollNo <= endRollNo; rollNo++) {
            // Fetch gradesheet for the current roll number
            const gradesheet = await fetchGradesheet(rollNo);

            // Load the fetched gradesheet as a PDF document
            const pdfDoc = await PDFDocument.load(gradesheet);

            // Add pages from the fetched gradesheet to the merged PDF document
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => {
                mergedPdf.addPage(page);
            });
        }

        // Serialize the merged PDF to a buffer
        const mergedPdfBytes = await mergedPdf.save();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged_gradesheets.pdf"');

        // Send the merged PDF as the response
        res.send(Buffer.from(mergedPdfBytes));
    } catch (error) {
        next(error);
    }
}


async function getGradesheetByRoll(req, res, next) {
    try {
        // Retrieve roll number from request parameters
        const rollNo = req.params.rollNo;
        console.log(rollNo);
        // Fetch gradesheet for the specified roll number
        const gradesheet = await fetchGradesheet(rollNo);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="gradesheet_${rollNo}.pdf"`);

        // Send the gradesheet as the response
        res.send(gradesheet);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getGradesheets, getGradesheetByRoll
}
