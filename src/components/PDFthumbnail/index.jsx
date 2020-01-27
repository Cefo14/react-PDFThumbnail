import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';

import pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;


const PDFThumbnail = ({
  alt,
  url,
  className,
  style,
  page,
  scale,
}) => {
  const [localURL, setLocalURL] = useState('');

  /**
   *
   * @param {string} _url
   * @returns {PDFDocumentProxy}
   */
  const loadPDF = async (_url) => {
    const pdf = await pdfjsLib.getDocument(_url).promise;
    return pdf;
  };

  /**
   *
   * @param {PDFDocumentProxy} pdf
   * @param {Number} indexPage 
   * @returns {Number}
   */
  const getValidPage = (pdf, indexPage) => {
    const { numPages } = pdf;
    if (indexPage < 1) return 1;
    if (indexPage > numPages) return numPages;
    return indexPage;
  };

  /**
   *
   * @param {PDFDocumentProxy} pdf
   * @param {Number} indexPage 
   * @returns {PDFPageProxy}
   */
  const readPage = async (pdf, indexPage) => {
    const validPage = getValidPage(pdf, indexPage);
    const page = await pdf.getPage(validPage);
    return page;
  };

  /**
   * 
   * @param {PDFPageProxy} _page
   * @param {Number} _scale
   * @returns {PDFPageProxy}
   */
  const transformPDFPageToCanvas = async (_page, _scale) => {
    const pageVp = _page.getViewport({ scale: _scale });

    const canvas = document.createElement('canvas');
    canvas.width = pageVp.width;
    canvas.height = pageVp.height;

    await _page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: pageVp,
    }).promise;

    return canvas;
  };

  /**
   *
   * @param {HTMLCanvasElement} canvas 
   */
  const loadCanvas = (canvas) => {
    const thumbnailPDF = canvas.toDataURL();
    setLocalURL(thumbnailPDF);
  };

  /**
   * 
   * @param {String} _url
   * @param {Number} _page
   * @param {Number} _scale
   */
  const readPDF = async (_url, _page, _scale) => {
    try {
      const pdf = await loadPDF(_url);
      const pdfPage = await readPage(pdf, _page);
      const canvasPDF = await transformPDFPageToCanvas(pdfPage, _scale);
      loadCanvas(canvasPDF);
    }
    catch(error) {
      setLocalURL('');
    }
  };

  useEffect(() => {
    readPDF(url, page, scale);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, page, scale]);

  return (
    <img
        alt={alt || localURL}
        src={localURL}
        className={className}
        style={style}
    />
  );
};

PDFThumbnail.propTypes = {
  alt: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  page: PropTypes.number,
  scale: PropTypes.number,
};

PDFThumbnail.defaultProps = {
  alt: '',
  url: '',
  className: '',
  style: {},
  page: 0,
  scale: 1,
};

export default memo(PDFThumbnail);