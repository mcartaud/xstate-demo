const scale = 1 / 0.375;

interface TrafficLightImageProps {
  redOn?: boolean;
  yellowOn?: boolean;
  greenOn?: boolean;
  size?: number;
  horizontal?: boolean;
}

const blackColor = "#000000";
const disabledColor = "#4A4A4A";
const redColor = "#D0021B";
const yellowColor = "#F8E71C";
const greenColor = "#7ED321";

export const TrafficLightImage = ({
  redOn = false,
  yellowOn = false,
  greenOn = false,
  size = 60,
  horizontal = false,
  ...props
}: TrafficLightImageProps) => (
  <svg
    width={`${size * (horizontal ? scale : 1)}px`}
    height={`${size * (horizontal ? 1 : scale)}px`}
    viewBox={horizontal ? "0 0 160 60" : "0 0 60 160"}
    version="1.1"
    {...props}
  >
    <defs>
      <circle id="redCirclePath" cx="30" cy="30" r="20" />
      <circle id="yellowCirclePath" cx="30" cy="80" r="20" />
      <circle id="greenCirclePath" cx="30" cy="130" r="20" />

      <filter
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        id="shadowFilter"
      >
        <feGaussianBlur
          stdDeviation="3"
          in="SourceAlpha"
          result="shadowBlurInner1"
        />
        <feOffset
          dx="0"
          dy="4"
          in="shadowBlurInner1"
          result="shadowOffsetInner1"
        />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
          result="shadowInnerInner1"
        />
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"
          type="matrix"
          in="shadowInnerInner1"
        />
      </filter>
    </defs>
    <g transform={horizontal ? `rotate(-90 30 30)` : undefined}>
      <rect fill={blackColor} x="0" y="0" width="60" height="160" rx="8" />

      <use
        fill={redOn ? redColor : disabledColor}
        fillRule="evenodd"
        xlinkHref="#redCirclePath"
      />
      <use
        fill={yellowOn ? yellowColor : disabledColor}
        fillRule="evenodd"
        xlinkHref="#yellowCirclePath"
      />
      <use
        fill={greenOn ? greenColor : disabledColor}
        fillRule="evenodd"
        xlinkHref="#greenCirclePath"
      />

      <use
        fill="black"
        fillOpacity="1"
        filter="url(#shadowFilter)"
        xlinkHref="#redCirclePath"
      />
      <use
        fill="black"
        fillOpacity="1"
        filter="url(#shadowFilter)"
        xlinkHref="#yellowCirclePath"
      />
      <use
        fill="black"
        fillOpacity="1"
        filter="url(#shadowFilter)"
        xlinkHref="#greenCirclePath"
      />
    </g>
  </svg>
);
