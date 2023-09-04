import arrowRight from './arrow-right.svg';
import arrowLeft from './arrow-left.svg';
import arrowDown from './arrow-down.svg';

import dataSource from './icons_data-source.svg';
import embed from './icons_embed.svg';

import data from './icons_data.svg';
import deaths from './icons_deaths.svg';
import fuels from './icons_fuels.svg';
import pm25 from './icons_pm25.svg';
import sectors from './icons_sectors.svg';
import policies from './icons_policies.svg';
import search from './icons_search-table.svg';

import nd from './disease_icons/small/icons_nd.svg';
import stroke from './disease_icons/small/icons_stroke.svg';
import ischemic from './disease_icons/small/icons_ischemic.svg';
import lri from './disease_icons/small/icons_lri.svg';
import lungcancer from './disease_icons/small/icons_lungcancer.svg';
import diabetes from './disease_icons/small/icons_diabetes.svg';
import copd from './disease_icons/small/icons_copd.svg';

import check from './icons_check.svg';
import whitecheck from './white-check.svg';

export const alignment = {
  pm25: 'transform: translateY(-7%)',
  sectors: 'transform: translateY(-8%)',
};

export default {
  dataSource,
  embed,
  check,
  whitecheck,
  arrows: {
    right: arrowRight,
    left: arrowLeft,
    down: arrowDown
  },
  menu : {
    data,
    search,
    deaths,
    fuels,
    pm25,
    sectors,
    policies
  },
  diseases: {
    nd,
    stroke,
    ischemic,
    lri,
    lungcancer,
    diabetes,
    copd
  }
};
