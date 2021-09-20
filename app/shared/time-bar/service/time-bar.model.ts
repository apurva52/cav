import { AppError } from 'src/app/core/error/error.model';
import { AppMenuItem } from '../../menu-item/service/menu-item.model';
import { MenuItem } from 'primeng';

export interface GlobalTimebarResponse {
    viewBy?: Array<AppMenuItem>;
    bestViewBy?: Array<AppMenuItem>;
    timePeriod?: Array<AppMenuItem>;
    error?: AppError;
    running?: boolean;
    selectedPreset?: string;
    selectedViewBy?: string;
    times?: number[];
}

export interface TimebarValue {
    timePeriod: TimebarMenuConfig;
    viewBy: TimebarMenuConfig;
    time: TimebarTimeConfig;
    running: boolean;
    discontinued: boolean;
    includeCurrent: boolean;
}

export interface TimebarValueInput {
    timePeriod?: string;
    viewBy?: string;
    running?: boolean;
    discontinued?: boolean;
    includeCurrent?: boolean;
    updateTime?: boolean;
}


export interface TimeMarker {
    label: string;
    value: number;
    position: string;
}
export interface AlertMarker {
    label: string;
    value: number;
    position: string;
}

export interface TimebarValue {
    timePeriod: TimebarMenuConfig,
    viewBy: TimebarMenuConfig
}

export interface TimebarTimeFrameTimeConfig {
    raw: string;
    value: number;
}

export interface TimebarTimeConfig {
    min: TimebarTimeFrameTimeConfig;
    max: TimebarTimeFrameTimeConfig;
    frameStart: TimebarTimeFrameTimeConfig;
    frameEnd: TimebarTimeFrameTimeConfig;
}

export interface TimebarMenuConfig {
    selected: MenuItem;
    previous: MenuItem;
    options: MenuItem[];
}