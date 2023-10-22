const fs = require('fs');
const {mdToPdf} = require('md-to-pdf');

const runsInWatchMode = process.argv.includes('--watch');

const onePagerPath = 'one-pager.md';
const designDocPath = 'design-doc.md';

const generatePdf = async () => {
    const onePagerContent = fs.readFileSync('one-pager.md', 'utf8');
    const designDocContent = fs.readFileSync('design-doc.md', 'utf8');
    const pageBreak = '<div class="page-break"></div>\n\n';
    const allContent = onePagerContent + pageBreak + designDocContent;

    const pdf = await mdToPdf({content: allContent}, {
        body_class: 'markdown-body',
        css: `
          .markdown-body {
            font-size: 12px;
          }
          .markdown-body table {
            font-size: 10px;
          }
        `,
        pdf_options: {
            format: 'A4',
            margin: {
                top: '20mm',
                bottom: '30mm',
                left: '18mm',
                right: '18mm'
            },
            headerTemplate: `
                <style>
                  section {
                    margin: 0 auto;
                    font-family: system-ui;
                    font-size: 11px;
                  }
                </style>`,
            footerTemplate: `
                <section>
                  <div>
                    Page <span class="pageNumber"></span>
                    of <span class="totalPages"></span>
                  </div>
                </section>`,
        }
    }).catch(console.error);

    if (pdf) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const outputFile = runsInWatchMode ? 'result.pdf' : `result-${timestamp}.pdf`;
        fs.writeFileSync(outputFile, pdf.content);
    }
};

if (runsInWatchMode) {
    fs.watch(onePagerPath, generatePdf);
    fs.watch(designDocPath, generatePdf);
} else {
    generatePdf().then(r => console.log('Done'));
}
