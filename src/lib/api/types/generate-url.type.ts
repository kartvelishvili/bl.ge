import {GenerateUrlArguments} from "@/lib/api/types/interfaces/generate-url-arguments.interface";

export type GenerateUrlType = <T>(data: GenerateUrlArguments<T>) => string;
