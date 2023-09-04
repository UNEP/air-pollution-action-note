<script context="module" lang="ts">
  export interface GBDCleanAirData {
    id: string;
    initialInt: number;
    int0: number;
    int1: number;
    int2: number;
    int3: number;
    int4: number;
    aqg: number;
    int0Pop: number;
    int1Pop: number;
    int2Pop: number;
    int3Pop: number;
    int4Pop: number;
    aqgPop: number;
    pop: number;
  }
</script>

<script lang="ts">
  import Cartogram from "src/components/maps/Cartogram.svelte";
  import pm25data from "src/data/pm25_coords.json";
  import countries from "src/data/countries.json";
  import policies from "src/data/policiesData.json";
  import diseases from "src/data/diseases.json";
  import agreements from "src/data/agreementsData.json";
  import agreementsDefinitionLookup from "src/data/agreementsLookup.json";
  import gbdCleenAirData from "src/data/GBDCleanAirData.json";
  import countryNameDictionary from "src/data/countryDictionary.json";
  import deaths_data from "src/data/death_coords.json";
  import Legend from "src/components/common/Legend.svelte";
  import {
    colorPM25,
    colorHealth,
    colorPolices,
    colorDiseases,
    colorAgreements,
    colorGBD,
  } from "src/colors";
  import { createLookup } from "src/util";

  import type { CountryDataPoint } from "src/components/maps/Cartogram.svelte";
  import ScrollableX from "./common/ScrollableX.svelte";
  import EmbedFooter from "./EmbedFooter.svelte";
  import SectionTitle from "src/components/SectionTitle.svelte";
  import Head from "./Head.svelte";
  import diseasesDictionary from "src/data/diseasesDictionary.json";
  import diseasesGlobal from "src/data/diseasesGlobal.json";
  import Embed from "./Embed.svelte";
  import type { Content, HealthDisease, TextBlock } from "src/types";

  export var data: "pm25" | "health" | "policies" | "diseases" | "test";
  export var id: string;
  export var block: Content;
  export var head: string;
  export var text: TextBlock[];
  export var embed: string;
  export var isEmbed: boolean = false;
  export let cartogramAnnotation: boolean;
  export let showEmbed: boolean = true;
  export let index: number = 0;

  let selectedDisease: HealthDisease = "ischemic";

  interface PoliciesData {
    name: string;
    id: string;
    "ind-1": number;
    "tra-1": number;
    "tra-2": number;
    "waste-1": number;
    "aq-1": number;
    "agri-1": number;
    "aqms-1": number;
    "aqm-1": number;
    pYes: number;
    pNo: number;
    pAlmost: number;
  }

  interface DiseasesData {
    name: string;
    id: string;
    short: string;
    copd: number;
    diabetes: number;
    ischemic: number;
    lungcancer: number;
    lri: number;
    stroke: number;
    nd: number;
  }

  interface AgreementsData {
    name: string;
    id: string;
    "unep-country": string;
    eanet: number;
    "asean-trans": number;
    male: number;
    neaspec: number;
    rapap: number;
    kathmandu: number;
    clrtap: number;
    "eu-directive": number;
    "us-canada": number;
    lusaka: number;
    nairobi: number;
    abidjan: number;
    "lat-caribbean": number;
    arctic: number;
    nAgreements: number;
  }

  enum PoliciesStatus {
    Yes = 1,
    No = 2,
    Almost = 3,
    NoData = 4,
  }

  enum AgreementsStatus {
    Participant = 1,
    Observer = 2,
  }

  const policiesLookup = createLookup(
    policies,
    (d) => d.id,
    (d) => d
  );
  const diseasesLookup = createLookup(
    diseases,
    (d) => d.id,
    (d) => d
  );

  const agreementsLookup = createLookup(
    agreements,
    (d) => d.id,
    (d) => d
  );
  const countryNameDictionaryLookup = createLookup(
    countryNameDictionary,
    (d) => d.id,
    (d) => d
  );

  const gbdCleenAirLookup = createLookup(
    gbdCleenAirData,
    (d) => d.id,
    (d) => d
  );

  const gbdIndexToField = {
    0: "int0",
    1: "int1",
    2: "int2",
    3: "int3",
    4: "int4",
    5: "aqg",
  };

  let legendElementSelectedIndex: number = null;
  let clientWidth = 0;
  let width: number;
  let height: number;
  let scale: number = 0;
  let checked: boolean = true;

  let rerender: () => void;

  $: legendIsHovered = legendElementSelectedIndex !== null;

  const diseasesHoverText = (data: DiseasesData) => {
    return `In <b>${data.name}</b>, <b>${Math.round(
      data[selectedDisease] * 100
    )}% of deaths</b> from <b>${diseasesDictionary[
      selectedDisease
    ].toLocaleLowerCase()}</b> are attributable to outdoor fine particles.`;
  };
  const agreementsHoverText = (data: AgreementsData): string => {
    const participantAgreement = [];
    const observerAgreement = [];

    if (data.abidjan === AgreementsStatus.Participant)
      participantAgreement.push("abidjan");
    if (data.abidjan === AgreementsStatus.Observer)
      observerAgreement.push("abidjan");

    if (data.arctic === AgreementsStatus.Participant)
      participantAgreement.push("arctic");
    if (data.arctic === AgreementsStatus.Observer)
      observerAgreement.push("arctic");

    if (data["asean-trans"] === AgreementsStatus.Participant)
      participantAgreement.push("asean-trans");
    if (data["asean-trans"] === AgreementsStatus.Observer)
      observerAgreement.push("asean-trans");

    if (data.clrtap === AgreementsStatus.Participant)
      participantAgreement.push("clrtap");
    if (data.clrtap === AgreementsStatus.Observer)
      observerAgreement.push("clrtap");

    if (data.eanet === AgreementsStatus.Participant)
      participantAgreement.push("eanet");
    if (data.eanet === AgreementsStatus.Observer)
      observerAgreement.push("eanet");

    if (data["eu-directive"] === AgreementsStatus.Participant)
      participantAgreement.push("eu-directive");
    if (data["eu-directive"] === AgreementsStatus.Observer)
      observerAgreement.push("eu-directive");

    if (data.kathmandu === AgreementsStatus.Participant)
      participantAgreement.push("kathmandu");
    if (data.kathmandu === AgreementsStatus.Observer)
      observerAgreement.push("kathmandu");

    if (data["lat-caribbean"] === AgreementsStatus.Participant)
      participantAgreement.push("lat-caribbean");
    if (data["lat-caribbean"] === AgreementsStatus.Observer)
      observerAgreement.push("lat-caribbean");

    if (data.lusaka === AgreementsStatus.Participant)
      participantAgreement.push("lusaka");
    if (data.lusaka === AgreementsStatus.Observer)
      observerAgreement.push("lusaka");

    if (data.male === AgreementsStatus.Participant)
      participantAgreement.push("male");
    if (data.male === AgreementsStatus.Observer) observerAgreement.push("male");

    if (data.nairobi === AgreementsStatus.Participant)
      participantAgreement.push("nairobi");
    if (data.nairobi === AgreementsStatus.Observer)
      observerAgreement.push("nairobi");

    if (data.neaspec === AgreementsStatus.Participant)
      participantAgreement.push("neaspec");
    if (data.neaspec === AgreementsStatus.Observer)
      observerAgreement.push("neaspec");

    if (data.rapap === AgreementsStatus.Participant)
      participantAgreement.push("rapap");
    if (data.rapap === AgreementsStatus.Observer)
      observerAgreement.push("rapap");

    if (data["us-canada"] === AgreementsStatus.Participant)
      participantAgreement.push("us-canada");
    if (data["us-canada"] === AgreementsStatus.Observer)
      observerAgreement.push("us-canada");

    let hoverText = `<strong>${data.name}</strong> ${
      data.nAgreements === 0
        ? "does not participate in any agreement"
        : "participates in the "
    }`;

    participantAgreement.forEach((agreement, i) => {
      let finalChar = ", ";
      if (i === participantAgreement.length - 1) finalChar = ".";
      if (i === participantAgreement.length - 2) finalChar = " and ";
      hoverText += `${agreementsDefinitionLookup[agreement].name}${finalChar}`;
    });

    return hoverText;
  };
  const policiesHoverText = (data: PoliciesData): string => {
    let hasMet = [];
    let onTrack = [];
    let noMet = [];
    let hoverText = "";

    if (data["ind-1"] === PoliciesStatus.Yes)
      hasMet.push(`Clean production incentives`);
    else if (data["ind-1"] === PoliciesStatus.Almost)
      onTrack.push(`Clean production incentives`);
    else if (data["ind-1"] === PoliciesStatus.No)
      noMet.push(`Clean production incentives`);

    if (data["tra-1"] === PoliciesStatus.Yes)
      hasMet.push(`Vehicle emissions standards`);
    else if (data["tra-1"] === PoliciesStatus.Almost)
      onTrack.push(`Vehicle emissions standards`);
    else if (data["tra-1"] === PoliciesStatus.No)
      noMet.push(`Vehicle emissions standards`);

    if (data["tra-2"] === PoliciesStatus.Yes)
      hasMet.push(`Fuel Sulphur content`);
    else if (data["tra-2"] === PoliciesStatus.Almost)
      onTrack.push(`Fuel Sulphur content`);
    else if (data["tra-2"] === PoliciesStatus.No)
      noMet.push(`Fuel Sulphur content`);

    if (data["waste-1"] === PoliciesStatus.Yes)
      hasMet.push(`Solid Waste Burning`);
    else if (data["waste-1"] === PoliciesStatus.Almost)
      onTrack.push(`Solid Waste Burning`);
    else if (data["waste-1"] === PoliciesStatus.No)
      noMet.push(`Solid Waste Burning`);

    if (data["res-1"] === PoliciesStatus.Yes)
      hasMet.push(`Incentives for residential cooking and heating`);
    else if (data["res-1"] === PoliciesStatus.Almost)
      onTrack.push(`Incentives for residential cooking and heating`);
    else if (data["res-1"] === PoliciesStatus.No)
      noMet.push(`Incentives for residential cooking and heating`);

    if (data["aq-1"] === PoliciesStatus.Yes)
      hasMet.push(`Air quality standards`);
    else if (data["aq-1"] === PoliciesStatus.Almost)
      onTrack.push(`Air quality standards`);
    else if (data["aq-1"] === PoliciesStatus.No)
      noMet.push(`Air quality standards`);

    if (data["agri-1"] === PoliciesStatus.Yes)
      hasMet.push(`Sustainable agricultural practices`);
    else if (data["agri-1"] === PoliciesStatus.Almost)
      onTrack.push(`Sustainable agricultural practices`);
    else if (data["agri-1"] === PoliciesStatus.No)
      noMet.push(`Sustainable agricultural practices`);

    if (data["aqms-1"] === PoliciesStatus.Yes)
      hasMet.push(`Air quality management strategies`);
    else if (data["aqms-1"] === PoliciesStatus.Almost)
      onTrack.push(`Air quality management strategies`);
    else if (data["aqms-1"] === PoliciesStatus.No)
      noMet.push(`Air quality management strategies`);
    if (data["aqm-1"] === PoliciesStatus.Yes)
      hasMet.push(`Air quality monitoring`);
    else if (data["aqm-1"] === PoliciesStatus.Almost)
      onTrack.push(`Air quality monitoring`);
    else if (data["aqm-1"] === PoliciesStatus.No)
      noMet.push(`Air quality monitoring`);

    if (hasMet.length > 0) {
      hoverText += `<strong>${data.name}</strong> has met <strong>
                    ${
                      hasMet.length === 1 ? "this target" : "these targets"
                    }</strong>: `;

      hoverText += hasMet.join(", ");
      if (onTrack.length > 0) {
        hoverText += `<br>And it is on track to meet <strong>
                      ${onTrack.length === 1 ? "this" : "these"}</strong>: `;
        hoverText += onTrack.join(", ");
      }
    } else if (onTrack.length > 0) {
      hoverText += `<strong>${data.name}</strong> is on track to met <strong>
                    ${
                      onTrack.length === 1 ? "this target" : "these targets"
                    }</strong>: `;
      hoverText += onTrack.join(", ");
    } else if (noMet.length === 0)
      hoverText += `No data for <strong>${data.name}</strong>`;
    else {
      if (noMet.length === 6)
        hoverText += `<strong>${data.name}</strong> has not met any targets`;
      else {
        hoverText += `<strong>${data.name}</strong>
                      has not met any of the targets for which we have data: `;
        hoverText += noMet.join(", ");
      }
    }
    return hoverText;
  };

  const datasetParams = {
    pm25: {
      data: pm25data.map((d) => {
        return {
          name: countryNameDictionaryLookup[d.id].name,
          short: countryNameDictionaryLookup[d.id].short,
          code: d.id,
          x: d.x,
          y: d.y,
          value: d.pm25,
          color: colorPM25(d.pm25),
        };
      }),
      nodeSize: 11,
      helpText: {
        code: "JPN",
        text: () => `<strong>Each square is a country</strong>, sized
         by the annual mean levels of <strong>fine particular
         matter PM<sub>2.5</sub></strong>, measured in µg/m<sup>3</sup>.`,
      },
      hoverTextFn: (d: CountryDataPoint) =>
        `In <strong>${d.name}</strong>, people are exposed to an average of
        <strong>${d.value} μg/m<sup>3</sup></strong> a year —
        <strong>${(d.value / 5).toFixed(1)}</strong> times the WHO guideline.`,
      classesFn: (d: CountryDataPoint) => {
        if (!legendIsHovered) {
          return [];
        } else {
          const isSelected =
            colorPM25.range().indexOf(d.color) === legendElementSelectedIndex;
          return [isSelected ? "country--shadow" : "country--hide"];
        }
      },
      color: colorPM25,
      legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (5 µg/m<sup>3</sup>)`,
      legendDomain: ["x1", "2", "3", "5", "7"],
      legendType: "sequential",
      domain: [700, 400] as [number, number],
      hoverText: (d: CountryDataPoint) =>
        `In <strong>${d.name}</strong>, people are exposed to an average of
        <strong>${d.value} μg/m<sup>3</sup></strong> a year —
        <strong>${(d.value / 10).toFixed(1)}</strong> times the WHO guideline.`,
      linearDomain: [0, 9],
      internalLabels: [
        { label: "AQG", border: true, icon: "check" },
        { label: "IT4" },
        { label: "IT3" },
        { label: "IT2" },
        { label: "IT1" },
        { label: "" },
      ],
    },

    health: {
      data: deaths_data.map((d) => {
        return {
          name: countryNameDictionaryLookup[d.id].name,
          short: countryNameDictionaryLookup[d.id].short,
          code: d.id,
          x: d.x,
          y: d.y,
          value: d.deaths,
          rate: d.rate,
          color: colorHealth(d.rate),
        };
      }),
      nodeSize: 80,
      helpText: {
        code: "GEO",
        text: () => `<strong>Each square is a country</strong>,
        sized by the total number of <strong>deaths
        caused by fine particle pollution</strong>.`,
      },
      hoverTextFn: (d: CountryDataPoint) =>
        `In <strong>${d.name}</strong>, fine particle
      pollution caused <strong>${d.value.toLocaleString(
        "en-US"
      )} deaths</strong>
      in 2019 — or <strong>${Math.round(d.rate)} per 100,000 people</strong>.`,
      classesFn: (d: CountryDataPoint) => {
        if (!legendIsHovered) {
          return [];
        } else {
          const isSelected =
            colorHealth.range().indexOf(d.color) === legendElementSelectedIndex;
          return [isSelected ? "country--shadow" : "country--hide"];
        }
      },
      color: colorHealth,
      legendTitle: `<strong>Deaths per 100,000 people</strong> caused by fine particle pollution`,
      legendDomain: ["20", "40", "60", "80", "100"],
      legendType: "sequential",
      domain: [700, 400] as [number, number],
      linearDomain: null,
      internalLabels: null,
    },

    policies: {
      data: countries
        .filter((d) => policiesLookup[d.code])
        .map((d) => {
          return {
            name: countryNameDictionaryLookup[d.code].name,
            short: countryNameDictionaryLookup[d.code].short,
            code: d.code,
            x: d.x,
            y: d.y,
            value: 5,
            data: policiesLookup[d.code],
          };
        }),
      nodeSize: 16,
      helpText: {
        code: "JPN",
        text: () => `<strong>Each square is a country</strong>,
          colored by the <strong>number of air quality targets met</strong> or on track.`,
      },
      hoverTextFn: (d: CountryDataPoint) =>
        policiesHoverText(d.data as PoliciesData),
      colorFn: (d: CountryDataPoint) => {
        let policiesData = d.data as PoliciesData;
        const colors = colorPolices.range();
        const gradients = [
          { color: colors[0], start: 0, end: policiesData.pYes },
          {
            color: colors[1],
            start: policiesData.pYes,
            end: policiesData.pYes + policiesData.pAlmost,
          },
          {
            color: colors[2],
            start: policiesData.pYes + policiesData.pAlmost,
            end: policiesData.pYes + policiesData.pAlmost + policiesData.pNo,
          },
          {
            color: colors[3],
            start: policiesData.pYes + policiesData.pAlmost + policiesData.pNo,
            end: 100,
          },
        ];

        const gradientStrs = gradients.map((g, i) => {
          const hide = legendIsHovered && legendElementSelectedIndex !== i;
          return `${g.color}${hide ? "00" : "ff"} ${g.start}% ${g.end}%`;
        });
        return `linear-gradient(to bottom, ${gradientStrs.join(", ")})`;
      },
      classesFn: (d: CountryDataPoint) => {
        let policiesData = d.data as PoliciesData;
        let policiesCont = [
          policiesData.pYes,
          policiesData.pAlmost,
          policiesData.pNo,
          100 - (policiesData.pNo + policiesData.pAlmost + policiesData.pYes),
        ];
        const hasValue =
          legendIsHovered && policiesCont[legendElementSelectedIndex] > 0;
        return hasValue ? ["country--shadow"] : [];
      },
      color: colorPolices,
      legendTitle: `<strong>Actions taken towards cleaner air</strong>`,
      legendDomain: colorPolices.domain(),
      legendType: "categorical",
      domain: [1300, 1300 / (740 / 420)] as [number, number],
      linearDomain: null,
      internalLabels: null,
    },

    diseases: {
      data: countries
        .filter((d) => diseasesLookup[d.code])
        .map((d) => {
          return {
            name: countryNameDictionaryLookup[d.code].name,
            short: countryNameDictionaryLookup[d.code].short,
            code: d.code,
            x: d.x,
            y: d.y,
            value: 5,
            data: diseasesLookup[d.code],
          };
        }),
      nodeSize: 16,
      helpText: {
        code: "JPN",
        text: () =>
          `<strong>Each square is a country</strong>, the filled area depicts the <strong>percentage of deaths</strong> from <b>${diseasesDictionary[
            selectedDisease
          ].toLocaleLowerCase()}</b> attributable to fine particle outdoor air pollution.`,
      },
      hoverTextFn: (d: CountryDataPoint) =>
        diseasesHoverText(d.data as DiseasesData),
      colorFn: (d: CountryDataPoint) => {
        let diseaseData = d.data as DiseasesData;
        const colors = colorDiseases.range();
        let currentColor = null;

        let i = 0;
        const domain = colorDiseases.domain();
        while (i < domain.length && currentColor === null) {
          if (
            diseaseData[selectedDisease] * 100 <= domain[i] &&
            !currentColor
          ) {
            currentColor = colors[i];
          }
          i++;
        }
        if (currentColor === null) currentColor = colors[colors.length - 1];

        const gradients = [
          {
            color: currentColor,
            start: 0,
            end: diseaseData[selectedDisease] * 100 * 2,
          },
          {
            color: "#D9D9D9",
            start: diseaseData[selectedDisease] * 100 * 2,
            end: 100,
          },
        ];

        const gradientStrs = gradients.map((g, i) => {
          const hide =
            legendIsHovered &&
            colorDiseases.range().indexOf(currentColor) !==
              legendElementSelectedIndex;
          return `${g.color}${hide ? "50" : "ff"} ${g.start}% ${g.end}%`;
        });
        return `linear-gradient(to bottom, ${gradientStrs.join(", ")})`;
      },
      classesFn: (d: CountryDataPoint) => {
        if (!legendIsHovered) {
          return [];
        } else {
          const diseaseData = d.data as DiseasesData;
          const domain = colorDiseases.domain();

          let selectedRange = null;

          if (legendElementSelectedIndex === 0)
            selectedRange = [0, domain[legendElementSelectedIndex]];
          else if (legendElementSelectedIndex < domain.length)
            selectedRange = [
              domain[legendElementSelectedIndex - 1],
              domain[legendElementSelectedIndex],
            ];
          else selectedRange = [domain[legendElementSelectedIndex - 1], 100];

          const isSelected =
            diseaseData[selectedDisease] * 100 >= selectedRange[0] &&
            diseaseData[selectedDisease] * 100 <= selectedRange[1];

          return [isSelected ? "country--shadow" : ""];
        }
      },
      color: colorDiseases,
      legendTitle: `<strong>Percent of deaths</strong> from the disease that can be attributed to outdoor fine particles`,
      legendDomain: colorDiseases.domain().map((e) => e + "%"),
      legendType: "sequential",
      domain: [1300, 1300 / (740 / 420)] as [number, number],
      linearDomain: null,
      internalLabels: null,
    },
    agreements: {
      data: countries
        .filter((d) => agreementsLookup[d.code])
        .map((d) => {
          return {
            name: countryNameDictionaryLookup[d.code]?.name,
            short: countryNameDictionaryLookup[d.code]?.short,
            code: d.code,
            x: d.x,
            y: d.y,
            value: 5,
            data: agreementsLookup[d.code],
          };
        }),
      nodeSize: 16,
      helpText: {
        code: "JPN",
        text: () => `<strong>Each square is a country</strong>,
          colored by the <strong>number of agreements</strong>.`,
      },
      hoverTextFn: (d: CountryDataPoint) => agreementsHoverText(d.data),
      colorFn: (d: CountryDataPoint) => {
        let agreementsData = d.data as AgreementsData;
        const colors = colorAgreements.range();
        const gradients = [
          {
            color: agreementsData.nAgreements > 0 ? colors[0] : "#D9D9D9",
            start: 0,
            end: 20,
          },
          {
            color: agreementsData.nAgreements > 1 ? colors[1] : "#D9D9D9",
            start: 20,
            end: 40,
          },
          {
            color: agreementsData.nAgreements > 2 ? colors[2] : "#D9D9D9",
            start: 40,
            end: 60,
          },
          {
            color: agreementsData.nAgreements > 3 ? colors[3] : "#D9D9D9",
            start: 60,
            end: 80,
          },
          {
            color: agreementsData.nAgreements > 4 ? colors[4] : "#D9D9D9",
            start: 80,
            end: 100,
          },
        ];

        const gradientStrs = gradients.map(
          (g) => `${g.color} ${g.start}% ${g.end}%`
        );
        return `linear-gradient(to bottom, ${gradientStrs.join(", ")})`;
      },
      classesFn: (d: CountryDataPoint) => {
        let agreementsData = d.data as AgreementsData;
        let agreementsCont = [1, 2, 3, 4, 5];
        const hasValue =
          legendIsHovered &&
          agreementsCont[legendElementSelectedIndex] ===
            agreementsData.nAgreements;
        return hasValue ? ["country--shadow"] : [];
      },
      color: colorAgreements,
      legendTitle: `<strong>No. of agreements</strong>`,
      legendDomain: colorAgreements.domain(),
      legendType: "sequential",
      domain: [1300, 1300 / (740 / 420)] as [number, number],
      linearDomain: null,
      internalLabels: null,
    },
    test: {
      data: deaths_data.map((d) => {
        return {
          name: countryNameDictionaryLookup[d.id].name,
          short: countryNameDictionaryLookup[d.id].short,
          code: d.id,
          x: d.x,
          y: d.y,
          value: d.deaths,
          rate: d.rate,
          data: gbdCleenAirLookup[d.id],
        };
      }),
      nodeSize: 80,
      helpText: {
        code: "GEO",
        text: () => `<strong>Each square is a country</strong>,
        sized by the total number of <strong>deaths
        caused by fine particle pollution</strong>.`,
      },
      hoverTextFn: (d: CountryDataPoint) =>
        `In <strong>${d.name}</strong>, fine particle
      pollution caused <strong>${d.value.toLocaleString(
        "en-US"
      )} deaths</strong>
      in 2019 — or <strong>${Math.round(d.rate)} per 100,000 people</strong>.`,
      classesFn: (d: CountryDataPoint) => {
        const data = d.data as GBDCleanAirData;
        if (!data || !legendIsHovered) return [];
        const isSelected =
          colorGBD.range().reverse()[
            data.initialInt + index > 5 ? 5 : data.initialInt + index
          ] === colorGBD.range()[legendElementSelectedIndex];

        return [isSelected ? "country--shadow" : "country--hide"];
      },
      color: colorGBD,
      legendTitle: `As a multiple of the <strong>WHO's guideline</strong> (5 µg/m<sup>3</sup>)`,
      legendDomain: ["x1", "2", "3", "5", "7"],
      internalLabels: [
        { label: "AQG", border: true, icon: "check" },
        { label: "IT4" },
        { label: "IT3" },
        { label: "IT2" },
        { label: "IT1" },
        { label: "" },
      ],
      legendType: "sequential",
      domain: [700, 400] as [number, number],
      linearDomain: [0, 9],
      staticBorder: () => {
        console.log("static border", checked);
        return checked;
      },

      colorFn: (d: CountryDataPoint) => {
        const data = d.data as GBDCleanAirData;
        if (!data) return "red";
        const currentIndex =
          data.initialInt + index > 5 ? 5 : data.initialInt + index;
        return colorGBD.range().reverse()[currentIndex];
      },
      scale: (d: CountryDataPoint) => {
        const data = gbdCleenAirLookup[d.code];
        if (!data) return 1;
        const currentIndex =
          data.initialInt + index > 5 ? 5 : data.initialInt + index;
        return gbdCleenAirLookup[d.code][gbdIndexToField[currentIndex]] / 100;
      },
    },
  };
  // re-render hack (as Cartogram component doesn't know when then result of our funcs change)
  $: (legendElementSelectedIndex !== undefined ||
    selectedDisease ||
    index ||
    !checked ||
    checked) &&
    rerender &&
    rerender();

  $: {
    width = Math.max(clientWidth, 700);
  }
  $: height = width * (data === "pm25" ? 0.55 : 0.62);
</script>

<section {id} class="viz wide">
  {#if !isEmbed && block.menu}
    <!-- if block has no menu there's no section title -->
    <SectionTitle {block} />
  {/if}

  <Head
    title={head}
    dropdown={block.dropdown}
    bind:selectedElement={selectedDisease}
    number={diseasesGlobal[selectedDisease] * 100}
    smaller={data === "diseases"}
  />

  <div class="right-narrow">
    <Legend
      title={datasetParams[data].legendTitle}
      colors={datasetParams[data].color.range()}
      labels={datasetParams[data].legendDomain}
      type={datasetParams[data].legendType}
      linearDomain={datasetParams[data].linearDomain}
      internalLabels={datasetParams[data].internalLabels}
      bind:checked
      bind:selected={legendElementSelectedIndex}
    />
  </div>

  {#if isEmbed && embed !== "policies"}
    <div class="embed-additional-text-desktop" class:hide={cartogramAnnotation}>
      <p>
        To explore more about the climate emergency and the effects on the
        planet visit
        <b><a target="_blank" href="https://www.unep.org/">unep.org</a></b>
      </p>
    </div>
  {/if}

  <div class="margin-breakout-mobile cartogram-region" bind:clientWidth>
    <slot name="range" />
    <ScrollableX>
      <div
        style="width:{width}px; height:{height}px"
        class="cartogram-container"
      >
        <Cartogram
          {...datasetParams[data]}
          slug={data}
          bind:rerenderFn={rerender}
          bind:annotationShowing={cartogramAnnotation}
          staticBorder={checked}
        />
      </div>
    </ScrollableX>
  </div>

  {#if showEmbed}
    <Embed {isEmbed} {embed} {cartogramAnnotation} {text} />
  {/if}
</section>

<style lang="scss">
  .footer {
    margin-bottom: 30px;
  }

  .embed-additional-text-desktop,
  .embed-additional-text-desktop-policies {
    opacity: 1;
    transition: 300ms opacity 700ms;
    position: relative;
    z-index: 1;
    &.hide {
      opacity: 0;
      transition: 150ms opacity;
    }
  }

  .cartogram-container {
    overflow: hidden;
  }

  :global(.annotation .text) {
    background: #f9f9f9e0;
    border-radius: 4px;
    padding: 0 10px 5px;
  }

  .cartogram-region {
    display: flex;
    gap: 10px;
    justify-items: center;
    align-items: center;
  }
</style>
