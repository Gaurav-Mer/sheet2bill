/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ManhattanTemplate } from './templates/ManhattanTemplate'; // We would add this later

import InvoiceTemplate from "../invoices/InvoiceTemplate";
import { ManhattanTemplate } from "./ManhattanTemplate";
import { ZurichTemplate } from "./ZurichTemplate";

// Define the props for our router component
type InvoiceTemplateRouterProps = {
    templateId?: string;
    data: any;
};

// This component acts as a router, selecting the correct template based on the ID.
export const CurrentTemplate = ({ templateId, data }: InvoiceTemplateRouterProps) => {
    console.log("templateId", templateId)
    switch (templateId) {
        // case 'manhattan':
        //   return <ManhattanTemplate data={data} />;
        case 'zurich':
            // Default to the Zurich template if no match is found
            return <ZurichTemplate data={data} />;
        case 'manhattan':
            // Default to the Zurich template if no match is found
            return <ManhattanTemplate data={data} />;
        default:
            return <InvoiceTemplate data={data as any} />
    }
};