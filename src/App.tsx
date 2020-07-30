import React, { useState, useMemo } from 'react';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';
import * as d3 from 'd3';
import { TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Card } from './ui/Card';
import { Autocomplete } from '@material-ui/lab';

const Center = styled.div`
  display: grid;
  flex: 1;
  place-items: center;
  height: 100vh;
`;

const useNumber = (initialValue) => {
  const [text, setText] = useState(initialValue);
  const [value, setValue] = useState(initialValue);

  const setSafeNumber = (e) => {
    const value = e.target.value;

    setText(value);

    const valueNumber = parseFloat(value);

    if (!Number.isNaN(valueNumber) && valueNumber !== 0) {
      setValue(valueNumber);
    }
  }

  return [
    text,
    setSafeNumber,
    value,
  ];
}

const useForceUpdate = () => {
  const [refresh, forceUpdate] = useState(0);

  const update = () => {
    forceUpdate(count => count + 1);
  }

  return [update, refresh];
}

const App = () => {
  const [sizeText, setSizeText, size] = useNumber(100);
  const [xRangeText, setXRangeText, xRange] = useNumber(4);
  const [lineWidthText, setLineWidthText, lineWidth] = useNumber(0);
  const [forceUpdate, refresh] = useForceUpdate();
  const [enableArea, setEnableArea] = useState<boolean>(true);
  const [enablePoints, setEnablePoints] = useState<boolean>(false);
  const [enableGridX, setEnableGridX] = useState<boolean>(false);
  const [enableGridY, setEnableGridY] = useState<boolean>(true);
  const [axisBottomLegend, setAxisBottomLegend] = useState('Time');
  const [axisLeftLegend, setAxisLeftLegend] = useState('Count');
  const [distribution, setDistribution] = useState({
    value: 'Exponential',
    label: 'Exponential',
  });

  const [lambdaText, setLambdaText, lambda] = useNumber(1);
  const [muText, setMuText, mu] = useNumber(0);
  const [sigmaText, setSigmaText, sigma] = useNumber(1);

  const DISTRIBUTION_OPTIONS = [
    {
      value: 'Exponential',
      label: 'Exponential',
    },
    {
      value: 'LogNormal',
      label: 'LogNormal',
    },
  ];

  const fnFromDistribution = () => {
    switch(distribution.value) {
      case 'Exponential':
        return d3.randomExponential;
      case 'LogNormal':
        return d3.randomLogNormal;
      default:
        return d3.randomExponential;
    }
  }

  const getDistributionParams = () => {
    switch(distribution.value) {
      case 'Exponential':
        return [lambda];
      case 'LogNormal':
        return [mu, sigma];
      default:
        return [lambda];
    }
  }

  const renderDistributionParams = () => {
    if (distribution.value === 'Exponential') {
      return (
        <TextField
          label='lambda'
          value={lambdaText}
          onChange={setLambdaText}
        />
      )
    }

    if (distribution.value === 'LogNormal') {
      return (
        <>
          <TextField
            label='mu'
            value={muText}
            onChange={setMuText}
          />
          <TextField
            label='sigma'
            value={sigmaText}
            onChange={setSigmaText}
          />
        </>
      )
    }
  }

  const qyy = useMemo(() => {
    const distributionFn = fnFromDistribution();
    const args = getDistributionParams();
    const exponentialData = Float64Array.from({length: size}, distributionFn(...args));

    const qy = exponentialData.sort(d3.ascending);
    return [].slice.call(qy);
  }, [size, refresh, distribution.value, lambda, mu, sigma]);

  const series = useMemo(() => {
    const data = qyy.map((v,i) => {
      return {
        x: i * xRange/size,
        y: v,
      }
    });

    return [
      {
        id: 'data',
        data,
      }
    ];
  }, [qyy, xRange]);

  const margin = {
    top: 50, right: 110, bottom: 50, left: 60
  };

  const xScale = {
    type: 'point'
  };

  const min = Math.min(...qyy);
  const max = Math.max(...qyy);

  const yScale = {
    type: 'linear',
    min: 0,
    max: max + 1,
    reverse: false
  };

  const colors = {
    scheme: 'category10'
  };

  const axisBottom = {
    orient: 'bottom',
    legend: axisBottomLegend,
    legendOffset: 36,
    legendPosition: 'middle',
    tickValues: [0, 1, 2 , 3, 4],
  };

  const axisLeft= {
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 5,
    legend: axisLeftLegend,
    legendOffset: -40,
    legendPosition: 'middle'
  }

  return (
    <Center>
      <Flex flexDirection='row'>
        <Flex width='800px' height='400px' flex={1}>
          <ResponsiveLine
            data={series}
            margin={margin}
            xScale={xScale}
            yScale={yScale}
            colors={colors}
            lineWidth={lineWidth}
            axisTop={null}
            axisRight={null}
            axisBottom={axisBottom}
            axisLeft={axisLeft}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={false}
            enableArea={enableArea}
            enablePoints={enablePoints}
            enableGridX={enableGridX}
            enableGridY={enableGridY}
          />
        </Flex>
        <Card flexDirection='column'>
          <Text>Distribution</Text>
          <Autocomplete
            options={DISTRIBUTION_OPTIONS}
            value={distribution}
            onChange={(event, value) => setDistribution(value)}
            blurOnSelect={true}
            disableClearable={true}
            openOnFocus={true}
            style={{ width: '100%' }}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) => option?.value === value?.value || option?.value === value}
            renderInput={(params) => {
              return <TextField {...params} variant='standard' label={'Distribution'} fullWidth />;
            }}
          />
          {renderDistributionParams()}
          <TextField
            label='size'
            value={sizeText}
            onChange={setSizeText}
          />
          <TextField
            label='xRange'
            value={xRangeText}
            onChange={setXRangeText}
          />
          <Text mt='10px'>Legend</Text>
          <TextField
            label='Axis Bottom'
            value={axisBottomLegend}
            onChange={(e) => setAxisBottomLegend(e.target.value)}
          />
          <TextField
            label='Axis Left'
            value={axisLeftLegend}
            onChange={(e) => setAxisLeftLegend(e.target.value)}
          />
          <Text mt='10px'>Chart</Text>
          <FormControlLabel
            control={<Checkbox checked={enableArea} onChange={(e) => setEnableArea(e.target.checked)} name="enableArea" />}
            label="enableArea"
          />
          <FormControlLabel
            control={<Checkbox checked={enablePoints} onChange={(e) => setEnablePoints(e.target.checked)} name="enableArea" />}
            label="enablePoints"
          />
          <FormControlLabel
            control={<Checkbox checked={enableGridX} onChange={(e) => setEnableGridX(e.target.checked)} name="enableArea" />}
            label="gridX"
          />
          <FormControlLabel
            control={<Checkbox checked={enableGridY} onChange={(e) => setEnableGridY(e.target.checked)} name="enableArea" />}
            label="gridY"
          />
          <TextField
            label='lineWidth'
            value={lineWidthText}
            onChange={setLineWidthText}
          />
          <Button onClick={forceUpdate}>
            Refresh
          </Button>
        </Card>
      </Flex>
    </Center>
  );
}

export default App;
