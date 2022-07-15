import ReactSlider from "react-slider";

interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onAfterChange?: () => void;
}

export default function Slider({
  value,
  min = 100,
  max = 400,
  onChange,
  onAfterChange,
}: SliderProps) {
  return (
    <ReactSlider
      value={value}
      min={min}
      max={max}
      onChange={(val) => onChange(val)}
      onAfterChange={() => onAfterChange && onAfterChange()}
      className=" flex h-6 cursor-pointer items-center  after:h-1 after:w-full after:rounded-full after:bg-pink"
      thumbClassName="bg-blue border-pink border-4 rounded-full w-7 h-7 drop-shadow-sm cursor-pointer"
      trackClassName="bg-pink"
    />
  );
}
