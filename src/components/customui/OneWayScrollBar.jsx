import "./oneWayScrollBar.css";

const OneWayScrollBar = ({ max, min, value, onChange, step }) => {
  // Calculate active percentage for dynamic coloring
  const activePercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full">
      <input
        type="range"
        step={step}
        max={max}
        min={min}
        value={value}
        onChange={onChange}
        className="cursor-pointer w-full h-1 rounded-lg appearance-none outline-none focus:outline-none slider"
        style={{
          background: `linear-gradient(to right, var(--color-4) ${activePercentage}%, var(--color-1) ${activePercentage}%)`
        }}
      />
    </div>
  );
};

export default OneWayScrollBar;
