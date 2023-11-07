import { ExposureType } from '../models/exposure.model';

export const EXPOSURE_TYPES: ExposureType[] = [
    {
        id: '2023season',
        label: 'NFL 2023 Season',
        season: 2023,
        platform: 'underdog',
        cutoffDate: '9/07/2023',
        allowUpload: true,
        enableResurrection: true,
        active: true,
    },
    {
        id: '2023weeklywinners',
        label: 'NFL 2023 Season: Weekly Winners',
        season: 2023,
        platform: 'underdog',
        cutoffDate: '9/07/2023',
        allowUpload: true,
        enableResurrection: false,
        active: true,
    },
    {
        id: '2023superflex',
        label: 'NFL 2023 Season: Superflex',
        season: 2023,
        platform: 'underdog',
        cutoffDate: '9/07/2023',
        allowUpload: true,
        enableResurrection: false,
        active: true,
    },
    {
        id: '2023resurrection',
        label: 'NFL 2023 Resurrection',
        season: 2023,
        platform: 'underdog',
        cutoffDate: '10/12/2023',
        allowUpload: true,
        enableResurrection: false,
        active: true,
    }
];

// export const EXPOSURE_TYPES: string[][] = [
//     ['2023season', 'NFL 2023 Season', '9/07/2023'],
//     ['2023weeklywinners', 'NFL 2023 Season: Weekly Winners', '9/07/2023'],
//     ['2023superflex', 'NFL 2023 Season: Superflex', '9/07/2023'],
//     ['2023resurrection', 'NFL 2023 Resurrection', '10/12/2023'],
// ];