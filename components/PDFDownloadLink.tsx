import React from "react";
import { PDFDownloadLink as ReactPDFDownloadLink } from "@react-pdf/renderer";

export const PDFDownloadLink = ({ children, ...props }) => {
  return (
    <ReactPDFDownloadLink {...props}>
      {(pdfProps) => children(pdfProps)}
    </ReactPDFDownloadLink>
  );
};
