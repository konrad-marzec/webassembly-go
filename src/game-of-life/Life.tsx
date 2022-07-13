import React from "react";
import styled from "styled-components";

interface LifeProps {
  value: number;
}

const Cell = styled.div<{ $value: number }>`
  border: 1px solid gray;
  width: 8px;
  height: 8px;
  background-color: ${({ $value }) => ($value === 0 ? "white" : "black")};
`;

function Life({ value }: LifeProps) {
  return <Cell $value={value} />;
}

export default React.memo(Life);
