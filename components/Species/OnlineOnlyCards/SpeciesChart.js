// @flow
import React, { useState, useCallback, useEffect, useContext, useMemo } from "react";
import { View } from "react-native";
import { Circle } from "react-native-svg";
import { XAxis, LineChart } from "react-native-svg-charts";

import { colors } from "../../../styles/global";
import styles from "../../../styles/species/speciesChart";
import SpeciesDetailCard from "../../UIComponents/SpeciesDetailCard";
import { capitalizeNames } from "../../../utility/helpers";
import { createShortMonthsList } from "../../../utility/dateHelpers";
import { SpeciesDetailContext } from "../../UserContext";
import { fetchHistogram } from "../../../utility/speciesDetailHelpers";

type Props = {
  +id: number,
  +region: {
    latitude?: number,
    longitude?: number
  }
};

const SpeciesChart = ( { id, region }: Props ) => {
  const { localSeasonality } = useContext( SpeciesDetailContext );
  const [data, setData] = useState( [] );

  const createHistogram = useCallback( async ( ) => {
    // not showing chart at all if user prefers local seasonality
    // but has location permissions off
    // and is looking at a species they haven't observed before
    if ( localSeasonality && !region.latitude ) {
      return;
    }
    const chartData = await fetchHistogram( id, localSeasonality ? region : null );
    setData( chartData );
  }, [id, localSeasonality, region] );

  useEffect( ( ) => {
    let isCurrent = true;

    if ( isCurrent ) {
      createHistogram( );
    }
    return ( ) => {
      isCurrent = false;
    };
  } , [createHistogram] );

  // $FlowFixMe
  const Decorator = ( { x, y } ) => data.map( ( value ) => (
    <Circle
      key={`circle-${value.month}`}
      cx={x( value.month )}
      cy={y( value.count )}
      fill={colors.seekiNatGreen}
      r={4}
    />
  ) );

  const xAccessor = ( { item } ) => item.month;
  const yAccessor = ( { item } ) => item.count;
  const lineChartSvg = { stroke: colors.seekForestGreen };

  const xAxis = useMemo( ( ) => {
    const xAxisSvg = {
      fontSize: 18,
      fill: colors.seekTeal
    };

    const allMonths = createShortMonthsList();
    const formatXAxis = ( index ) => capitalizeNames( allMonths[index] );
    const formatLabel = ( value ) => formatXAxis( value - 1 );
    return (
      <XAxis
        contentInset={styles.xAxisWidth}
        data={data}
        formatLabel={formatLabel}
        style={styles.xAxis}
        svg={xAxisSvg}
        xAccessor={xAccessor}
      />
    );
  }, [data] );

  return (
    <SpeciesDetailCard text="species_detail.monthly_obs" hide={data.length === 0}>
      <View style={styles.container}>
        <View style={styles.chartRow}>
          <LineChart
            contentInset={styles.chartInset}
            data={data}
            style={styles.chart}
            svg={lineChartSvg}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          >
            <Decorator />
          </LineChart>
          {xAxis}
        </View>
      </View>
    </SpeciesDetailCard>
  );
};

export default SpeciesChart;
