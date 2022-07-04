// @ts-expect-error
import lagRadar from "@gaearon/lag-radar";

import { useEffect, useRef } from "react";
import styled from "styled-components";

const Radar = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
`;

function LagRadar() {
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const destroy = lagRadar({
      frames: 50, // number of frames to draw, more = worse performance
      speed: 0.0017, // how fast the sweep moves (rads per ms)
      size: 300, // outer frame px
      inset: 3, // circle inset px
      parent: radarRef.current, // DOM node to attach to
    });

    return destroy;
  }, []);

  return <Radar ref={radarRef} />;
}

export default LagRadar;
