import { ImageInput } from '@/types/image';

export const DEMO_SATELLITE_IMAGES: Record<string, ImageInput> = {
  opticalHyderabad: {
    id: 'img-hyd-optical-01',
    fileName: 'sentinel2_hyderabad_2026.tif',
    url: '/images/assets/map-satellite.jpg',
    format: 'geotiff',
    modality: 'multispectral',
    acquisitionDate: '2026-03-15',
    width: 2048,
    height: 2048,
    metadata: {
      satellite: 'Sentinel-2B',
      sensor: 'MSI',
      spatialResolutionMeters: 10,
    },
  },
  temporal2022: {
    id: 'img-temp-2022',
    fileName: 'sentinel2_hyderabad_2022.tif',
    url: '/images/assets/temporal-2022.jpg',
    format: 'geotiff',
    modality: 'optical',
    acquisitionDate: '2022-04-10',
    width: 2048,
    height: 2048,
  },
  temporal2026: {
    id: 'img-temp-2026',
    fileName: 'sentinel2_hyderabad_2026.tif',
    url: '/images/assets/temporal-2026.jpg',
    format: 'geotiff',
    modality: 'optical',
    acquisitionDate: '2026-03-15',
    width: 2048,
    height: 2048,
  },
  sarBackscatter: {
    id: 'img-sar-fusion',
    fileName: 'sentinel1_sar_cband_vv.tif',
    url: '/images/assets/sar-backscatter.jpg',
    format: 'geotiff',
    modality: 'sar',
    acquisitionDate: '2026-03-12',
    width: 2048,
    height: 2048,
  },
};
