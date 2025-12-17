/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ManhattanTemplate } from './templates/ManhattanTemplate'; // We would add this later

import InvoiceTemplate from "../invoices/InvoiceTemplate";
import { BasilTemplate } from "./BasilTemplate";
import { BerlinTemplate } from "./BerlinTemplate";
import { JaipurTemplate } from "./JaipurTemplate";
import { KyotoTemplate } from "./KyotoTemplate";
import LuxeTemplate from "./LuxeTemplate";
import { ManhattanTemplate } from "./ManhattanTemplate";
import MonacoTemplate from "./MonacoTemplate";
import { StockholmTemplate } from "./StockholmTemplate";
import { ZurichTemplate } from "./ZurichTemplate";

// Define the props for our router component
type InvoiceTemplateRouterProps = {
    templateId?: string;
    data: any;
};

// This component acts as a router, selecting the correct template based on the ID.
export const CurrentTemplate = ({ templateId, data }: InvoiceTemplateRouterProps) => {
    switch (templateId) {
        // case 'manhattan':
        //   return <ManhattanTemplate data={data} />;
        case 'zurich':
            // Default to the Zurich template if no match is found
            return <ZurichTemplate data={data} />;
        case 'manhattan':
            // Default to the Zurich template if no match is found
            return <ManhattanTemplate data={data} />;
        case 'stockholm': // NEW
            return <StockholmTemplate data={data} />;
        case 'jaipur':
            // Default to the Zurich template if no match is found
            return <JaipurTemplate data={data} />;
        case 'berlin':
            // Default to the Zurich template if no match is found
            return <BerlinTemplate data={data} />;
        case 'kyoto':
            // Default to the Zurich template if no match is found
            return <KyotoTemplate data={data} />;

        case 'basel':
            // Default to the Zurich template if no match is found
            return <BasilTemplate data={data as any} />;
        case "monaco":
            return <MonacoTemplate data={data as any} />;
        case "luxe":
            return <LuxeTemplate data={data as any} />;
        default:
            return <InvoiceTemplate data={data as any} />
    }
};