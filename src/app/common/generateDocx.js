export function isStyleLoaded(resourceUrl) {
  return !!document.querySelector(`link[href="${resourceUrl}"]`);
}

export function isScriptLoaded(resourceUrl) {
  return !!document.querySelector(`script[src="${resourceUrl}"]`);
}

export function loadStyleAsync(resourceUrl) {
  return new Promise((resolve, reject) => {
    if (!isStyleLoaded(resourceUrl)) {
      const head = document.getElementsByTagName('head')[0];
      const link = document.createElement('link');
      link.href = resourceUrl;
      link.rel = 'stylesheet';
      link.onload = resolve;
      link.onerror = reject;
      head.appendChild(link);
    } else {
      resolve();
    }
  });
}

export function loadScriptAsync(resourceUrl) {
  return new Promise((resolve, reject) => {
    if (!isScriptLoaded(resourceUrl)) {
      const script = document.createElement('script');
      script.src = resourceUrl;
      script.async = true;
      script.charset = 'utf-8';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    } else {
      resolve();
    }
  });
}

export async function loadResources() {
  await loadScriptAsync('https://cdnjs.cloudflare.com/ajax/libs/docxtemplater/3.19.7/docxtemplater.js');
  await loadScriptAsync('https://unpkg.com/pizzip@3.0.6/dist/pizzip.js');
  await loadScriptAsync('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js');
  await loadScriptAsync('https://unpkg.com/pizzip@3.0.6/dist/pizzip-utils.js');
}

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

export function generateDocx(dataDocx, templateFilename, outputFilename) {
  if (!dataDocx) return;

  loadFile(`/DocxTemplate/${templateFilename}.docx`, function(error, content) {
    if (error) {
      throw error;
    }

    function replaceErrors(key, value) {
      if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function(error, key) {
          error[key] = value[key];
          return error;
        }, {});
      }
      return value;
    }

    function errorHandler(error) {
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function(error) {
          return error.properties.explanation;
        }).join('\n');
        console.log('errorMessages', errorMessages);
      }
      throw error;
    }

    let zip = new PizZip(content);
    let doc;
    try {
      doc = new window.docxtemplater(zip);
    } catch (error) {
      errorHandler(error);
    }

    doc.setData(dataDocx);
    try {
      doc.render();
    } catch (error) {
      errorHandler(error);
    }

    let out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }); //Output the document using Data-URI
    saveAs(out, `${outputFilename}.docx`);
  });
}
