import arrowRight from './arrow-right.svg';
import arrowLeft from './arrow-left.svg';

import dataSource from './icons_data-source.svg';
import embed from './icons_embed.svg';

import data from './icons_data.svg';
import deaths from './icons_deaths.svg';
import fuels from './icons_fuels.svg';
import pm25 from './icons_pm25.svg';
import sectors from './icons_sectors.svg';
import policies from './icons_policies.svg';

export const alignment = {
  pm25: 'transform: translateY(-7%)',
  sectors: 'transform: translateY(-8%)',
};

export default {
  dataSource,
  embed,
  arrows: {
    right: arrowRight,
    left: arrowLeft
  },
  menu : {
    data,
    deaths,
    fuels,
    pm25,
    sectors,
    policies
  }
};
