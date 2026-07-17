import { Policy } from "./Policy";

export interface Annotation {
    annotation_id: number;
    policy: Policy;
    category: string;
    startId: number;
    endId: number;
    text: string;
    url: string;
    pretty_print: string;
    segment: number;
}