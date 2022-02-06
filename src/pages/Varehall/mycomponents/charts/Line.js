/* eslint-disable prefer-rest-params */
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';

import { lineChartOptions } from './config';

const Line = ({ data, shadow = false }) => {
  const chartContainer = useRef(null);
  const [, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      if (shadow) {
        Chart.controllers.lineWithShadow = Chart.controllers.line;
        Chart.controllers.lineWithShadow = Chart.controllers.line.extend({
          draw(ease) {
            Chart.controllers.line.prototype.draw.call(this, ease);
            const {
              chart: { ctx },
            } = this;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 10;
            ctx.responsive = true;
            ctx.stroke();
            Chart.controllers.line.prototype.draw.apply(this, arguments);
            ctx.restore();
          },
        });
      }
      const context = chartContainer.current.getContext('2d');
      const newChartInstance = new Chart(context, {
        type: shadow ? 'lineWithShadow' : 'line',
        options: lineChartOptions,
        data,
      });
      setChartInstance(newChartInstance);
    }
  }, [chartContainer, data, shadow]);

  return (<>
    <div>
      <p className="lead color-theme-1 mb-1 value">{'currentValue'}</p>
      <p className="mb-0 label text-small">{'currentLabel'}</p>
    </div>
    <div style={{
      height:390
    }}>
      <canvas ref={chartContainer} />;
      </div>
    </>)
};

export default Line;
