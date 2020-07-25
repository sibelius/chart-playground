import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

type GridProps = {
  templateColumns?: string;
  gap?: string;
} & SpaceProps;

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.templateColumns ? props.templateColumns : '1fr'};
  grid-gap: ${(props) => (props.gap ? props.gap : '0')};
  ${space}
`;

export default Grid;
