import React from 'react';
import 'rc-tooltip/assets/bootstrap.css';
import Slider, { SliderProps } from 'rc-slider';
import Tooltip from 'rc-tooltip';

interface HandleTooltipProps {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  tipFormatter?: (value: number) => React.ReactNode;
}

const HandleTooltip: React.FC<HandleTooltipProps> = ({
  value,
  children,
  visible,
  tipFormatter = (val) => `${val} %`,
}) => {
  const tooltipRef = React.useRef<any>(null);
  const [tooltipVisible, setTooltipVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (visible) {
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  }, [visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: 'auto' }}
      ref={tooltipRef}
      visible={tooltipVisible}
    >
      {children}
    </Tooltip>
  );
};

export const handleRender: SliderProps['handleRender'] = (node, props) => {
  return (
    <HandleTooltip value={props.value} visible={props.dragging}>
      {node}
    </HandleTooltip>
  );
};

const TooltipSlider: React.FC<SliderProps & {
  tipFormatter?: (value: number) => React.ReactNode;
  tipProps: any;
}> = ({ tipFormatter, tipProps, ...props }) => {
  const tipHandleRender: SliderProps['handleRender'] = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={handleProps.dragging}
        tipFormatter={tipFormatter}
        {...tipProps}
      >
        {node}
      </HandleTooltip>
    );
  };

  return <Slider {...props} handleRender={tipHandleRender} />;
};

export default TooltipSlider;
