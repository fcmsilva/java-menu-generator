        /*
     * Retrieves the text of a specif page within a PDF Document obtained through pdf.js 
     * 
     * @param {Integer} pageNum Specifies the number of the page 
     * @param {PDFDocument} PDFDocumentInstance The PDF document obtained 
     **/
    function getPageText(pageNum, PDFDocumentInstance) {
        // Return a Promise that is solved once the text of the page is retrieven
        return new Promise(function(resolve, reject) {
            PDFDocumentInstance.getPage(pageNum).then(function(pdfPage) {
                // The main trick to obtain the text of the PDF page, use the getTextContent method
                pdfPage.getTextContent().then(function(textContent) {
                    var textItems = textContent.items;
                    var finalString = "";

                    // Concatenate the string of the item to the final string
                    for (var i = 0; i < textItems.length; i++) {
                        var item = textItems[i];

                        finalString += item.str + " ";
                    }

                    // Solve promise with the text retrieven from the page
                    resolve(finalString);
                });
            });
        });
    }

    function readPDFFile(pdf) {
        return new Promise((resolve, reject) => {

                PDFJS.getDocument({
                    data: pdf
                }).then(function(pdf) {
                    var totalPages = pdf.pdfInfo.numPages;

                    // Extract the text
                    var text = "";

                    function nextPage(p) {
                    	console.log(p);
                        getPageText(p, pdf).then(function(textPage) {
                            text += textPage;
                            if (p < totalPages) {
                                nextPage(p + 1);
                            } else {
                                resolve(text);
                            }
                        }).catch(err => {
                        	reject(err);
                        });
                    }
                    nextPage(1);

                    //
                });
            });
        }
