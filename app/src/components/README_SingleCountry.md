# SingleCountry Component

A reusable Svelte component for displaying detailed pollution data for individual countries. This component was extracted from the CartoCountries component to provide a focused view of single country data.

## Features

- **Interactive Legend**: Click on legend items to filter data by sector or fuel type
- **Bar Chart Visualization**: Horizontal bar chart showing pollution data breakdown
- **Detailed Data Table**: Clickable rows with exact values and percentages
- **Responsive Design**: Adapts to different screen sizes
- **Configurable Display**: Toggle legend, chart, and details sections
- **Data Type Support**: Works with both sector and fuel type data
- **Value Formatting**: Supports absolute values (µg/m³) or percentages

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `countryCode` | `string` | `''` | ISO country code (e.g., "USA") |
| `countryName` | `string` | `''` | Full country name (e.g., "United States") |
| `dataType` | `'sectors' \| 'fuels'` | `'sectors'` | Type of data to display |
| `pollutionData` | `Array<{type: string, value: number}>` | `[]` | Array of pollution data objects |
| `totalValue` | `number` | `0` | Sum of all pollution values |
| `valueType` | `'number' \| 'percentage'` | `'number'` | How to display values |
| `showLegend` | `boolean` | `true` | Whether to show the legend |
| `showChart` | `boolean` | `true` | Whether to show the chart |
| `showDetails` | `boolean` | `true` | Whether to show the details table |

## Data Structure

The `pollutionData` prop expects an array of objects with the following structure:

```typescript
interface PollutionDataItem {
  type: string;    // Sector or fuel type identifier
  value: number;   // Pollution value (µg/m³)
}
```

### Supported Sector Types

- `residential` - Residential sector
- `transport` - Transportation sector
- `intlshipping` - International shipping
- `industry` - Industrial sector
- `commercial` - Commercial sector
- `afciddust` - Anthropogenic fugitive, combustion and industrial dust
- `othercombustion` - Other combustion sources
- `remainingsources` - Remaining sources
- `otherfires` - Landscape fires
- `agrwasteburning` - Agricultural waste burning
- `agriculture` - Agriculture sector
- `waste` - Waste sector
- `solvents` - Solvents
- `energy` - Energy sector
- `windblowndust` - Windblown dust

### Supported Fuel Types

- `process` - Process emissions
- `liquid` - Liquid fuels
- `solidbio` - Solid biofuels
- `coal` - Coal

## Usage Examples

### Basic Usage

```svelte
<script>
  import SingleCountry from './SingleCountry.svelte';
  
  const data = [
    { type: 'residential', value: 4.26 },
    { type: 'transport', value: 1.54 },
    { type: 'industry', value: 1.20 }
  ];
</script>

<SingleCountry
  countryCode="USA"
  countryName="United States"
  pollutionData={data}
  totalValue={7.0}
/>
```

### With Fuel Data

```svelte
<SingleCountry
  countryCode="CHN"
  countryName="China"
  dataType="fuels"
  pollutionData={fuelData}
  totalValue={25.0}
  valueType="percentage"
/>
```

### Customized Display

```svelte
<SingleCountry
  countryCode="DEU"
  countryName="Germany"
  pollutionData={sectorData}
  totalValue={12.5}
  showLegend={true}
  showChart={true}
  showDetails={false}
/>
```

## Integration with CartoCountries

This component can be integrated with the existing CartoCountries component to provide detailed views of individual countries. You can:

1. **Extract Country Data**: Parse the regional data from CartoCountries to get individual country information
2. **Create Country Instances**: Use this component to display detailed views for selected countries
3. **Maintain Consistency**: Use the same color schemes and data structures

## Styling

The component includes comprehensive CSS styling with:

- Modern card-based design
- Consistent color scheme matching the existing application
- Responsive breakpoints for mobile devices
- Smooth transitions and hover effects
- Accessible color contrasts

## Dependencies

- `src/colors` - For sector and fuel color schemes
- `src/components/common/Legend.svelte` - For the interactive legend
- Svelte 3+ for reactive features

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- SVG support for chart rendering

## Future Enhancements

Potential improvements could include:

- Additional chart types (pie charts, donut charts)
- Export functionality for data
- Comparison mode between multiple countries
- Time series data support
- Custom color schemes
- Accessibility improvements (ARIA labels, keyboard navigation)
