import React, { useState } from 'react';
import { Flex } from 'rebass';
import styled from 'styled-components';
import { ResponsiveLine } from '@nivo/line';
import * as d3 from 'd3';
import { TextField, Button } from '@material-ui/core';
import { Card } from './ui/Card';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  const [, forceUpdate] = useState(0);

  const update = () => {
    forceUpdate(count => count + 1);
  }

  return update;
}

const App = () => {
  const [lambdaText, setLambdaText, lambda] = useNumber(1);
  const [sizeText, setSizeText, size] = useNumber(100);
  const [xRangeText, setXRangeText, xRange] = useNumber(4);
  const forceUpdate = useForceUpdate();

  const exponentialData = Float64Array.from({length: size}, d3.randomExponential(lambda));

  const qy = exponentialData.sort(d3.ascending);
  const qyy = [].slice.call(qy);

  const data = qyy.map((v,i) => {
    return {
      x: i * xRange/size,
      y: v,
    }
  });

  const series = [
    {
      id: 'data',
      data,
    }
  ];

  console.log('series', {
    series,
  });

  const margin = {
    top: 50, right: 110, bottom: 50, left: 60
  };

  const xScale = {
    type: 'point'
  };

  const min = Math.min(...qyy);
  const max = Math.max(...qyy);

  console.log({
    min,
    max,
  });

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
    legend: 'Time',
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
    legend: 'count',
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
            lineWidth={0}
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
            enableArea={true}
            enablePoints={false}
            enableGridX={false}
            enableGridY={true}
          />
        </Flex>
        <Card flexDirection='column'>
          <TextField
            label='lambda'
            value={lambdaText}
            onChange={setLambdaText}
            />
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
          <Button onClick={forceUpdate}>
            Refresh
          </Button>
        </Card>
      </Flex>
    </Center>
  );
}

export default App;
